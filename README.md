# 🚢 Ship Cutting Robot Management Platform (TITAN-CUT)

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/anshika01-agrawal/ship-cutter.git)
[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-lightgrey)](LICENSE)

An industrial full-stack web platform for managing and showcasing **autonomous ship cutting robotics**, real-time plasma dismantling operations, structural hull part tracking, optical emission spectrometry (OES) analysis, robot health diagnostics, and AI vision copilot path planning.

Repository: **[https://github.com/anshika01-agrawal/ship-cutter.git](https://github.com/anshika01-agrawal/ship-cutter.git)**

---

## 🌐 Working Platform Links

When the development servers are running locally, access each section directly:

| Section | Route URL | Description |
|---|---|---|
| **Public Showcase Website** | [http://localhost:5173/](http://localhost:5173/) | Landing page, video hero HUD, 4-step workflow, team, gallery & contact |
| **• About Section** | [http://localhost:5173/#about](http://localhost:5173/#about) | Company mission, scrap metrics & engineering leadership |
| **• How It Works** | [http://localhost:5173/#how-it-works](http://localhost:5173/#how-it-works) | Interactive 4-step autonomous cutting pipeline & machine tolerances |
| **• Capabilities / Services** | [http://localhost:5173/#services](http://localhost:5173/#services) | Heavy marine plate cutting, AI kerf pathing & machine specs drawer |
| **• Operational Gallery** | [http://localhost:5173/#gallery](http://localhost:5173/#gallery) | Filterable field photos with interactive fullscreen lightbox |
| **• Field Research Logs** | [http://localhost:5173/#field-logs](http://localhost:5173/#field-logs) | Technical whitepapers preview & engineering publications |
| **• Yard Dispatch Form** | [http://localhost:5173/#contact](http://localhost:5173/#contact) | Yard feasibility assessment and rapid deployment request |
| **Real-time Operations Dashboard** | [http://localhost:5173/dashboard](http://localhost:5173/dashboard) | Live cutting telemetry, 68.4% progress ring, hull section map, live event feed |
| **Structural Part Tracking** | [http://localhost:5173/dashboard/parts](http://localhost:5173/dashboard/parts) | Plate manifest, category filters, and part registration modal |
| **Material Spectrometry & Metallurgy** | [http://localhost:5173/dashboard/materials](http://localhost:5173/dashboard/materials) | OES chemical composition bars, scrap purity score, EAF certification |
| **Robot Health & Maintenance** | [http://localhost:5173/dashboard/maintenance](http://localhost:5173/dashboard/maintenance) | Health scores for plasma torch, kinematics, tracks & service schedule |
| **Scrap Feasibility & ROI Statement** | [http://localhost:5173/dashboard/feasibility](http://localhost:5173/dashboard/feasibility) | Financial statements, secondary scrap yield, and cycle duration |
| **Historical Cut Operations** | [http://localhost:5173/dashboard/history](http://localhost:5173/dashboard/history) | Chronological past vessel dismantling operations timeline & CSV export |
| **Inspection Photo Library** | [http://localhost:5173/dashboard/photos](http://localhost:5173/dashboard/photos) | Drag-and-drop media upload, tag filtering, and inspection archive |
| **Vessel Fleet Management** | [http://localhost:5173/dashboard/ships](http://localhost:5173/dashboard/ships) | Registered ships, tonnages (LDT), berth statuses, and vessel registration |
| **AI Cutting Copilot (Gemini)** | [http://localhost:5173/dashboard/chatbot](http://localhost:5173/dashboard/chatbot) | Autonomous cutting AI with suggested prompts and inspection photo analysis |
| **Field Engineering Whitepapers** | [http://localhost:5173/blog](http://localhost:5173/blog) | Complete archive with search, tag filters, and modal reader |
| **Feasibility Dispatch Page** | [http://localhost:5173/contact](http://localhost:5173/contact) | Dedicated yard assessment request form |
| **Backend REST API Health** | [http://localhost:5000/api/health](http://localhost:5000/api/health) | Live backend API health check endpoint |

---

## 🎨 Industrial Design System

| Property | Value | Description |
|---|---|---|
| **Primary Background** | `#000000` | Pure Black with subtle radial grid overlay |
| **Card / Surface Background** | `#111111` / `#1a1a1a` | Dark Charcoal with subtle borders |
| **Secondary Surface** | `#2a2a2a` | Medium charcoal for active controls |
| **Border / Divider** | `#333333` | Crisp structural separation |
| **Primary Typography** | `Inter`, sans-serif | Ultra-clean modern interface typography |
| **Telemetry Font** | `JetBrains Mono`, monospace | High-precision numeric metrics and data logs |
| **Cyan Accent** | `#38bdf8` | Autonomous cutting path & AI vision indicators |
| **Emerald Accent** | `#10b981` | Completed cuts & optimal robot health status |
| **Amber Accent** | `#f59e0b` | High thermal gradient & maintenance notices |

---

## 🏗️ System Architecture

### 1. Backend Server (`/server`)
- **Node.js + Express.js** REST API with Morgan logging and CORS.
- **Mongoose Data Models**:
  - `Ship.js` — Vessel specifications, dimensions, tonnages, and photos
  - `CuttingOperation.js` — Real-time telemetry, cut zones, velocity, logs
  - `Part.js` — Structural plates, beams, bulkheads, scrap offcuts
  - `Material.js` — Spectrometry chemical composition (Steel, Iron, Al, Cu)
  - `Maintenance.js` — Subsystem health scores (torch, tracks, kinematics)
  - `Feasibility.js` — Economic statement, revenue, costs, and net ROI %
  - `Photo.js` — Field inspection photos, tags, metadata
  - `BlogPost.js` — Engineering research articles
  - `Contact.js` — Shipyard feasibility submissions
- **Multer Storage** (`/middleware/upload.js`) configured for local uploads with mime verification.
- **Graceful DB Fallbacks**: Functions with MongoDB Atlas/local, and provides mock seed data if disconnected.

### 2. Frontend Client (`/client`)
- **React 18 + Vite** with Tailwind CSS dark theme.
- **Framer Motion** for smooth scroll transitions and dialog animations.
- **Lucide React** icons.
- **Smooth Scroll Anchors & Scrollspy**: Seamless navigation to `#about`, `#how-it-works`, `#services`, `#gallery`, `#field-logs`, `#contact`.
- **API Proxy**: Automatically proxies `/api` and `/uploads` to `http://localhost:5000`.

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18+` or `v20+`
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/anshika01-agrawal/ship-cutter.git
cd ship-cutter
```

### 2. Install Dependencies
```bash
# Install Server dependencies
cd server
npm install

# Install Client dependencies
cd ../client
npm install
```

### 3. Launch Development Servers

**Option A: Run from Root**
```bash
# Run backend server
npm run dev:server

# In a second terminal, run frontend client
npm run dev:client
```

**Option B: Run from Respective Directories**
```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

Open **`http://localhost:5173/`** in your browser.

---

## 📄 License
MIT © 2026 TITAN-CUT Ship Robotics Platform
