# Counvo Dashboard Layout Structure

## Overview
The Counvo dashboard uses a three-panel layout with Material-UI components:

```
┌─────────────────────────────────────────────────────────────┐
│                   Navigation Header (Top)                    │
│                    Fixed - 70px height                       │
└─────────────────────────────────────────────────────────────┘
┌──────────────┬───────────────────────────┬──────────────────┐
│              │                           │                  │
│ Navigation   │                           │   Side Panel     │
│  Sidebar     │    Main Content Area      │   (Activity)     │
│   (Left)     │       (Center)            │    (Right)       │
│              │                           │                  │
│  260px       │       Flexible            │  320px/70px      │
│  Fixed       │       Growing             │  Collapsible     │
│              │                           │                  │
└──────────────┴───────────────────────────┴──────────────────┘
```

## Components

### 1. NavigationHeader (Top)
**File:** `NavigationHeader.js`  
**Position:** Fixed top, full width  
**Height:** 70px  
**Features:**
- Logo and branding
- Search bar
- Dark/Light mode toggle
- Notifications icon
- User profile menu
- Hamburger menu for mobile

**Z-Index:** Highest (above drawers)

---

### 2. NavigationSidebar (Left)
**File:** `NavigationSidebar.js`  
**Position:** Fixed left, below header  
**Width:** 260px (desktop), Hidden (mobile - drawer)  
**Features:**
- User info section with avatar
- Simple navigation menu:
  - Dashboard
  - Find Lawyer
  - Profile
  - Support
- Logout button at bottom
- Active route highlighting
- Smooth transitions

**Behavior:**
- **Desktop (≥960px):** Permanent drawer, always visible
- **Mobile (<960px):** Temporary drawer, opened via hamburger menu

**Styling:**
- White background
- Light gray borders
- Purple gradient for active items
- Hover effects

---

### 3. SidePanel (Right)
**File:** `SidePanel.js`  
**Position:** Fixed right, full height  
**Width:** 320px (expanded) / 70px (collapsed)  
**Features:**
- Quick stats dashboard
- Notifications list
- Recent activity
- Quick action buttons
- Settings access
- Toggle button for collapse/expand

**Behavior:**
- **Desktop (≥1200px):** Expanded by default
- **Tablet (960px-1199px):** Collapsed by default
- **Mobile (<960px):** Collapsed by default
- Self-managed state (independent)

**Styling:**
- Light gradient background
- Purple gradient header
- Smooth width transitions
- Tooltips in collapsed mode

---

### 4. Main Content Area (Center)
**Component:** `<Outlet />` from React Router  
**Position:** Center, flexible width  
**Features:**
- Houses all page content
- Scrollable area
- Responsive padding
- Offset for sidebars

**Calculations:**
- **Desktop:** Width = Viewport - 260px (left) - 320px/70px (right)
- **Mobile:** Width = Viewport (full width)

---

## Layout Hierarchy

```jsx
DashboardLayout
├── NavigationHeader (Fixed Top)
├── NavigationSidebar (Fixed Left)
│   ├── User Info
│   ├── Navigation Menu
│   │   ├── Dashboard
│   │   ├── Find Lawyer
│   │   ├── Profile
│   │   └── Support
│   └── Logout Button
├── Main Content (Center - Flexible)
│   └── <Outlet /> (Pages render here)
└── SidePanel (Fixed Right - Collapsible)
    ├── Quick Stats
    ├── Notifications
    ├── Recent Activity
    ├── Quick Actions
    └── Settings
```

---

## Responsive Breakpoints

### Desktop (≥960px)
- NavigationHeader: Full features visible
- NavigationSidebar: Permanent, 260px
- Main Content: Flexible width
- SidePanel: Expanded (320px) or collapsed (70px)

### Tablet (768px - 959px)
- NavigationHeader: Search hidden, other features visible
- NavigationSidebar: Hidden, opens as drawer via hamburger
- Main Content: Full width
- SidePanel: Auto-collapsed (70px)

### Mobile (<768px)
- NavigationHeader: Minimal, only essentials
- NavigationSidebar: Drawer only
- Main Content: Full width
- SidePanel: Auto-collapsed (70px)

---

## Configuration

All dimensions centralized in `config.js`:

```javascript
export const APP_CONFIG = {
  NAVIGATION_HEADER_HEIGHT: 70,      // Header height
  NAVIGATION_SIDEBAR_WIDTH: 260,     // Left sidebar width
  SIDE_PANEL_WIDTH: 320,             // Right panel expanded
  SIDE_PANEL_COLLAPSED_WIDTH: 70,    // Right panel collapsed
};
```

---

## State Management

### DashboardLayout State
```javascript
const [mobileOpen, setMobileOpen] = useState(false);
```
- Controls mobile NavigationSidebar drawer
- Toggled by hamburger menu in header

### Component States
- **NavigationHeader:** No internal state (receives callbacks)
- **NavigationSidebar:** No internal state (controlled by parent)
- **SidePanel:** Self-managed `isExpanded` state
- **Main Content:** No state (pure outlet)

---

## Navigation Flow

1. **User clicks hamburger** → Opens NavigationSidebar (mobile)
2. **User clicks menu item** → Navigates + closes drawer
3. **User clicks notification** → Can trigger SidePanel actions
4. **User toggles SidePanel** → Expands/collapses independently

---

## CSS/MUI Styling

### Z-Index Layers
```
NavigationHeader: z-index: 1201 (theme.zIndex.drawer + 1)
NavigationSidebar: z-index: 1200 (theme.zIndex.drawer)
SidePanel: z-index: 1200 (theme.zIndex.drawer)
Main Content: z-index: 1 (default)
```

### Colors
```
Primary: #667eea → #764ba2 (gradient)
Background: #f8fafc
Borders: #e5e7eb
Text Primary: #1f2937
Text Secondary: #6b7280
Active Item: #667eea with 15% opacity background
Error/Logout: #ef4444
```

### Transitions
```
Drawer: 0.225s cubic-bezier
SidePanel width: 0.3s ease-in-out
Hover effects: 0.2s ease
```

---

## Accessibility

- ✅ Keyboard navigation supported
- ✅ Screen reader friendly labels
- ✅ Focus management on drawer open/close
- ✅ ARIA attributes on interactive elements
- ✅ Proper heading hierarchy
- ✅ Color contrast WCAG AA compliant

---

## Performance Optimization

- NavigationSidebar permanent drawer uses `variant="permanent"`
- Mobile drawer uses `keepMounted` for faster reopens
- SidePanel manages own state (no parent re-renders)
- Smooth animations with GPU acceleration

---

## Usage Example

```jsx
import DashboardLayout from './layouts/DashboardLayout';

// In your router
<Route path="/" element={<DashboardLayout />}>
  <Route path="ClientDashboard" element={<ClientDashboard />} />
  <Route path="findlawyer" element={<FindLawyer />} />
  <Route path="clientprofile" element={<ClientProfile />} />
  <Route path="supports" element={<Support />} />
</Route>
```

---

## Future Enhancements

- [ ] Keyboard shortcuts (e.g., Cmd+K for search)
- [ ] Customizable sidebar order
- [ ] Theme switcher persistence
- [ ] Breadcrumb navigation
- [ ] Quick command palette
- [ ] Multi-level menu support
- [ ] Pinned/favorite pages

---

**Last Updated:** December 2025  
**Version:** 2.0  
**Maintained by:** Counvo Development Team

