# Counvo Material UI Theme Documentation

## ⚠️ CRITICAL: SIMPLE & CLEAN DESIGN - NO GRADIENTS
**This theme uses SOLID COLORS ONLY. Keep designs SIMPLE. NO gradients, minimal backgrounds.**  
See `NO_GRADIENTS_POLICY.md` for details.

## Design Philosophy
- **Simple & Clean**: Minimal design, no over-styling
- **Solid Colors Only**: No gradients anywhere
- **Minimal Backgrounds**: Only add backgrounds when absolutely necessary
- **Professional**: Let content speak, not decoration

## Overview
Professional legal/lawyer app theme with Yellow/Amber as primary, Navy Blue as secondary, and Burgundy as tertiary.

## Color Palette

### Primary Colors (Yellow/Gold)
```javascript
primary: {
  main: '#F59E0B',    // Amber/Gold - Professional yellow
  light: '#FCD34D',   // Light amber
  dark: '#D97706',    // Dark amber
  contrastText: '#1F2937',
}
```

**Usage:**
- Primary buttons
- Call-to-action elements
- Key highlights
- Success indicators
- Premium features

**Meaning:** Trust, Excellence, Premium Service, Success

### Secondary Colors (Navy Blue)
```javascript
secondary: {
  main: '#1E3A8A',    // Navy Blue - Professional authority
  light: '#3B82F6',   // Light blue
  dark: '#1E40AF',    // Dark navy
  contrastText: '#FFFFFF',
}
```

**Usage:**
- Headers and navigation
- Professional sections
- Authority indicators
- Links and secondary actions

**Meaning:** Authority, Professionalism, Stability, Trust

### Tertiary Colors (Burgundy)
```javascript
tertiary: {
  main: '#991B1B',    // Burgundy - Legal tradition
  light: '#DC2626',   // Red
  dark: '#7F1D1D',    // Dark burgundy
  contrastText: '#FFFFFF',
}
```

**Usage:**
- Important warnings
- Legal documents indicators
- Traditional legal elements
- Error states (when appropriate)

**Meaning:** Tradition, Sophistication, Legal Heritage

### Semantic Colors

#### Success
```javascript
success: {
  main: '#059669',    // Professional green
  light: '#10B981',
  dark: '#047857',
}
```
Used for: Successful operations, verifications, approvals

#### Error
```javascript
error: {
  main: '#DC2626',
  light: '#EF4444',
  dark: '#B91C1C',
}
```
Used for: Errors, rejections, critical warnings

#### Warning
```javascript
warning: {
  main: '#F59E0B',    // Same as primary
  light: '#FCD34D',
  dark: '#D97706',
}
```
Used for: Alerts, pending items, important notices

#### Info
```javascript
info: {
  main: '#3B82F6',    // Blue
  light: '#60A5FA',
  dark: '#2563EB',
}
```
Used for: Information, tips, helpful messages

### Background Colors
```javascript
background: {
  default: '#F9FAFB',  // Light gray for page background
  paper: '#FFFFFF',     // White for cards and surfaces
}
```

### Text Colors
```javascript
text: {
  primary: '#1F2937',   // Dark gray - main text
  secondary: '#6B7280', // Medium gray - secondary text
  disabled: '#9CA3AF',  // Light gray - disabled text
}
```

## Typography

### Font Family
```javascript
fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
```

### Headings
```javascript
h1: { fontSize: '2.5rem', fontWeight: 700 }
h2: { fontSize: '2rem', fontWeight: 700 }
h3: { fontSize: '1.75rem', fontWeight: 600 }
h4: { fontSize: '1.5rem', fontWeight: 600 }
h5: { fontSize: '1.25rem', fontWeight: 600 }
h6: { fontSize: '1.125rem', fontWeight: 600 }
```

### Body Text
```javascript
body1: { fontSize: '1rem', fontWeight: 400 }
body2: { fontSize: '0.875rem', fontWeight: 400 }
```

### Special Text
```javascript
button: { fontSize: '0.875rem', fontWeight: 600, textTransform: 'none' }
caption: { fontSize: '0.75rem', fontWeight: 400 }
overline: { fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }
```

## Component Customizations

### Buttons
- **Border Radius:** 8px
- **Padding:** 10px 24px (default), 6px 16px (small), 12px 32px (large)
- **Font Weight:** 600
- **Text Transform:** None (not uppercase)
- **Shadow:** None default, gradient shadow on hover
- **Primary Button:** Linear gradient (Amber → Dark Amber)

**Example:**
```jsx
<Button variant="contained" color="primary">
  Book Consultation
</Button>
```

### Cards
- **Border Radius:** 12px
- **Default Shadow:** Subtle elevation
- **Hover Shadow:** Enhanced elevation

### TextField
- **Border Radius:** 8px
- **Focus Color:** Primary (Amber)
- **Hover Border:** Primary color
- **Border Width on Focus:** 2px

### Chips
- **Border Radius:** 8px
- **Font Weight:** 500
- **Filled Variant:** Light amber background with dark text

### List Items
- **Border Radius:** 8px
- **Selected Background:** Light amber (#FEF3C7)
- **Selected Text Color:** Dark amber (#92400E)

## Usage Examples

### Using Theme Colors in Components

```jsx
import { useTheme } from '@mui/material/styles';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <Box sx={{
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      padding: theme.spacing(2),
      borderRadius: theme.shape.borderRadius,
    }}>
      Content
    </Box>
  );
}
```

### Button Examples

```jsx
// Primary action (Amber gradient)
<Button variant="contained" color="primary">
  Hire Lawyer
</Button>

// Secondary action (Navy blue)
<Button variant="contained" color="secondary">
  View Details
</Button>

// Outlined button
<Button variant="outlined" color="primary">
  Learn More
</Button>

// Text button
<Button variant="text" color="primary">
  Cancel
</Button>
```

### Card with Theme

```jsx
<Card sx={{
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
  color: theme.palette.primary.contrastText,
}}>
  <CardContent>
    Premium Content
  </CardContent>
</Card>
```

### Alert Examples

```jsx
<Alert severity="success">Operation successful!</Alert>
<Alert severity="error">Error occurred</Alert>
<Alert severity="warning">Please review</Alert>
<Alert severity="info">Important information</Alert>
```

## Best Practices

### 1. Use Theme Colors
✅ **Do:**
```jsx
sx={{ color: theme.palette.primary.main }}
```

❌ **Don't:**
```jsx
sx={{ color: '#F59E0B' }}
```

### 2. Consistent Spacing
Use theme spacing function:
```jsx
sx={{ 
  p: theme.spacing(2),  // 16px
  m: theme.spacing(3),  // 24px
}}
```

### 3. Typography Variants
Use predefined variants:
```jsx
<Typography variant="h1">Main Title</Typography>
<Typography variant="body1">Body text</Typography>
```

### 4. Responsive Design
```jsx
sx={{
  width: { xs: '100%', sm: '80%', md: '60%' },
  fontSize: { xs: '0.875rem', md: '1rem' },
}}
```

### 5. Semantic Colors
- Use `primary` for main actions
- Use `secondary` for secondary actions
- Use `success`/`error`/`warning`/`info` for feedback
- Use `tertiary` for legal/traditional elements

## Color Psychology for Legal App

### Yellow/Amber (Primary)
- **Positive:** Trust, optimism, clarity, wisdom
- **Professional:** Premium service, expertise
- **Legal Context:** Justice, enlightenment, guidance

### Navy Blue (Secondary)
- **Positive:** Authority, stability, confidence
- **Professional:** Corporate, reliable, trustworthy
- **Legal Context:** Law enforcement, professionalism

### Burgundy (Tertiary)
- **Positive:** Tradition, sophistication, power
- **Professional:** Executive, prestigious
- **Legal Context:** Legal heritage, judicial authority

## Accessibility

### Contrast Ratios
All color combinations meet WCAG 2.1 Level AA standards:
- Primary text on white: 4.5:1 minimum
- Button text on primary: 3:1 minimum
- Secondary text: 4.5:1 minimum

### Focus States
All interactive elements have visible focus indicators using theme colors.

## Migration from Old Colors

### Old Purple Gradient → New Theme
```javascript
// Before
background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'

// After - Use secondary for headers
background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`

// Or use primary for highlights
background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
```

### Component Updates
1. **Buttons:** Will automatically use new primary color
2. **Cards:** May need gradient updates
3. **Headers:** Update to secondary color
4. **Highlights:** Use primary color

## Development Tips

### 1. Theme Access
```jsx
import { useTheme } from '@mui/material/styles';
const theme = useTheme();
```

### 2. Custom Component with Theme
```jsx
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
}));
```

### 3. Conditional Theming
```jsx
sx={{
  backgroundColor: active 
    ? theme.palette.primary.light 
    : theme.palette.background.default,
}}
```

## Resources

- [Material-UI Theme Documentation](https://mui.com/material-ui/customization/theming/)
- [Material-UI Color Tool](https://mui.com/material-ui/customization/color/)
- [Color Palette Reference](https://mui.com/material-ui/customization/palette/)

---

**Theme Version:** 1.0.0  
**Last Updated:** December 2025  
**Maintained by:** Counvo Development Team

