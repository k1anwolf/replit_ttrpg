# Design Guidelines: TTRPG Combat Dashboard

## Design Approach
**System-Based with Fantasy Gaming Aesthetic**: Drawing from D&D Beyond and Roll20's functional interfaces while incorporating traditional fantasy tabletop aesthetics. This is a utility-focused application prioritizing information density, readability, and quick access to combat management tools.

## Core Design Principles
- **Information Hierarchy**: Combat-critical data (HP, initiative, status effects) must be immediately visible
- **Visual Clarity**: Dark theme with high contrast for extended gaming sessions
- **Tactile Fantasy Feel**: Incorporate subtle medieval/fantasy design elements without compromising functionality
- **Rapid Interaction**: All common actions accessible within 1-2 clicks

## Color Palette

### Dark Mode (Primary)
- **Primary Brand**: 25 60% 35% (коричневый - medieval brown for primary actions, headers)
- **Secondary/Accent**: 43 75% 50% (золотой - gold for highlights, important UI elements)
- **Danger/Combat**: 348 83% 47% (красный - red for damage, critical states)
- **Background Primary**: 0 0% 18% (темно-серый - dark foundation)
- **Background Secondary**: 0 0% 25% (slightly lighter panels)
- **Text Primary**: 40 56% 92% (бежевый - warm beige for readability)
- **Text Secondary**: 40 35% 70% (muted beige for labels)
- **Success**: 120 61% 34% (зеленый - healing, positive effects)

### Faction Color Coding
- **Players**: 210 100% 50% (синий - blue indicators, borders)
- **NPCs**: 0 100% 50% (красный - red indicators, borders)  
- **Bosses**: 330 100% 60% (розовый - pink/magenta indicators, borders)

## Typography

### Font Families
- **Primary**: 'Roboto', sans-serif (body text, labels, data)
- **Secondary**: 'Open Sans', sans-serif (headings, buttons)
- **Accent (optional)**: 'Cinzel' or 'Marcellus' for major headers (fantasy feel)

### Type Scale
- **H1**: 2rem (32px) - Main dashboard title
- **H2**: 1.5rem (24px) - Section headers
- **H3**: 1.25rem (20px) - Subsection headers
- **Body**: 0.875rem (14px) - Default text, table cells
- **Small**: 0.75rem (12px) - Labels, metadata
- **Button**: 0.875rem (14px) - Action buttons

## Layout System

### Spacing Primitives
**Tailwind units**: 2, 4, 6, 8, 12, 16 (consistent spacing rhythm)
- **Micro spacing**: p-2, gap-2 (8px) - tight UI elements
- **Standard spacing**: p-4, gap-4 (16px) - default component padding
- **Section spacing**: p-6, gap-6 (24px) - between major sections
- **Large spacing**: p-8 (32px) - major panel separation

### Grid Structure
- **Three-column layout**: Left sidebar (300px) | Main content (flex-1) | Right log (350px)
- **Responsive breakpoints**: Stack to single column below 1024px
- **Table rows**: Dense spacing (py-1.5) for maximum data visibility

## Component Library

### Navigation & Headers
- **Top Bar**: Fixed header, h-16, brown background with gold border-bottom
- **Section Headers**: Gold accent bar on left, brown background, subtle shadow

### Data Display
- **Tables**: Striped rows (alternating dark gray shades), hover states with gold tint
- **Cards**: Brown border, dark gray background, rounded-lg corners
- **Progress Bars**: 
  - HP: Green to yellow to red gradient based on percentage
  - MP: Blue gradient
  - Height: h-2 for compact, h-3 for emphasis

### Forms & Inputs
- **Input Fields**: Dark background (bg-gray-800), beige text, gold focus ring
- **Buttons**:
  - Primary: Brown background, gold text, gold border on hover
  - Secondary: Transparent, gold border, gold text
  - Danger: Red background, white text
  - Icon buttons: Square, subtle hover background

### Status & Indicators
- **Status Chips**: Small rounded badges with faction colors, duration counters
- **Initiative Tracker**: Large numbers in gold, current turn highlighted with pulsing gold border
- **Health States**: Color-coded chips (Dying: red, Stable: yellow, Unconscious: gray)

### Modals & Overlays
- **Modal Background**: Semi-transparent black (bg-black/80)
- **Modal Panel**: Brown border-2, dark gray background, max-width appropriate to content
- **Dropdown Menus**: Dark background, gold hover states, subtle shadow

### Icons & Graphics
- **Icon Library**: Heroicons (outline for navigation, solid for status indicators)
- **Dice Icons**: Consider custom medieval-style dice graphics for critical rolls
- **Status Icons**: Clear, recognizable symbols for conditions (sword for attack, shield for defense, etc.)

## Images
**No hero images** - This is a utility dashboard. Use subtle background textures:
- **Parchment texture overlay**: Very subtle (opacity: 0.02) on panels for fantasy feel
- **Leather texture**: Optional for sidebar backgrounds (extremely subtle)
- **Decorative elements**: Corner flourishes on modal headers (SVG, gold color)

## Visual Effects & Animations

### Minimal Animation Strategy
- **Active Turn Indicator**: Gentle pulsing gold glow (1.5s cycle)
- **HP/MP Changes**: Brief flash animation (200ms) when values update
- **Status Expiry**: Fade out (300ms) when effects end
- **Modal Entry**: Scale + fade (250ms)
- **Hover States**: Instant background color shifts (no delay)

### Interactive States
- **Buttons**: Subtle scale on click (scale-95), gold border glow on focus
- **Table Rows**: Background lightening on hover (20% lighter)
- **Drag & Drop**: Opacity reduction (0.6) when dragging initiative order

## Accessibility

### Dark Mode Implementation
- All form inputs maintain dark backgrounds with high contrast beige text
- Focus indicators: 2px gold ring with offset
- Minimum contrast ratio: 4.5:1 for all text
- Color-blind friendly: Faction colors supplemented with icons/labels

### Keyboard Navigation
- Tab order follows visual hierarchy (left to right, top to bottom)
- All actions accessible via keyboard
- Modal traps focus until dismissed

## Special Considerations

### Combat Table Design
- **Dense Information Display**: Maximize rows visible without scrolling
- **Editable Fields**: Inline editing with clear visual feedback
- **Quick Actions**: Icon button row for each character (damage, heal, move, delete)
- **Expandable Sections**: Abilities/spells collapse by default, expand on click

### Save System UI
- **Save Slots**: Card grid layout, visual preview of saved state
- **Import/Export**: Clear visual distinction between local and file operations
- **Template Manager**: Categorized tabs with search, visual card previews

### Responsive Behavior
- **Mobile (< 768px)**: Stack all panels vertically, collapsible sections
- **Tablet (768px-1024px)**: Two-column (sidebar + main), log moves to bottom
- **Desktop (> 1024px)**: Full three-column layout

This design system balances the functional requirements of a combat management tool with the atmospheric needs of tabletop fantasy gaming, ensuring both usability during intense combat sessions and immersive aesthetic appeal.