# TSS Technical Deep-Dive: Data Architecture & Update Lifecycle

This report provides a granular examination of the current technical implementation of **Setu - TheStartupSchool (TSS)**. It focuses on the "Static-Data-as-a-Service" pattern currently in use and the automation scripts that manage it.

---

## 1. The "Database" (Static TypeScript Engine)
Contrary to a traditional live database (like SQL), TSS operates on a **Static Data Layer**.

- **Storage Location**: `web/lib/data/`
- **Mechanism**: Data is stored as strongly-typed TypeScript arrays of objects.
- **Key "Tables" (Files)**:
    - `events.ts`: Master list of 2026 founder events (B2B, exhibitions, etc.).
    - `grants.ts`: A curated repository of government and private startup grants (~900 lines of data).
    - `pitchDecks.ts`: Mapping for winning pitch deck assets.
    - `globalPitchDecks.ts`: Extended global dataset.

**Why this is used currently**: 
- **Absolute Speed**: No database query time; data is pre-loaded into the browser or server-side memory.
- **Type Safety**: The frontend is 100% aware of the data structure, preventing runtime errors.
- **Maintenance**: No database servers to manage or scale for the current load.

---

## 2. Source of Truth: The "Excel-to-Code" Pipeline
The "Master Source" for events and grants is managed externally in **Microsoft Excel**.

- **Primary Source**: `India_Events_2026_COMPLETE.xlsx`
- **Logic**: All structural changes (adding events, changing dates) happen in Excel first.

---

## 3. Automation Scripts: The "Update Engine"
The bridge between Excel and the Website is a set of **Batch Scripts** in `web/scripts/`.

### A. The Sync Script (`update_events_from_excel.cjs`)
This is the most critical technical component for data management.
1.  **Extraction**: It uses the `xlsx` library to read specific sheets (e.g., `📋 All Events`).
2.  **Date Normalization**: 
    - Excel stores dates as serial numbers (e.g., `46123`). The script includes custom logic (`extractMonth`, `xlsx.SSF.parse_date_code`) to convert these into "April" or "14-16 Oct".
3.  **Code Rewriting (The "Inject" Phase)**:
    - The script identifies a "Marker" in the source code file: `export const eventsData: FounderEvent[] = [`.
    - It generates a massive string by mapping every Excel row to a JSON object.
    - It **directly overwrites `events.ts`** by stitching the new data between the markers.

### B. Incremental Updates (`append_events.cjs`)
Used when adding individual items from `out.json` (likely an AI or scraper output). It uses string replacement to prepend new data to the existing array without a full wipe.

### C. QC Utilities
- `check_current_count.cjs`: Ensures the total record count matches between source and destination.
- `inspect_excel.cjs`: Checks for header name mismatches before a sync.

---

## 4. Current Frontend/Backend Interaction
- **Next.js App Router**: Utilizes specialized layouts for different sections (e.g., `/fundraising-workshop-15apr`).
- **AI Integration**: The `DirectoryAdvisorBot` and `investor-match-ai` read from these static files to provide "intelligence." 
- **Build-Time Generation**: Because the data is static, the site is extremely fast because Next.js can pre-render pages during the build process.

---

## 5. Summary of the Update Workflow
1.  **Manager** updates Excel spreadsheet.
2.  **Tech/Dev** runs `node scripts/update_events_from_excel.cjs`.
3.  **System** automatically reformats dates and rewrites `lib/data/events.ts`.
4.  **Deployment** triggers a build, and the new data is live globally.

---

## 6. Recommendations for Full-Stack Backend Transition
1.  **API Migration**: Move the script logic into a secure Admin API.
2.  **Database Strategy**: Use a database (e.g., Supabase/Postgres) but keep an **Edge Cache** or continue generating static files for performance-critical components.
3.  **Auth Layer**: Add authentication to control who can trigger the sync scripts or update data.
