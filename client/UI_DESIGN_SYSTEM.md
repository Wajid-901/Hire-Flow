# HireFlow UI Design System

## Overview
HireFlow features a premium, modern SaaS dashboard UI inspired by Linear, Vercel, Notion, Stripe Dashboard, and Raycast. The design emphasizes elegance, minimalism, and professional polish.

## Design Principles

### 1. **Dark Mode First**
- Primary Background: `#09090B`
- Card Background: `#18181B`
- Elevated Background: `#27272A`

### 2. **Color Palette**

#### Brand Colors
- **Primary (Indigo)**: `#6366F1`
- **Accent (Emerald)**: `#10B981`

#### Status Colors
- **Applied (Blue)**: Indigo variants
- **Interview (Amber)**: `#F59E0B`
- **Offer (Green)**: Emerald variants
- **Rejected (Rose)**: `#F43F5E`

#### Neutrals
- Text Primary: `white`
- Text Secondary: `neutral-400`
- Text Tertiary: `neutral-500`

### 3. **Typography**
- Font Family: **Inter** (Professional, modern, highly legible)
- Font Features: `cv11`, `ss01` for enhanced readability
- Hierarchy:
  - Hero: `text-6xl` / `text-7xl`
  - Page Title: `text-4xl`
  - Section Title: `text-2xl` / `text-3xl`
  - Card Title: `text-xl`
  - Body: `text-sm` / `text-base`

### 4. **Spacing (8px Grid System)**
- Base unit: `8px` (0.5rem)
- Common values: 8px, 16px, 24px, 32px, 40px, 48px

### 5. **Border Radius**
- Small: `0.5rem` (8px)
- Medium: `0.75rem` (12px)
- Large: `1rem` (16px)
- XL: `1.25rem` (20px)
- 2XL: `1.5rem` (24px)

### 6. **Shadows & Effects**

#### Glass Effect
```css
backdrop-blur-xl bg-white/5 border border-white/10
```

#### Premium Shadow
```css
shadow-[0_4px_24px_-2px_rgba(0,0,0,0.5),0_2px_8px_-2px_rgba(0,0,0,0.3)]
```

#### Glow Effects
- Indigo: `shadow-[0_0_20px_rgba(99,102,241,0.3)]`
- Emerald: `shadow-[0_0_20px_rgba(16,185,129,0.3)]`

## Component Patterns

### Cards
```jsx
<div className="rounded-2xl border border-white/5 bg-[#18181B] p-6 shadow-xl">
  {/* Content */}
</div>
```

### Buttons

#### Primary
```jsx
<button className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all hover:-translate-y-0.5">
  Button Text
</button>
```

#### Secondary
```jsx
<button className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white transition-all">
  Button Text
</button>
```

### Input Fields
```jsx
<input className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
```

### Status Badges
```jsx
<span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
  Applied
</span>
```

## Page Layouts

### Landing Page
- Hero section with gradient text
- Animated background blobs
- Feature highlights
- Social proof
- Premium CTAs

### Authentication Pages
- Split-screen layout
- Left: Animated illustration with gradient blobs
- Right: Glass card with form
- Google OAuth button
- Password visibility toggle

### Dashboard Layout
- Fixed sidebar (72px width on desktop)
- Sticky header with search
- Main content area (max-width: 7xl)
- Floating AI Assistant

### Dashboard Components
1. **Stats Cards** - 4-column grid with icons and trends
2. **Recent Applications** - Card-based list view
3. **Progress Card** - Animated progress bars
4. **Activity Chart** - Interactive bar chart
5. **Quick Actions** - Button group
6. **AI Tips** - Gradient card with suggestions

## Responsive Breakpoints

```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Mobile Considerations
- Hamburger menu for navigation
- Bottom navigation bar (optional)
- Touch-friendly button sizes (min 44px)
- Simplified layouts
- Hidden secondary actions

## Animations & Transitions

### Hover Effects
- Scale: `hover:scale-105`
- Translate: `hover:-translate-y-0.5`
- Background: `hover:bg-white/10`
- Shadow: `hover:shadow-xl`

### Loading States
```jsx
<div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
```

### Micro-interactions
- Button press feedback
- Card hover lift
- Icon scale on active
- Smooth color transitions (300ms)

## Accessibility

### Color Contrast
- Ensure WCAG AA compliance
- Use semantic colors
- Avoid color-only indicators

### Focus States
```css
focus:outline-none focus:ring-2 focus:ring-indigo-500
```

### ARIA Labels
- Use descriptive labels for icons
- Provide alt text for images
- Semantic HTML structure

## Icon System
Using **React Icons (Bootstrap Icons)**
- Consistent 20px size for UI icons
- 24px for prominent actions
- Colored icons for status indicators

## Usage Examples

### Creating a New Page
```jsx
import PageContainer from "../components/layout/PageContainer";

const NewPage = () => {
  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Page Title
        </h1>
        <p className="text-lg text-neutral-400">
          Page description
        </p>
      </div>
      
      {/* Page content */}
    </PageContainer>
  );
};
```

### Creating a Card Component
```jsx
const MyCard = () => {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#18181B] p-6 shadow-xl hover:-translate-y-1 transition-all">
      <h3 className="text-xl font-bold text-white mb-2">Card Title</h3>
      <p className="text-sm text-neutral-400">Card content</p>
    </div>
  );
};
```

## Best Practices

1. **Consistency**: Use design tokens and component library
2. **Performance**: Optimize images and animations
3. **Accessibility**: Test with screen readers
4. **Responsive**: Mobile-first approach
5. **Polish**: Attention to micro-interactions
6. **Hierarchy**: Clear visual hierarchy
7. **Whitespace**: Generous spacing for clarity
8. **Feedback**: Visual feedback for all interactions

## File Structure
```
src/
├── components/
│   ├── common/           # Reusable UI components
│   ├── layout/           # Layout components
│   ├── dashboard/        # Dashboard-specific components
│   └── applications/     # Application-specific components
├── pages/
│   ├── auth/            # Authentication pages
│   └── dashboard/       # Dashboard pages
├── layouts/             # Page layouts
└── index.css            # Global styles & design tokens
```

## Future Enhancements

- [ ] Light mode support
- [ ] Component documentation with Storybook
- [ ] Design tokens in JSON format
- [ ] Animation library integration (Framer Motion)
- [ ] Advanced charts and visualizations
- [ ] Customizable themes
- [ ] Exportable design system package

---

**Last Updated**: August 30, 2026
**Version**: 1.0.0
