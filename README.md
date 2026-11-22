# Ekmutho Hashi (একমুঠো হাসি)
### Community Charity & Relief Distribution Dashboard

A complete, responsive, and transparent web application designed for grassroots volunteer and charity groups in Bangladesh. It empowers humanitarian organizations to track donor contributions, manage warehouse relief inventory, register verified underprivileged beneficiary families, bundle custom relief packages (e.g., **Ramadan Iftar Samogri**), log wholesale market expenses, and generate printable money receipts and relief token slips.

---

## 🌟 Key Features

### 1. 📊 Overview Dashboard
- **Bangladeshi Taka (৳ / BDT):** Native currency formatting across all figures, charts, and transaction logs.
- **5 KPI Summary Cards:** Total Funds Raised, Total Spent, Remaining Cash Balance, Families Served, and Packages Distributed.
- **Interactive Visualizations:**
  - Cash In vs. Spent Out comparison bar chart with running net balance.
  - Category-wise expenditure breakdown donut chart.
- **Warehouse Threshold Alerts:** Real-time warnings when essential relief items (Chola, Dates, Oil, Sugar) run low.
- **Activity Feed:** Live chronological feed of donations, wholesale market buys, and family aid distributions.

### 2. ⚡ Supabase Cloud Sync & Volunteer Mobile Access
- **Multi-Volunteer Synchronization:** Multiple volunteers can log in from their phones in the field and updates (donations, inventory deductions, family aid deliveries) sync in real-time across all devices.
- **Volunteer Authentication:** Secure login & registration with volunteer profile tracking. Every distribution and expense is tagged with the volunteer's name.
- **Dual-Mode Architecture:** Seamless offline/local fallback via LocalStorage when offline or unconfigured, plus real-time Postgres subscriptions when connected to Supabase.
- **One-Click Cloud Seeding:** Easily push pre-populated local Ramadan 2026 sample data into Supabase in one click.

### 3. 📢 Campaigns & Seasonal Drives (`/campaigns`)
- Organize relief initiatives separately (*e.g., Ramadan Iftar Samogri Drive 2026, Winter Warmth Blanket Drive, Emergency Medical Fund*).
- Track target funds, family targets, completion percentages, and progress bars.
- Global campaign filter in the header bar to filter stats across the whole application.

### 4. 🤝 Fund Collection & Donor Records (`/donors`)
- Track contributions from members, well-wishers, local merchants, and overseas expats.
- Supports **Cash Contributions** (*bKash, Nagad, Rocket, Hand Cash, Bank Transfer*) and **Direct In-Kind Relief Donations** (*e.g., 50 kg Chola or 20 L Oil*).
- **Printable Donor Money Receipt:** Instant receipt generation with receipt numbers, date, amount in figures and spelled out in words, and official verification seal.
- Export donor records to CSV with UTF-8 BOM encoding.

### 5. 👨‍👩‍👧‍👦 Beneficiary Registry (`/beneficiaries`)
- Verified directory of underprivileged households with unique **Token Numbers** (`TKN-001`) and **Family IDs** (`EH-FAM-001`).
- Priority classification: *Widow / Elderly, Disabled, Day Laborer, Orphan Support, Low-Income Family*.
- **Printable Relief Token Card:** Formal token slip for families to bring to distribution staging points with barcodes and Bengali instructions.
- Complete aid history timeline for every family.

### 6. 📦 Relief Stock & Package Builder (`/inventory`)
- Track bulk relief commodities (*Chola, Dates, Soybean Oil, Muri, Sugar, Dal, Miniket Rice*).
- Auto-calculated stock balance: `(Purchased + Donated) - Distributed`.
- **Relief Package Formula Builder:** Define bundle recipes (e.g. *Standard Ramadan Iftar Box* = 2kg Chola + 1kg Dates + 1L Oil + 1kg Sugar + 1kg Muri + 1kg Dal). Shows how many full boxes can be packaged from current warehouse stock.

### 7. 🧾 Expenses & Distribution Ledger (`/expenses`)
- Record wholesale market purchases, van transport fare, and packaging bags. Checkbox option to automatically add purchased items to inventory stock.
- Hand over aid to families: auto-checks stock availability, prevents negative inventory, deducts items from stock, and marks the beneficiary as *Delivered*.

### 8. 📑 Financial Ledger & Audit Export (`/reports`)
- Chronological income-and-expense statement with real-time running balance.
- Payment method breakdown (*Hand Cash, bKash, Nagad, Rocket, Bank Transfer*).
- **Printable Audit Report:** Official A4 statement for committee reviews, donor meetings, and public transparency.
- Full CSV / Excel export for all financial transactions.

---

## ☁️ Supabase Cloud Database Setup (2 Minutes)

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard, click **New query**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql), and click **Run**.
3. Go to **Project Settings → API** and copy:
   - **Project URL**
   - **anon public API Key**
4. Connect via either:
   - **In-App (Easiest):** Open the app, click **"Connect Cloud"** in the topbar, paste your URL and API Key, and click **Connect**.
   - **Or via `.env`:** Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5. In the app, click **"Push Local Records to Cloud Database"** to immediately seed the cloud with the Ramadan 2026 data.

---

## 🛠️ Technology Stack

- **Framework:** React 19 + Vite 8
- **Backend / Database:** Supabase (PostgreSQL + Auth + Realtime WebSocket Sync)
- **Styling:** Tailwind CSS v4
- **Charts:** Recharts
- **Icons:** Lucide React
- **Confetti:** Canvas-Confetti
- **Storage:** Supabase Cloud + LocalStorage Fallback

---

## 🚀 Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/engrarmanhossain/Ekmutho-Hashi.git
   cd Ekmutho-Hashi
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
