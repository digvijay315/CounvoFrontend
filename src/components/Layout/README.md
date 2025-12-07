# Layout Components Documentation

## Overview
This folder contains the modern Material-UI based layout components for the Counvo application.

## Components

### 1. NavigationHeader
A feature-rich top navigation bar with Material-UI design.

**Features:**
- Search functionality
- Notification center with badge counter
- Dark/Light mode toggle
- Help & Support quick access
- User profile menu with avatar
- Responsive design

**Props:**
- `onMenuClick`: Function - Callback when hamburger menu is clicked
- `onNotificationClick`: Function - Callback when notifications icon is clicked

**Usage:**
```javascript
import NavigationHeader from './components/Layout/NavigationHeader';

<NavigationHeader 
  onMenuClick={() => setDrawerOpen(true)}
  onNotificationClick={() => setSidePanelOpen(true)}
/>
```

---

### 2. SidePanel
A persistent, self-managed activity panel fixed on the right side with collapse/expand functionality.

**Features:**
- **Always visible** - Permanently rendered, manages its own state
- **Collapsible** - Can collapse to icon-only view (70px) or expand (320px)
- **Responsive** - Auto-collapses on mobile/tablet, expands on desktop
- **Independent state** - Does NOT depend on parent component props
- Quick stats dashboard
- Notifications list with unread indicators
- Recent activity timeline
- Quick action buttons
- Settings access
- Smooth collapse/expand animation
- Toggle button with hover effects

**Props:**
- None - Component manages its own state internally

**Usage:**
```javascript
import SidePanel from './components/Layout/SidePanel';

// Simply render it - no state management needed
<SidePanel />
```

**Behavior:**
- Desktop (≥1200px): Expanded by default
- Tablet (960px-1199px): Collapsed by default
- Mobile (<960px): Collapsed by default
- Users can manually toggle at any time via the button

---

### 3. DashboardLayout
The main layout component that combines header, sidebar, and content area.

**Features:**
- Responsive sidebar (permanent on desktop, temporary on mobile)
- Material-UI navigation
- Integrated header and side panel
- Active route highlighting
- Logout functionality

**Usage:**
In your routes configuration:
```javascript
import DashboardLayout from './layouts/DashboardLayout';

<Route path="/" element={<DashboardLayout />}>
  <Route path="ClientDashboard" element={<ClientDashboard />} />
  <Route path="findlawyer" element={<FindLawyer />} />
  <Route path="clientprofile" element={<ClientProfile />} />
  <Route path="supports" element={<Support />} />
</Route>
```

---

## Design System

### Color Palette
- Primary Gradient: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Background: `#f8fafc`
- Borders: `#e5e7eb`
- Text Primary: `#1f2937`
- Text Secondary: `#6b7280`

### Spacing
- Drawer Width: `260px`
- Header Height: `70px`
- Border Radius: `8px - 16px`

### Typography
- Header: Bold 600-700
- Body: Regular 400
- Labels: Medium 500

---

## Integration Notes

1. **State Management**: The layout uses local state for drawer and panel toggling. You can integrate with Redux/Context if needed.

2. **Authentication**: User data is retrieved from `localStorage.getItem('userDetails')`. Ensure this is set after login.

3. **Routing**: Uses `react-router-dom` for navigation. Ensure all routes are properly configured.

4. **Icons**: Uses Material-UI icons. All icons are imported from `@mui/icons-material`.

5. **Responsive Behavior**:
   - Desktop (>= 960px): Permanent sidebar
   - Mobile (< 960px): Temporary drawer with hamburger menu

---

## Customization

### Changing Theme Colors
Update the gradient colors in the respective component files:
```javascript
background: 'linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 100%)'
```

### Adding Menu Items
In `DashboardLayout.jsx`, modify the `menuItems` array:
```javascript
const menuItems = [
  { 
    label: 'Your Label', 
    icon: <YourIcon />, 
    path: '/your-path' 
  },
  // ... more items
];
```

### Notification Data
In `NavigationHeader.js` and `SidePanel.js`, replace the sample notification arrays with API calls:
```javascript
const [notifications, setNotifications] = useState([]);

useEffect(() => {
  // Fetch notifications from API
  fetchNotifications().then(data => setNotifications(data));
}, []);
```

---

## Screenshots

### Desktop View
- Full sidebar visible
- Top navigation with search
- Activity panel on right side

### Mobile View
- Hamburger menu
- Collapsible sidebar
- Responsive notifications

---

## Dependencies
- `@mui/material`: ^5.15.16
- `@mui/icons-material`: ^5.15.16
- `react-router-dom`: ^6.24.0
- `@emotion/react`: ^11.11.1
- `@emotion/styled`: ^11.11.0

---

## Future Enhancements
- [ ] Add real-time notification updates via WebSocket
- [ ] Implement theme persistence in localStorage
- [ ] Add breadcrumb navigation
- [ ] Implement notification filtering
- [ ] Add user preferences panel
- [ ] Integration with backend API for notifications

