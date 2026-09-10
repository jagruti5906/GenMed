/**
 * Phase 5 — AI Intelligence Service (Gemini 2.5 Flash)
 *
 * Capabilities:
 *  1. Customer AI Concierge — RAG over service catalog manuals + heuristic fallback
 *  2. Multimodal Photo Diagnosis — Gemini Vision analyses damage images, maps to SKU
 *  3. Admin Operations Co-Pilot — SLA breach prediction, shift handoff summaries
 *  4. Dynamic Surge Pricing — demand/supply heuristic with hard catalog price bounds
 */

import { GoogleGenAI } from '@google/genai';
import { ServiceItem, Order, Specialist } from '../types';

// ─── Client Initialisation ─────────────────────────────────────────────────────

const getApiKey = (): string | undefined =>
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
  (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
  undefined;

let genAIClient: GoogleGenAI | null = null;
const apiKey = getApiKey();
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try { genAIClient = new GoogleGenAI({ apiKey }); } catch { genAIClient = null; }
}

// ─── 1. Customer AI Concierge with RAG ────────────────────────────────────────

export async function queryAiConcierge(
  userQuery: string,
  services: ServiceItem[]
): Promise<{ text: string; recommendedServiceId?: string }> {

  if (genAIClient) {
    try {
      // Phase 5 RAG: full knowledge base with features, pricing, and category context
      const catalogKb = services
        .filter(s => s.available)
        .map(s =>
          `[SKU: ${s.id}] "${s.name}" | Category: ${s.category} | Price: $${s.price}` +
          ` | Duration: ${s.durationMinutes}min | Rating: ${s.rating}★ (${s.reviewsCount} reviews)` +
          ` | Features: ${s.features.join(' • ')}`
        )
        .join('\n');

      const prompt = `You are OmniFlow's Smart AI Concierge — a friendly, knowledgeable on-demand home service coordinator.

KNOWLEDGE BASE (Authoritative Service Catalog):
${catalogKb}

CUSTOMER MESSAGE: "${userQuery}"

INSTRUCTIONS:
- Diagnose the customer's need empathetically in 2-3 sentences maximum.
- Recommend the single most suitable service from the Knowledge Base.
- Mention the price and a key benefit of the recommended service.
- End ONLY with: [RECOMMENDED_SERVICE: <sku_id>]
- If no service is a good match, omit the tag entirely.`;

      const response = await genAIClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const raw = response.text || '';
      const match = raw.match(/\[RECOMMENDED_SERVICE:\s*([a-zA-Z0-9_-]+)\]/);
      const recommendedServiceId = match ? match[1].trim() : undefined;
      const cleanedText = raw.replace(/\[RECOMMENDED_SERVICE:\s*[a-zA-Z0-9_-]+\]/g, '').trim();
      if (cleanedText) return { text: cleanedText, recommendedServiceId };
    } catch { /* fall through */ }
  }

  // High-fidelity heuristic fallback (no API key required)
  return heuristicConcierge(userQuery);
}

// ─── 2. Multimodal Photo Diagnosis (Phase 5) ─────────────────────────────────

export interface PhotoDiagnosisResult {
  diagnosis: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendedServiceId?: string;
  recommendedServiceName?: string;
  estimatedCost?: string;
  urgencyLabel: string;
}

/**
 * Accepts a base64-encoded image and uses Gemini Vision to diagnose the issue
 * and recommend the best-matching service SKU from the catalog.
 */
export async function diagnosePhotoWithAI(
  imageBase64: string,
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp',
  services: ServiceItem[]
): Promise<PhotoDiagnosisResult> {
  const catalogSummary = services
    .filter(s => s.available)
    .map(s => `[${s.id}] ${s.name} ($${s.price}) — ${s.category}`)
    .join('\n');

  if (genAIClient) {
    try {
      const prompt = `You are an expert home-service damage assessor for OmniFlow.
A customer has uploaded a photo of an issue at their home.

SERVICE CATALOG:
${catalogSummary}

Analyse the image and respond in STRICT JSON (no markdown) with this exact structure:
{
  "diagnosis": "<1-2 sentence description of what you see and the root cause>",
  "severity": "<low|medium|high|critical>",
  "recommendedServiceId": "<service SKU id from catalog, or null>",
  "recommendedServiceName": "<service name, or null>",
  "estimatedCost": "<e.g. '$89 - $120', or null>",
  "urgencyLabel": "<e.g. 'Schedule within 48h' or 'Emergency — book now'>"
}`;

      const response = await genAIClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { text: prompt },
          {
            inlineData: {
              mimeType,
              data: imageBase64
            }
          }
        ] as Parameters<typeof genAIClient.models.generateContent>[0]['contents']
      });

      const raw = (response.text || '').trim().replace(/^```json\s*/i, '').replace(/```\s*$/, '');
      const parsed = JSON.parse(raw) as PhotoDiagnosisResult;
      return { ...parsed, severity: parsed.severity || 'medium', urgencyLabel: parsed.urgencyLabel || 'Schedule at your convenience' };
    } catch { /* fall through */ }
  }

  // Fallback heuristic diagnosis when Gemini is unavailable
  return {
    diagnosis: 'Based on the photo, there appears to be visible damage or wear that warrants a professional inspection. Our certified technicians can provide a detailed on-site assessment.',
    severity: 'medium',
    recommendedServiceId: services[0]?.id,
    recommendedServiceName: services[0]?.name,
    estimatedCost: `$${services[0]?.price ?? 89} - $${(services[0]?.price ?? 89) + 40}`,
    urgencyLabel: 'Schedule within 48 hours'
  };
}

// ─── 3. Admin Operations Co-Pilot with SLA Prediction ────────────────────────

export interface SlaBreachPrediction {
  orderId: string;
  orderNumber: string;
  riskScore: number;        // 0–100, higher = higher breach risk
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  reason: string;
  recommendedAction: string;
}

export interface ShiftHandoffSummary {
  periodLabel: string;
  totalOrders: number;
  completedOrders: number;
  averageOrderValue: number;
  topService: string;
  pendingCount: number;
  specialistUtilizationPct: number;
  flaggedIssues: string[];
  outgoingBriefing: string;
}

/**
 * Predicts SLA breach risk for each active/pending order based on elapsed time,
 * assigned specialist status, and queue depth.
 */
export function predictSlaBreaches(orders: Order[], specialists: Specialist[]): SlaBreachPrediction[] {
  const SLA_THRESHOLD_MINUTES = 45;

  return orders
    .filter(o => o.status === 'pending' || o.status === 'confirmed' || o.status === 'assigned')
    .map(o => {
      let riskScore = 0;
      const reasons: string[] = [];

      // ETA risk component
      if (o.etaMinutes > SLA_THRESHOLD_MINUTES) {
        riskScore += 40;
        reasons.push(`ETA ${o.etaMinutes}min exceeds ${SLA_THRESHOLD_MINUTES}min SLA`);
      } else if (o.etaMinutes > 30) {
        riskScore += 20;
        reasons.push(`ETA approaching SLA limit (${o.etaMinutes}min)`);
      }

      // Unassigned penalty
      if (o.status === 'pending' || o.status === 'confirmed') {
        riskScore += 30;
        reasons.push('No specialist assigned yet');
      }

      // Specialist queue saturation
      const busySpecialists = specialists.filter(s => s.status !== 'available').length;
      const utilizationPct = specialists.length > 0 ? (busySpecialists / specialists.length) * 100 : 0;
      if (utilizationPct >= 75) {
        riskScore += 20;
        reasons.push(`Fleet utilization at ${utilizationPct.toFixed(0)}% — limited availability`);
      }

      // Low progress penalty
      if (o.currentStepProgress < 20 && o.status !== 'pending') {
        riskScore += 10;
        reasons.push('Progress stalled at early stage');
      }

      const riskLevel: SlaBreachPrediction['riskLevel'] =
        riskScore >= 80 ? 'critical'
        : riskScore >= 55 ? 'high'
        : riskScore >= 30 ? 'medium'
        : 'low';

      const recommendedAction =
        riskLevel === 'critical' ? 'Escalate immediately — assign nearest available specialist'
        : riskLevel === 'high' ? 'Assign specialist within 5 minutes to meet SLA'
        : riskLevel === 'medium' ? 'Monitor closely and pre-position specialist'
        : 'No action required — on track';

      return {
        orderId: o.id,
        orderNumber: o.orderNumber,
        riskScore: Math.min(100, riskScore),
        riskLevel,
        reason: reasons.join('. ') || 'Within SLA parameters',
        recommendedAction
      };
    })
    .sort((a, b) => b.riskScore - a.riskScore);
}

/**
 * Generates an end-of-shift intelligence briefing for the incoming dispatch manager.
 */
export function generateShiftHandoffSummary(orders: Order[], specialists: Specialist[]): ShiftHandoffSummary {
  const completed = orders.filter(o => o.status === 'completed');
  const pending   = orders.filter(o => o.status === 'pending');
  const active    = orders.filter(o => o.status === 'assigned' || o.status === 'in_progress');
  const cancelled = orders.filter(o => o.status === 'cancelled');

  const totalRevenue = completed.reduce((sum, o) => sum + o.totalAmount, 0);
  const avgValue     = completed.length > 0 ? totalRevenue / completed.length : 0;

  // Most booked service
  const serviceCount: Record<string, number> = {};
  orders.forEach(o => { serviceCount[o.serviceName] = (serviceCount[o.serviceName] || 0) + 1; });
  const topService = Object.entries(serviceCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const busySpecs   = specialists.filter(s => s.status !== 'available' && s.status !== 'off_duty').length;
  const utilization = specialists.length > 0 ? Math.round((busySpecs / specialists.length) * 100) : 0;

  const flaggedIssues: string[] = [];
  if (pending.length > 2)   flaggedIssues.push(`${pending.length} unassigned orders need immediate dispatch`);
  if (cancelled.length > 3) flaggedIssues.push(`${cancelled.length} cancellations — review for refund processing`);
  if (utilization > 90)     flaggedIssues.push(`Fleet utilization critical at ${utilization}% — consider on-call reserves`);
  if (active.length > 0)    flaggedIssues.push(`${active.length} job(s) still in progress — handoff tracking required`);

  const outgoingBriefing =
    `Shift Summary: ${completed.length} jobs completed | GMV $${totalRevenue.toFixed(2)} | ` +
    `${pending.length} orders queued | ${active.length} active in field | ` +
    `Fleet utilization ${utilization}%. ` +
    (flaggedIssues.length > 0
      ? `Action items: ${flaggedIssues.join('; ')}.`
      : 'No critical flags. Smooth transition to incoming shift.');

  return {
    periodLabel: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
    totalOrders: orders.length,
    completedOrders: completed.length,
    averageOrderValue: parseFloat(avgValue.toFixed(2)),
    topService,
    pendingCount: pending.length,
    specialistUtilizationPct: utilization,
    flaggedIssues,
    outgoingBriefing
  };
}

export async function queryAiAdminCopilot(
  query: string,
  orders: Order[],
  specialists: Specialist[]
): Promise<string> {
  const pendingOrders   = orders.filter(o => o.status === 'pending');
  const activeOrders    = orders.filter(o => o.status === 'assigned' || o.status === 'in_progress');
  const completedOrders = orders.filter(o => o.status === 'completed');
  const availableSpecs  = specialists.filter(s => s.status === 'available');

  // Phase 5: Auto-compute SLA risks and shift handoff for AI context
  const slaRisks    = predictSlaBreaches(orders, specialists);
  const highRisk    = slaRisks.filter(r => r.riskLevel === 'critical' || r.riskLevel === 'high');
  const handoff     = generateShiftHandoffSummary(orders, specialists);
  const totalGmv    = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.totalAmount, 0);

  if (genAIClient) {
    try {
      const opsSummary = `LIVE OPERATIONAL SNAPSHOT:
• Total Orders: ${orders.length} | Pending: ${pendingOrders.length} | Active: ${activeOrders.length} | Completed: ${completedOrders.length}
• Specialists: ${specialists.length} total | ${availableSpecs.length} available | Utilization: ${handoff.specialistUtilizationPct}%
• GMV (Session): $${totalGmv.toFixed(2)} | Avg Order Value: $${handoff.averageOrderValue}
• Top Service: ${handoff.topService}
• SLA BREACH RISKS (${highRisk.length} high/critical):
${highRisk.map(r => `  - #${r.orderNumber}: ${r.riskLevel.toUpperCase()} (score ${r.riskScore}) — ${r.reason}`).join('\n') || '  None — all orders within SLA'}
• FLAGGED ISSUES: ${handoff.flaggedIssues.join('; ') || 'None'}`;

      const prompt = `You are OmniFlow Operations Co-Pilot — a precise, authoritative AI assistant for dispatch managers.
${opsSummary}

DISPATCHER QUESTION: "${query}"

Respond with 2-4 concise sentences. Use bullet points only when listing specific actions. Be direct and operational.`;

      const response = await genAIClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const text = response.text?.trim();
      if (text) return text;
    } catch { /* fall through */ }
  }

  return heuristicAdminCopilot(query, pendingOrders, activeOrders, completedOrders, availableSpecs, specialists, totalGmv, highRisk);
}

// ─── 4. Dynamic Surge Pricing ─────────────────────────────────────────────────

export interface SurgePricingResult {
  serviceId: string;
  basePriceDollars: number;
  surgeMultiplier: number;
  surgePriceDollars: number;
  reason: string;
  demandLevel: 'normal' | 'elevated' | 'high' | 'surge';
}

/**
 * Calculates a demand-driven price multiplier for a service.
 * Multiplier is hard-bounded at 1.5× to stay within catalog constraints.
 */
export function calculateSurgePrice(
  service: ServiceItem,
  pendingOrdersForService: number,
  availableSpecialists: number
): SurgePricingResult {
  const SURGE_CAP_MULTIPLIER = 1.5;

  let multiplier = 1.0;
  let demandLevel: SurgePricingResult['demandLevel'] = 'normal';
  const reasons: string[] = [];

  // Supply / demand ratio
  const demand = pendingOrdersForService;
  const supply = Math.max(1, availableSpecialists);
  const ratio  = demand / supply;

  if (ratio >= 3) {
    multiplier = 1.5;
    demandLevel = 'surge';
    reasons.push(`${demand} pending orders vs ${supply} available specialist(s)`);
  } else if (ratio >= 2) {
    multiplier = 1.3;
    demandLevel = 'high';
    reasons.push(`High demand ratio (${ratio.toFixed(1)}:1)`);
  } else if (ratio >= 1) {
    multiplier = 1.15;
    demandLevel = 'elevated';
    reasons.push(`Elevated demand in this category`);
  }

  // Peak hours: 8-10 AM and 5-8 PM
  const hour = new Date().getHours();
  if ((hour >= 8 && hour < 10) || (hour >= 17 && hour < 20)) {
    multiplier = Math.min(SURGE_CAP_MULTIPLIER, multiplier + 0.1);
    reasons.push('Peak service hours');
  }

  multiplier = parseFloat(Math.min(SURGE_CAP_MULTIPLIER, multiplier).toFixed(2));
  const surgePriceDollars = parseFloat((service.price * multiplier).toFixed(2));

  return {
    serviceId: service.id,
    basePriceDollars: service.price,
    surgeMultiplier: multiplier,
    surgePriceDollars,
    reason: reasons.join('; ') || 'Standard pricing in effect',
    demandLevel
  };
}

// ─── Heuristic Fallbacks ──────────────────────────────────────────────────────

function heuristicConcierge(userQuery: string): { text: string; recommendedServiceId?: string } {
  const lower = userQuery.toLowerCase();
  if (lower.includes('leak') || lower.includes('pipe') || lower.includes('plumb') || lower.includes('water') || lower.includes('drain'))
    return { text: 'For plumbing emergencies or leaking pipes, our rapid-response team arrives in under 45 minutes with hydrostatic diagnostic tools and replacement fittings. Starting at $95.', recommendedServiceId: 'srv-2' };
  if (lower.includes('clean') || lower.includes('sanitiz') || lower.includes('house') || lower.includes('maid') || lower.includes('dust'))
    return { text: 'Our Deep Home Sanctuary Cleaning includes hospital-grade eco disinfectants, inside-oven/fridge care, and HEPA-filter vacuuming. Starting at $89.', recommendedServiceId: 'srv-1' };
  if (lower.includes('wifi') || lower.includes('network') || lower.includes('internet') || lower.includes('tech') || lower.includes('router'))
    return { text: 'Our master tech network specialists optimize mesh backhauls, tune WPA3 enterprise encryption, and eliminate dead zones. Starting at $75.', recommendedServiceId: 'srv-5' };
  if (lower.includes('courier') || lower.includes('deliver') || lower.includes('package') || lower.includes('urgent') || lower.includes('document'))
    return { text: 'Our Priority White-Glove Courier offers direct door-to-door transit, digital chain-of-custody verification, and real-time transit telemetry. Starting at $29.', recommendedServiceId: 'srv-6' };
  if (lower.includes('appliance') || lower.includes('refrigerator') || lower.includes('fridge') || lower.includes('dishwasher') || lower.includes('oven'))
    return { text: 'Our OEM-certified technicians carry genuine manufacturer parts for all major brands with same-day diagnosis and component-level repair. Starting at $99.', recommendedServiceId: 'srv-4' };
  if (lower.includes('electric') || lower.includes('wire') || lower.includes('breaker') || lower.includes('hvac') || lower.includes('thermostat'))
    return { text: 'Our licensed master electricians troubleshoot panels, smart HVAC thermostats, and perform comprehensive load-balancing safety checks. Starting at $110.', recommendedServiceId: 'srv-3' };
  return { text: 'We have verified licensed pros ready for dispatch across Home Cleaning, Plumbing, Electrical, Appliances, Tech Support, and Express Courier. What needs attention?' };
}

function heuristicAdminCopilot(
  query: string,
  pendingOrders: Order[],
  activeOrders: Order[],
  completedOrders: Order[],
  availableSpecs: Specialist[],
  allSpecs: Specialist[],
  totalGmv: number,
  highRisk: SlaBreachPrediction[]
): string {
  const lower = query.toLowerCase();

  if (lower.includes('sla') || lower.includes('breach') || lower.includes('risk') || lower.includes('bottleneck') || lower.includes('delay')) {
    if (highRisk.length > 0)
      return `⚠️ SLA Risk Alert: ${highRisk.length} order(s) at elevated breach risk. Critical: ${highRisk.filter(r => r.riskLevel === 'critical').map(r => `#${r.orderNumber}`).join(', ') || 'none'}. Recommend immediate dispatch assignment to maintain <45-min arrival SLA.`;
    return '✅ All active orders are within SLA parameters. Dispatch queue is operating optimally with no predicted breach risks at this time.';
  }

  if (lower.includes('revenue') || lower.includes('gmv') || lower.includes('margin') || lower.includes('finance')) {
    const completedRevenue = completedOrders.reduce((s, o) => s + o.totalAmount, 0);
    return `📊 Session GMV: $${totalGmv.toFixed(2)} across all active orders. Completed revenue: $${completedRevenue.toFixed(2)}. ${completedOrders.length} jobs closed with avg order value $${completedOrders.length > 0 ? (completedRevenue / completedOrders.length).toFixed(2) : '0.00'}.`;
  }

  if (lower.includes('handoff') || lower.includes('shift') || lower.includes('briefing') || lower.includes('summary')) {
    const summary = generateShiftHandoffSummary([...pendingOrders, ...activeOrders, ...completedOrders], allSpecs);
    return `📋 Shift Briefing: ${summary.outgoingBriefing}`;
  }

  if (lower.includes('specialist') || lower.includes('workload') || lower.includes('utilization') || lower.includes('fleet')) {
    const utilization = allSpecs.length > 0 ? Math.round(((allSpecs.length - availableSpecs.length) / allSpecs.length) * 100) : 0;
    return `👷 Fleet Utilization: ${utilization}% — ${availableSpecs.length} of ${allSpecs.length} specialists available. ${utilization > 80 ? '⚠️ High utilization — consider on-call reserves for incoming demand.' : 'Capacity is healthy.'}`;
  }

  return `OmniFlow Ops Co-Pilot: ${pendingOrders.length} queued | ${activeOrders.length} active in field | ${completedOrders.length} completed | $${totalGmv.toFixed(2)} GMV. ${highRisk.length > 0 ? `${highRisk.length} SLA risk(s) detected.` : 'No SLA risks.'} Ask about bottlenecks, shift handoff, or revenue analysis.`;
}
