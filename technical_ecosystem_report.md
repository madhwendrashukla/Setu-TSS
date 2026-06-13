# Technical Ecosystem Report: Setu - TheStartupSchool (TSS)

This report outlines the current state and future technical direction of **Setu - TheStartupSchool (TSS)** ecosystem. It is intended for technical stakeholders as the project transitions from a frontend-heavy architecture to an integrated **Full-Stack (Backend + Frontend)** mode.

---

## 1. Project Vision
**Setu - TheStartupSchool** is an "Alternate B-School" designed for aspiring founders. It aims to bridge gaps in:
- **Learning**: Pragmatic, workshop-based education (e.g., AI and Fundraising bootcamps).
- **Access**: Curated directories of capital (Investors, Grants, Incubators).
- **Mentoring**: A network of industry-specific mentors.
- **Tools**: Essential productivity tools for early-stage operations.

---

## 2. Technical Stack
The platform uses a bleeding-edge modern web stack:

- **Frontend Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **AI Integration**: Google Gemini AI SDK (`@google/generative-ai`)
- **Data Handling**: `xlsx`, `csv-parse`, `lucide-react`
- **Automation**: `playwright` (potential for ecosystem data scraping)

---

## 3. Core Modules & Architecture

### A. Educational Product (Workshops)
High-conversion, dynamic landing pages built for specific cohorts.
- **Current Priority**: AI Startup Bootcamp (May 15-17)
- **Legacy Components**: Fundraising Workshop (April 15).
- **Functionality**: curriculum mapping, registration funnels, and dynamic testimonial sliders.

### B. Founder Resource Hub
Comprehensive directories currently served from localized data files (`/lib/data`).
- **Investor Directory**: AI-driven matching engine.
- **Incubators & Accelerators**: Searchable database of support organizations.
- **Grant Repository**: Curated funding opportunities in `grants.ts`.
- **Pitch Deck Repository**: Collection of 48+ winning pitch decks.

### C. Productivity Application Suite
Specialized tools built as standalone Next.js modules:
- **Financial Modeler**: Automated spreadsheets for startup modeling.
- **Cap Table Simulator**: Visualization for equity distribution.
- **Founder Calendar**: Curated list of B2B events and ecosystem deadlines.

### D. AI Intelligence Layer (`/api`)
The core "intelligence" layer, currently utilizing serverless functions:
- **Investor Match AI**: Matches startup profiles with relevant investors using Gemini models.
- **Directory Chat**: A chat-based interface (`DirectoryAdvisorBot`) for navigating ecosystem resources.

---

## 4. Current Architecture Limitations
1.  **Static Data Management**: Most resource data (investors, grants) is currently hardcoded in `.ts` files rather than a queryable database.
2.  **Lack of Persistence**: No centralized database for user profiles, saved resources, or application state.
3.  **Authentication**: Currently missing a unified Auth system (e.g., NextAuth/Clerk).

---

## 5. Transition Roadmap (Frontend → Full-Stack)

### Phase 1: Persistence & Data Layer
- Transition all resource data (Investors, Grants, Incubators) into a managed database (PostgreSQL/MongoDB).
- Implement Server Actions for data mutations to replace client-side only state.

### Phase 2: User Personalization & Auth
- Implement authentication (NextAuth/Clerk).
- Create a "Founder Dashboard" to track bookmarked investors, enrolled workshops, and tool progress.

### Phase 3: AI Scaling
- Move from stateless LLM calls to a RAG (Retrieval-Augmented Generation) pipeline for the Advisor Bot, using a vector database for the resource directories.

---

## 6. Directory Structure Overview
```text
/web
├── app/                  # Next.js App Router (Pages & API)
│   ├── AI-workshop...    # Product landing pages
│   ├── api/              # Serverless backend logic
│   ├── tools/            # Productivity applications
│   └── mentors/          # Mentor network pages
├── components/           # UI System (Tailwind 4)
├── lib/                  # Data stores (JSON/TS) & Utilities
└── public/               # Static assets
```
