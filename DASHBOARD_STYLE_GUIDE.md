# Dashboard Style Guide

## Executive Information System - Dashboard Visual Standards

This document provides comprehensive guidelines for maintaining visual consistency in the dashboard interface.

---

## 1. Color Palette

### Primary Colors
| Name | Hex | HSL | Usage |
|------|-----|-----|-------|
| Primary (Orange) | `#FF6A00` | `17 100% 50%` | Main brand color, CTAs, highlights |
| Primary Light | `#FF8533` | `24 100% 60%` | Hover states, gradients |

### Secondary Colors
| Name | Hex | HSL | Usage |
|------|-----|-----|-------|
| Accent (Blue) | `#1890FF` | `207 90% 54%` | Info states, secondary actions |
| Accent Light | `#40A9FF` | `211 100% 62%` | Hover states |

### Semantic Colors
| Name | Hex | HSL | Usage |
|------|-----|-----|-------|
| Success | `#52C41A` | `142 71% 45%` | Success states, positive trends |
| Warning | `#FAAD14` | `38 92% 50%` | Warnings, pending states |
| Error | `#F5222D` | `0 72% 51%` | Error states, alerts |
| Info | `#1890FF` | `207 90% 54%` | Information states |

### Neutral Colors
| Name | Hex | HSL | Usage |
|------|-----|-----|-------|
| Background | `#FAFAFA` | `0 0% 98%` | Page background |
| Surface | `#FFFFFF` | `0 0% 100%` | Card backgrounds |
| Surface Secondary | `#F8FAFC` | `210 17% 98%` | Section backgrounds |
| Border | `#E5E7EB` | `214 32% 91%` | Borders, dividers |
| Text Primary | `#1F2937` | `220 13% 18%` | Main text |
| Text Secondary | `#6B7280` | `220 9% 46%` | Secondary text |

---

## 2. Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### Type Scale
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 (Page Title) | 48px / 3rem | Bold (700) | 1.2 |
| H2 (Section Title) | 24px / 1.5rem | Bold (700) | 1.3 |
| H3 (Card Title) | 18px / 1.125rem | Bold (700) | 1.4 |
| Body Large | 16px / 1rem | Regular (400) | 1.5 |
| Body | 14px / 0.875rem | Regular (400) | 1.5 |
| Small | 12px / 0.75rem | Medium (500) | 1.4 |
| Micro | 10px / 0.625rem | Medium (500) | 1.4 |

### Font Weights
- **Regular (400)**: Body text, descriptions
- **Medium (500)**: Labels, captions
- **Semibold (600)**: Emphasized text, small headings
- **Bold (700)**: Titles, important values

---

## 3. Spacing System

### Base Unit: 4px
| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Minimal spacing |
| `sm` | 8px | Compact elements |
| `md` | 16px | Standard spacing |
| `lg` | 24px | Section padding |
| `xl` | 32px | Large gaps |
| `2xl` | 48px | Major sections |

### Component Spacing
- **Card padding**: 24px (p-6)
- **Card header padding**: 24px horizontal, 16px vertical
- **Grid gaps**: 16px (gap-4) to 24px (gap-6)
- **List item padding**: 16px (p-4)

---

## 4. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 4px | Badges, small elements |
| `md` | 8px | Buttons, inputs |
| `lg` | 12px | Cards, panels |
| `xl` | 16px | Large cards |
| `2xl` | 20px | Featured sections |
| `full` | 9999px | Pills, avatars |

---

## 5. Shadows

### Elevation Levels
```css
/* Level 1 - Cards */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.04);

/* Level 2 - Hover */
box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.08);

/* Level 3 - Modals */
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);

/* Level 4 - Dropdowns */
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.16);
```

---

## 6. Components

### Cards
```jsx
// Standard Card
<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        {/* Header */}
    </div>
    <div className="p-6">
        {/* Content */}
    </div>
</div>
```

### Stat Cards (KPI)
- Background: White with gradient on hover
- Icon: 48px container with colored background
- Value: 30px font, bold
- Trend badge: Pill with colored background
- Mini sparkline: 80px width

### Quick Action Cards
- Gradient background (brand colors)
- Icon: 48px with glass background
- Text: White
- Decorative circles for visual interest
- Hover: Scale(1.02) + enhanced shadow

### Status Badges
```jsx
// Success
"bg-success/10 text-success"

// Warning
"bg-warning/10 text-warning"

// Error  
"bg-error/10 text-error"

// Info
"bg-info/10 text-info"
```

### Buttons

#### Primary
```jsx
<button className="px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-lg">
    Action
</button>
```

#### Secondary
```jsx
<button className="px-4 py-2.5 text-sm border border-gray-200 text-gray-700 rounded-xl bg-white hover:bg-gray-50 transition-all">
    Cancel
</button>
```

#### Ghost (on dark backgrounds)
```jsx
<button className="px-4 py-2.5 text-sm border border-white/40 text-white rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm">
    Action
</button>
```

---

## 7. Animations

### Keyframes
```css
/* Fade In */
@keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* Slide Up */
@keyframes slide-up {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Slide In Right */
@keyframes slide-in-right {
    from {
        opacity: 0;
        transform: translateX(30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}
```

### Duration Guidelines
- Micro-interactions: 150ms
- State changes: 200ms
- Element transitions: 300ms
- Page transitions: 500ms
- Complex animations: 600ms+

### Stagger Delays
```jsx
{items.map((item, index) => (
    <div style={{ animationDelay: `${index * 50}ms` }}>
        {item}
    </div>
))}
```

---

## 8. Responsive Breakpoints

| Breakpoint | Value | Usage |
|------------|-------|-------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet portrait |
| `lg` | 1024px | Tablet landscape / Small desktop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large desktop |

### Grid Layouts
```jsx
// Stats Grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

// Charts Section
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

// Recent Activity
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
```

---

## 9. Charts

### Color Scheme
```javascript
const CHART_COLORS = [
    '#FF6A00', // Primary Orange
    '#1890FF', // Accent Blue
    '#52C41A', // Success Green
    '#FAAD14', // Warning Yellow
    '#722ED1', // Purple
    '#13C2C2'  // Cyan
];
```

### Gradients for Area Charts
```jsx
<defs>
    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#FF6A00" stopOpacity={0.4} />
        <stop offset="95%" stopColor="#FF6A00" stopOpacity={0} />
    </linearGradient>
</defs>
```

### Tooltip Styling
```jsx
contentStyle={{
    backgroundColor: 'white',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
}}
```

---

## 10. Accessibility

### Focus States
```css
.focus-ring:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px hsl(17 100% 50% / 0.3);
}
```

### ARIA Labels
- All interactive elements have descriptive aria-labels
- Form inputs have associated labels
- Charts have aria-describedby for data
- Status changes use role="alert" or role="status"

### Keyboard Navigation
- Tab order follows visual order
- Escape closes modals
- Enter submits forms
- Arrow keys navigate within components

### Screen Reader Support
- Semantic HTML structure
- Descriptive alt text for images
- Status announcements for dynamic content

---

## 11. Form Elements

### Input Fields
```jsx
<input
    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white 
               focus:ring-2 focus:ring-primary/20 focus:border-primary 
               transition-all outline-none"
    placeholder="Enter value..."
/>
```

### Error State
```jsx
<input className="border-red-300 focus:border-red-500" />
<p className="mt-1 text-xs text-red-500">Error message</p>
```

### Select Dropdown
```jsx
<select className="text-sm border-2 border-gray-200 rounded-lg px-3 py-2 
                   focus:outline-none focus:ring-2 focus:ring-primary 
                   focus:border-primary bg-white">
    <option>Option</option>
</select>
```

---

## 12. Icons

### Library
Using **Lucide React** for consistent icon design.

### Sizes
| Context | Size |
|---------|------|
| Inline with text | 14-16px |
| Action buttons | 18px |
| Card icons | 20-24px |
| Feature icons | 28-32px |
| Empty states | 40-48px |

### Icon Colors
- Match parent text color
- Use semantic colors for status icons
- Reduce opacity for decorative icons

---

## 13. File Structure

```
client/src/
├── components/
│   ├── dashboard/
│   │   ├── DashboardHeader.jsx
│   │   ├── QuickStats.jsx
│   │   ├── SalesOverview.jsx
│   │   ├── RecentActivity.jsx
│   │   └── index.js
│   ├── common/
│   │   └── Notification.jsx
│   └── products/
│       └── AddProductForm.jsx
├── pages/
│   └── Dashboard.jsx
└── index.css
```

---

## 14. Code Conventions

### Component Structure
```jsx
import React from 'react';
import { Icon } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Component({ prop1, prop2 }) {
    // State & hooks
    
    // Handlers
    
    // Effects
    
    return (
        <div className="..." role="..." aria-label="...">
            {/* Content */}
        </div>
    );
}
```

### Class Name Organization
1. Layout (display, position)
2. Sizing (width, height)
3. Spacing (margin, padding)
4. Typography
5. Colors/backgrounds
6. Borders
7. Effects (shadows, opacity)
8. Transitions/animations
9. State modifiers (hover, focus)

---

## 15. Best Practices

### Performance
- Use CSS transforms for animations
- Memoize expensive calculations with `useMemo`
- Lazy load non-critical components
- Optimize images before upload

### Consistency
- Always use design tokens (colors, spacing)
- Follow component patterns
- Maintain accessibility standards
- Test across breakpoints

### Maintenance
- Document custom styles
- Use semantic class names
- Group related styles
- Comment complex animations

---

*Last updated: December 2024*
