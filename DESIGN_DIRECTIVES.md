Gotcha. I’ll describe this like a design spec you’d hand to a dev team / Figma designer – no code, but everything concrete and implementation-ready.

⸻

1. Overall concept
	•	One layout, two moods
	•	Light → soft, guided, meditative.
	•	Dark → sharp, matrix-like training tool.
	•	Geometry, spacing, and typography are identical in both themes. Only color / shadows / glow change.
	•	Mobile-first. Desktop is a stretched, multi-column version of the same components.
	•	Two main screens:
	1.	Start Screen – presets + current settings + Start.
	2.	Session Screen – large circular timer + phase info + Stop.

⸻

One can summarize design perspective like:
	1.	Single component library
	•	Cards, buttons, sections, timer, top nav are shared.
	•	Theme is just a token set (colors + glow/shadow).
	2.	Key implementation points
	•	Mobile-first column layout; desktop = two columns.
	•	Presets & Current settings are accordions with shared header pattern.
	•	Nav bar collapses on mobile; always visible on desktop.
	•	Timer screen reuses main layout; only content changes.
	3.	What they see = what they implement
	•	Use exact sizes, radii, spacing from this document.
	•	Semantics (e.g., accent-primary, bg-card, text-secondary) should become CSS variables or design tokens.


2. Global layout & structure

2.1 Page structure (both screens)

Hierarchy (mobile):
	1.	Top nav area (collapsible)
	2.	Page title (“Take a breath”)
	3.	Scrollable content area
	•	Presets section (collapsible)
	•	Current settings section (collapsible)
	4.	Persistent bottom action – Start / Stop button

Hierarchy (desktop):
	1.	Top nav bar (always visible, no collapse)
	2.	Main content frame centered with max-width (e.g. 1120px)
	•	Left: Presets column
	•	Right: Current settings / Timer summary
	3.	Primary action bottom-center of content frame

All content is wrapped in an App Container with:
	•	Mobile: full width, horizontal padding 16px
	•	Desktop: centered, max-width 1120px, horizontal padding 24–32px.

⸻

3. Design tokens

3.1 Spacing scale

Use a simple scale, applied everywhere:
	•	space-4  = 4px
	•	space-8  = 8px
	•	space-12 = 12px
	•	space-16 = 16px
	•	space-24 = 24px
	•	space-32 = 32px
	•	space-40 = 40px

Patterns:
	•	Outer page padding: 16px mobile, 24–32px desktop.
	•	Inside cards: 16px.
	•	Vertical spacing between sections: 24px.
	•	Vertical spacing inside sections: 12–16px.

3.2 Corner radius

Same in both themes:
	•	Cards, buttons, inputs: 12px
	•	Tag / small pills (if used): 999px (fully rounded)
	•	Timer circle: circle, no rounded rects.

3.3 Typography

Use a modern sans (e.g. Inter / SF / Roboto). Define:
	•	Display / Page Title
	•	Size: 28px mobile, 32px desktop
	•	Weight: 700
	•	Line height: ~120%
	•	Letter spacing: normal
	•	Section Title (“Presets”, “Current settings”)
	•	Size: 18px
	•	Weight: 600
	•	Line height: 130%
	•	Card Title (preset name)
	•	Size: 16px
	•	Weight: 600
	•	Card Subtitle (preset description)
	•	Size: 14px
	•	Weight: 400
	•	Color: secondary text color
	•	Body text / labels
	•	Size: 14px
	•	Weight: 400
	•	Small label (e.g. “In”, “Hold”, “Out”, “ROUNDS”)
	•	Size: 12px
	•	Weight: 500
	•	Timer numeric countdown
	•	Size: 64px mobile, 80px desktop
	•	Weight: 600–700
	•	Digit spacing: slightly tighter (−1% tracking)
	•	Phase label (“INHALE”, “HOLD”, etc.)
	•	Size: 16px
	•	Weight: 600
	•	Letter spacing: +5–8% (slightly spaced, all caps)

⸻

4. Color systems

Both themes use the same semantic roles.

4.1 Light theme (guided / calm)

Backgrounds
	•	bg-page: #F5F3E8 (warm, very light beige/green)
	•	bg-card: #FFFFFF with 4–6% soft tint (#F8F6ED)
	•	bg-card-pressed: #ECE7D8

Text
	•	text-primary: #16161A
	•	text-secondary: #6F6F74
	•	text-muted: #A0A0A5

Accent / brand
	•	accent-primary: #52A97B (calm green)
	•	accent-primary-soft: same hue at 20% opacity for backgrounds
	•	accent-danger: #D25B5B (for Stop button if you want)

Borders & separators
	•	border-subtle: #E2DDCF
	•	border-strong: #C3BBA8

Shadows
	•	Card shadow:
	•	0 4px 12px rgba(0, 0, 0, 0.06)
	•	Button shadow (Start):
	•	0 6px 14px rgba(82, 169, 123, 0.35)

4.2 Dark theme (matrix / training)

Backgrounds
	•	bg-page: #050608 or #050B09
	•	bg-card: #101418
	•	bg-card-pressed: #141920

Text
	•	text-primary: #F7F7FC
	•	text-secondary: #9FA6B2
	•	text-muted: #6D7480

Accent / brand
	•	accent-primary: #37FF73 (neon green)
	•	accent-secondary: #3CF0C5 (teal, for alternative highlights)
	•	accent-danger: #FF5A5A

Borders & outlines
	•	border-subtle: #181C22
	•	border-glow-base: #37FF73 at 24–40% opacity

Effects/glow
	•	Primary button glow: 0 0 24px rgba(55, 255, 115, 0.4)
	•	Active card outline: 1px border in accent-primary + subtle outer glow (0 0 16px at low opacity).

⸻

5. Components, one by one

5.1 App background
	•	Fills the whole viewport.
	•	Light: flat bg-page.
	•	Dark: flat bg-page (no gradients).
	•	On desktop, content is centered with max-width; background expands edge-to-edge.

⸻

5.2 Top navigation bar (collapsible on mobile)

Structure (mobile)
	•	Collapsed:
	•	Only a small chevron-down icon is visible, centered at the top edge, overlapping content by ~8px.
	•	Chevron is circular button (32x32) with:
	•	Light: bg-card, subtle shadow.
	•	Dark: transparent background, thin border-subtle.
	•	Tapping expands the bar down.
	•	Expanded:
	•	Full-width bar, height ~56px.
	•	Background:
	•	Light: bg-card with shadow.
	•	Dark: bg-card with slight blur or just flat.
	•	Contents laid out horizontally with even spacing:
	•	Left: theme toggle icon (sun/moon)
	•	Center: sound toggle (speaker icon)
	•	Right: settings icon (gear) & info icon (i)
	•	Icons are 24x24 inside 40x40 touch areas.
	•	A chevron-up appears on the right to re-collapse the bar (same style as the down one).

Animations
	•	Expand: transform Y from -100% to 0, opacity 0 → 1, duration 220–260ms ease-out.
	•	Collapse: reverse with ease-in.

Desktop
	•	Always expanded, at top.
	•	Left-aligned logo/title “Breathing Trainer” or just the app name.
	•	Right side: same icons, horizontally aligned.
	•	Height: 64px.

⸻

5.3 Page title area
	•	Appears below the nav (or at very top if nav collapsed).
	•	Text: “Take a breath”
	•	Left-aligned on both mobile and desktop.
	•	Vertical margin:
	•	24px top from nav / safe area.
	•	16px bottom before first section.

⸻

5.4 Section: Presets (collapsible group)

Header row
	•	Layout:
	•	Left: “Presets” (section title)
	•	Right: caret icon (down/up) inside 32x32 touch area.
	•	Entire row acts as a toggle.
	•	Bottom border: border-subtle.
	•	Padding: 0 top / 12px bottom → visually connected to cards when expanded.

Expanded state
	•	Below header, a vertical stack of preset cards with 12px gap.

Collapsed state
	•	Cards are hidden.
	•	Light: no background change.
	•	Dark: header row background slightly darkened on hover/active.

⸻

5.5 Preset Cards

Each preset is a rectangular card with:
	•	Width: full parent width.
	•	Min height: 96–112px.
	•	Padding: 16px.
	•	Radius: 12px.
	•	Border: 1px border-subtle.
	•	Background:
	•	Light: bg-card.
	•	Dark: bg-card.

Internal layout

Vertical stack:
	1.	Row 1 – Title & description
	•	Title (preset name) left-aligned, bold.
	•	Subtitle below or same line; small body text.
	2.	Row 2 – Breath phases mini-table
	•	Option A (compact):
	•	A pill-shaped area inside the card, with three or four columns:
	•	Header row: “In”, “Hold”, “Out”, “Hold”
	•	Values row: 4  7  8 etc.
	•	Background of this mini-table:
	•	Light: accent-primary-soft at 10–15% opacity.
	•	Dark: same but in neon at 8–12% opacity.
	•	Text center-aligned in each cell.

States
	•	Default: neutral border, neutral shadow/glow.
	•	Hover (desktop):
	•	Light: subtle elevation (stronger shadow).
	•	Dark: border color slightly shifted toward accent-primary.
	•	Pressed:
	•	Slight scale-down (0.98).
	•	Background changes to bg-card-pressed.
	•	Selected preset (the one applied to current settings):
	•	Left border accent strip (4px wide) in accent-primary.
	•	Card border: accent-primary.
	•	Card title and values use accent-primary for emphasis.
	•	A tiny label/tag at top right: “Active” (12px text in accent color).

⸻

5.6 Section: Current settings (collapsible)

Similar header pattern as Presets:
	•	Header row:
	•	Left: “Current settings”.
	•	Right: caret icon.

Expanded content is a single card summarizing what will happen when the user taps Start.

Current settings card
	•	Same visual style as preset cards (same radius, padding, border).
	•	Inside layout (vertical):

	1.	Row – Label
	•	“Timer sets” label (small caps style)
	2.	Timer sets preview
	•	One line per set:
	•	Example: 4s – 4s – 4s – 4s
	•	Or a compact row of tags: [4–4–4–4]  [6–6–6–6]  [8–8–8–8]
	3.	Row – Rounds summary
	•	“Rounds 3×” with the number larger / accented.

On desktop, this card sits to the right of the presets column.

⸻

5.7 Primary action: Start button (Start screen)

Mobile
	•	Positioned at the bottom of the screen, centered.
	•	Full-width minus horizontal padding (e.g. width = 100% – 32px).
	•	Height: 52–56px.
	•	Radius: 12px.

Light theme:
	•	Background: accent-primary.
	•	Text: white.
	•	Shadow: 0 6px 14px rgba(82, 169, 123, 0.35).

Dark theme:
	•	Background: accent-primary.
	•	Text: nearly black: #030403.
	•	Glow: 0 0 24px rgba(55, 255, 115, 0.4).
	•	No “drop shadow”, only glow.

States:
	•	Hover (desktop): lighten background by ~6%.
	•	Pressed: darken by ~6%, translateY(1px), weaker glow / shadow.
	•	Disabled (if you ever need it): background border-subtle, text text-muted.

Desktop
	•	Same visual style.
	•	Width: 240–280px, centered horizontally below the main content frame.

⸻

6. Session (Timer) screen

When Start is tapped, the screen transitions to an active session view.

6.1 Layout (mobile)

Vertical stack, centered:
	1.	Back / Collapse nav gesture (optional): tapping safe area or a small X icon in the corner could stop/confirm exit – up to you.
	2.	Page title (“Take a breath”) remains at top but smaller margin.
	3.	Round info: “Round 1 of 3” centered.
	4.	Timer circle (dominant center element).
	5.	Phase label below the circle (e.g., “INHALE”).
	6.	Secondary hint text (optional: “Breathe in slowly through the nose”).
	7.	Stop button at the bottom center.

6.2 Timer circle

Geometry:
	•	Mobile: diameter ~66% of screen width (e.g., 260–280px).
	•	Desktop: 320–360px.
	•	Stroke thickness: 12–16px.
	•	Circle is composed of:
	•	Background circle – full ring in neutral color.
	•	Active arc – animated segment showing current progress within the phase.

Colors per theme
	•	Light:
	•	Background ring: very light desaturated line (#E2DDCF).
	•	Active arc: color depending on phase:
	•	Inhale: accent-primary.
	•	Hold: warm amber or teal.
	•	Exhale: calmer blue-green.
	•	Hold after exhale: same as hold or muted.
	•	Dark:
	•	Background ring: #181C22.
	•	Active arc:
	•	Inhale: accent-primary with subtle glow.
	•	Hold: accent-secondary.
	•	Exhale: #FF6F6F or bright orange.

Numeric countdown
	•	Centered inside the circle.
	•	Big numeric text (64–80px) always white/dark enough for contrast.
	•	Below the number (still inside circle) you can display small unit text, e.g., “seconds” in 12px muted.

⸻

6.3 Phase label
	•	Positioned just below the circle, center aligned.
	•	Text: INHALE / HOLD / EXHALE / HOLD.
	•	All caps, 16px, 600 weight.
	•	Color = same as the active arc color for that phase (light) or slightly dimmed version (dark).

⸻

6.4 Round info
	•	Above the circle, centered.
	•	Text: “Round 1 of 3”
	•	Font: 14px, medium.
	•	Light: text-secondary.
	•	Dark: text-secondary.

⸻

6.5 Stop button (Session screen)

Visual style similar to Start, but with “Stop” text.

Option 1 (recommended)
	•	Light theme:
	•	Background: white card with border accent-danger.
	•	Text: accent-danger.
	•	Shadow: subtle.
	•	Dark theme:
	•	Background: dark card bg-card.
	•	Text: accent-danger.
	•	Border: accent-danger at 70% opacity.

Size & placement:
	•	Same dimensions as Start.
	•	At bottom center, with 24px margin from screen edge.

⸻

6.6 Transition from Start → Session
	•	Fade out presets & settings.
	•	Fade in timer circle & phase label.
	•	Maintain page title; Start button morphs into Stop button (same position, change label and style).
	•	Duration of transition: ~250ms.

⸻

7. Desktop layout specifics

7.1 Start screen (desktop)

Inside main content frame:
	•	Top: Page title left-aligned.
	•	Below, two columns (flex row with gap 32px):
	•	Left column (≈60%) – Presets section
	•	Section header
	•	Preset cards stacked vertically
	•	Right column (≈40%) – Current settings section
	•	“Current settings” header
	•	Current settings card
	•	Bottom center within the same frame: Start button.

Everything still uses the same cards, buttons, typography. Only difference is horizontal layout.

7.2 Session screen (desktop)
	•	Left column: big circular timer + phase label + round info.
	•	Right column (optional but nice):
	•	Current preset summary card.
	•	Maybe “Upcoming phases” list.

Stop button anchored below the timer inside the left column.

⸻

8. Interaction details & affordances

8.1 Tap feedback

All tappable elements (cards, buttons, accordions, icons):
	•	Touch down:
	•	Slight scale (0.98).
	•	Slight darkening/lightening of background.
	•	Release:
	•	Smooth return with 120–160ms ease.

8.2 Focus states (accessibility / keyboard)
	•	Buttons & cards show an outline:
	•	Light: 2px outline in accent-primary with 20% outer glow.
	•	Dark: 2px outline in accent-primary with 40% glow.

8.3 Theme switch
	•	Theme toggle icon sits in the nav bar (sun/moon).
	•	Tapping toggles all semantic color tokens; geometry/layout unaffected.
	•	Transition: background-color + color crossfade over 200ms.

⸻