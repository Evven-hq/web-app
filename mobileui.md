# Evven Mobile UI / UX Specification

This document describes the design system, visual components, screens, and interaction patterns used by the Evven web app. It is intended as a mobile app reference so the same UI/UX feel can be recreated on iOS/Android.

## 1. Brand & Visual System

### 1.1 Colors
Base palette used throughout the app:
- Primary: `#2d5a4f`
- Secondary surface: `#f5f3f0`
- Background: `#faf8f5`
- Border: `#c4bfb7`
- Text primary: `#1a1816`
- Text muted: `#8b8480`
- Accent secondary: `#e8dcc8`
- Error: `#c0392b`

Theme variants exist for `teams` and `enterprise`, but the default mobile app should use the core brand palette for the personal experience.

### 1.2 Typography
Evven uses a mix of expressive and neutral type styles:
- Body / interface: `Satoshi`, sans-serif
- Headings / brand accent: `Xanh Mono`, monospace
- Hero display / italic brand: `Baskervville` / serif italic
- Code / numeric labels: `JetBrains Mono`

Text weights and scale:
- Hero large heading: very bold, large display size
- Section headings: bold, 2xl–5xl on web; mobile should use scaled versions for hierarchy
- Button / label text: medium weight, uppercase or sentence case depending on context
- Metadata and helper text: small, muted, uppercase tracking for section labels

### 1.3 Radii and Surfaces
Rounded shapes are central to the UI:
- Card radius: `16px`
- Hero and overlay radius: `20px`
- Buttons and pills: full rounded / `999px` corners for pill shapes
- Modal / sheet corners: `28px`–`40px`

Surface treatment:
- Use soft background cards with a subtle border and slightly raised shadow.
- Border opacity is low: `0.5px solid var(--evven-border)`.
- On mobile, mimic the translucent floating dock and chrome using background blur and a soft white/cream fill.

### 1.4 Motion & Interaction
- Slide/fade transitions for modals and the mobile menu
- Subtle scaling on hover and tap for buttons and navigation icons
- Floating assets use soft float and parallax movement in the hero
- Loading states use spinners and skeleton-style pulses for lists

## 2. Global App Navigation

### 2.1 App shell
Evven’s authenticated app shell uses:
- A fixed bottom dock for mobile navigation
- A floating profile + action chrome at the top for mobile
- A persistent bottom dock with 5 entries: Dashboard, Expenses, Groups, Friends, Profile
- A floating add-expense quick action visible on dashboard screens

### 2.2 Dock behavior
Mobile dock:
- Always visible at bottom across authenticated screens
- Five evenly spaced icon buttons inside a rounded pill container
- Active item uses color and subtle background highlight
- Center add button uses filled primary color (`#2d5a4f`) and white icon

Desktop variant is a centered floating nav bar, but for mobile use the bottom dock exclusively.

### 2.3 Top chrome
A mobile top chrome includes:
- Profile avatar button on the top-left
- Add expense quick action on the top-right (on dashboard only)
- Frosted blur background with a soft border
- Circular avatar and floating button with touch-friendly size

## 3. Components & Patterns

### 3.1 Buttons
Button styles:
- Primary: filled `#2d5a4f` with white text, pill corners, medium weight
- Secondary / ghost: outlined or transparent with muted text
- Text link: primary color with underline on hover/tap
- Size variants: default, sm, lg, icon

Mobile guidance:
- Use full-width primary buttons for form submit actions
- Use pill-shaped buttons for top-level CTAs and floating actions
- Provide tap states with slight scale-up or opacity change

### 3.2 Cards
Card treatment is used for lists, stats, and content sections:
- Background: white or matching background surface
- Border: subtle `#c4bfb7` or surface border
- Radius: 16px / 20px
- Padding: 16–24px
- Shadow is soft and subtle for elevated cards

Card types:
- Feature cards: numbered icon bubble, title, description
- Expense list cards: icon badge, title, metadata, amount, actions
- Group summary cards: avatar bubble, title, date, chevron

### 3.3 Form Controls
Input fields:
- Rounded corners (`16px`+)
- Light background on form fields
- Soft border and focus state with primary ring
- Password toggle, search icon, chip-style category buttons

Labels:
- Small uppercase text with letter spacing for section headings
- Inline label text uses medium weight and clear hierarchy

### 3.4 Tabs and filters
Tab patterns:
- Horizontal segmented control with four states for group detail sections
- Active tab white background, inactive tab muted surface
- Touch target height around 40px

Filter chips:
- Rounded pills with subtle background overlay
- Active state shows contrast fill and dark text
- Used for category filters on expenses and participants selection

### 3.5 Modals / Sheets
Group and expense modals use:
- Centered fixed overlay on mobile
- Dark translucent backdrop with blur
- White rounded container with strong padding
- Close icon top-right
- Clear header, body, action footer

Expense editing uses a scrollable modal with a maximum height of ~90vh.

## 4. Screen UI Reference

### 4.1 Landing / Home Marketing
This is the public marketing landing page, not authenticated UI.

Key sections:
- Hero: large headline "Split bills. Not friendships.", supportive copy, primary CTA, secondary text button
- Animated / floating illustration on larger screens
- Features grid: three vertical cards with numbered bubbles
- How it works: three step list with numeric badge and explanation
- Use cases, testimonials, pricing, FAQ, CTA, footer

Mobile adaptation:
- Stack sections vertically with generous spacing
- Use smaller headline sizes but keep brand hierarchy
- Convert grid cards to a single-column stack
- Keep call-to-action buttons full width when possible

### 4.2 Auth: Login / Signup
Shared visual style:
- Frosted glass card with border and shadow
- Centered form container with rounded corners
- Input fields stacked with clear labels
- Primary button full width and large
- Secondary sign-in options separated by a horizontal divider
- Link-based alternative actions below form

Login specifics:
- Header text: "Welcome back!"
- Email + password fields
- Password show/hide toggle
- Error alert box if login fails
- Google sign-in button below
- Footer link to signup

Signup specifics:
- Header text: "Create an account"
- Name, email, password fields
- Password show/hide toggle
- Same Google sign-in and footer link to login

### 4.3 Dashboard
Main authenticated landing screen after login.

Layout:
- Top greeting: "Good morning, [name]"
- Summary hero card with total spent and active groups
- Quick action button: add expense
- Ring stat cards for budget/balance-style analytics
- Recent personal expenses list

Mobile recommendations:
- Use one prominent hero panel with 16–20px padding
- Large greeting text plus subtext to set tone
- Provide an always-available bottom dock for nav
- Quick add button is essential and should remain visible

### 4.4 Groups Page
Group list screen shows:
- Header with count and new group button
- Empty state card when no groups exist
- Group cards with colored avatar bubble, group name, created date
- Create group modal overlays with input and primary button

Mobile layout:
- Stack group cards vertically
- Use tap-friendly rows with 16px vertical spacing
- Floating modal should feel native with full-width inputs

### 4.5 Expenses Page
Expense list screen includes:
- Header with top-level count
- Search bar with search icon inside input
- Total amount summary badge
- Category filter chips row
- Expense item card list with icon, title, metadata, amount
- Edit / delete actions available per item

Mobile UX notes:
- Search field should be full width and easy to type on mobile
- Category pills wrap into multiple rows if needed
- Each expense row should have a clear target and a secondary affordance for edit
- Use text-heavy summary with small metadata and strong numeric amounts

### 4.6 Group Detail
Group detail is a multi-tab screen with:
- Header showing group name, members count, expense count
- Primary actions: add member + add expense
- Tab switcher: Expenses, Balances, Settlements, Members
- Each tab has its own card/list layout

Expense tab:
- Summary cards for totals
- List of individual group expenses with category badge and amount
- Action buttons to open detail and edit

Balances tab:
- Group balance summary card
- List of who paid what with positive/negative states
- Action buttons for settle

Settlements tab:
- Pending / completed settlement rows
- Payment actions and history cards

Members tab:
- Member list with avatar initials, name, code
- Add member button and remove member actions

Mobile-specific behavior:
- Use a sticky header or clear anchor to maintain context
- Keep tab bar visible near the top when scrolling
- Use in-place modals for adding expenses or members

### 4.7 Profile Page
Personal account screen includes:
- Profile summary card with avatar, name, email, account provider
- User code card with copy action
- Editable name and profile picture fields
- Save button with disabled state

Mobile form guidelines:
- Use a single-column form and compact vertical spacing
- Provide instant feedback when copy action occurs
- Use a clear banded background for user code and copy interaction

## 5. UI Copy and Labeling
Evven’s tone is friendly, direct, and helpful.

Example labels:
- CTA primary: "Start splitting for free", "Add expense", "Create group"
- Section label: "Core Features", "How It Works"
- Microcopy: "Send a settlement reminder", "See exactly who needs to pay whom"
- Empty states: "No groups yet", "No personal expenses yet"

Use short action-driven copy and avoid overly technical wording.

## 6. Accessibility & Touch
- All touch targets should be at least 44x44 points.
- Maintain high contrast for primary text and interactive labels.
- Use clear focus / pressed states for buttons and tabs.
- Use semantic headings and label form fields clearly.

## 7. Implementation Notes for Mobile

### 7.1 Navigation
- Bottom navigation is the core authenticated pattern.
- Use a floating top profile/action bar only on dashboard screens.
- If using a drawer or sheet for mobile, keep it simple and full width.

### 7.2 Lists and cards
- Use rounded rectangles and soft surfaces consistently.
- Separate list items with 12–16px gaps.
- Include subtle shadows or borders to distinguish cards from background.

### 7.3 Forms
- Use consistent input heights and padding.
- Keep label + field spacing tight but readable.
- Use inline validation messaging below the field or above the CTA.

### 7.4 Modals and sheets
- Prefer full-height bottom sheets for mobile expense creation if the form is long.
- Use centered dialogs for shorter forms such as group creation and confirmation.
- Backdrop should have a muted dark overlay plus blur for depth.

## 8. Mobile UI Component Library
Use these building blocks as the basis for the mobile implementation:

- `AppShell` / `AuthenticatedShell`
  - Bottom navigation dock
  - Floating chrome with profile avatar
  - Main content scroll area

- `HeroCard`
  - Large summary panel with count, totals, and CTA buttons

- `ExpenseCard`
  - Icon badge, title, metadata, amount, optional actions

- `GroupCard`
  - Initials bubble, name, subtitle, chevron

- `FilterChip`
  - Round button pill, active state fill

- `SegmentedControl`
  - Group detail tab bar with active indicator

- `FormField`
  - Label + rounded input + helper text

- `ModalSheet`
  - Full overlay with header, body, and action footer

- `FloatingActionButton`
  - Primary add action with accent fill

## 9. Suggested Mobile Screen Flow
1. Splash / marketing hero (if public app exists)
2. Auth flow: Login → Signup → Dashboard
3. Dashboard with quick analytics + CTA
4. Expenses list + search + filters
5. Groups list + create modal
6. Group detail with tabs and expense actions
7. Profile / settings

## 10. Notes on Web-to-Mobile Consistency
- Preserve the same rounded shapes, soft color palette, and brand accent.
- Keep copy and section hierarchy aligned with the web experience.
- Use mobile-friendly equivalents of the web dock and floating chrome.
- Prioritize rapid access to expense creation and group membership actions.

---

This document is intentionally detailed for mobile adaptation, while focusing on the actual patterns used by Evven’s web implementation. Use it as the source of truth for UI structure, spacing, interactions, and content hierarchy.
