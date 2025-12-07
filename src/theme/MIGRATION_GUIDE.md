# Theme Migration Guide

## ⚠️ IMPORTANT: NO GRADIENTS POLICY

**This theme uses SOLID COLORS ONLY - NO GRADIENTS anywhere in the app.**

## Quick Update Checklist

Follow this guide to update existing components to use the new professional lawyer theme.

## Step 1: Update Hardcoded Colors

### Before (Old)
```jsx
sx={{ 
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#1F2937',
}}
```

### After (New - SOLID COLOR ONLY)
```jsx
const theme = useTheme();

sx={{ 
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.text.primary,
}}
```

## Step 2: Update Button Styles

### Primary Buttons (Yellow/Amber)
```jsx
// These will automatically get the yellow gradient
<Button variant="contained" color="primary">
  Book Consultation
</Button>
```

### Secondary Buttons (Navy Blue)
```jsx
<Button variant="contained" color="secondary">
  View Details
</Button>
```

## Step 3: Common Color Replacements

| Old Color | New Theme Property | Usage |
|-----------|-------------------|-------|
| `#667eea` (Purple) | `theme.palette.secondary.main` | Headers, Navigation |
| `#764ba2` (Dark Purple) | `theme.palette.secondary.dark` | Dark backgrounds |
| `#F59E0B` (Amber) | `theme.palette.primary.main` | Primary buttons, highlights |
| `#1F2937` (Dark Gray) | `theme.palette.text.primary` | Main text |
| `#6B7280` (Gray) | `theme.palette.text.secondary` | Secondary text |
| `#F9FAFB` (Light Gray) | `theme.palette.background.default` | Page background |
| `#FFFFFF` (White) | `theme.palette.background.paper` | Card/Paper background |

## Step 4: Update Component Files

### Navigation Sidebar
```jsx
// OLD
sx={{
  background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
  color: '#667eea',
}}

// NEW
const theme = useTheme();
sx={{
  background: theme.palette.primary.light + '15', // 15% opacity
  color: theme.palette.primary.main,
}}
```

### Profile Cards
```jsx
// OLD
sx={{
  border: '4px solid #667eea',
  boxShadow: '0 4px 20px rgba(102,126,234,0.3)',
}}

// NEW
const theme = useTheme();
sx={{
  border: `4px solid ${theme.palette.primary.main}`,
  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
}}
```

## Step 5: Update Specific Components

### ClientProfile.js
```jsx
// Update gradient backgrounds
background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`

// Update icon backgrounds
sx={{
  background: alpha(theme.palette.primary.main, 0.15),
  color: theme.palette.primary.main,
}}
```

### NavigationHeader.js
```jsx
// Header background - Keep secondary (Navy) for authority
background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`

// Avatar background - Use primary (Yellow) for distinction
background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
```

### NavigationSidebar.js
```jsx
// Active item - Use primary yellow
'&.Mui-selected': {
  background: alpha(theme.palette.primary.main, 0.15),
  color: theme.palette.primary.dark,
}
```

## Step 6: Import useTheme Hook

Add to your component imports:
```jsx
import { useTheme } from '@mui/material/styles';

// Inside component
const theme = useTheme();
```

## Step 7: Update Inline Styles to sx Prop

### Before
```jsx
<div style={{ 
  background: '#667eea',
  padding: '20px',
}}>
```

### After
```jsx
<Box sx={{ 
  background: theme.palette.primary.main,
  p: 2.5, // 20px = 2.5 * 8px (theme spacing unit)
}}>
```

## Step 8: Testing Checklist

After updating components, verify:

- [ ] Primary buttons are yellow/amber with gradient
- [ ] Secondary buttons are navy blue
- [ ] Headers use navy blue background
- [ ] Active/selected items use yellow highlight
- [ ] All text is readable (good contrast)
- [ ] Hover states work properly
- [ ] Focus states are visible
- [ ] Cards have proper shadows
- [ ] Forms use yellow for focus states

## Step 9: Files Priority Order

Update in this order for best results:

1. **High Priority**
   - `App.js` (Already done ✅)
   - `NavigationHeader.js`
   - `NavigationSidebar.js`
   - `ClientProfile.js`

2. **Medium Priority**
   - `DashboardContent.jsx`
   - `findalawyer.js`
   - `clientchathistory.js`

3. **Low Priority**
   - Other pages and components

## Step 10: Common Patterns

### Primary Buttons (SOLID COLOR - NO GRADIENT)
```jsx
<Button
  variant="contained"
  color="primary"
  sx={{
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  }}
>
  Premium Action
</Button>
```

### Status Chips
```jsx
// Active/Success
<Chip label="Active" color="success" />

// Warning
<Chip label="Pending" color="warning" />

// Premium (SOLID COLOR ONLY)
<Chip 
  label="Premium" 
  color="primary"
  sx={{ 
    backgroundColor: theme.palette.primary.main,
    border: `2px solid ${theme.palette.primary.dark}`,
  }}
/>
```

### Cards with Theme
```jsx
<Card
  elevation={3}
  sx={{
    borderRadius: 3,
    border: `1px solid ${theme.palette.divider}`,
    '&:hover': {
      boxShadow: theme.shadows[6],
      borderColor: theme.palette.primary.main,
    },
  }}
>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

## Troubleshooting

### Issue: Colors not showing
**Solution:** Make sure `<ThemeProvider>` wraps your app in `App.js`

### Issue: Gradient not working
**Solution:** Use backticks and template literals:
```jsx
background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
```

### Issue: Theme not available
**Solution:** Import and use the hook:
```jsx
import { useTheme } from '@mui/material/styles';
const theme = useTheme();
```

## Quick Reference

```jsx
// Import theme
import { useTheme, alpha } from '@mui/material/styles';

// Use in component
const theme = useTheme();

// Access colors
theme.palette.primary.main      // #F59E0B (Yellow)
theme.palette.secondary.main    // #1E3A8A (Navy)
theme.palette.success.main      // #059669 (Green)
theme.palette.error.main        // #DC2626 (Red)
theme.palette.text.primary      // #1F2937 (Dark Gray)
theme.palette.background.default // #F9FAFB (Light Gray)

// Spacing
theme.spacing(1)  // 8px
theme.spacing(2)  // 16px
theme.spacing(3)  // 24px

// Shadows
theme.shadows[2]  // Small shadow
theme.shadows[4]  // Medium shadow
theme.shadows[6]  // Large shadow
```

## Need Help?

1. Check `theme/README.md` for detailed documentation
2. Look at `theme/ThemeExamples.jsx` for usage examples
3. Import colors from `theme/colors.js` for quick access

---

**Version:** 1.0.0  
**Last Updated:** December 2025

