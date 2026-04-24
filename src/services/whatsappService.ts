/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  VENKAT SWITCHGEARS — WHATSAPP BUSINESS SERVICE
 *  Auto-send WhatsApp messages + copy to company number
 *
 *  Provider options:
 *  1. Twilio WhatsApp API (easiest, free sandbox to test)
 *     → npm install twilio
 *     → Signup: console.twilio.com
 *
 *  2. WhatsApp Business API (Meta official — needs Business verification)
 *     → Apply at: business.facebook.com/wa/manage
 *     → Needs approved message templates
 *
 *  3. Interakt / Wati / AiSensy (Indian resellers — easier setup)
 *     → interakt.shop | wati.io | aisensy.com
 *     → Recommended for small Indian businesses
 *
 *  This file uses Twilio (easiest for dev/testing)
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── CONFIG ────────────────────────────────────────────────────
export const WHATSAPP_CONFIG = {
  provider: "twilio" as "twilio" | "meta" | "interakt",

  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || "ACxxxx",
    authToken:  process.env.TWILIO_AUTH_TOKEN   || "xxxx",
    fromNumber: "whatsapp:+14155238886",           // Twilio sandbox number
    // In production, replace with your approved WhatsApp Business number:
    // fromNumber: "whatsapp:+91XXXXXXXXXX",
  },

  meta: {
    phoneNumberId: process.env.META_PHONE_NUMBER_ID || "xxxx",
    accessToken:   process.env.META_WA_ACCESS_TOKEN  || "xxxx",
    templateName:  "welcome_lead",                  // Pre-approved template name
  },

  companyNumber: "+91 9448354274",   // Company WhatsApp — gets copy of every message

  // Interakt config (alternative)
  interakt: {
    apiKey: process.env.INTERAKT_API_KEY || "xxxx",
  },
};

// ── MESSAGE TEMPLATES ─────────────────────────────────────────

export function buildWelcomeMessage(params: {
  name: string; product: string; leadId: string;
}): string {
  return `Hello ${params.name} 👋

Thank you for contacting *Venkat Switchgears*! ⚡

Your enquiry for *${params.product}* has been received.
📋 *Reference:* ${params.leadId}

Our team will contact you within *24 hours* with pricing & details.

📞 +91 9448354274 | 9844021560
🌐 venkatswitchgears.com
📍 Peenya Industrial Area, Bangalore

*Venkat Switchgears — Synergizing Power* 🔌`;
}

export function buildCompanyCopyMessage(params: {
  leadId: string; name: string; company: string;
  phone: string; product: string; source: string;
}): string {
  return `🔔 *New Lead Alert — ${params.leadId}*

👤 Name: ${params.name}
🏢 Company: ${params.company}
📞 Phone: ${params.phone}
🎯 Product: ${params.product}
📡 Source: ${params.source}

[Auto-notification from Venkat BI Dashboard]`;
}

export function buildLowStockAlert(params: {
  product: string; currentStock: number; minLevel: number; unit: string;
}): string {
  return `⚠️ *Low Stock Alert — Venkat Switchgears*

📦 *Product:* ${params.product}
📉 *Current Stock:* ${params.currentStock} ${params.unit}
🔔 *Min Level:* ${params.minLevel} ${params.unit}

Please arrange for restocking immediately.
[Venkat BI Dashboard Alert]`;
}

export function buildOverdueAlert(params: {
  customer: string; invoiceNo: string;
  amount: string; agingDays: number;
}): string {
  return `🚨 *Overdue Payment Alert — Venkat Switchgears*

🏢 Customer: *${params.customer}*
📄 Invoice: ${params.invoiceNo}
💰 Amount: *${params.amount}*
📅 Overdue: *${params.agingDays} days*

Immediate follow-up required.
[Venkat BI Dashboard Alert]`;
}

// ── SEND FUNCTIONS ────────────────────────────────────────────

/**
 * Send WhatsApp via Twilio
 * Call from your Firebase Cloud Function or backend API
 */
export async function sendWhatsAppTwilio(to: string, message: string): Promise<{ success: boolean; sid?: string; error?: string }> {
  const { accountSid, authToken, fromNumber } = WHATSAPP_CONFIG.twilio;
  const toFormatted = `whatsapp:${to.replace(/\s/g, "")}`;

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${btoa(`${accountSid}:${authToken}`)}`,
      },
      body: new URLSearchParams({
        From: fromNumber,
        To:   toFormatted,
        Body: message,
      }),
    }
  );

  const data = await res.json() as any;
  if (data.sid) return { success: true, sid: data.sid };
  return { success: false, error: data.message || "Unknown error" };
}

/**
 * Send WhatsApp via Meta Cloud API (approved templates)
 */
export async function sendWhatsAppMeta(to: string, templateParams: string[]): Promise<{ success: boolean; error?: string }> {
  const { phoneNumberId, accessToken, templateName } = WHATSAPP_CONFIG.meta;

  const res = await fetch(
    `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: to.replace(/\D/g, ""),
        type: "template",
        template: {
          name: templateName,
          language: { code: "en" },
          components: [{
            type: "body",
            parameters: templateParams.map(t => ({ type: "text", text: t })),
          }],
        },
      }),
    }
  );

  const data = await res.json() as any;
  return data.messages ? { success: true } : { success: false, error: JSON.stringify(data) };
}

// ── LEAD NOTIFICATION FLOW ────────────────────────────────────

/** Send welcome WA to lead + copy to company */
export async function notifyLeadWhatsApp(lead: {
  id: string; name: string; company: string;
  phone: string; productInterest: string; source: string;
}) {
  const welcomeMsg = buildWelcomeMessage({
    name: lead.name, product: lead.productInterest, leadId: lead.id,
  });

  const copyMsg = buildCompanyCopyMessage({
    leadId: lead.id, name: lead.name, company: lead.company,
    phone: lead.phone, product: lead.productInterest, source: lead.source,
  });

  const [customerResult, companyResult] = await Promise.allSettled([
    sendWhatsAppTwilio(lead.phone, welcomeMsg),
    sendWhatsAppTwilio(WHATSAPP_CONFIG.companyNumber, copyMsg),
  ]);

  return {
    customerSent: (customerResult as any)?.value?.success ?? false,
    companySent:  (companyResult as any)?.value?.success  ?? false,
  };
}

/** Low stock WhatsApp alert → company number */
export async function sendLowStockWhatsApp(item: {
  product: string; currentStock: number; minLevel: number; unit: string;
}) {
  const msg = buildLowStockAlert(item);
  return sendWhatsAppTwilio(WHATSAPP_CONFIG.companyNumber, msg);
}

/** Overdue payment WhatsApp alert → company number */
export async function sendOverdueWhatsApp(invoice: {
  customer: string; invoiceNo: string; amount: string; agingDays: number;
}) {
  const msg = buildOverdueAlert(invoice);
  return sendWhatsAppTwilio(WHATSAPP_CONFIG.companyNumber, msg);
}

/**
 * ─────────────────────────────────────────────────────────────
 *  SETUP CHECKLIST
 *  ─────────────────────────────────────────────────────────────
 *  Twilio (Testing):
 *  1. Sign up at console.twilio.com (free)
 *  2. Go to Messaging → Try it out → Send a WhatsApp message
 *  3. Note: TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN
 *  4. Add to .env.local
 *
 *  Meta Business WhatsApp (Production):
 *  1. Create Meta Business account: business.facebook.com
 *  2. Add WhatsApp product → Verify business
 *  3. Create message templates (get approved ~24-48hrs)
 *  4. Note: Phone Number ID + Access Token
 *
 *  Recommended for India (easiest):
 *  → Use Interakt (interakt.shop) — Indian company, Hindi support
 *  → ₹999/month for 1000 conversations
 * ─────────────────────────────────────────────────────────────
 */
