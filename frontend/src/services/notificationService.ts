/**
 * Phase 4 — Notification Service (Twilio SMS + FCM Push + SendGrid Email)
 *
 * Simulates the full multi-channel notification pipeline. In production:
 *   - SMS:   Twilio Messaging API  (POST https://api.twilio.com/2010-04-01/Accounts/{SID}/Messages)
 *   - Email: SendGrid / AWS SES    (POST https://api.sendgrid.com/v3/mail/send)
 *   - Push:  Firebase Cloud Messaging (POST https://fcm.googleapis.com/fcm/send)
 *
 * Each function here mirrors the real API contract so swapping in the live SDK
 * only requires replacing the stub implementations below.
 */

import { NotificationChannel, NotificationRecord, NotificationTrigger } from '../types';

// ─── Notification Templates ───────────────────────────────────────────────────

type TemplateVars = {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceName: string;
  totalAmount: number;
  specialistName?: string;
  specialistPhone?: string;
  etaMinutes?: number;
  otpCode?: string;
  trackingUrl?: string;
};

const SMS_TEMPLATES: Record<NotificationTrigger, (v: TemplateVars) => string> = {
  order_booked: v =>
    `[OmniFlow] Hi ${v.customerName}, your booking for "${v.serviceName}" (#${v.orderNumber}) is confirmed. Total: $${v.totalAmount}. We'll keep you updated!`,
  specialist_assigned: v =>
    `[OmniFlow] Great news! ${v.specialistName || 'Your specialist'} has been dispatched to your location for order #${v.orderNumber}.`,
  specialist_en_route: v =>
    `[OmniFlow] ${v.specialistName || 'Your specialist'} is on the way! ETA: ${v.etaMinutes ?? '~20'} min. Track live: ${v.trackingUrl || 'https://omniflow.app/track/' + v.orderId}`,
  service_started: v =>
    `[OmniFlow] Service has started at your location for order #${v.orderNumber}. Our specialist is on-site working now.`,
  order_completed: v =>
    `[OmniFlow] Order #${v.orderNumber} completed! Thanks for choosing OmniFlow. Rate your experience: https://omniflow.app/rate/${v.orderId}`,
  order_cancelled: v =>
    `[OmniFlow] Order #${v.orderNumber} has been cancelled. Any charged amount will be refunded within 3-5 business days.`,
  otp_verification: v =>
    `[OmniFlow] Your verification code is: ${v.otpCode || '------'}. Valid for 10 minutes. Do not share this with anyone.`
};

const EMAIL_SUBJECTS: Record<NotificationTrigger, string> = {
  order_booked:        'Your OmniFlow Booking is Confirmed',
  specialist_assigned: 'A Specialist Has Been Dispatched',
  specialist_en_route: 'Your Specialist is On the Way',
  service_started:     'Service in Progress at Your Location',
  order_completed:     'Your Service is Complete — Invoice Attached',
  order_cancelled:     'Your Order Has Been Cancelled',
  otp_verification:    'Your OmniFlow Verification Code'
};

// ─── Channel Dispatchers ─────────────────────────────────────────────────────

/**
 * Simulates sending an SMS via Twilio Messaging API.
 * In production: use `twilio` npm package with TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN env vars.
 */
async function sendSms(
  phone: string,
  message: string,
  vars: TemplateVars
): Promise<NotificationRecord> {
  // Simulate Twilio API latency
  await delay(300);

  const record: NotificationRecord = {
    id:        'notif-sms-' + randomId(),
    channel:   'sms',
    trigger:   vars.orderId as NotificationTrigger, // resolved externally
    recipient: phone,
    message,
    status:    'delivered',
    sentAt:    new Date().toISOString(),
    orderId:   vars.orderId
  };

  console.log(`[Twilio SMS → ${phone}] ${message}`);
  return record;
}

/**
 * Simulates sending a transactional email with PDF invoice via SendGrid.
 * In production: use `@sendgrid/mail` npm package with SENDGRID_API_KEY env var.
 */
async function sendEmail(
  email: string,
  subject: string,
  vars: TemplateVars
): Promise<NotificationRecord> {
  await delay(200);

  const htmlBody = buildEmailHtml(subject, vars);

  const record: NotificationRecord = {
    id:        'notif-email-' + randomId(),
    channel:   'email',
    trigger:   vars.orderId as NotificationTrigger,
    recipient: email,
    message:   subject,
    status:    'delivered',
    sentAt:    new Date().toISOString(),
    orderId:   vars.orderId
  };

  console.log(`[SendGrid Email → ${email}] Subject: ${subject}`);
  console.log(`[SendGrid Email] HTML body generated (${htmlBody.length} chars)`);
  return record;
}

/**
 * Simulates sending a Firebase Cloud Messaging push notification.
 * In production: use `firebase-admin` SDK with a FCM service account.
 */
async function sendPushNotification(
  userId: string,
  title: string,
  body: string,
  vars: TemplateVars
): Promise<NotificationRecord> {
  await delay(150);

  const record: NotificationRecord = {
    id:        'notif-push-' + randomId(),
    channel:   'push',
    trigger:   vars.orderId as NotificationTrigger,
    recipient: userId,
    message:   `${title}: ${body}`,
    status:    'delivered',
    sentAt:    new Date().toISOString(),
    orderId:   vars.orderId
  };

  console.log(`[FCM Push → ${userId}] ${title}: ${body}`);
  return record;
}

// ─── Primary Exported API ─────────────────────────────────────────────────────

/**
 * Sends the appropriate notifications for each order lifecycle trigger.
 * Fires SMS, email, and push in parallel for maximum delivery speed.
 */
export async function sendOrderNotification(
  trigger: NotificationTrigger,
  vars: TemplateVars
): Promise<NotificationRecord[]> {
  const smsText     = SMS_TEMPLATES[trigger](vars);
  const emailSubject = EMAIL_SUBJECTS[trigger];

  const pushTitles: Record<NotificationTrigger, { title: string; body: string }> = {
    order_booked:        { title: 'Booking Confirmed 🎉',           body: `#${vars.orderNumber} — ${vars.serviceName}` },
    specialist_assigned: { title: 'Specialist Dispatched 🚗',       body: `${vars.specialistName || 'Your pro'} is heading over` },
    specialist_en_route: { title: 'On the Way! 📍',                 body: `ETA: ${vars.etaMinutes ?? '~20'} min` },
    service_started:     { title: 'Service Started 🔧',             body: 'Our specialist is on-site' },
    order_completed:     { title: 'Job Complete ✅',                 body: 'Rate your experience' },
    order_cancelled:     { title: 'Order Cancelled',                 body: `#${vars.orderNumber} has been cancelled` },
    otp_verification:    { title: 'Verification Code',               body: `Your code: ${vars.otpCode}` }
  };

  const { title, body } = pushTitles[trigger];

  const results = await Promise.allSettled([
    sendSms(vars.customerPhone, smsText, vars),
    sendEmail(vars.customerEmail, emailSubject, vars),
    sendPushNotification(vars.orderId, title, body, vars)
  ]);

  return results
    .filter((r): r is PromiseFulfilledResult<NotificationRecord> => r.status === 'fulfilled')
    .map(r => r.value);
}

/**
 * Generates and dispatches a one-time OTP code for service completion verification.
 */
export async function sendOtpVerification(
  phone: string,
  email: string,
  orderId: string
): Promise<{ otpCode: string; records: NotificationRecord[] }> {
  const otpCode = String(Math.floor(100000 + Math.random() * 900000));
  const vars: TemplateVars = {
    orderId,
    orderNumber: orderId,
    customerName: 'Customer',
    customerPhone: phone,
    customerEmail: email,
    serviceName: 'Service',
    totalAmount: 0,
    otpCode
  };

  const records = await sendOrderNotification('otp_verification', vars);
  return { otpCode, records };
}

// ─── Email HTML Builder ───────────────────────────────────────────────────────

function buildEmailHtml(subject: string, vars: TemplateVars): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><title>${subject}</title></head>
<body style="font-family:system-ui,sans-serif;background:#f8fafc;padding:32px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:24px 32px;">
      <h1 style="color:#fff;margin:0;font-size:20px;">OmniFlow</h1>
      <p style="color:#c7d2fe;margin:4px 0 0;font-size:13px;">On-Demand Home Services</p>
    </div>
    <div style="padding:32px;">
      <h2 style="font-size:16px;color:#0f172a;margin-top:0;">${subject}</h2>
      <table style="width:100%;border-collapse:collapse;font-size:13px;color:#475569;">
        <tr><td style="padding:6px 0;font-weight:600;color:#0f172a;">Order</td><td>#${vars.orderNumber}</td></tr>
        <tr><td style="padding:6px 0;font-weight:600;color:#0f172a;">Service</td><td>${vars.serviceName}</td></tr>
        <tr><td style="padding:6px 0;font-weight:600;color:#0f172a;">Amount</td><td>$${vars.totalAmount}.00</td></tr>
        ${vars.specialistName ? `<tr><td style="padding:6px 0;font-weight:600;color:#0f172a;">Specialist</td><td>${vars.specialistName}</td></tr>` : ''}
      </table>
      <p style="font-size:12px;color:#94a3b8;margin-top:24px;">Questions? Contact support@omniflow.app</p>
    </div>
  </div>
</body>
</html>`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
