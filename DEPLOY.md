# Venkat Switchgears BI Dashboard — Cloud Deployment Guide

> **Client:** Venkat Switchgears, Peenya Industrial Area, Bangalore  
> **Domain to purchase:** dashboard.venkatswitchgears.com  
> **Cloud account:** Register on company name — Venkat Switchgears Pvt Ltd

---

## RECOMMENDED STACK

| Layer | Service | Cost/month |
|-------|---------|-----------|
| Frontend hosting | **Vercel** (easiest) or AWS Amplify | Free–₹800 |
| Backend API | **Firebase Cloud Functions** or AWS Lambda | Free tier |
| Database | **Firebase Firestore** (real-time) | Free–₹1500 |
| Auth | **Firebase Auth** | Free |
| Email | **SendGrid** (100/day free) | Free–₹1500 |
| WhatsApp | **Twilio** or **Interakt** | ₹999+ |
| File storage | **Firebase Storage** or AWS S3 | Free–₹200 |
| **Total estimate** | | **₹0–₹5000/month** |

---

## STEP 1 — BUY DOMAIN / SUBDOMAIN

The main site `venkatswitchgears.com` is on WordPress.  
Add a subdomain for the dashboard:

```
dashboard.venkatswitchgears.com
```

**Steps:**
1. Log in to domain registrar (GoDaddy / BigRock / Namecheap)
2. Go to DNS Manager → Add CNAME record:
   - Name: `dashboard`
   - Value: `cname.vercel-dns.com` (after Vercel deploy)
   - TTL: 300

---

## STEP 2 — FIREBASE SETUP (Database + Auth)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Create new project
firebase init

# Choose: Firestore + Functions + Hosting + Auth
```

**Firebase Console (console.firebase.google.com):**
1. Create project: `venkat-switchgears-bi`
2. Authentication → Enable Email/Password + Google
3. Firestore → Create database (Mumbai region — `asia-south1`)
4. Rules: Set up role-based read rules

**Firestore Collections:**
```
leads/          → All enquiries (website, Instagram, WhatsApp, manual)
users/          → Dashboard users with roles
activityLogs/   → Who viewed what, when
settings/       → KPI targets, email config, WhatsApp config
tallySync/      → Last synced Tally data cache
notifications/  → Pending notifications queue
```

**Environment variables (add to .env.local):**
```env
VITE_FIREBASE_API_KEY=xxxx
VITE_FIREBASE_AUTH_DOMAIN=venkat-switchgears-bi.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=venkat-switchgears-bi
VITE_FIREBASE_STORAGE_BUCKET=venkat-switchgears-bi.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxx
VITE_FIREBASE_APP_ID=xxxx
```

---

## STEP 3 — DEPLOY FRONTEND (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# From venkat-dashboard folder:
vercel

# Follow prompts:
# Project name: venkat-switchgears-dashboard
# Framework: Vite
# Build command: npm run build
# Output directory: dist
```

**Add custom domain in Vercel:**
- Vercel Dashboard → Project → Settings → Domains
- Add: `dashboard.venkatswitchgears.com`
- Vercel auto-provisions SSL certificate (free)

---

## STEP 4 — BACKEND API (Firebase Cloud Functions)

```bash
cd functions/
npm install

# Deploy functions
firebase deploy --only functions
```

**Key Cloud Functions to create:**
```
/api/leads/website       → Receive WordPress form webhook
/api/leads/instagram     → Receive Instagram webhook
/api/notify/email        → Send welcome email via SendGrid
/api/notify/whatsapp     → Send WhatsApp via Twilio
/api/tally/sync          → Pull data from Tally (triggered by cron or on-demand)
/api/reports/pdf         → Generate PDF report
/webhooks/instagram      → Instagram webhook verification + events
```

---

## STEP 5 — TALLY INTEGRATION (Office PC Bridge)

Since Tally runs on a Windows PC in the office, we need a **bridge**:

```
OFFICE PC (Windows)
├── Tally Prime (port 9000)
└── Node.js Bridge (bridge.js)
    ├── Reads data from Tally XML API every 5 min
    ├── Pushes to Firebase Firestore
    └── Accessible via: ngrok OR static IP OR VPN
```

**bridge.js setup on office PC:**
```bash
# Install on office PC
node --version   # Need v18+
npm install express axios xml2js firebase-admin dotenv

# Run bridge
node bridge.js

# Auto-start on Windows boot:
# Use PM2 or Windows Task Scheduler
npm install -g pm2
pm2 start bridge.js --name "venkat-tally-bridge"
pm2 startup
pm2 save
```

**Options for office PC connectivity:**
| Option | Setup | Cost | Reliability |
|--------|-------|------|-------------|
| **Static IP** from ISP | Call BSNL/Airtel | ₹500/month | High |
| **ngrok** tunnel | `ngrok http 3001` | Free–₹800/month | Medium |
| **Tailscale VPN** | Free for small teams | Free | High |
| **AWS Direct Connect** | Complex | ₹5000+ | Very High |

**Recommended:** Get a static IP from your ISP (BSNL/Airtel/Jio Fiber) for the office.

---

## STEP 6 — SENDGRID (Email)

1. Sign up at **sendgrid.com** (free 100 emails/day)
2. Verify sender domain: `venkatswitchgears.com`
3. Create API key → add to Firebase Functions env:
   ```bash
   firebase functions:config:set sendgrid.key="SG.xxxx"
   ```
4. Test: Send test email from console

---

## STEP 7 — WHATSAPP (Twilio or Interakt)

**Option A — Twilio (for developers):**
```bash
# Sign up: console.twilio.com
# Get: Account SID + Auth Token
firebase functions:config:set twilio.sid="ACxxxx" twilio.token="xxxx"
```

**Option B — Interakt (recommended for India, simpler):**
1. Sign up at **interakt.shop** (₹999/month)
2. Connect your WhatsApp Business number
3. Get API key → add to Firebase config
4. Create message templates (approved by Meta in ~24hrs)

---

## STEP 8 — INSTAGRAM

1. Go to **developers.facebook.com**
2. Create App → Add Instagram Graph API + Webhooks
3. Connect Instagram Business Account to Facebook Page
4. Subscribe webhooks: `messages`, `comments`
5. Set webhook URL: `https://asia-south1-venkat-switchgears-bi.cloudfunctions.net/webhooks/instagram`
6. Add tokens to Firebase config

---

## STEP 9 — CUSTOM DOMAIN SSL

Vercel auto-handles SSL. Nothing extra needed.

For Firebase Hosting (alternative):
```bash
firebase hosting:channel:deploy production
# Then in Firebase Console → Hosting → Add custom domain
```

---

## PRODUCTION CHECKLIST

- [ ] Domain: `dashboard.venkatswitchgears.com` created in DNS
- [ ] Firebase project created (Mumbai region)
- [ ] Environment variables set in Vercel + Firebase
- [ ] Frontend deployed to Vercel
- [ ] Cloud Functions deployed to Firebase
- [ ] Tally bridge running on office PC
- [ ] SendGrid sender domain verified
- [ ] WhatsApp/Twilio account active
- [ ] Instagram webhook connected
- [ ] WordPress contact form webhook pointing to API
- [ ] Test lead flow: Submit form → DB → Email → WhatsApp
- [ ] Test Tally sync: Data appears in dashboard
- [ ] SSL certificate active
- [ ] All 5 user roles tested
- [ ] Customer portal tested

---

## MONTHLY COST ESTIMATE

| Service | Free Tier | Paid |
|---------|-----------|------|
| Vercel hosting | Free (hobby) | ₹1500 (pro) |
| Firebase | Free (Spark) | ₹1500 (Blaze, pay-as-you-go) |
| SendGrid | 100/day free | ₹1200 (Essentials) |
| Twilio WhatsApp | Trial credits | ₹800 + ₹0.7/msg |
| Interakt (alternative) | — | ₹999 flat |
| Static IP (ISP) | — | ₹500 |
| Domain renewal | — | ₹800/year |
| **TOTAL** | **₹0** (limited) | **~₹4000–6000/month** |

---

## SUPPORT CONTACTS

| Service | Support |
|---------|---------|
| Firebase | firebase.google.com/support |
| Vercel | vercel.com/support |
| Interakt | support@interakt.shop |
| Twilio | support.twilio.com |
| SendGrid | support.sendgrid.com |

---

*Document prepared for: Venkat Switchgears, Peenya Industrial Area, Bangalore*  
*Dashboard version: 1.0.0 | Last updated: April 2025*
