# NavigationSidebar Component Guide

## Overview
The NavigationSidebar is a fully responsive, collapsible navigation drawer that works seamlessly across desktop and mobile devices.

## Features

### ✅ Desktop Features
- **Collapsible**: Click the chevron icon to collapse/expand the sidebar
- **Smooth Transitions**: Animated width transitions when collapsing
- **Tooltips**: Hover over icons in collapsed state to see labels
- **Persistent State**: Sidebar state is maintained during navigation
- **Logo Switching**: Shows icon logo when collapsed, full logo when expanded

### ✅ Mobile Features
- **Temporary Drawer**: Opens as an overlay on mobile devices
- **Always Full Width**: Mobile drawer is always expanded (no collapse)
- **Auto-Close**: Closes automatically when navigating to a page
- **Touch-Friendly**: Optimized for touch interactions

### ✅ Responsive Breakpoints
- **Mobile**: `< 960px` (md breakpoint) - Temporary drawer
- **Desktop**: `≥ 960px` - Permanent drawer with collapse functionality

## Widths

```javascript
// From config.js
NAVIGATION_SIDEBAR_WIDTH: 260        // Expanded width
SIDE_PANEL_COLLAPSED_WIDTH: 80      // Collapsed width (desktop only)
```

## Component Props

```typescript
interface NavigationSidebarProps {
  mobileOpen: boolean;      // Controls mobile drawer open state
  onClose: () => void;      // Called when mobile drawer closes
}

// Ref Methods
ref.current.handleToggleCollapse()  // Toggle collapse state (desktop)
ref.current.handleLogout()          // Programmatically logout
```

## Usage Example

```jsx
import NavigationSidebar from "../components/Layout/NavigationSidebar";

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarRef = useRef(null);
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleMobileDrawerClose = () => {
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <NavigationSidebar
        ref={sidebarRef}
        mobileOpen={mobileOpen}
        onClose={handleMobileDrawerClose}
      />
      {/* Main content */}
    </Box>
  );
};
```

## States

### Expanded (Desktop)
```
┌─────────────────────────────┐
│  [Logo]            [<]      │ Header with collapse button
├─────────────────────────────┤
│  [Icon] Dashboard           │ Menu items with icons + text
│  [Icon] Find Lawyer         │
│  [Icon] History             │
│  [Icon] Support             │
│  [Icon] Profile             │
├─────────────────────────────┤
│  [Avatar] John Doe          │ User profile
│  Client Account             │
├─────────────────────────────┤
│  [Icon] Logout              │ Logout button
└─────────────────────────────┘
Width: 260px
```

### Collapsed (Desktop)
```
┌─────────┐
│ [Icon]  │ Just logo icon
├─────────┤
│ [Icon]  │ Menu icons only
│ [Icon]  │ (with tooltips)
│ [Icon]  │
│ [Icon]  │
│ [Icon]  │
├─────────┤
│ [Avatar]│ Just avatar
├─────────┤
│ [Icon]  │ Logout icon
└─────────┘
Width: 80px
```

### Mobile
```
Full screen overlay drawer
Always expanded (260px)
Closes on navigation or backdrop click
```

## Styling & Theme

### Colors
- **Active Item**: `primary.main` with light background
- **Hover**: `alpha(primary.light, 0.08)`
- **Dividers**: `theme.palette.divider`
- **Background**: `background.paper`
- **Logout**: `error.main`

### Transitions
- Width transition: `theme.transitions.duration.enteringScreen`
- Easing: `theme.transitions.easing.sharp`

## Menu Items

Menu items are dynamically generated from `navigationConstants.js`:

```javascript
import { GetNavigationMenuItems } from "../../_constants/navigationConstants";

const menuItems = GetNavigationMenuItems(userRole);
```

## User Profile Section

Located at the bottom with:
- Avatar with initials
- User full name
- Account type label
- Logout button

All properly aligned for both collapsed and expanded states.

## Collapse Toggle Button

**Desktop Only**:
- Located in the header
- Shows `ChevronLeft` when expanded
- Shows `ChevronRight` when collapsed (positioned absolutely on the right edge)
- Has tooltip showing current action

**Mobile**:
- Collapse button is hidden
- Use menu icon in NavigationHeader to toggle drawer

## Best Practices

### ✅ DO
- Use ref methods for programmatic control
- Let mobile drawer close automatically on navigation
- Use tooltips in collapsed state
- Keep menu items concise

### ❌ DON'T
- Don't try to collapse on mobile (handled automatically)
- Don't hardcode widths (use APP_CONFIG constants)
- Don't nest complex content in menu items
- Don't override transition durations

## Accessibility

- ✅ Keyboard navigation support
- ✅ Proper ARIA labels
- ✅ Focus management
- ✅ Screen reader friendly
- ✅ High contrast support

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS/Android)

## Troubleshooting

### Sidebar not collapsing
- Ensure you're on desktop (≥ 960px width)
- Check if collapse button is visible
- Verify APP_CONFIG constants are loaded

### Mobile drawer not closing
- Check `onClose` prop is correctly passed
- Verify `mobileOpen` state is being updated
- Ensure navigation is working

### Layout issues
- Verify DashboardLayout accounts for sidebar width
- Check for conflicting CSS
- Ensure proper Box flex layout

### Logo not switching
- Verify LogoIcon and LogoHorizontal images exist
- Check import paths
- Ensure images are in correct format

## Performance

- ✅ `keepMounted` prop for mobile drawer (faster reopening)
- ✅ `overflowX: hidden` prevents horizontal scroll during transitions
- ✅ CSS transitions (GPU accelerated)
- ✅ Conditional rendering for collapsed content

## Future Enhancements

Potential additions:
- [ ] Remember collapse state in localStorage
- [ ] Keyboard shortcut to toggle collapse (e.g., Ctrl+B)
- [ ] Animation options (slide, fade, etc.)
- [ ] Custom width configurations per user
- [ ] Sub-menu support for nested navigation

---

**Last Updated**: December 2025  
**Component Version**: 2.0  
**MUI Version**: 5.x

