# Website Redesign Plan

## Goal

Transform ajaykakkar93.github.io from a 2017 template into a career-accelerating portfolio that gets Ajay better job offers by positioning him accurately as a senior solutions architect — not a developer.

**Primary purpose:** Living resume + portfolio. Sent instead of a PDF. Gets the meeting.

**Five target audiences — one positioning:**
1. Company hiring a Qlik Solutions Architect
2. Qlik partner seeking a senior consultant
3. Startup wanting an AI-augmented analytics product builder
4. Potential Udemy students
5. Qlik community validating expertise

**The positioning that works for all five:**
> *Qlik Solutions Architect · AI Product Builder · Mumbai*
> *10 years turning hard analytics problems into working solutions*

**Common question all 5 audiences are asking:** "Can this person solve a hard problem I have?" — the site answers yes with proof, not claims.

---

## Job-Search Specific Requirements

| Element | Requirement |
|---------|------------|
| "Open to opportunities" | Subtle badge on hero — recruiters scan for availability |
| CV download | Above the fold, prominent — primary recruiter conversion |
| Contact form | Use Formspree (free, works on static GitHub Pages) |
| SEO meta tags | "Qlik Solutions Architect India", "Qlik Cloud Expert Mumbai", "AI Analytics Engineer" |
| Mobile-first | Recruiters check profiles on phones |
| Load speed | Under 2 seconds — Tailwind CDN, optimised images |
| Language | Every word at senior level — "architected", "led", "delivered" not "built", "worked on" |

## Words That Pay More

| Remove | Replace with |
|--------|-------------|
| "I built dashboards" | "I architected analytics products" |
| "I worked on Wowizer" | "I led R&D on 7 enterprise products" |
| "I trained some freshers" | "I grew a 20-person engineering cohort from zero to independently productive" |
| "I know Qlik API" | "Deep expertise across the full Qlik stack: QlikView, Sense Enterprise, Qlik Cloud" |
| "I made a bot" | "Built conversational AI on Qlik's Associative Engine before RAG became industry terminology" |

## Current Site Problems

| Problem | Impact |
|---------|--------|
| 2017 W3layouts template (Bootstrap 3.1.1, jQuery 2.1.4) | Looks abandoned, signals no growth |
| Meta description says "2+ years web dev" | Wrong on Google, immediate credibility hit |
| Copyright 2017 in footer | First thing recruiters notice |
| No projects section | Biggest work is invisible |
| Skill % bars (Web Design 20%, Power BI 35%) | Meaningless, undersells expertise |
| "AI For Everyone" is the only AI credential shown | Misses the Wowizer AI bot products entirely |
| No mention of Wowizer.ai product role | Product architect role completely invisible |
| Typed text only shows "Qlik" roles | Doesn't reflect AI or product direction |
| Age displayed (calculated from 1993) | Privacy risk, unprofessional |
| Phone number publicly displayed | Privacy risk |
| No quantified impact (30% cost reduction, 22 trained, 5 awards) | Lost persuasion |

---

## New Positioning

### Headline
```
Qlik Solutions Architect & R&D Lead
Building Products That Make Analytics Easy
```

### Typed text rotation (replace current)
```
- Qlik Solutions Architect
- Team Lead · Team Wowizer
- AI-Powered Product Builder
- Qlik Cloud & Enterprise Expert
- Udemy Instructor & Mentor
```

### Value proposition (About section)
> "I don't build features — I design solutions that make things genuinely easier for users. At Wowizer.ai (Predoole Analytics), I lead a team of 5 engineers to build enterprise Qlik products across the full platform stack: QlikView, Qlik Sense Enterprise, and Qlik Cloud. From GDPR-compliance tools to AI-powered bots to cloud migration accelerators — my job is to look at a hard problem and find the solution that removes the complexity for the person using it."

---

## Site Structure (Recommended Order)

### 1. Hero
- Name, headline, typed roles
- 3 CTAs: `View Projects` · `See Wowizer Products` · `Download CV`
- Social links: GitHub, LinkedIn, YouTube, Udemy, Qlik Community

### 2. Impact Numbers (single bold row)
```
9+ Years  |  5 Products Built  |  14+ Extensions  |  22 Engineers Trained  |  5 Awards  |  4 Courses
```

### 3. Gen AI Work (new section — signals current direction)

Two subsections:

**Professional AI:**
- Teams Bot (Conversational AI + Qlik)
- WhatsApp Bot (Conversational AI + Qlik)
- KADAC Vendor Enrollment — OCR document intelligence (active, Apr 2026)

**Personal Gen AI:**
- RAG Pipeline — retrieval-augmented generation (custom knowledge base Q&A)
- OpenRouter + Claude API integration

### 4. Featured Projects (most important section)
Cards with screenshot, tech stack tags, description, and link:

| Project | Tag | Link |
|---------|-----|------|
| KADAC Vendor Enrollment (OCR) | OCR · AI · S2P · Finance Ops | kadac.ai |
| Wowizer Data Access Auditor | GDPR · Qlik · Security | wowizer.ai |
| Teams Bot — Conversational AI | AI · NLP · Qlik · Teams | wowizer.ai |
| WhatsApp Bot | AI · NLP · Qlik · WhatsApp | wowizer.ai |
| Cloud Migration Accelerator | Cloud · Qlik · Migration | wowizer.ai |
| Cloud QMC | Admin · Multi-tenant · Qlik Cloud | wowizer.ai |
| RAG Pipeline (Personal) | Gen AI · RAG · LLM · Python | GitHub |
| OpenRouter + Claude Integration | Gen AI · Claude · API · LLM | GitHub |
| Qlik API Micro-Service | API · Micro-service · Node.js | GitHub |
| 14+ Custom Extensions | Qlik · JavaScript · Open Source | GitHub |

### 4. Wowizer Products Section
Dedicated mini-section: "Products I Architected at Wowizer.ai"
- Logo + tagline
- 5 product cards with description and link to wowizer.ai

### 5. Skills
Replace % bars with icon/tag grid grouped by category:

**Qlik Platform:** Qlik Sense · Extensions · Mashups · Engine API · enigma.js · NPrinting · QMC · GeoAnalytics · Qlik Cloud

**AI & Integration:** Conversational AI · NLP · Qlik Insight Advisor · Teams API · WhatsApp API · Python

**Web & Code:** JavaScript · jQuery · HTML5 · CSS3 · Python · PHP · SQL · JSON

**Architecture:** Micro-services · GDPR Design · Multi-tenant Systems · Cloud Migration · Product R&D

### 6. Experience Timeline (updated)
- Predoole / Wowizer (2022–Present) — Product Architect & Sr. Developer
- Medly Pharmacy (2020–2022) — Qlik Developer
- Clay Logix (2016–2020) — Extension & Mashup Developer (Mahindra, Accenture, Burger King, Oberoi)
- Freelance (2014–2016) — Web Developer

### 7. I Teach
- 4 Udemy course cards (with student count + rating)
- YouTube channel
- Qlik Community link

### 8. Awards
Keep all 5 with dates, descriptions, and Qlik links.

### 9. Certifications
Updated — show all certs including Python, Power BI, JavaScript Essentials.
Add recommended Gen AI certs when completed.

### 10. Contact
Simple form. No phone number. LinkedIn + Email only.

---

## Tech Stack for Rebuild

**Recommended:** HTML + Tailwind CSS + Alpine.js
- No build tools needed
- Deploys directly to GitHub Pages
- Modern look, fast, maintainable
- Can be done in a single `index.html` + a few includes

**Alternative:** Next.js (if React experience is wanted on resume)

---

## What's Needed From Ajay Before Building

| Item | Status | Notes |
|------|--------|-------|
| TPM screenshot | DONE | Laptop mockup — alert monitoring dashboard |
| CMA screenshot | DONE | Desktop mockup — migration overview (v3.2) |
| Udemy stats | DONE | 875 learners, 2 live courses, 3.4★ and 3.8★ |
| Gen AI personal projects | DONE | RAG pipeline, OpenRouter + Claude |
| KADAC OCR detail | DONE | PAN card + Aadhaar card, validation + UX focus |
| Wowizer live products | DONE | TPM, QMC, CMA, QV2QC Extended |
| LinkedIn Coursera certs | PENDING | User to paste cert list from LinkedIn |
| Cloud QMC / QV2QC screenshots | PENDING | Add when available |
| Teams Bot / WhatsApp Bot screenshot | PENDING | Add when available |
| Preferred headshot | PENDING | Choose from AjayKakkarProfileImages/ (5 options) |
| Phone number on site? | PENDING | Keep or email-only? |
| YouTube subscriber count | OPTIONAL | Nice to have |

---

## Priority Order for Build

1. Hero + Impact numbers (sets tone immediately)
2. Featured Projects / Wowizer Products (most missed, most impactful)
3. Skills grid (replaces misleading % bars)
4. Experience timeline (minor update from current)
5. Teaching section (differentiator)
6. Awards (keep, minor cleanup)
7. Certifications (add missing ones)
8. Contact (cleanup)
