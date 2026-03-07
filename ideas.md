# BGM CRM — Design Brainstorm

## Context
A retirement village management CRM for Barrina Gardens. Users include village managers, sales teams, admin staff, resident liaison, maintenance, and finance. Non-technical users. Daily operational use. Needs to feel calm, professional, and efficient.

---

<response>
<text>
## Idea 1: Nordic Operational Calm

**Design Movement:** Scandinavian Minimalism meets Enterprise SaaS (Linear/Notion influence)

**Core Principles:**
1. Information density without clutter — every pixel earns its place
2. Typographic hierarchy does the heavy lifting — no decorative flourishes
3. Muted, desaturated palette with one warm accent — reduces eye strain for all-day use
4. Structural clarity — sidebar, content, detail panel — always know where you are

**Color Philosophy:** Warm off-white background (#F8F7F4), deep slate text (#1C1F26), sage green accent (#4A7C59) for primary actions. The sage green evokes nature and calm — appropriate for a village setting. Muted amber (#C4873A) for warnings. Soft stone borders (#E2DDD8).

**Layout Paradigm:** Fixed left sidebar (240px) with icon + label nav. Main content area with a top breadcrumb bar. Right detail panel slides in for record views (no full-page navigation for quick lookups). Three-column layout: nav | list | detail.

**Signature Elements:**
1. Status pills with subtle left-border colour coding (not full background fills)
2. Section dividers as thin horizontal rules with section labels in small caps
3. Avatar initials circles in warm tones for residents/staff

**Interaction Philosophy:** Keyboard-first. Click to select, side panel opens. Inline editing where possible. Modals only for destructive actions. Toasts for confirmations.

**Animation:** Subtle 150ms ease-out transitions on panel slides. No bouncing. Fade-in for list items on load. Skeleton loaders, not spinners.

**Typography System:** DM Sans (body, labels, UI) + DM Serif Display (page titles, section headers). DM Sans at 14px for data, 13px for labels. Tight letter-spacing on headings.
</text>
<probability>0.08</probability>
</response>

<response>
<text>
## Idea 2: Warm Institutional Authority

**Design Movement:** Contemporary Australian Government/Healthcare UX — trusted, accessible, warm

**Core Principles:**
1. Accessibility-first — WCAG AA minimum, large tap targets, clear labels
2. Warm neutrals over cold greys — feels welcoming, not clinical
3. Structured data tables with generous row height — easy scanning for non-technical staff
4. Clear visual hierarchy with card-based grouping

**Color Philosophy:** Warm cream background (#FAFAF8), deep navy primary (#1E3A5F), terracotta accent (#C4603A) for CTAs and alerts. Soft teal (#3A7D8C) for informational states. The navy/terracotta combination reads as authoritative yet warm — like a quality aged-care brand.

**Layout Paradigm:** Left sidebar with grouped navigation sections (collapsed by default on mobile). Full-width content area with card-based sections. Sticky top bar with search, notifications, user avatar. No split panels — full page transitions for clarity.

**Signature Elements:**
1. Coloured left-border cards for status grouping (occupied/vacant/enquiry)
2. Breadcrumb trail with chevrons in the top bar
3. Data tables with alternating row shading and sticky header

**Interaction Philosophy:** Click-through navigation. Forms in full-page or modal. Confirmation dialogs for destructive actions. Clear save/cancel buttons always visible.

**Animation:** Page transitions with 200ms fade. Accordion expand/collapse for form sections. Smooth scroll to anchors within long records.

**Typography System:** Lato (body, forms, tables) + Playfair Display (village name, section titles). Lato 14px regular for data, 600 weight for labels. Playfair adds warmth and character to headings.
</text>
<probability>0.07</probability>
</response>

<response>
<text>
## Idea 3: Precision Slate — The Chosen Direction

**Design Movement:** Modern B2B SaaS Precision (HubSpot/Linear DNA with a retirement-village warmth layer)

**Core Principles:**
1. Sidebar-anchored navigation — always oriented, never lost
2. Data-first layout — tables and lists are the hero, not decorative cards
3. Warm slate palette — professional without being cold or sterile
4. Consistent component language — every form, table, badge, and button follows the same rules

**Color Philosophy:** Near-white background (#FAFAF9), warm slate sidebar (#1A2332), sage-teal primary (#2D7D6F) for actions and links. Amber (#D97706) for warnings and pending states. Soft red (#DC2626) for critical/overdue. The sage-teal primary is distinctive, calm, and professional — avoiding the generic blue of most enterprise tools. It subtly references nature and gardens.

**Layout Paradigm:** Fixed 240px sidebar with grouped nav sections. 64px top bar with global search, notifications, user menu. Main content area with page-level tabs for complex records (e.g., Resident profile has tabs: Overview, Health, Contacts, Documents, Notes). List pages use a full-width table with filter bar above.

**Signature Elements:**
1. Status badges: pill-shaped, colour-coded, consistent across all modules
2. Record header cards: avatar/unit photo + key stats in a horizontal strip at top of detail pages
3. Activity timeline: right-aligned vertical timeline for notes/history on records

**Interaction Philosophy:** Fast. Search-first (global CMD+K search). Inline status changes via dropdown. Slide-over panels for quick edits. Full-page forms only for new record creation.

**Animation:** 120ms ease transitions on hover states. Slide-over panels animate from right (300ms). Table row hover lifts with subtle shadow. Skeleton loaders on data fetch.

**Typography System:** Inter (body, labels, tables — but used intentionally with weight variation) + Sora (page titles, sidebar logo, section headers). Sora gives the product a distinctive character. Inter 13px for table data, 14px for body, Sora 600 for headings.

Wait — per design guidelines, avoid Inter. Use **Geist** (body) + **Sora** (headings) instead.
</text>
<probability>0.09</probability>
</response>

---

## Selected Direction: Idea 3 — Precision Slate

The Precision Slate approach is chosen for its balance of operational clarity, data density, and calm professionalism. The sage-teal primary colour distinguishes the product from generic blue-toned enterprise tools while remaining appropriate for a retirement village context. The sidebar-anchored navigation ensures non-technical staff always know where they are. The component language is consistent and learnable.

**Fonts:** Geist (body/data) + Sora (headings/titles) via Google Fonts CDN
**Primary:** Sage-teal #2D7D6F (oklch equivalent)
**Background:** Warm near-white
**Sidebar:** Deep warm slate #1A2332
