---
name: frontend-skill
description: Build responsive, accessible, and maintainable user interfaces using Next.js App Router, React, TypeScript, and Tailwind CSS. Use whenever creating or modifying pages, layouts, components, or styling.
---

# Frontend Skill

## Objective

Design and build modern, responsive, and production-ready user interfaces using **Next.js App Router**, **React**, **TypeScript**, and **Tailwind CSS**.

This skill applies to:

- Layouts
- Pages
- Components
- Styling
- Responsive Design
- UI Composition
- State Management
- API Integration

---

# Layout Building

Create reusable layouts using the Next.js App Router.

Build:

- Root Layout
- Nested Layouts
- Dashboard Layouts
- Authentication Layouts
- Shared Navigation
- Sidebar
- Header
- Footer

Requirements:

- Consistent spacing.
- Responsive structure.
- Reusable layout components.
- Logical content hierarchy.
- Mobile-first design.

Checklist:

- Shared layouts.
- Nested layouts where appropriate.
- Responsive containers.
- Proper page spacing.
- Consistent typography.

---

# Page Development

Build pages using the Next.js App Router.

Support:

- Static Pages
- Dynamic Routes
- Nested Routes
- Loading UI
- Error Pages
- Not Found Pages

Always:

- Generate page metadata.
- Keep pages lightweight.
- Delegate logic to reusable components.
- Handle loading and error states gracefully.

---

# Component Development

Create reusable React components.

Build:

- Buttons
- Cards
- Forms
- Inputs
- Tables
- Navigation
- Dialogs
- Modals
- Dropdowns
- Alerts
- Badges
- Loaders

Guidelines:

- Single responsibility.
- Reusable props.
- Type-safe interfaces.
- Composition over duplication.
- Small, maintainable components.

Never:

- Duplicate UI logic.
- Create oversized components.
- Mix business logic with presentation.

---

# Styling

Style applications using Tailwind CSS.

Requirements:

- Utility-first approach.
- Consistent spacing.
- Modern typography.
- Reusable color palette.
- Clean visual hierarchy.
- Design system consistency.

Prefer:

- Flexbox
- CSS Grid
- Responsive utilities
- Tailwind components
- Custom utility classes only when necessary

Avoid:

- Inline styles.
- Repeated utility combinations.
- Unnecessary custom CSS.

---

# Responsive Design

Design for:

- Mobile
- Tablet
- Laptop
- Desktop
- Wide Screens

Follow:

- Mobile-first development.
- Flexible layouts.
- Responsive typography.
- Responsive images.
- Responsive navigation.

Ensure:

- Touch-friendly controls.
- Proper spacing.
- Readable text.
- Flexible grids.

---

# Accessibility

Build accessible interfaces.

Requirements:

- Semantic HTML.
- Keyboard navigation.
- Focus states.
- Screen reader compatibility.
- Proper labels.
- ARIA attributes when necessary.
- Accessible forms.
- Sufficient color contrast.

Never:

- Use divs instead of semantic elements unnecessarily.
- Remove focus indicators.
- Ignore accessibility warnings.

---

# State Management

Manage UI state efficiently.

Prefer:

- Local Component State
- React Context (when needed)
- Server Components
- Client Components only where required

Keep:

- State predictable.
- Components loosely coupled.
- Business logic separated.

---

# API Integration

Connect frontend to backend APIs.

Implement:

- Data fetching.
- Loading states.
- Error handling.
- Empty states.
- Success feedback.
- Form submission.

Always:

- Validate API responses.
- Handle failures gracefully.
- Keep fetching logic reusable.

---

# Performance

Optimize frontend performance.

Use:

- Server Components.
- Next.js Image.
- Dynamic imports.
- Lazy loading.
- Code splitting.
- Optimized fonts.
- Memoization where beneficial.

Avoid:

- Unnecessary client components.
- Large JavaScript bundles.
- Excessive re-renders.

---

# Project Structure

Organize the application clearly.

Example:

```
app/
├── (auth)/
├── dashboard/
├── api/
├── layout.tsx
├── page.tsx
├── loading.tsx
├── error.tsx

components/
├── ui/
├── forms/
├── layout/
├── shared/

hooks/

lib/

styles/

types/

utils/
```

Separate:

- Layouts
- Components
- Hooks
- Utilities
- API Clients
- Types

---

# Code Quality

Frontend code should be:

- Clean
- Modular
- Reusable
- Well typed
- Readable
- Maintainable

Follow:

- SOLID principles
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple, Stupid)

Use:

- TypeScript interfaces
- Proper component naming
- Consistent folder structure

---

# UI/UX Best Practices

Design interfaces that are:

- Clean
- Modern
- Minimal
- Consistent
- Intuitive

Include:

- Hover states
- Focus states
- Loading indicators
- Empty states
- Error states
- Success messages
- Smooth transitions

Maintain:

- Visual hierarchy
- Consistent spacing
- Clear navigation
- User-friendly interactions

---

# Testing Checklist

Verify:

- Pages render correctly.
- Layouts remain consistent.
- Components are reusable.
- Responsive behavior works.
- Accessibility requirements are met.
- Forms validate correctly.
- API integrations function properly.
- Styling is consistent.
- Navigation works.
- Loading and error states behave correctly.

---

# Deliverables

Every frontend implementation should include:

- Responsive layouts
- Reusable components
- Next.js App Router pages
- Tailwind CSS styling
- Mobile-first design
- Accessible UI
- API integration
- Loading and error states
- Clean project structure
- Type-safe React components
- Production-ready, maintainable frontend code