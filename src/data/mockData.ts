// ─────────────────────────────────────────────────────────────
//  Venkat Switchgears — Mock Tally ERP Data
//  Est. 2002 | Tagline: "Synergizing Power"
//  #150, 10th Main, 3rd Phase, Peenya Industrial Area, Bangalore – 560058
//  Unit 1: #150, 10th Main, 3rd Phase | Unit 2: #439-440, 12th Main, 4th Phase
//  Phone: +91 9448354274 / 9844021560 | 080-23722274
//  Email: projects@venkatswitchgears.com | marketing@venkatswitchgears.com
//  Products: HT & LT Switchgear, Transformers, Panels, CB, DG Sets, Cable Trays
// ─────────────────────────────────────────────────────────────

export const COMPANY = {
  name: "Venkat Switchgears",
  tagline: "Synergizing Power",
  motto: "We Brand Quality. Quality Leads With The Industry!",
  established: 2002,
  gstin: "29AAACV1234F1ZX", // placeholder — confirm with client
  unit1: { label: "Unit 1", address: "#150, 10th Main, 3rd Phase, Peenya Industrial Area, Bangalore – 560058" },
  unit2: { label: "Unit 2", address: "#439 & 440, 12th Main Road, 4th Phase, Peenya Industrial Area, Bangalore – 560058" },
  phone: ["+91 9448354274", "+91 9844021560", "080-23722274"],
  email: { projects: "projects@venkatswitchgears.com", marketing: "marketing@venkatswitchgears.com" },
  website: "https://venkatswitchgears.com",
  logo: "https://venkatswitchgears.com/wp-content/uploads/2021/08/logo_vsg-web.png",
  social: {
    facebook: "https://www.facebook.com/Ms-Venkat-Switchgears",
    linkedin: "https://www.linkedin.com/company/venkat-switchgears",
    youtube: "https://www.youtube.com/channel/UCbZoVvsKoepLlPRGesAhaqw",
  },
};

export const MONTHS = [
  "Apr '24", "May '24", "Jun '24", "Jul '24",
  "Aug '24", "Sep '24", "Oct '24", "Nov '24",
  "Dec '24", "Jan '25", "Feb '25", "Mar '25",
];

// ── SALES DATA ──────────────────────────────────────────────

export const monthlySales = [
  { month: "Apr '24", unit1: 5200000, unit2: 3300000, total: 8500000 },
  { month: "May '24", unit1: 5800000, unit2: 3400000, total: 9200000 },
  { month: "Jun '24", unit1: 4800000, unit2: 3000000, total: 7800000 },
  { month: "Jul '24", unit1: 5400000, unit2: 3400000, total: 8800000 },
  { month: "Aug '24", unit1: 5900000, unit2: 3700000, total: 9600000 },
  { month: "Sep '24", unit1: 6200000, unit2: 3800000, total: 10000000 },
  { month: "Oct '24", unit1: 7200000, unit2: 4800000, total: 12000000 },
  { month: "Nov '24", unit1: 7000000, unit2: 4800000, total: 11800000 },
  { month: "Dec '24", unit1: 6300000, unit2: 4200000, total: 10500000 },
  { month: "Jan '25", unit1: 5700000, unit2: 3800000, total: 9500000 },
  { month: "Feb '25", unit1: 5300000, unit2: 3500000, total: 8800000 },
  { month: "Mar '25", unit1: 8700000, unit2: 5800000, total: 14500000 },
];

export const prevYearSales = [
  { month: "Apr '23", unit1: 4600000, unit2: 2900000, total: 7500000 },
  { month: "May '23", unit1: 5100000, unit2: 3100000, total: 8200000 },
  { month: "Jun '23", unit1: 4200000, unit2: 2600000, total: 6800000 },
  { month: "Jul '23", unit1: 4900000, unit2: 3100000, total: 8000000 },
  { month: "Aug '23", unit1: 5300000, unit2: 3200000, total: 8500000 },
  { month: "Sep '23", unit1: 5700000, unit2: 3500000, total: 9200000 },
  { month: "Oct '23", unit1: 6400000, unit2: 4300000, total: 10700000 },
  { month: "Nov '23", unit1: 6200000, unit2: 4100000, total: 10300000 },
  { month: "Dec '23", unit1: 5700000, unit2: 3900000, total: 9600000 },
  { month: "Jan '24", unit1: 5100000, unit2: 3300000, total: 8400000 },
  { month: "Feb '24", unit1: 4700000, unit2: 3200000, total: 7900000 },
  { month: "Mar '24", unit1: 7800000, unit2: 5200000, total: 13000000 },
];

export const productWiseSales = [
  { product: "LT Switchgear Panels",    category: "Panels",        unit1: 18500000, unit2: 12300000, total: 30800000, qty: 124 },
  { product: "Motor Control Centers",   category: "Panels",        unit1: 15200000, unit2: 9800000,  total: 25000000, qty: 87  },
  { product: "Distribution Boards",     category: "DB/PDB",        unit1: 12400000, unit2: 8200000,  total: 20600000, qty: 312 },
  { product: "MCCB",                    category: "Breakers",      unit1: 9800000,  unit2: 6700000,  total: 16500000, qty: 540 },
  { product: "MCB",                     category: "Breakers",      unit1: 7200000,  unit2: 4900000,  total: 12100000, qty: 2400},
  { product: "Bus Ducts & Bus Bars",    category: "Bus Systems",   unit1: 8600000,  unit2: 3200000,  total: 11800000, qty: 68  },
  { product: "Capacitor Banks",         category: "Power Factor",  unit1: 5400000,  unit2: 2800000,  total: 8200000,  qty: 43  },
  { product: "Power Factor Panels",     category: "Power Factor",  unit1: 4800000,  unit2: 2100000,  total: 6900000,  qty: 38  },
  { product: "ATS / AMF Panels",        category: "Automation",    unit1: 3900000,  unit2: 1800000,  total: 5700000,  qty: 29  },
  { product: "Control & Relay Panels",  category: "Automation",    unit1: 2600000,  unit2: 1400000,  total: 4000000,  qty: 22  },
];

export const salesTarget = {
  yearly: 180000000,   // ₹18 Cr
  currentYTD: 121000000, // ₹12.1 Cr (Apr–Mar)
  unit1Target: 110000000,
  unit1Actual: 75800000,
  unit2Target: 70000000,
  unit2Actual: 48200000,
};

// ── PURCHASE DATA ────────────────────────────────────────────

export const vendorWisePurchase = [
  { vendor: "Havells India Ltd",      category: "Electrical Components", amount: 18400000, unit: "Both"   },
  { vendor: "ABB India Ltd",          category: "Switchgear",            amount: 14200000, unit: "Unit 1" },
  { vendor: "Siemens Ltd",            category: "Switchgear",            amount: 11800000, unit: "Unit 1" },
  { vendor: "Polycab Wires",          category: "Cables & Wires",        amount: 9600000,  unit: "Both"   },
  { vendor: "Schneider Electric",     category: "Electrical Components", amount: 8700000,  unit: "Unit 2" },
  { vendor: "L&T Switchgear",         category: "Switchgear",            amount: 7200000,  unit: "Both"   },
  { vendor: "HPL Electric",           category: "Electrical Components", amount: 5400000,  unit: "Unit 2" },
  { vendor: "Indo Asian Fusegear",    category: "Breakers",              amount: 4800000,  unit: "Unit 1" },
  { vendor: "Legrand India",          category: "Electrical Components", amount: 3900000,  unit: "Both"   },
  { vendor: "Finolex Cables",         category: "Cables & Wires",        amount: 2800000,  unit: "Unit 2" },
];

export const monthlyPurchase = [
  { month: "Apr '24", unit1: 3800000, unit2: 2400000, total: 6200000 },
  { month: "May '24", unit1: 4200000, unit2: 2500000, total: 6700000 },
  { month: "Jun '24", unit1: 3500000, unit2: 2100000, total: 5600000 },
  { month: "Jul '24", unit1: 3900000, unit2: 2400000, total: 6300000 },
  { month: "Aug '24", unit1: 4300000, unit2: 2700000, total: 7000000 },
  { month: "Sep '24", unit1: 4600000, unit2: 2800000, total: 7400000 },
  { month: "Oct '24", unit1: 5400000, unit2: 3500000, total: 8900000 },
  { month: "Nov '24", unit1: 5200000, unit2: 3400000, total: 8600000 },
  { month: "Dec '24", unit1: 4700000, unit2: 3100000, total: 7800000 },
  { month: "Jan '25", unit1: 4100000, unit2: 2700000, total: 6800000 },
  { month: "Feb '25", unit1: 3800000, unit2: 2500000, total: 6300000 },
  { month: "Mar '25", unit1: 6400000, unit2: 4200000, total: 10600000 },
];

// ── INVENTORY / STOCK DATA ───────────────────────────────────

export const inventoryItems = [
  { code: "VK0001", product: "LT Switchgear Panel (400A)",    category: "Panels",       unit1: 12, unit2: 8,  minLevel: 10, unitOfMeasure: "Nos", hsn: "8537", rate: 145000 },
  { code: "VK0002", product: "LT Switchgear Panel (630A)",    category: "Panels",       unit1: 6,  unit2: 4,  minLevel: 8,  unitOfMeasure: "Nos", hsn: "8537", rate: 185000 },
  { code: "VK0003", product: "MCC Panel (Standard)",          category: "Panels",       unit1: 8,  unit2: 5,  minLevel: 6,  unitOfMeasure: "Nos", hsn: "8537", rate: 220000 },
  { code: "VK0004", product: "Distribution Board (12-way)",   category: "DB/PDB",       unit1: 32, unit2: 24, minLevel: 20, unitOfMeasure: "Nos", hsn: "8537", rate: 28000  },
  { code: "VK0005", product: "Distribution Board (24-way)",   category: "DB/PDB",       unit1: 18, unit2: 12, minLevel: 15, unitOfMeasure: "Nos", hsn: "8537", rate: 45000  },
  { code: "VK0006", product: "MCCB 63A (3P)",                 category: "Breakers",     unit1: 145,unit2: 92, minLevel: 80, unitOfMeasure: "Nos", hsn: "8536", rate: 2800   },
  { code: "VK0007", product: "MCCB 100A (3P)",                category: "Breakers",     unit1: 88, unit2: 56, minLevel: 60, unitOfMeasure: "Nos", hsn: "8536", rate: 4200   },
  { code: "VK0008", product: "MCCB 250A (3P)",                category: "Breakers",     unit1: 34, unit2: 21, minLevel: 40, unitOfMeasure: "Nos", hsn: "8536", rate: 8500   },
  { code: "VK0009", product: "MCB 16A (1P)",                  category: "Breakers",     unit1: 520,unit2: 380,minLevel: 300,unitOfMeasure: "Nos", hsn: "8536", rate: 380    },
  { code: "VK0010", product: "MCB 32A (1P)",                  category: "Breakers",     unit1: 380,unit2: 280,minLevel: 200,unitOfMeasure: "Nos", hsn: "8536", rate: 520    },
  { code: "VK0011", product: "Bus Bar Copper 100A",           category: "Bus Systems",  unit1: 280,unit2: 140,minLevel: 200,unitOfMeasure: "Mtr", hsn: "7407", rate: 1200   },
  { code: "VK0012", product: "Bus Bar Copper 250A",           category: "Bus Systems",  unit1: 120,unit2: 60, minLevel: 150,unitOfMeasure: "Mtr", hsn: "7407", rate: 2800   },
  { code: "VK0013", product: "Bus Duct 400A",                 category: "Bus Systems",  unit1: 45, unit2: 20, minLevel: 30, unitOfMeasure: "Mtr", hsn: "8544", rate: 4500   },
  { code: "VK0014", product: "Capacitor 25 KVAR",             category: "Power Factor", unit1: 22, unit2: 14, minLevel: 20, unitOfMeasure: "Nos", hsn: "8532", rate: 3800   },
  { code: "VK0015", product: "Capacitor 50 KVAR",             category: "Power Factor", unit1: 8,  unit2: 5,  minLevel: 15, unitOfMeasure: "Nos", hsn: "8532", rate: 6500   },
  { code: "VK0016", product: "Power Cable 95 sq.mm",          category: "Cables",       unit1: 640,unit2: 380,minLevel: 500,unitOfMeasure: "Mtr", hsn: "8544", rate: 480    },
  { code: "VK0017", product: "Control Cable 2.5 sq.mm",       category: "Cables",       unit1: 1200,unit2:800,minLevel: 800,unitOfMeasure: "Mtr", hsn: "8544", rate: 85     },
  { code: "VK0018", product: "CTs (Current Transformer)",     category: "Instruments",  unit1: 38, unit2: 22, minLevel: 40, unitOfMeasure: "Nos", hsn: "8504", rate: 1800   },
  { code: "VK0019", product: "Indicating Lamps",              category: "Instruments",  unit1: 220,unit2:140, minLevel: 150,unitOfMeasure: "Nos", hsn: "8531", rate: 120    },
  { code: "VK0020", product: "Push Buttons (START/STOP)",     category: "Instruments",  unit1: 180,unit2:120, minLevel: 100,unitOfMeasure: "Nos", hsn: "8536", rate: 180    },
];

// ── OUTSTANDING PAYMENTS ─────────────────────────────────────

export const debtors = [
  { customer: "BHEL Bangalore",              invoiceNo: "VSG/2024/1142", amount: 4850000, dueDate: "2025-01-15", agingDays: 90, unit: "Unit 1" },
  { customer: "L&T Construction (South)",    invoiceNo: "VSG/2024/1156", amount: 3200000, dueDate: "2025-02-01", agingDays: 73, unit: "Unit 2" },
  { customer: "KPTCL",                       invoiceNo: "VSG/2024/1168", amount: 6400000, dueDate: "2025-01-28", agingDays: 77, unit: "Unit 1" },
  { customer: "Brigade Enterprises",         invoiceNo: "VSG/2025/0012", amount: 1850000, dueDate: "2025-03-10", agingDays: 25, unit: "Unit 2" },
  { customer: "Prestige Group",              invoiceNo: "VSG/2025/0018", amount: 2400000, dueDate: "2025-03-05", agingDays: 30, unit: "Unit 1" },
  { customer: "Embassy Office Parks",        invoiceNo: "VSG/2025/0024", amount: 3800000, dueDate: "2025-02-20", agingDays: 43, unit: "Unit 1" },
  { customer: "Infosys Campus (Mysore Rd)",  invoiceNo: "VSG/2025/0031", amount: 2100000, dueDate: "2025-03-01", agingDays: 34, unit: "Unit 2" },
  { customer: "Wipro SEZ, Sarjapur",         invoiceNo: "VSG/2025/0038", amount: 1650000, dueDate: "2025-03-15", agingDays: 20, unit: "Unit 1" },
  { customer: "BMRCL Phase-III",             invoiceNo: "VSG/2024/1180", amount: 8200000, dueDate: "2025-01-10", agingDays: 95, unit: "Unit 1" },
  { customer: "TVS Motor Company",           invoiceNo: "VSG/2025/0042", amount: 980000,  dueDate: "2025-03-18", agingDays: 17, unit: "Unit 2" },
  { customer: "Manipal Health Systems",      invoiceNo: "VSG/2025/0048", amount: 2200000, dueDate: "2025-03-22", agingDays: 13, unit: "Unit 2" },
  { customer: "Nandi Infrastructure",        invoiceNo: "VSG/2024/1172", amount: 3600000, dueDate: "2025-02-14", agingDays: 49, unit: "Unit 1" },
  { customer: "UB Group (United Breweries)", invoiceNo: "VSG/2025/0051", amount: 1400000, dueDate: "2025-03-25", agingDays: 10, unit: "Unit 2" },
  { customer: "KSRTC Depot, Shivajinagar",   invoiceNo: "VSG/2024/1161", amount: 5100000, dueDate: "2025-01-20", agingDays: 85, unit: "Unit 1" },
];

export const creditors = [
  { vendor: "ABB India Ltd",        invoiceNo: "ABB/2025/34218", amount: 2800000, dueDate: "2025-03-20", agingDays: 15 },
  { vendor: "Siemens Ltd",          invoiceNo: "SIE/2025/08814", amount: 1900000, dueDate: "2025-02-28", agingDays: 37 },
  { vendor: "Havells India Ltd",    invoiceNo: "HAV/2025/21045", amount: 3200000, dueDate: "2025-03-10", agingDays: 25 },
  { vendor: "Polycab Wires",        invoiceNo: "POL/2025/55421", amount: 1400000, dueDate: "2025-03-25", agingDays: 10 },
  { vendor: "Schneider Electric",   invoiceNo: "SCH/2025/12308", amount: 2200000, dueDate: "2025-02-15", agingDays: 50 },
  { vendor: "L&T Switchgear",       invoiceNo: "LTS/2025/09871", amount: 1650000, dueDate: "2025-03-05", agingDays: 30 },
  { vendor: "Indo Asian Fusegear",  invoiceNo: "IAF/2024/76532", amount: 980000,  dueDate: "2025-01-30", agingDays: 75 },
  { vendor: "Legrand India",        invoiceNo: "LEG/2025/14210", amount: 760000,  dueDate: "2025-03-28", agingDays: 7  },
  { vendor: "HPL Electric",         invoiceNo: "HPL/2025/08832", amount: 1100000, dueDate: "2025-02-22", agingDays: 43 },
];

// ── PROFIT & LOSS ─────────────────────────────────────────────

export const plData = [
  { month: "Apr '24", revenue: 8500000,  rawMaterial: 4250000, labour: 850000, overhead: 680000, admin: 340000, other: 170000, netProfit: 2210000 },
  { month: "May '24", revenue: 9200000,  rawMaterial: 4600000, labour: 920000, overhead: 736000, admin: 368000, other: 184000, netProfit: 2392000 },
  { month: "Jun '24", revenue: 7800000,  rawMaterial: 3900000, labour: 780000, overhead: 624000, admin: 312000, other: 156000, netProfit: 2028000 },
  { month: "Jul '24", revenue: 8800000,  rawMaterial: 4400000, labour: 880000, overhead: 704000, admin: 352000, other: 176000, netProfit: 2288000 },
  { month: "Aug '24", revenue: 9600000,  rawMaterial: 4800000, labour: 960000, overhead: 768000, admin: 384000, other: 192000, netProfit: 2496000 },
  { month: "Sep '24", revenue: 10000000, rawMaterial: 5000000, labour: 1000000,overhead: 800000, admin: 400000, other: 200000, netProfit: 2600000 },
  { month: "Oct '24", revenue: 12000000, rawMaterial: 6000000, labour: 1200000,overhead: 960000, admin: 480000, other: 240000, netProfit: 3120000 },
  { month: "Nov '24", revenue: 11800000, rawMaterial: 5900000, labour: 1180000,overhead: 944000, admin: 472000, other: 236000, netProfit: 3068000 },
  { month: "Dec '24", revenue: 10500000, rawMaterial: 5250000, labour: 1050000,overhead: 840000, admin: 420000, other: 210000, netProfit: 2730000 },
  { month: "Jan '25", revenue: 9500000,  rawMaterial: 4750000, labour: 950000, overhead: 760000, admin: 380000, other: 190000, netProfit: 2470000 },
  { month: "Feb '25", revenue: 8800000,  rawMaterial: 4400000, labour: 880000, overhead: 704000, admin: 352000, other: 176000, netProfit: 2288000 },
  { month: "Mar '25", revenue: 14500000, rawMaterial: 7250000, labour: 1450000,overhead: 1160000,admin: 580000, other: 290000, netProfit: 3770000 },
];

// ── GST DATA ─────────────────────────────────────────────────

export const gstData = [
  { month: "Apr '24", taxableValue: 7203000, cgst: 648270, sgst: 648270, igst: 432180, totalCollected: 1728720, totalPaid: 1142500, net: 586220 },
  { month: "May '24", taxableValue: 7796000, cgst: 701640, sgst: 701640, igst: 467760, totalCollected: 1871040, taxableITC: 5860000, totalPaid: 1234000, net: 637040 },
  { month: "Jun '24", taxableValue: 6610000, cgst: 594900, sgst: 594900, igst: 396600, totalCollected: 1586400, totalPaid: 1046000, net: 540400 },
  { month: "Jul '24", taxableValue: 7458000, cgst: 671220, sgst: 671220, igst: 447480, totalCollected: 1789920, totalPaid: 1180000, net: 609920 },
  { month: "Aug '24", taxableValue: 8136000, cgst: 732240, sgst: 732240, igst: 488160, totalCollected: 1952640, totalPaid: 1290000, net: 662640 },
  { month: "Sep '24", taxableValue: 8475000, cgst: 762750, sgst: 762750, igst: 508500, totalCollected: 2034000, totalPaid: 1340000, net: 694000 },
  { month: "Oct '24", taxableValue: 10169000, cgst: 915210, sgst: 915210, igst: 610140, totalCollected: 2440560, totalPaid: 1610000, net: 830560 },
  { month: "Nov '24", taxableValue: 10000000, cgst: 900000, sgst: 900000, igst: 600000, totalCollected: 2400000, totalPaid: 1580000, net: 820000 },
  { month: "Dec '24", taxableValue: 8898000, cgst: 800820, sgst: 800820, igst: 534000, totalCollected: 2135640, totalPaid: 1408000, net: 727640 },
  { month: "Jan '25", taxableValue: 8051000, cgst: 724590, sgst: 724590, igst: 483060, totalCollected: 1932240, totalPaid: 1274000, net: 658240 },
  { month: "Feb '25", taxableValue: 7458000, cgst: 671220, sgst: 671220, igst: 447480, totalCollected: 1789920, totalPaid: 1180000, net: 609920 },
  { month: "Mar '25", taxableValue: 12288000, cgst: 1105920,sgst: 1105920, igst: 737280, totalCollected: 2949120, totalPaid: 1950000, net: 999120 },
];

// ── USERS ─────────────────────────────────────────────────────

export const users = [
  { id: 1, name: "Venkat Raju",     email: "admin@venkat.com",    role: "superadmin", unit: "Both",   status: "active",   lastLogin: "2025-04-16 09:12" },
  { id: 2, name: "Rajesh Kumar",    email: "manager@venkat.com",  role: "manager",    unit: "Both",   status: "active",   lastLogin: "2025-04-16 08:45" },
  { id: 3, name: "Priya Sharma",    email: "sales@venkat.com",    role: "sales",      unit: "Unit 1", status: "active",   lastLogin: "2025-04-15 17:32" },
  { id: 4, name: "Kavitha M",       email: "accounts@venkat.com", role: "accounts",   unit: "Both",   status: "active",   lastLogin: "2025-04-16 10:02" },
  { id: 5, name: "Anand V",         email: "viewer@venkat.com",   role: "viewer",     unit: "Unit 2", status: "active",   lastLogin: "2025-04-14 14:18" },
  { id: 6, name: "Suresh Babu",     email: "suresh@venkat.com",   role: "sales",      unit: "Unit 2", status: "active",   lastLogin: "2025-04-16 08:59" },
  { id: 7, name: "Deepa R",         email: "deepa@venkat.com",    role: "viewer",     unit: "Unit 1", status: "inactive", lastLogin: "2025-04-10 11:40" },
];

// ── ACTIVITY LOGS ─────────────────────────────────────────────

export const activityLogs = [
  { user: "Kavitha M",   action: "Viewed GST Report",          time: "2025-04-16 10:05", module: "GST" },
  { user: "Rajesh Kumar",action: "Exported Sales Report (PDF)", time: "2025-04-16 09:48", module: "Sales" },
  { user: "Priya Sharma",action: "Viewed Sales Dashboard",      time: "2025-04-16 09:30", module: "Sales" },
  { user: "Venkat Raju", action: "Updated KPI Targets",         time: "2025-04-16 09:15", module: "Settings" },
  { user: "Anand V",     action: "Viewed Stock Report",         time: "2025-04-15 17:40", module: "Inventory" },
  { user: "Kavitha M",   action: "Viewed Outstanding Report",   time: "2025-04-15 16:20", module: "Outstanding" },
  { user: "Suresh Babu", action: "Viewed Sales Dashboard",      time: "2025-04-15 15:05", module: "Sales" },
  { user: "Rajesh Kumar",action: "Viewed P&L Report",           time: "2025-04-15 14:30", module: "P&L" },
];

// ── CUSTOMER PORTAL DATA ─────────────────────────────────────

export const customerPortalData = {
  "BHEL Bangalore": {
    contact: "Mr. Subramaniam",
    email: "subramaniam@bhel.in",
    phone: "+91 80 2296 3710",
    orders: [
      { orderNo: "VSG/2024/1142", date: "2024-12-15", amount: 4850000, status: "Delivered", outstanding: 4850000 },
      { orderNo: "VSG/2024/1098", date: "2024-11-02", amount: 2600000, status: "Paid",      outstanding: 0       },
      { orderNo: "VSG/2024/1052", date: "2024-09-18", amount: 3100000, status: "Paid",      outstanding: 0       },
    ],
    totalOutstanding: 4850000,
  },
  "Brigade Enterprises": {
    contact: "Ms. Anitha Rao",
    email: "anitha.rao@brigade.com",
    phone: "+91 80 4294 3000",
    orders: [
      { orderNo: "VSG/2025/0012", date: "2025-03-10", amount: 1850000, status: "Delivered", outstanding: 1850000 },
      { orderNo: "VSG/2024/1135", date: "2024-12-05", amount: 2200000, status: "Paid",      outstanding: 0       },
    ],
    totalOutstanding: 1850000,
  },
};

// ── HELPER FUNCTIONS ──────────────────────────────────────────

export const formatCurrency = (value: number, compact = false): string => {
  if (compact) {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000)   return `₹${(value / 100000).toFixed(2)} L`;
    if (value >= 1000)     return `₹${(value / 1000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
};

export const getAgingBucket = (days: number): "0-30" | "31-60" | "60+" => {
  if (days <= 30) return "0-30";
  if (days <= 60) return "31-60";
  return "60+";
};

export const getLowStockItems = () =>
  inventoryItems.filter(i => (i.unit1 + i.unit2) < i.minLevel * 1.2);

export const getTotalOutstanding = () =>
  debtors.reduce((s, d) => s + d.amount, 0);

export const getYTDSales = () =>
  monthlySales.reduce((s, m) => s + m.total, 0);

export const getYTDProfit = () =>
  plData.reduce((s, p) => s + p.netProfit, 0);

// Pie chart colors
export const CHART_COLORS = [
  "#0D2B5E", "#E87722", "#22C55E", "#8B5CF6",
  "#EC4899", "#14B8A6", "#F59E0B", "#EF4444",
  "#6366F1", "#84CC16",
];

// ── LEADS & ENQUIRIES ─────────────────────────────────────────

export type LeadSource = "Website" | "Instagram" | "WhatsApp" | "Manual" | "Referral";
export type LeadStatus = "New" | "Contacted" | "Quoted" | "Won" | "Lost";

export interface Lead {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  source: LeadSource;
  status: LeadStatus;
  productInterest: string;
  estimatedValue: number;
  message: string;
  date: string;           // ISO date-time
  assignedTo: string;
  followUpDate: string;
  emailSent: boolean;
  emailSentAt?: string;   // ISO datetime when welcome email was sent
  reminderSent: boolean;  // 1hr follow-up reminder sent
  reminderSentAt?: string;
  whatsappSent: boolean;
  notes: string;
}

export const leadsData: Lead[] = [
  {
    id: "LQ-2025-001",
    name: "Mohan Rao",
    company: "Shree Constructions Pvt Ltd",
    phone: "+91 98450 23451",
    email: "mohan@shreeconstructions.in",
    source: "Website",
    status: "Quoted",
    productInterest: "LT Switchgear Panel (400A)",
    estimatedValue: 850000,
    message: "Need 2 nos LT panels for commercial building project at Whitefield",
    date: "2025-04-15T10:32:00",
    assignedTo: "Priya Sharma",
    followUpDate: "2025-04-18",
    emailSent: true,  emailSentAt: "2025-04-15T10:33:00",
    reminderSent: true, reminderSentAt: "2025-04-15T11:33:00",
    whatsappSent: true,
    notes: "Site visit scheduled April 19th",
  },
  {
    id: "LQ-2025-002",
    name: "Arun Kumar",
    company: "Kumar Infra Projects",
    phone: "+91 77605 88210",
    email: "arun@kumarinfra.com",
    source: "Instagram",
    status: "New",
    productInterest: "Distribution Boards (24-way)",
    estimatedValue: 320000,
    message: "Saw your Instagram post — interested in DB boxes for apartment project",
    date: "2025-04-16T08:14:00",
    assignedTo: "Suresh Babu",
    followUpDate: "2025-04-17",
    emailSent: true,  emailSentAt: "2025-04-16T08:15:00",
    reminderSent: true, reminderSentAt: "2025-04-16T09:15:00",
    whatsappSent: true,
    notes: "",
  },
  {
    id: "LQ-2025-003",
    name: "Savitha Reddy",
    company: "Reddy Engineering Works",
    phone: "+91 94484 67321",
    email: "savitha@reddyeng.com",
    source: "WhatsApp",
    status: "Contacted",
    productInterest: "Motor Control Center (MCC)",
    estimatedValue: 1200000,
    message: "Looking for MCC panel for pump house — need urgent quote",
    date: "2025-04-14T14:05:00",
    assignedTo: "Priya Sharma",
    followUpDate: "2025-04-19",
    emailSent: true,  emailSentAt: "2025-04-14T14:06:00",
    reminderSent: true, reminderSentAt: "2025-04-14T15:06:00",
    whatsappSent: true,
    notes: "Sent catalogue. Awaiting site dimensions.",
  },
  {
    id: "LQ-2025-004",
    name: "Rajiv Menon",
    company: "Menon & Associates",
    phone: "+91 80234 55678",
    email: "rajiv.menon@menonassoc.com",
    source: "Referral",
    status: "Won",
    productInterest: "Bus Ducts 400A",
    estimatedValue: 480000,
    message: "Referred by BHEL contact — need bus duct supply for plant expansion",
    date: "2025-04-10T11:20:00",
    assignedTo: "Suresh Babu",
    followUpDate: "2025-04-20",
    emailSent: true,  emailSentAt: "2025-04-10T11:21:00",
    reminderSent: true, reminderSentAt: "2025-04-10T12:21:00",
    whatsappSent: true,
    notes: "Order confirmed VSG/2025/0062 — ₹4.8L",
  },
  {
    id: "LQ-2025-005",
    name: "Deepak Sharma",
    company: "Sharma Power Projects",
    phone: "+91 73489 12345",
    email: "deepak@sharmapower.in",
    source: "Website",
    status: "New",
    productInterest: "HT Panel / VCB",
    estimatedValue: 2400000,
    message: "Need HT panels for 33KV substation. Urgent requirement — please call.",
    date: "2025-04-16T09:45:00",
    assignedTo: "Priya Sharma",
    followUpDate: "2025-04-17",
    emailSent: true,  emailSentAt: "2025-04-16T09:46:00",
    reminderSent: false,
    whatsappSent: false,
    notes: "High priority lead — ₹24L potential",
  },
  {
    id: "LQ-2025-006",
    name: "Kavya Nair",
    company: "Nair Electricals",
    phone: "+91 99001 44332",
    email: "kavya@nairelectricals.com",
    source: "Instagram",
    status: "Lost",
    productInterest: "MCB (Bulk — 16A)",
    estimatedValue: 95000,
    message: "Need bulk MCBs — 500 nos. Competitive pricing required.",
    date: "2025-04-08T16:30:00",
    assignedTo: "Suresh Babu",
    followUpDate: "2025-04-12",
    emailSent: true,  emailSentAt: "2025-04-08T16:31:00",
    reminderSent: true, reminderSentAt: "2025-04-08T17:31:00",
    whatsappSent: true,
    notes: "Lost to competitor on price. Maintain contact for future.",
  },
  {
    id: "LQ-2025-007",
    name: "T. Krishnamurthy",
    company: "KSRTC (Shivajinagar)",
    phone: "+91 80 2220 1234",
    email: "km.ksrtc@karnataka.gov.in",
    source: "Manual",
    status: "Quoted",
    productInterest: "MCCB 250A (3P) + Control Panel",
    estimatedValue: 680000,
    message: "Government tender for depot electrification work",
    date: "2025-04-12T10:00:00",
    assignedTo: "Priya Sharma",
    followUpDate: "2025-04-22",
    emailSent: true,  emailSentAt: "2025-04-12T10:01:00",
    reminderSent: true, reminderSentAt: "2025-04-12T11:01:00",
    whatsappSent: false,
    notes: "Govt order — L1 basis. Quote submitted.",
  },
  {
    id: "LQ-2025-008",
    name: "Suresh Patel",
    company: "Patel Cold Storage",
    phone: "+91 98456 87654",
    email: "suresh@patelcoldstorage.com",
    source: "WhatsApp",
    status: "Contacted",
    productInterest: "Capacitor Bank 50 KVAR",
    estimatedValue: 340000,
    message: "Power factor issue in cold storage — need capacitor bank with APFC",
    date: "2025-04-13T12:15:00",
    assignedTo: "Suresh Babu",
    followUpDate: "2025-04-18",
    emailSent: false,
    reminderSent: false,
    whatsappSent: false,
    notes: "Site inspection done. Energy audit report shared.",
  },
];

export const leadSourceColors: Record<LeadSource, string> = {
  Website:   "#0D2B5E",
  Instagram: "#E1306C",
  WhatsApp:  "#25D366",
  Manual:    "#E87722",
  Referral:  "#8B5CF6",
};

export const leadStatusColors: Record<LeadStatus, string> = {
  New:       "badge-blue",
  Contacted: "badge-navy",
  Quoted:    "badge-amber",
  Won:       "badge-green",
  Lost:      "badge-red",
};

export const WELCOME_EMAIL_TEMPLATE = `Subject: Thank you for your enquiry — Venkat Switchgears

Dear {name},

Thank you for reaching out to Venkat Switchgears!

We have received your enquiry regarding **{product}** and our team will get back to you within 24 hours with a detailed quote.

**Your Enquiry Reference:** {leadId}

Meanwhile, feel free to explore our product range at:
🌐 https://venkatswitchgears.com

For urgent requirements, please call us directly:
📞 +91 9448354274 / +91 9844021560

Warm regards,
Venkat Switchgears — Synergizing Power
#150, 10th Main, 3rd Phase, Peenya Industrial Area
Bangalore – 560058`;

export const WELCOME_WHATSAPP_TEMPLATE = `Hello {name} 👋

Thank you for contacting *Venkat Switchgears*!

Your enquiry for *{product}* (Ref: {leadId}) has been received.

Our team will contact you within 24 hours with pricing & details.

📞 +91 9448354274
🌐 venkatswitchgears.com

*Venkat Switchgears — Synergizing Power* ⚡`;
