---
name: Vinh Hung CRM Identity
colors:
  surface: '#f9f9f7'
  surface-dim: '#dadad8'
  surface-bright: '#f9f9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f2'
  surface-container: '#eeeeec'
  surface-container-high: '#e8e8e6'
  surface-container-highest: '#e2e3e1'
  on-surface: '#1a1c1b'
  on-surface-variant: '#404941'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
  outline: '#707971'
  outline-variant: '#c0c9bf'
  surface-tint: '#2b6a45'
  primary: '#004625'
  on-primary: '#ffffff'
  primary-container: '#1e5e3a'
  on-primary-container: '#94d5a8'
  inverse-primary: '#94d5a7'
  secondary: '#5e5f58'
  on-secondary: '#ffffff'
  secondary-container: '#e4e3da'
  on-secondary-container: '#64655e'
  tertiary: '#3a3c39'
  on-tertiary: '#ffffff'
  tertiary-container: '#525350'
  on-tertiary-container: '#c6c7c2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#aff2c2'
  primary-fixed-dim: '#94d5a7'
  on-primary-fixed: '#00210f'
  on-primary-fixed-variant: '#0d512f'
  secondary-fixed: '#e4e3da'
  secondary-fixed-dim: '#c8c7bf'
  on-secondary-fixed: '#1b1c17'
  on-secondary-fixed-variant: '#474741'
  tertiary-fixed: '#e3e3de'
  tertiary-fixed-dim: '#c6c7c2'
  on-tertiary-fixed: '#1a1c19'
  on-tertiary-fixed-variant: '#464744'
  background: '#f9f9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e2e3e1'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '300'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '300'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '300'
    lineHeight: 36px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 32px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style

The brand identity for this design system is built on the intersection of agricultural heritage and modern enterprise efficiency. It targets internal stakeholders and sales representatives who require a tool that feels as fresh as the product they sell while maintaining the rigorous standards of a professional CRM.

The design style is **Minimalist and Modern**, prioritizing clarity and operational speed. By utilizing a "Milk & Meadow" palette, the UI evokes an emotional response of trust, hygiene, and vitality. The interface avoids unnecessary ornamentation, leaning into heavy whitespace to reduce cognitive load during complex data management tasks. It is a digital reflection of a pristine dairy environment: clean, organized, and natural.

## Colors

The palette is derived from the Vĩnh Hưng landscape and the purity of dairy products. 

- **Primary (Meadow Green):** Used for primary actions, active states, and brand signifiers. It represents growth and the source of the product.
- **Background (Pure Milk White):** The foundation of the entire UI. This off-white provides a softer, more premium feel than pure hex white, reducing eye strain.
- **Text Primary (Deep Charcoal):** High-contrast black for maximum legibility in data tables and headers.
- **Secondary Text (Smoke Grey):** Used for metadata, placeholders, and supportive information.
- **Border (Fine Ash):** A subtle grey used for structural dividers and input outlines, maintaining a clean look without the "heavy" feel of traditional UI borders.

## Typography

The design system utilizes **Inter** exclusively to ensure a systematic and utilitarian feel that remains highly readable at small sizes. 

To achieve the "Modern Minimalist" aesthetic, all major headlines (Large and Medium) use a **Light (300)** weight. This creates an editorial, sophisticated look that offsets the density of CRM data. Body text remains at a standard weight (400) for clarity, while labels and tactical UI elements use Semi-Bold (600) for quick scanning. Tracking is slightly tightened on headlines to maintain a cohesive visual block.

## Layout & Spacing

This design system employs a **12-column fluid grid** for desktop, transitioning to a 4-column grid for mobile. 

The spacing philosophy is "Airy & Purposeful." We use an 8px base unit. To emphasize the minimalist aesthetic, container padding is generous (32px), creating a frame of negative space around data modules. Vertical rhythm is strictly enforced using "stack" tokens to ensure that information groups (like customer details or inventory lists) are clearly separated without the need for heavy horizontal rules.

## Elevation & Depth

To maintain the professional, flat-modern aesthetic, this design system avoids heavy shadows. Depth is primarily communicated through **Low-Contrast Outlines** and **Tonal Layering**.

- **Level 0 (Base):** Pure Milk White (#FDFDFB) background.
- **Level 1 (Cards/Modules):** Defined by a 1px solid border of Fine Ash Grey (#EFEFEA). No shadow.
- **Level 2 (Dropdowns/Popovers):** A very soft, diffused ambient shadow (10% opacity Meadow Green tint) is used only when an element physically overlaps another to provide necessary contrast.
- **Active States:** Subtle shifts in background color (from White to Ash Grey) indicate hover or press states.

## Shapes

The shape language is disciplined and consistent. All interactive elements—including buttons, input fields, and card containers—utilize a **6px corner radius**. 

This specific radius strikes a balance between the clinical sharpness of a "0px" grid and the playfulness of a fully "Rounded" system. It feels precise and engineered, reinforcing the "Professional" brand pillar. Status indicators (Chips) may use a pill-shape (fully rounded) to distinguish them from actionable buttons.

## Components

- **Buttons:** Primary buttons use Meadow Green (#1E5E3A) with White text. Secondary buttons use the Fine Ash Grey border with Charcoal text.
- **Input Fields:** Use a 1px Fine Ash border. Upon focus, the border transitions to Meadow Green with a subtle 2px glow of the same color at 10% opacity.
- **Chips:** Used for "Stock Status" or "Customer Tier." These are semi-transparent versions of the primary color or semantic colors (Red for low stock, etc.) with a 6px radius.
- **Data Tables:** These are the heart of the CRM. No vertical lines; only horizontal dividers in Fine Ash Grey. Row height is generous (at least 48px) to maintain the "spacious" feel.
- **Cards:** Used to group customer profiles. Cards have a 1px Fine Ash border and no shadow, appearing to sit flush with the background until interacted with.
- **Checkboxes/Radios:** Square-ish with a 2px radius (fitting the 6px overall theme) and Meadow Green fill when selected.