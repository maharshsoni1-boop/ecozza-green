# Ecozza Green — Official E-Commerce Platform

Official production e-commerce and agronomic platform for **Ecozza Green**, based in Gujarat, India.

The platform sells high-grade granular biochar soil conditioners to nurseries, farmers, commercial fruit orchards, and home gardeners across India.

---

## 1. Tech Stack & Architecture

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router) + TypeScript + React 19
- **Styling:** Tailwind CSS with custom design tokens (`globals.css`)
- **Database & ORM:** PostgreSQL / SQLite with [Prisma ORM 6](https://www.prisma.io/)
- **Payments:** [Razorpay](https://razorpay.com/) (Cards, Netbanking, UPI, QR) + Cash on Delivery (pincode validated)
- **Logistics:** Shiprocket abstraction with weight-tiered calculations (0-5kg, 5-10kg, 10-25kg, >25kg)
- **Transactional Notifications:** Resend email notifications & WhatsApp Click-to-Chat deep links
- **Hosting Target:** Vercel (zero-config Next.js deployment)

---

## 2. Key Business & Agronomic Features

1. **Strict Regulatory & Claims Safeguards:**
   - Centralized compliance engine ensuring biochar is categorized strictly as a **Soil Conditioner**, never a chemical fertilizer.
   - Zero yield-increase guarantees or cure claims.
   - Persistent *"starting recommendation"* disclaimers across all dose calculation views.
   - Dynamic **FCO Registration Number** field in `/admin/settings` (left empty until provided).
2. **Dynamic Soil Dose Calculator (`/dose-calculator`):**
   - Inputs: Crop type, number of pots, trees, or acres, and soil texture (Sandy, Clayey, Loamy, Degraded).
   - Dynamic outputs: Total kilograms needed, optimal bag combination (25kg, 10kg, 5kg), and estimated cost.
   - 100% database driven (`DoseRule` table) with zero hardcoded agronomic figures.
   - One-click *"Add Recommended Bags to Cart"*.
3. **Transparent Batch Lab Reports (`/lab-reports`):**
   - Batch lookup modal (e.g., `EG-2026-B01`).
   - Displays real parameters: Organic Carbon %, pH, Moisture %, Granule Size Range, Bulk Density, and Heavy Metals test results.
   - Downloadable certified test PDFs.
4. **India GST & Invoicing:**
   - Concessional 5% GST included in retail pricing.
   - Automatic tax split on checkout & printable invoices:
     - **Intra-state (Gujarat):** CGST (2.5%) + SGST (2.5%).
     - **Inter-state (Rest of India):** IGST (5.0%).
   - Optional B2B 15-character GSTIN collection for commercial input tax credit.
5. **Back-Office Admin Console (`/admin`):**
   - Executive dashboard (Paid Revenue, Orders, New Leads, Low Inventory Alerts).
   - Order fulfillment workflow (`PLACED` -> `PAID` -> `PACKED` -> `SHIPPED` -> `DELIVERED`).
   - Bag inventory and pricing editor.
   - Production batch & lab report logger.
   - B2B commercial grower leads CRM with 1-click WhatsApp messaging.
   - Review moderation suite.
   - FCO registration and tax settings editor.

---

## 3. Quick Local Development Setup

### Prerequisites
- Node.js 20+ installed
- npm or pnpm

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy the sample environment file:
```bash
cp .env.example .env
```
*(Default settings are pre-configured with local SQLite and test payment simulation keys).*

### 3. Initialize & Seed Database
```bash
npx prisma db push
npm run db:seed
```
This seeds:
- 4 graded biochar products (Garden Grade, Nursery Blend, Orchard Coarse, Farm Granules)
- 1 demo batch lab report (`EG-2026-B01`) with realistic physical/chemical parameters
- 3 demo orders with tracking and invoices
- Complete dose recommendation matrix
- Administrator account: `admin@ecozzagreen.in` / `EcozzaAdmin2026!`

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run Automated Test Suite
```bash
npm test
```
Runs 10 assertions covering:
- Pricing and GST calculation (CGST/SGST vs IGST)
- Cart math and shipping weight tiers
- Dose calculator optimization algorithms
- Order status state machine transitions

---

## 4. Production Deployment to Vercel

1. **Database:** Create a managed PostgreSQL database on [Supabase](https://supabase.com/), [Neon](https://neon.tech/), or [Railway](https://railway.app/).
2. In `prisma/schema.prisma`, change datasource provider to PostgreSQL:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Update `DATABASE_URL` in Vercel project environment variables.
4. Set build command: `npx prisma db push && npm run build`.

---

## 5. Go-Live Checklist

- [ ] **FCO Compliance:** Log in to `/admin/settings` and enter your official Fertilizer (Control) Order registration / license number once granted.
- [ ] **Razorpay Live Credentials:**
  - Replace `NEXT_PUBLIC_RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` with live merchant keys from Razorpay Dashboard.
  - Set `RAZORPAY_WEBHOOK_SECRET` and register webhook URL `https://ecozzagreen.in/api/webhooks/razorpay` for `payment.captured` and `order.paid` events.
- [ ] **Shiprocket Live Credentials:** Enter live Shiprocket API credentials in `.env` to enable real-time AWB generation and courier pickup.
- [ ] **Resend Transactional Email:** Add live `RESEND_API_KEY` for order confirmation receipts and sales lead alerts.
- [ ] **Legal Review:** Have local counsel review policy draft placeholders at `/policies/privacy`, `/policies/terms`, `/policies/shipping`, and `/policies/returns`.
- [ ] **Analytics:** Add Google Analytics 4 Measurement ID and Meta Pixel ID in cookie consent preferences.
