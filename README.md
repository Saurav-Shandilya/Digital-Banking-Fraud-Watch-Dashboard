# Digital Banking Fraud-Watch Dashboard

An interactive digital banking dashboard featuring real-time client-side heuristic fraud detection, transaction risk scoring, and financial analytics.

---

## 🚀 Features

- **Account Overview**: Real-time balance tracking in INR (₹), quick statistics (cleared vs flagged transactions, average risk index), and interactive activity table with detailed security audit modals.
- **Fund Transfer with Live Fraud-Watch Engine**:
  - Live pre-flight risk evaluation before submitting payments.
  - Multi-rule scoring based on single-transaction caps, warning thresholds, location anomalies, velocity burst checks, and high-risk merchant categories.
  - Interactive alerts and confirmation intercept for high-risk transactions.
- **Configurable Rules & Penalty Weights**:
  - Fine-tune risk thresholds (Low, Medium, High, Critical).
  - Adjust scoring penalty weights for amount violations, location anomalies, frequency spikes, and merchant types.
  - Reset to baseline defaults or customize on the fly.
- **Statements & Risk Analytics**:
  - Powered by Chart.js and React-Chartjs-2.
  - Risk distribution doughnut chart and category spending bar chart.
  - Complete incident log of all transactions triggering security policies.
- **Modern Fintech UI**: Dark glassmorphic design system with responsive sidebar navigation and accessibility.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Data Visualization**: Chart.js, React-Chartjs-2
- **Icons**: Lucide React
- **Styling**: Modern CSS3 Glassmorphism with CSS custom properties (variables)
- **Currency**: Indian Rupee (₹ INR)

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## 👥 Project Team & Contributors
- **Saurav Shandilya** (Roll No: 2415001453) - Account Operations & State Management
- **Saumya Raghav** (Roll No: 2415001444) - Fraud Scoring Engine & Heuristics
- **Saurabh Singh** (Roll No: 2415001450) - Visualizations & Chart Analytics
- **Saubhagy Singh** (Roll No: 2415001443) - UI Architecture & Design System
