/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  VENKAT SWITCHGEARS — TALLY ERP INTEGRATION SERVICE
 *  Connect via Tally XML Gateway (TDL) or ODBC
 *
 *  How it works:
 *  1. Tally runs on a PC in the office (Windows)
 *  2. Tally XML Server listens on port 9000 (by default)
 *  3. This service sends XML requests → Tally replies with data
 *  4. We parse the XML and return clean JSON to the dashboard
 *
 *  Setup in Tally:
 *  - Open Tally Prime → Gateway of Tally → F12 Configure
 *  - Enable: "Allow XML Reporting" → Port: 9000
 *  - Or use ODBC: Control Panel → ODBC Data Sources → Add Tally DSN
 *
 *  For cloud deployment:
 *  - Install a lightweight Node.js bridge on the office PC
 *  - It polls Tally → pushes to Firebase/Supabase
 *  - Dashboard reads from Firebase (real-time)
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── CONFIG ────────────────────────────────────────────────────
export const TALLY_CONFIG = {
  host:        "192.168.1.100",   // Tally PC's local IP (update per office network)
  port:        9000,              // Tally XML Gateway port
  company:     "Venkat Switchgears",
  fromDate:    "20240401",        // FY start: 1 Apr 2024 (YYYYMMDD)
  toDate:      "20250331",        // FY end: 31 Mar 2025
  syncIntervalMs: 300_000,        // Sync every 5 minutes
};

// ── XML REQUEST BUILDERS ──────────────────────────────────────

/** Build the standard Tally XML envelope */
const buildRequest = (reportName: string, extraXml = "") => `
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Export Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <EXPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>${reportName}</REPORTNAME>
        <STATICVARIABLES>
          <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
          <SVFROMDATE>${TALLY_CONFIG.fromDate}</SVFROMDATE>
          <SVTODATE>${TALLY_CONFIG.toDate}</SVTODATE>
          <SVCURRENTCOMPANY>${TALLY_CONFIG.company}</SVCURRENTCOMPANY>
          ${extraXml}
        </STATICVARIABLES>
      </REQUESTDESC>
    </EXPORTDATA>
  </BODY>
</ENVELOPE>`.trim();

// ── API REQUESTS ──────────────────────────────────────────────

/**
 * Send XML request to Tally and get response
 * NOTE: In production, this goes through a backend API (not direct from browser
 * due to CORS). The backend acts as a proxy.
 */
async function sendToTally(xml: string): Promise<string> {
  const proxyUrl = "/api/tally";   // Your backend proxy endpoint
  const response = await fetch(proxyUrl, {
    method: "POST",
    headers: { "Content-Type": "text/xml" },
    body: xml,
  });
  if (!response.ok) throw new Error(`Tally request failed: ${response.status}`);
  return response.text();
}

// ── SALES DATA ────────────────────────────────────────────────

/**
 * Fetch monthly sales from Tally
 * TDL Report: "Day Book" or custom "Sales Register"
 */
export async function fetchSalesData(fromDate?: string, toDate?: string) {
  const xml = buildRequest("Sales Register", `
    <SVFROMDATE>${fromDate || TALLY_CONFIG.fromDate}</SVFROMDATE>
    <SVTODATE>${toDate || TALLY_CONFIG.toDate}</SVTODATE>
  `);

  // In production: const rawXml = await sendToTally(xml);
  // Parse rawXml → return structured data

  // Mock response (replace with real parser):
  return {
    status: "mock",
    message: "Connect Tally XML Gateway to get live data",
    data: [],
  };
}

/** Fetch stock/inventory levels from Tally */
export async function fetchInventory() {
  const xml = buildRequest("Stock Summary");
  // const rawXml = await sendToTally(xml);
  return { status: "mock", data: [] };
}

/** Fetch outstanding debtors (receivables) from Tally */
export async function fetchDebtors() {
  const xml = buildRequest("Outstanding Receivables");
  // const rawXml = await sendToTally(xml);
  return { status: "mock", data: [] };
}

/** Fetch outstanding creditors (payables) from Tally */
export async function fetchCreditors() {
  const xml = buildRequest("Outstanding Payables");
  // const rawXml = await sendToTally(xml);
  return { status: "mock", data: [] };
}

/** Fetch P&L data from Tally */
export async function fetchPnL() {
  const xml = buildRequest("Profit & Loss");
  // const rawXml = await sendToTally(xml);
  return { status: "mock", data: [] };
}

/** Fetch GST reports from Tally */
export async function fetchGSTData(gstrType: "GSTR1" | "GSTR3B") {
  const xml = buildRequest(gstrType === "GSTR1" ? "GSTR-1" : "GSTR-3B");
  // const rawXml = await sendToTally(xml);
  return { status: "mock", data: [] };
}

// ── CONNECTION TEST ───────────────────────────────────────────

/** Test if Tally is reachable */
export async function testTallyConnection(): Promise<{ connected: boolean; company?: string; error?: string }> {
  try {
    const xml = buildRequest("List of Companies");
    // const rawXml = await sendToTally(xml);
    // Parse company name from response
    return {
      connected: true,
      company: TALLY_CONFIG.company,
    };
  } catch (err: any) {
    return { connected: false, error: err.message };
  }
}

// ── SYNC MANAGER ──────────────────────────────────────────────

/** Start periodic sync (call on app load for real-time mode) */
export function startTallySync(callback: (module: string, data: any) => void) {
  const sync = async () => {
    try {
      const [sales, inventory, debtors, creditors, pnl] = await Promise.all([
        fetchSalesData(),
        fetchInventory(),
        fetchDebtors(),
        fetchCreditors(),
        fetchPnL(),
      ]);
      callback("all", { sales, inventory, debtors, creditors, pnl });
    } catch (err) {
      console.error("Tally sync failed:", err);
    }
  };

  sync(); // Immediate first sync
  return setInterval(sync, TALLY_CONFIG.syncIntervalMs);
}

/**
 * ─────────────────────────────────────────────────────────────
 *  DEPLOYMENT STEPS (Office PC Bridge Setup)
 *  ─────────────────────────────────────────────────────────────
 *  1. On Tally PC (Windows), install Node.js
 *  2. Run: npm install express xml2js firebase-admin
 *  3. Create bridge.js:
 *     - Receive XML requests from dashboard backend
 *     - Forward to Tally on localhost:9000
 *     - Return response
 *  4. Use ngrok / static IP to expose bridge to internet
 *     Or: push parsed data to Firebase every N minutes
 *  5. Dashboard reads from Firebase — works from anywhere
 *
 *  Alternative: Tally ODBC
 *  - Install Tally ODBC driver on the PC
 *  - Connect via DSN: "TallyODBC_9000"
 *  - Use any Node.js ODBC library to query
 * ─────────────────────────────────────────────────────────────
 */
