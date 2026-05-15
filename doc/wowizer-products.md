# Wowizer.ai — Product Suite

**Company:** Wowizer (product line of Predoole Analytics)
**Website:** https://wowizer.ai
**Tagline:** "Making Qlik Click" | "Outsmart the Game"
**Mission:** Enhance user experience and automate the mundane tasks for Qlik implementations
**HQ:** USA (Wilmington, Delaware) + India (Thane, Maharashtra)

---

## Ajay Kakkar's Role

**Solutions Architect · R&D Lead · Team Lead · Systems Thinker ("Spock")**

Ajay is the primary conceptual leader and technical architect across all Wowizer products. He drives the thinking behind what to build, how it should work, and what real user problem it solves — from ideation through delivery.

**Team:** Leads Team Wowizer — a team of 5 engineers. Guides architecture decisions, Qlik Cloud/Enterprise API usage, and solution design. The team executes; Ajay defines the direction.

**Qlik Platform Coverage:** Full migration spectrum — QlikView → Qlik Sense Enterprise → Qlik Cloud. Deep API knowledge of both Qlik Enterprise and Qlik Cloud used to guide the team and design solutions that aren't possible without that depth.

**Core philosophy:** *Solutions to make life easy for the user.* Every product starts from a genuine user pain — the goal is always simplification, not complexity.

**Expanding:** Beginning to guide the KADAC team as AI-powered finance product work grows (from Apr 2026).

---

## Live Products (Confirmed)

**Currently in production:** TPM, Cloud QMC, CMA, QV2QC Extended

---

## Products

### 1. Wowizer Data Access Auditor

**Category:** Data Security & GDPR Compliance
**Target Users:** Qlik Champions, Developers, Data Protection Officers (DPOs)

**What it does:**
A robust tool that ensures meticulous data security and compliance in Qlik dashboards. Validates user access and enforces regulations by monitoring data interactions in real time.

**Key Features:**
- Granular access validation: stream, app, sheet, and row-level access
- Proactive compliance monitoring and checks
- Real-time auditing with feedback loops
- Prevention of unauthorized data entry
- GDPR adherence verification with testing evidence
- Streamlined dashboard implementation and risk mitigation

**Why it matters:**
Empowers DPOs and developers with precise testing evidence for access compliance, safeguarding against improper access in rapidly evolving data landscapes.

---

---

### 2. QV2QC Extended — QlikView to Qlik Cloud Migration (NEW)

**Category:** BI Migration / Legacy Modernisation
**Status:** New product — live
**Target Users:** Enterprises running QlikView who need to move to Qlik Cloud

**What it does:**
An extended migration tool specifically for QlikView-to-Qlik-Cloud journeys — going beyond the standard CMA scope to handle the deeper complexity of QlikView architectures (scripting differences, section access models, visualisation gaps between QlikView and Qlik Cloud).

**Why "Extended":**
QlikView to Qlik Cloud is a harder migration than Sense Enterprise to Cloud. QV2QC Extended addresses the specific pain points that generic migration tools miss — script compatibility, object mapping, and validation workflows.

---

### 3. Teams Bot (Wowizer Alerts — Microsoft Teams)

**Category:** Conversational AI / NLP-powered Analytics
**Integration:** Microsoft Teams + Qlik Sense

**What it does:**
Enhances Qlik Sense with conversational AI via Microsoft Teams. Users interact with Qlik data using natural language, powered by the Qlik Associative Engine.

**Key Features:**
- Natural language interactions with Qlik data
- Qlik Associative Engine as the analytics backbone
- Scalable on-premises architecture
- Contextual responses and human handover suggestions
- Insight Advisor support
- Guided analytics based on app-level keywords (Apps, Dimensions, Measures)
- Teams-Qlik chart integration
- Administration UI
- Data security layer
- Requires Insight Bot License

**Architecture:** On-premises, scalable, with Qlik QIX Engine connectivity

---

### 4. WhatsApp Bot (Wowizer Alerts — WhatsApp)

**Category:** Conversational AI / NLP-powered Analytics
**Integration:** WhatsApp + Qlik Sense

**What it does:**
Brings Qlik Sense analytics into WhatsApp via conversational AI. Same core capabilities as Teams Bot but delivered through WhatsApp for broader accessibility.

**Key Features:**
- Natural language queries to Qlik Sense data via WhatsApp
- Qlik Associative Engine integration
- Scalable on-premises architecture
- Contextual responses and guided analytics
- App-specific non-guided analytics support
- Data security and compliance built in
- Insight Advisor support

---

### 5. Cloud Migration Accelerator (CMA)

**Category:** BI Migration Tool — Qlik Sense Enterprise → Qlik Cloud
**Status:** Live in production (Version 3.2)
**Screenshot:** Available — desktop mockup
**Target Users:** Qlik Enterprise admins migrating to Qlik Cloud

**What it does:**
A structured migration management platform that tracks, validates, and executes the full migration from Qlik Sense Enterprise (Client Managed) to Qlik Cloud — covering apps, users, tasks, data connections, and licences in a single dashboard.

**What the UI shows (from screenshot):**
- **Environment selector:** Switch between Client Managed (QlkEntDev) and Cloud (QlkCMDev) environments
- **Migration Overview panel:**
  - Apps: 46 (Client Managed) → 1 (Cloud)
  - Users: 6 → 0
  - Tasks: 55 → 0
  - Data Connection/Script Changes: 89 → 0
- **License Overview panel:** Tracks Analyzer, Professional, Analyzer Time Access licence slots (used vs. available in both environments)
- **Client Managed Overview panel:** Full licence metadata — type, validity, GeoAnalytics ✓, NetAuth ✓, MaxUsers, ConcurrentBackgroundTasks, ConcurrentInteractiveApps, etc.
- **Action buttons:** Migration Report · Qlik Inventory Report
- **Left sidebar:** Migrate Users · Migrate Apps · Data Connection · UAT · Publish Apps · Migrate Tasks · Migrate User Access · Audit Log · Admin Config

**Key Features:**
- Side-by-side Client Managed vs Cloud comparison for all migration objects
- Tracks migration progress per object type (apps, users, tasks, connections)
- Licence gap analysis before migration
- UAT workflow built in — validate before going live
- Full audit log
- One-click publish apps to cloud
- Inventory reporting — know exactly what you have before you move it

---

### 6. AI-Powered Command Center (TPM — Tenant & Performance Management)

**Category:** Enterprise Administration / Real-Time Monitoring / Alert Management
**Status:** Live in production
**Screenshot:** Available — laptop mockup
**Target Users:** Qlik administrators, managed service providers managing multiple Qlik environments

**What it does:**
A real-time alert monitoring and administration command centre for Qlik environments. Gives admins instant visibility into what's happening across all their Qlik apps, tasks, and hosts — with severity-based alerting and one-click action.

**What the UI shows (from screenshot):**
- **Top stat bar:** Live counts — Unread alerts, Total alerts, by severity category (colour-coded: green/yellow/red/blue)
- **Alert table columns:** Date-Time · Host Name · Alert Name · Severity · Alert State · Action · Details
- **Filters:** All Hosts · App Reloaded/Otherwise Missed · All States · QB · QW · NPrinting
- **Left sidebar navigation:** Home · Real Time Monitoring · App/Visualizations · Reports/Feedback · Admin
- Wowizer branding: "TAKE ACTION WISER"

**Key Features:**
- Real-time alert monitoring across multiple Qlik hosts
- Severity classification (colour-coded — critical/medium/low)
- NPrinting task monitoring integrated
- Multi-tenant administration console
- AI-powered operational insights and recommendations
- Managed services capabilities — for MSPs managing multiple client Qlik environments
- Performance monitoring and optimization
- Centralized control of distributed Qlik environments

---

### 7. Cloud QMC

**Category:** Cloud Administration
**Target Users:** Qlik Cloud administrators

**What it does:**
A multi-tenant cloud administration solution delivering enhanced management capabilities on Qlik Cloud beyond the native QMC.

**Key Features:**
- Complex Task Chaining — intricate task sequences with Success/Failure dependencies via GUI
- Scheduled or manual backup (on-premise, without data) for recovery from accidental deletion
- Bulk User Provisioning — allocate multiple users to spaces with access in one go
- Multitenant Administration Console — unified management of users, apps, and spaces
- Streamlined admin workflows and bulk operations
- Disaster recovery capabilities
- Bridges on-premise-to-cloud transition workflows

---

## Wowizer Content & Community Presence

- Promotional videos created for Qlik Community, Medium, and YouTube
- Wowizer Data Access Auditor featured and promoted across Qlik ecosystem channels
- Ajay authored and produced all promotional and educational content for the product suite
