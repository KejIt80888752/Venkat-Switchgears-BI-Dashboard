/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  VENKAT SWITCHGEARS — EMAIL SERVICE
 *  Auto-send welcome emails to leads + CC company inbox
 *
 *  Provider options (choose one):
 *  1. SendGrid (recommended — free 100/day)      → npm install @sendgrid/mail
 *  2. Nodemailer + Gmail                          → npm install nodemailer
 *  3. AWS SES (cost-effective at scale)           → npm install @aws-sdk/client-ses
 *  4. Resend (modern, developer-friendly)         → npm install resend
 *
 *  This file uses SendGrid API via fetch (works in backend/Firebase Functions)
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── CONFIG ────────────────────────────────────────────────────
export const EMAIL_CONFIG = {
  from: {
    email: "projects@venkatswitchgears.com",
    name:  "Venkat Switchgears",
  },
  companyCC: [
    "projects@venkatswitchgears.com",
    "marketing@venkatswitchgears.com",
  ],
  sendgridApiKey: process.env.SENDGRID_API_KEY || "SG.xxxx",   // Set in .env
  replyTo: "projects@venkatswitchgears.com",
};

// ── TYPES ─────────────────────────────────────────────────────
export interface EmailPayload {
  to:       string;
  toName:   string;
  subject:  string;
  htmlBody: string;
  textBody: string;
  cc?:      string[];
}

// ── TEMPLATE BUILDER ──────────────────────────────────────────

/** Build welcome email HTML for new lead */
export function buildWelcomeEmail(params: {
  name: string;
  product: string;
  leadId: string;
  phone: string;
}): Pick<EmailPayload, "subject" | "htmlBody" | "textBody"> {
  const subject = `Thank you for your enquiry — Venkat Switchgears [${params.leadId}]`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; color: #1E293B; margin: 0; padding: 0; background: #F1F5F9; }
    .container { max-width: 600px; margin: 32px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: #0D2B5E; padding: 28px 32px; text-align: center; }
    .header img { height: 52px; }
    .header h1 { color: #fff; margin: 8px 0 0; font-size: 20px; }
    .header p { color: #8BAED6; margin: 4px 0 0; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; }
    .body { padding: 32px; }
    .body h2 { color: #0D2B5E; font-size: 22px; margin: 0 0 8px; }
    .body p { color: #475569; line-height: 1.6; margin: 8px 0; }
    .highlight { background: #FFF7ED; border-left: 4px solid #E87722; border-radius: 8px; padding: 16px 20px; margin: 20px 0; }
    .highlight p { margin: 4px 0; font-size: 14px; }
    .btn { display: inline-block; background: #E87722; color: #fff !important; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0; }
    .footer { background: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 20px 32px; text-align: center; }
    .footer p { color: #94A3B8; font-size: 12px; margin: 4px 0; }
    .footer a { color: #E87722; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://venkatswitchgears.com/wp-content/uploads/2021/08/logo_vsg-web.png" alt="Venkat Switchgears" />
      <h1>Venkat Switchgears</h1>
      <p>Synergizing Power</p>
    </div>
    <div class="body">
      <h2>Dear ${params.name},</h2>
      <p>Thank you for reaching out to <strong>Venkat Switchgears</strong>! We have received your enquiry and our team will get back to you within <strong>24 hours</strong> with detailed pricing and availability.</p>

      <div class="highlight">
        <p><strong>Enquiry Reference:</strong> ${params.leadId}</p>
        <p><strong>Product Interest:</strong> ${params.product}</p>
        <p><strong>Expected Response:</strong> Within 24 business hours</p>
      </div>

      <p>For urgent requirements, please call us directly:</p>
      <p>📞 <strong>+91 9448354274</strong> &nbsp;|&nbsp; <strong>+91 9844021560</strong></p>
      <p>📞 <strong>080-23722274</strong></p>

      <a href="https://venkatswitchgears.com" class="btn">Explore Our Products →</a>

      <p>We look forward to serving your electrical requirements.</p>
      <p>Warm regards,<br /><strong>Team Venkat Switchgears</strong></p>
    </div>
    <div class="footer">
      <p><strong>Venkat Switchgears</strong> — Est. 2002</p>
      <p>#150, 10th Main, 3rd Phase, Peenya Industrial Area, Bangalore – 560058</p>
      <p><a href="https://venkatswitchgears.com">venkatswitchgears.com</a> &nbsp;|&nbsp; <a href="mailto:projects@venkatswitchgears.com">projects@venkatswitchgears.com</a></p>
      <p style="margin-top:8px;color:#CBD5E1;font-size:11px;">Manufacturing · Export · Electrical Contracts · AMC Services</p>
    </div>
  </div>
</body>
</html>`;

  const textBody = `
Dear ${params.name},

Thank you for your enquiry regarding ${params.product}.

Reference: ${params.leadId}

Our team will contact you within 24 hours.

📞 +91 9448354274 | 080-23722274
🌐 https://venkatswitchgears.com

Venkat Switchgears — Synergizing Power
#150, 10th Main, 3rd Phase, Peenya, Bangalore – 560058`.trim();

  return { subject, htmlBody, textBody };
}

/** Build internal notification email to company when new lead arrives */
export function buildInternalAlertEmail(params: {
  leadId: string; name: string; company: string;
  phone: string; product: string; source: string; message: string;
}): Pick<EmailPayload, "subject" | "htmlBody" | "textBody"> {
  return {
    subject: `🔔 New Lead [${params.leadId}] — ${params.name} | ${params.source}`,
    htmlBody: `
<div style="font-family:Arial;max-width:500px;padding:24px;border:1px solid #E2E8F0;border-radius:12px;">
  <h2 style="color:#0D2B5E;margin:0 0 16px;">New Lead Received 🎯</h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">
    ${Object.entries(params).map(([k, v]) => `
      <tr>
        <td style="padding:8px;background:#F8FAFC;font-weight:600;color:#475569;width:140px;border-radius:4px;">${k.charAt(0).toUpperCase() + k.slice(1)}</td>
        <td style="padding:8px;color:#1E293B;">${v}</td>
      </tr>`).join("")}
  </table>
  <p style="margin-top:16px;color:#64748B;font-size:12px;">
    View in dashboard → <a href="https://dashboard.venkatswitchgears.com/leads" style="color:#E87722;">Open Leads</a>
  </p>
</div>`,
    textBody: Object.entries(params).map(([k, v]) => `${k}: ${v}`).join("\n"),
  };
}

// ── SEND FUNCTION ─────────────────────────────────────────────

/**
 * Send email via SendGrid REST API
 * Call this from your Firebase Cloud Function or Node.js backend
 */
export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const body = {
      personalizations: [{
        to: [{ email: payload.to, name: payload.toName }],
        ...(payload.cc?.length ? { cc: payload.cc.map(e => ({ email: e })) } : {}),
      }],
      from: EMAIL_CONFIG.from,
      reply_to: { email: EMAIL_CONFIG.replyTo },
      subject: payload.subject,
      content: [
        { type: "text/plain", value: payload.textBody },
        { type: "text/html",  value: payload.htmlBody  },
      ],
    };

    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${EMAIL_CONFIG.sendgridApiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (res.status === 202) return { success: true, messageId: res.headers.get("X-Message-Id") || "" };
    const err = await res.text();
    return { success: false, error: err };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ── LEAD NOTIFICATION FLOW ────────────────────────────────────

/**
 * Full flow: send welcome email to lead + alert to company
 * Call this whenever a new lead is created
 */
export async function notifyNewLead(lead: {
  id: string; name: string; company: string;
  email: string; phone: string;
  productInterest: string; source: string; message: string;
}) {
  const { subject, htmlBody, textBody } = buildWelcomeEmail({
    name: lead.name, product: lead.productInterest,
    leadId: lead.id, phone: lead.phone,
  });

  // 1. Send welcome to customer
  await sendEmail({
    to: lead.email, toName: lead.name,
    subject, htmlBody, textBody,
  });

  // 2. Send internal alert to company (CC both emails)
  const alert = buildInternalAlertEmail({
    leadId: lead.id, name: lead.name, company: lead.company,
    phone: lead.phone, product: lead.productInterest,
    source: lead.source, message: lead.message,
  });
  await sendEmail({
    to: EMAIL_CONFIG.companyCC[0],
    toName: "Venkat Switchgears",
    cc: EMAIL_CONFIG.companyCC.slice(1),
    subject: alert.subject, htmlBody: alert.htmlBody, textBody: alert.textBody,
  });

  return { success: true };
}
