# Style Guide

## Visual Consistency Guidelines

This style guide ensures visual consistency across the dashboard and product management interface.

## Color System

### Primary Colors

```css
/* Primary - Alibaba Orange */
--color-primary: #FF6A00
--color-primary-foreground: #FFFFFF

/* Accent - Blue */
--color-accent: #1890FF
--color-accent-foreground: #FFFFFF
```

### Status Colors

```css
/* Success */
--color-success: #52C41A
--color-success-foreground: #FFFFFF

/* Warning */
--color-warning: #FAAD14
--color-warning-foreground: #FFFFFF

/* Error */
--color-error: #F5222D
--color-error-foreground: #FFFFFF

/* Info */
--color-info: #1890FF
--color-info-foreground: #FFFFFF
```

### Neutral Colors

```css
/* Background */
--color-background: #FAFAFA
--color-surface: #FFFFFF
--color-surface-secondary: #F5F5F5

/* Text */
--color-foreground: #262626
--color-muted-foreground: #8C8C8C

/* Borders */
--color-border: #E8E8E8
--color-divider: #F0F0F0
```

## Typography

### Font Family

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### Font Sizes

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Page Title | 3xl-5xl (30-48px) | Bold (700) | 1.2 |
| Section Title | xl-2xl (20-24px) | Bold (700) | 1.3 |
| Card Title | lg (18px) | Semibold (600) | 1.4 |
| Body Text | base (14px) | Normal (400) | 1.5 |
| Small Text | sm (12px) | Normal (400) | 1.4 |
| Caption | xs (10px) | Normal (400) | 1.3 |

### Text Colors

- **Primary Text**: `text-foreground` (#262626)
- **Secondary Text**: `text-muted-foreground` (#8C8C8C)
- **White Text**: `text-white` (on colored backgrounds)

## Spacing System

### Padding

- **Container**: `p-4 sm:p-6 lg:p-8` (16px / 24px / 32px)
- **Card**: `p-6` (24px)
- **Form Field**: `px-4 py-3` (16px horizontal, 12px vertical)
- **Button**: `px-5 py-2.5` or `px-6 py-3`

### Margins & Gaps

- **Section Gap**: `space-y-6` (24px)
- **Card Gap**: `gap-4` or `gap-6` (16px / 24px)
- **Form Field Gap**: `space-y-4` or `space-y-6` (16px / 24px)
- **Grid Gap**: `gap-4` (16px)

## Component Styles

### Buttons

#### Primary Button

```jsx
className="px-6 py-3 text-sm font-semibold rounded-xl bg-primary text-white hover:shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-primary/20"
```

#### Secondary Button

```jsx
className="px-6 py-3 text-sm font-medium border-2 border-border rounded-xl hover:bg-secondary transition-all focus:outline-none focus:ring-4 focus:ring-primary/10"
```

#### Icon Button

```jsx
className="p-2 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-lg transition-all"
```

### Cards

#### Standard Card

```jsx
className="bg-white rounded-xl border border-border shadow-alibaba p-6"
```

#### Hover Card

```jsx
className="bg-white rounded-xl border border-border shadow-alibaba p-6 hover:shadow-alibaba-lg transition-all"
```

### Form Inputs

#### Text Input

```jsx
className="w-full px-4 py-3 border-2 border-input rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
```

#### Input with Error

```jsx
className="w-full px-4 py-3 border-2 border-error rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-error/10 transition-all"
```

### Badges & Pills

#### Status Badge

```jsx
className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-success/10 text-success"
```

#### Category Tag

```jsx
className="inline-block px-2 py-1 text-xs bg-accent/10 text-accent rounded-md font-medium"
```

## Shadows

```css
/* Standard Shadow */
.shadow-alibaba {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Large Shadow */
.shadow-alibaba-lg {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}
```

## Border Radius

- **Small**: `rounded-lg` (8px) - Buttons, inputs
- **Medium**: `rounded-xl` (12px) - Cards, modals
- **Large**: `rounded-2xl` (16px) - Large cards, headers
- **Full**: `rounded-full` - Pills, badges, avatars

## Gradients

### Primary Gradient

```jsx
className="bg-gradient-to-r from-primary via-primary to-accent"
```

### Action Card Gradient

```jsx
className="bg-gradient-to-br from-primary to-accent"
```

## Icons

### Icon Sizes

- **Small**: `size={16}` - Inline with text
- **Medium**: `size={20}` - Card headers, buttons
- **Large**: `size={24}` - Feature icons
- **XLarge**: `size={28}` - KPI cards

### Icon Colors

- **Primary**: `text-primary`
- **Accent**: `text-accent`
- **Muted**: `text-muted-foreground`
- **Status**: `text-success`, `text-warning`, `text-error`, `text-info`

## Animations

### Fade In

```css
.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}
```

### Slide Up

```css
.animate-slide-up {
  animation: slide-up 0.6s ease-out;
}
```

### Scale In

```css
.animate-scale-in {
  animation: scale-in 0.4s ease-out;
}
```

### Hover Effects

```jsx
// Scale on hover
className="hover:scale-105 transition-transform"

// Shadow on hover
className="hover:shadow-alibaba-lg transition-all"
```

## Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
```

### Grid Layouts

```jsx
// Responsive Grid
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"

// Responsive Flex
className="flex flex-col md:flex-row gap-4"
```

## Accessibility Standards

### Focus States

```jsx
className="focus:outline-none focus:ring-4 focus:ring-primary/20"
```

### ARIA Labels

Always include descriptive ARIA labels:

```jsx
<button aria-label="Add new product">...</button>
<input aria-required="true" aria-invalid={hasError} />
```

### Color Contrast

- **Text on Background**: Minimum 4.5:1 ratio
- **Large Text**: Minimum 3:1 ratio
- **Interactive Elements**: Minimum 3:1 ratio

## Component Patterns

### Modal/Dialog

```jsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
  <div className="w-full max-w-2xl bg-white rounded-2xl shadow-alibaba-lg">
    {/* Content */}
  </div>
</div>
```

### Notification

```jsx
<div className="flex items-start gap-3 px-4 py-3 rounded-xl border shadow-alibaba-lg">
  <Icon />
  <div className="flex-1">
    <p className="font-semibold">{title}</p>
    <p className="text-sm">{message}</p>
  </div>
  <CloseButton />
</div>
```

### Loading State

```jsx
<div className="flex items-center justify-center">
  <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
  <p className="text-sm text-muted-foreground">Loading...</p>
</div>
```

## Best Practices

### 1. Consistency

- Use the same spacing values throughout
- Maintain consistent border radius
- Use standard shadow values

### 2. Responsiveness

- Mobile-first approach
- Test on multiple screen sizes
- Use responsive utilities (sm:, md:, lg:)

### 3. Accessibility

- Always include ARIA labels
- Ensure keyboard navigation
- Maintain color contrast ratios

### 4. Performance

- Use CSS transitions instead of JavaScript
- Minimize animation complexity
- Optimize images

### 5. Maintainability

- Use Tailwind utility classes
- Create reusable components
- Document custom styles

## Custom Utilities

### Grid Background

```css
.bg-grid {
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}
```

### Animation Delays

```css
.animation-delay-100 { animation-delay: 100ms; }
.animation-delay-200 { animation-delay: 200ms; }
.animation-delay-300 { animation-delay: 300ms; }
```

## Examples

### Complete Card Example

```jsx
<div className="bg-white rounded-xl border border-border shadow-alibaba p-6 hover:shadow-alibaba-lg transition-all">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-bold text-foreground">Card Title</h3>
    <Icon size={20} className="text-primary" />
  </div>
  <p className="text-sm text-muted-foreground">Card content goes here</p>
</div>
```

### Complete Form Field Example

```jsx
<div>
  <label htmlFor="field-name" className="block text-sm font-semibold text-foreground mb-2">
    Field Label <span className="text-error">*</span>
  </label>
  <input
    id="field-name"
    type="text"
    className="w-full px-4 py-3 border-2 border-input rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
    aria-required="true"
  />
  {error && (
    <p className="mt-1 text-xs text-error" role="alert">{error}</p>
  )}
</div>
```

## Version History

- **v1.0** (2024): Initial style guide creation
  - Color system
  - Typography
  - Component styles
  - Accessibility guidelines

