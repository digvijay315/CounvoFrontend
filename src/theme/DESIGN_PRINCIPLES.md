# Counvo Design Principles

## Core Philosophy: SIMPLE & CLEAN

### 1. **NO GRADIENTS**
❌ Never use linear-gradient, radial-gradient, or any gradients
✅ Use solid colors from the theme

```jsx
// ❌ WRONG
sx={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}

// ✅ RIGHT
sx={{ backgroundColor: theme.palette.primary.main }}
```

### 2. **MINIMAL BACKGROUNDS**
❌ Don't add background colors unless necessary
✅ Let white/default backgrounds work

```jsx
// ❌ WRONG - Unnecessary background
<Box sx={{ 
  backgroundColor: '#F9FAFB',
  padding: 2,
  borderRadius: 2,
}}>

// ✅ RIGHT - Clean and simple
<Box sx={{ padding: 2 }}>
```

### 3. **SIMPLE LAYOUTS**
❌ No fancy containers, wrappers, or nested boxes
✅ Direct, straightforward structure

```jsx
// ❌ WRONG - Over-designed
<Paper elevation={3}>
  <Box sx={{ background: 'gradient...', p: 4 }}>
    <Card sx={{ m: 3, boxShadow: '...' }}>
      <CardContent>
        Content
      </CardContent>
    </Card>
  </Box>
</Paper>

// ✅ RIGHT - Simple
<Card>
  <CardContent>
    Content
  </CardContent>
</Card>
```

### 4. **USE THEME COLORS**
❌ No hardcoded colors
✅ Always use theme palette

```jsx
// ❌ WRONG
sx={{ color: '#667eea' }}

// ✅ RIGHT
sx={{ color: theme.palette.primary.main }}
```

### 5. **LET MATERIAL-UI DO ITS JOB**
❌ Don't override default styles unnecessarily
✅ Use Material-UI defaults

```jsx
// ❌ WRONG - Too many custom styles
<Button 
  variant="contained" 
  color="primary"
  sx={{ 
    px: 4, 
    py: 1.5, 
    borderRadius: 2,
    fontSize: '1rem',
    fontWeight: 600,
    boxShadow: '0 4px 15px rgba(102,126,234,0.4)',
  }}
>

// ✅ RIGHT - Let theme handle it
<Button variant="contained" color="primary">
  Click Me
</Button>
```

## Component Guidelines

### Buttons
```jsx
// Simple - just use color prop
<Button variant="contained" color="primary">Primary</Button>
<Button variant="outlined" color="primary">Secondary</Button>
<Button variant="text">Text Button</Button>
```

### Cards
```jsx
// Simple card - minimal styling
<Card>
  <CardContent>
    <Typography variant="h6">Title</Typography>
    <Typography variant="body2">Content</Typography>
  </CardContent>
</Card>
```

### Headers
```jsx
// Clean header - no backgrounds
<Box sx={{ mb: 3 }}>
  <Typography variant="h4">Page Title</Typography>
  <Typography variant="body2" color="text.secondary">
    Description
  </Typography>
</Box>
```

### Avatars
```jsx
// Simple avatar - solid color
<Avatar sx={{ backgroundColor: theme.palette.primary.main }}>
  JD
</Avatar>
```

### Drawers
```jsx
// Simple drawer header - no gradient
<Box
  sx={{
    p: 2,
    borderBottom: 1,
    borderColor: 'divider',
  }}
>
  <Typography variant="h6">Title</Typography>
</Box>
```

## What NOT to Do

### ❌ Don't Add Unnecessary Styling
```jsx
// Too much!
<Box
  sx={{
    p: 4,
    background: 'linear-gradient(...)',
    borderRadius: 3,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
  }}
>
```

### ❌ Don't Use Icon Backgrounds
```jsx
// Over-designed
<Box
  sx={{
    width: 48,
    height: 48,
    borderRadius: 2,
    background: '#667eea15',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}
>
  <PersonIcon />
</Box>

// ✅ Simple
<PersonIcon color="primary" />
```

### ❌ Don't Override Theme Components
```jsx
// Wrong - custom styling
sx={{
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 600,
}}

// Right - let theme handle it
// (theme already sets these)
```

## Approved Patterns

### Profile Page
```jsx
<Container maxWidth="lg">
  <Card>
    <CardContent>
      <Typography variant="h4">My Profile</Typography>
      <Avatar>{initials}</Avatar>
      <Typography variant="h6">{name}</Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="caption" color="text.secondary">
            Label
          </Typography>
          <Typography variant="body1">{value}</Typography>
        </Grid>
      </Grid>
      
      <Button variant="contained" color="primary">Edit</Button>
    </CardContent>
  </Card>
</Container>
```

### Form Drawer
```jsx
<Drawer open={open} onClose={onClose}>
  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
    <Typography variant="h6">Form Title</Typography>
  </Box>
  
  <Box sx={{ p: 3 }}>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField label="Field" fullWidth />
      </Grid>
    </Grid>
    
    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
      <Button variant="outlined" onClick={onClose}>Cancel</Button>
      <Button variant="contained" color="primary">Save</Button>
    </Box>
  </Box>
</Drawer>
```

## Color Usage

- **Primary (Yellow)**: Buttons, active states, highlights
- **Secondary (Navy)**: Headers, navigation (if needed)
- **Text**: Use `color="text.secondary"` for labels
- **Dividers**: Use `borderColor: 'divider'` 

## Summary

**Keep It Simple!**
1. No gradients
2. No unnecessary backgrounds
3. Use theme colors
4. Let Material-UI defaults work
5. Minimal custom styling
6. Clean, professional look

---

**Remember: Less is More!**

