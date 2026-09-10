/**
 * Phase 4 — Stripe Payment Simulation Service
 *
 * Simulates PCI-DSS compliant Stripe payment flows on the frontend.
 * In production, card tokenization happens inside Stripe.js / Stripe Elements
 * so raw card numbers never touch your server. This module mirrors that contract:
 * it validates the card locally, creates a PaymentIntent stub, and resolves it
 * after a brief async delay — identical to the real Stripe client-side API.
 */

import { StripePaymentIntent, StripePaymentIntentStatus, StripeCardDetails } from '../types';

// Test card numbers that always succeed (mirrors Stripe's test card catalogue)
const ALWAYS_SUCCEED_CARDS = new Set([
  '4242424242424242', // Visa
  '4000056655665556', // Visa (debit)
  '5555555555554444', // Mastercard
  '2223003122003222', // Mastercard (2-series)
  '378282246310005',  // American Express
  '6011111111111117', // Discover
]);

// Test card numbers that always fail
const ALWAYS_DECLINE_CARDS = new Set([
  '4000000000000002', // Generic decline
  '4000000000009995', // Insufficient funds
  '4000000000000069', // Expired card
  '4000000000000127', // Incorrect CVC
]);

export interface CardValidationResult {
  valid: boolean;
  brand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';
  last4: string;
  errors: string[];
}

/**
 * Validates card fields and detects card brand.
 * In production this is handled by Stripe.js; we replicate the contract here.
 */
export function validateCard(details: Partial<StripeCardDetails>): CardValidationResult {
  const errors: string[] = [];
  const raw = (details.cardNumber || '').replace(/\s/g, '');

  if (!raw || raw.length < 13 || raw.length > 19 || !/^\d+$/.test(raw)) {
    errors.push('Invalid card number.');
  } else if (!luhnCheck(raw)) {
    errors.push('Card number failed validation.');
  }

  if (!details.expiry || !/^\d{2}\/\d{2}$/.test(details.expiry)) {
    errors.push('Expiry must be MM/YY.');
  } else {
    const [mm, yy] = details.expiry.split('/').map(Number);
    const now = new Date();
    const expDate = new Date(2000 + yy, mm - 1, 1);
    if (mm < 1 || mm > 12 || expDate < now) {
      errors.push('Card is expired or expiry date is invalid.');
    }
  }

  if (!details.cvc || !/^\d{3,4}$/.test(details.cvc)) {
    errors.push('CVC must be 3–4 digits.');
  }

  if (!details.cardholderName || details.cardholderName.trim().length < 2) {
    errors.push('Cardholder name is required.');
  }

  let brand: CardValidationResult['brand'] = 'unknown';
  if (/^4/.test(raw)) brand = 'visa';
  else if (/^5[1-5]|^2[2-7]/.test(raw)) brand = 'mastercard';
  else if (/^3[47]/.test(raw)) brand = 'amex';
  else if (/^6011|^65/.test(raw)) brand = 'discover';

  return {
    valid: errors.length === 0,
    brand,
    last4: raw.slice(-4),
    errors
  };
}

/**
 * Creates a simulated PaymentIntent (mirrors POST /v1/payment_intents on Stripe's API).
 */
export async function createPaymentIntent(
  amountDollars: number,
  orderId: string
): Promise<StripePaymentIntent> {
  await delay(400);
  const intentId = 'pi_' + randomId(24);
  return {
    id: intentId,
    clientSecret: `${intentId}_secret_${randomId(24)}`,
    amount: Math.round(amountDollars * 100),
    currency: 'usd',
    status: 'requires_payment_method',
    orderId,
    createdAt: new Date().toISOString()
  };
}

/**
 * Confirms a PaymentIntent with card details (mirrors confirmCardPayment in Stripe.js).
 * Simulates network latency and test-card logic.
 */
export async function confirmPayment(
  intent: StripePaymentIntent,
  cardDetails: StripeCardDetails
): Promise<{ success: boolean; intent: StripePaymentIntent; errorMessage?: string }> {
  await delay(1200); // simulate Stripe network round-trip

  const rawNumber = cardDetails.cardNumber.replace(/\s/g, '');
  const validation = validateCard(cardDetails);

  if (!validation.valid) {
    return {
      success: false,
      intent: { ...intent, status: 'requires_payment_method' },
      errorMessage: validation.errors[0]
    };
  }

  if (ALWAYS_DECLINE_CARDS.has(rawNumber)) {
    return {
      success: false,
      intent: { ...intent, status: 'canceled' },
      errorMessage: 'Your card was declined. Please use a different payment method.'
    };
  }

  // All other cards (including ALWAYS_SUCCEED_CARDS and unknown cards) succeed
  const succeededIntent: StripePaymentIntent = {
    ...intent,
    status: 'succeeded' as StripePaymentIntentStatus
  };

  return { success: true, intent: succeededIntent };
}

/**
 * Simulates a refund for a completed order's PaymentIntent.
 */
export async function refundPayment(
  intentId: string
): Promise<{ success: boolean; refundId: string }> {
  await delay(600);
  return { success: true, refundId: 're_' + randomId(24) };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function luhnCheck(num: string): boolean {
  let sum = 0;
  let alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = parseInt(num[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function randomId(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Formats a raw card number string into display groups (e.g. "4242 4242 4242 4242").
 */
export function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

/**
 * Masks a card number for display (e.g. "•••• •••• •••• 4242").
 */
export function maskCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  return '•••• •••• •••• ' + digits.slice(-4);
}
