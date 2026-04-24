/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  VENKAT SWITCHGEARS — WEBSITE LEADS SERVICE
 *  Capture contact form submissions from venkatswitchgears.com
 *
 *  The website (WordPress) sends form submissions to this service.
 *  Two methods:
 *
 *  Method A — Webhook from WordPress Contact Form 7 / WPForms:
 *    - Install "CF7 Webhook" plugin on WordPress
 *    - Point webhook to: POST https://your-backend.com/api/leads/website
 *    - This service receives it → saves to DB → auto-notifies
 *
 *  Method B — Firebase Realtime / Supabase (shared between site + dashboard):
 *    - WordPress site writes to Firebase when form submitted
 *    - Dashboard reads from Firebase in real-time
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── TYPES ─────────────────────────────────────────────────────

export interface WebsiteFormSubmission {
  name:       string;
  email:      string;
  phone:      string;
  company?:   string;
  subject?:   string;
  message:    string;
  formName:   string;   // "contact_form" | "product_enquiry" | "quote_request"
  page:       string;   // URL of the page where form was submitted
  submittedAt: string;  // ISO datetime
  ipAddress?:  string;
}

// ── WEBHOOK HANDLER ───────────────────────────────────────────

/**
 * Process incoming website form submission
 * Called from: POST /api/leads/website
 */
export async function handleWebsiteFormSubmission(submission: WebsiteFormSubmission) {
  // 1. Validate required fields
  if (!submission.name || !submission.phone) {
    throw new Error("Name and phone are required");
  }

  // 2. Generate lead ID
  const leadId = `LQ-WEB-${Date.now()}`;

  // 3. Map to Lead format
  const lead = {
    id:              leadId,
    name:            submission.name,
    email:           submission.email || "",
    phone:           submission.phone,
    company:         submission.company || "",
    source:          "Website" as const,
    status:          "New" as const,
    productInterest: submission.subject || submission.message.slice(0, 60),
    message:         submission.message,
    estimatedValue:  0,
    date:            submission.submittedAt,
    assignedTo:      "Priya Sharma",    // default sales person
    followUpDate:    getNextBusinessDay(),
    emailSent:       false,
    whatsappSent:    false,
    notes:           `From: ${submission.page}`,
  };

  // 4. Save to database (Firebase/Supabase — implement as needed)
  // await db.collection("leads").doc(leadId).set(lead);

  // 5. Send notifications (email + WhatsApp)
  // await notifyNewLead(lead);       // from emailService.ts
  // await notifyLeadWhatsApp(lead);  // from whatsappService.ts

  console.log("New website lead:", lead);
  return { success: true, leadId, lead };
}

// ── WORDPRESS INTEGRATION ─────────────────────────────────────

/**
 * WordPress Contact Form 7 webhook payload mapper
 * CF7 sends raw POST data — this normalizes it
 */
export function parseContactForm7Payload(body: Record<string, string>): WebsiteFormSubmission {
  return {
    name:        body["your-name"]    || body["name"]    || "",
    email:       body["your-email"]   || body["email"]   || "",
    phone:       body["your-phone"]   || body["phone"]   || body["mobile"] || "",
    company:     body["your-company"] || body["company"] || "",
    subject:     body["your-subject"] || body["subject"] || "",
    message:     body["your-message"] || body["message"] || "",
    formName:    body["_wpcf7_unit_tag"] || "contact_form",
    page:        body["_wpcf7_current_url"] || "https://venkatswitchgears.com",
    submittedAt: new Date().toISOString(),
  };
}

/**
 * WPForms webhook payload mapper
 */
export function parseWPFormsPayload(body: any): WebsiteFormSubmission {
  const fields = body.fields || {};
  return {
    name:        getFieldValue(fields, ["name","your-name","full-name"]),
    email:       getFieldValue(fields, ["email","your-email"]),
    phone:       getFieldValue(fields, ["phone","mobile","contact"]),
    company:     getFieldValue(fields, ["company","organization"]),
    subject:     getFieldValue(fields, ["subject","product","interested-in"]),
    message:     getFieldValue(fields, ["message","details","requirement"]),
    formName:    body.form_id ? `wpform_${body.form_id}` : "wpforms",
    page:        body.page_url || "https://venkatswitchgears.com",
    submittedAt: new Date().toISOString(),
  };
}

// ── HELPERS ───────────────────────────────────────────────────

function getFieldValue(fields: any, keys: string[]): string {
  for (const key of keys) {
    if (fields[key]?.value) return fields[key].value;
    if (typeof fields[key] === "string") return fields[key];
  }
  return "";
}

function getNextBusinessDay(): string {
  const d = new Date();
  d.setDate(d.getDate() + (d.getDay() === 5 ? 3 : d.getDay() === 6 ? 2 : 1));
  return d.toISOString().split("T")[0];
}

/**
 * ─────────────────────────────────────────────────────────────
 *  WORDPRESS SETUP GUIDE
 *  ─────────────────────────────────────────────────────────────
 *  1. Log in to: venkatswitchgears.com/wp-admin
 *
 *  For Contact Form 7:
 *  2. Install plugin: "Contact Form 7 – Webhook" (Takayuki Miyoshi)
 *  3. Edit any CF7 form → Webhook tab
 *  4. URL: https://your-backend.com/api/leads/website
 *  5. Method: POST, Data: application/x-www-form-urlencoded
 *
 *  For WPForms:
 *  2. WPForms → Settings → Integrations → Webhooks
 *  3. Add webhook URL: https://your-backend.com/api/leads/website
 *
 *  For Google Forms (if used):
 *  2. Open Google Form → Script Editor (Ctrl+Shift+P → Extensions → Apps Script)
 *  3. Add form submit trigger → POST to webhook URL
 *
 *  Testing with ngrok (dev):
 *  → ngrok http 3001
 *  → Copy https URL → paste in WordPress
 * ─────────────────────────────────────────────────────────────
 */
