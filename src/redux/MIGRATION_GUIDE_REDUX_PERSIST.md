# Redux Persist Migration Guide

## Overview

We've migrated from manual localStorage handling to **redux-persist** for automatic state persistence. This provides better performance, automatic syncing, and cleaner code.

## What Changed

### ✅ Before (Manual localStorage)
```javascript
// In components
const userData = JSON.parse(localStorage.getItem('userDetails'));
const userId = userData?.user?._id;

// On logout
localStorage.removeItem('userDetails');
localStorage.removeItem('authToken');
```

### ✅ After (Redux Persist + useAuth hook)
```javascript
// In components
import useAuth from '../hooks/useAuth';

const { user, userId, userData, isAuthenticated } = useAuth();
// userData object matches old localStorage structure for backward compatibility
```

## Benefits

1. **Automatic Persistence**: State is automatically saved and restored
2. **Type Safety**: No more JSON parsing errors
3. **Performance**: Optimized updates and hydration
4. **Cleaner Code**: No manual localStorage calls
5. **Centralized**: Single source of truth (Redux store)

## Migration Steps

### Step 1: Install redux-persist (if not installed)

```bash
npm install redux-persist
# or
yarn add redux-persist
```

### Step 2: Replace localStorage Access

#### ❌ OLD WAY - Direct localStorage
```javascript
const userData = JSON.parse(localStorage.getItem('userDetails'));
const userId = userData?.user?._id;
const userRole = userData?.user?.role;
```

#### ✅ NEW WAY - useAuth Hook
```javascript
import useAuth from '../hooks/useAuth';

const { user, userId, userRole, userData } = useAuth();
// userData provides backward compatibility with old structure
```

### Step 3: Update Logout Functions

#### ❌ OLD WAY
```javascript
const handleLogout = () => {
  localStorage.removeItem('userDetails');
  localStorage.removeItem('authToken');
  navigate('/login');
};
```

#### ✅ NEW WAY
```javascript
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const dispatch = useDispatch();

const handleLogout = async () => {
  await dispatch(logout());
  navigate('/login');
};
```

### Step 4: Update Auth Guards

#### ❌ OLD WAY
```javascript
// authguard.js
const isAuthenticated = !!localStorage.getItem('userDetails');
```

#### ✅ NEW WAY
```javascript
// authguard.js
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../redux/slices/authSlice';

const isAuthenticated = useSelector(selectIsAuthenticated);
```

## Component-by-Component Migration

### Files That Need Updates

Based on code analysis, these files need migration:

1. ✅ **Already Updated:**
   - `redux/store.js`
   - `redux/slices/authSlice.js`
   - `App.js`
   - `hooks/useAuth.jsx`

2. ⚠️ **Need Migration:**
   - `components/Layout/NavigationSidebar.jsx`
   - `components/Layout/NavigationHeader.jsx`
   - `components/Client/ClientProfile.jsx`
   - `components/Client/FindLawyer.jsx`
   - `components/Client/ClientChathistory.jsx`
   - `components/dashboard/DashboardContent.jsx`
   - `components/Client/Payment.js`
   - `components/home.js`
   - `components/Layout/header.js`
   - `components/clientsidebar.js`
   - `components/authguard.js`
   - `components/login.js` (to be deprecated)

### Example: NavigationSidebar.jsx

#### Before
```javascript
const userData = useSelector((state) => state.auth.userData);
const userFullName = userData?.user?.fullName || "User";

const handleLogout = () => {
  localStorage.removeItem("userDetails");
  navigate("/login");
};
```

#### After
```javascript
import useAuth from '../../hooks/useAuth';
import { logout } from '../../redux/slices/authSlice';

const { userFullName, dispatch } = useAuth();

const handleLogout = async () => {
  await dispatch(logout());
  navigate("/login");
};
```

### Example: ClientProfile.jsx

#### Before
```javascript
const userData = JSON.parse(localStorage.getItem("userDetails"));
const userId = userData?.user?._id;
```

#### After
```javascript
import useAuth from '../../hooks/useAuth';

const { user, userId } = useAuth();
// Or for backward compatibility:
const { userData } = useAuth();
const userId = userData?.user?._id;
```

### Example: authguard.js

#### Before
```javascript
const isAuthenticated = !!localStorage.getItem('userDetails');
if (!isAuthenticated) {
  return <Navigate to="/login" />;
}
```

#### After
```javascript
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../redux/slices/authSlice';

const isAuthenticated = useSelector(selectIsAuthenticated);
if (!isAuthenticated) {
  return <Navigate to="/login" />;
}
```

## useAuth Hook API

The updated `useAuth` hook provides:

```javascript
const {
  // Redux dispatch
  dispatch,
  
  // Auth state
  isAuthenticated,    // boolean
  isLoading,          // boolean
  error,              // string | null
  
  // User data
  user,               // user object from Redux
  userId,             // user._id
  userRole,           // user.role
  userFullName,       // user.fullName
  userEmail,          // user.email
  userMobile,         // user.mobile
  token,              // auth token
  
  // Backward compatibility
  getUserData,        // function that returns { user, token }
  userData,           // { user, token } object
} = useAuth();
```

## Common Patterns

### Pattern 1: Get User ID
```javascript
// Old
const userData = JSON.parse(localStorage.getItem("userDetails"));
const userId = userData?.user?._id;

// New
const { userId } = useAuth();
```

### Pattern 2: Get User Role
```javascript
// Old
const userData = JSON.parse(localStorage.getItem("userDetails"));
const userRole = userData?.user?.role;

// New
const { userRole } = useAuth();
```

### Pattern 3: Check Authentication
```javascript
// Old
const isAuthenticated = !!localStorage.getItem('userDetails');

// New
const { isAuthenticated } = useAuth();
```

### Pattern 4: Logout
```javascript
// Old
localStorage.removeItem('userDetails');
localStorage.removeItem('authToken');

// New
import { logout } from '../redux/slices/authSlice';
const { dispatch } = useAuth();
await dispatch(logout());
```

### Pattern 5: Get Full User Data (Backward Compatible)
```javascript
// Old
const userData = JSON.parse(localStorage.getItem("userDetails"));

// New (exact same structure)
const { userData } = useAuth();
// userData = { user: {...}, token: "..." }
```

## Testing

After migration, test these scenarios:

1. ✅ **Login Flow**
   - Login successfully
   - Verify user data is accessible
   - Refresh page - state should persist

2. ✅ **Logout Flow**
   - Logout successfully
   - Verify state is cleared
   - Verify redirect to login

3. ✅ **Page Refresh**
   - Login
   - Refresh page
   - Verify user remains logged in
   - Verify all user data is available

4. ✅ **Multiple Tabs**
   - Login in one tab
   - Open another tab
   - Verify user is logged in both tabs

## Troubleshooting

### Issue: State not persisting after refresh
**Solution:** Ensure `PersistGate` is wrapping your app in `App.js`

### Issue: "Cannot read property 'user' of null"
**Solution:** Use optional chaining or check `isAuthenticated` first
```javascript
const { isAuthenticated, user } = useAuth();
if (isAuthenticated && user) {
  // Safe to use user
}
```

### Issue: Old localStorage data conflicts
**Solution:** Clear localStorage once after migration
```javascript
// Run once after deployment
localStorage.removeItem('userDetails');
localStorage.removeItem('authToken');
// Then reload - redux-persist will take over
```

## Redux DevTools

You can inspect the persisted state in Redux DevTools:

```javascript
// State structure
{
  auth: {
    user: { _id, fullName, email, role, ... },
    token: "jwt_token",
    isAuthenticated: true,
    isLoading: false,
    error: null,
    userRole: "client"
  },
  _persist: {
    version: -1,
    rehydrated: true
  }
}
```

## Performance Notes

- redux-persist uses debouncing for writes (doesn't write on every state change)
- Reads are instant (from memory after initial hydration)
- No more JSON.parse() on every component render
- Automatic cleanup on logout

## Best Practices

1. ✅ **Always use `useAuth` hook** instead of direct Redux selectors
2. ✅ **Never access localStorage directly** for auth data
3. ✅ **Use optional chaining** when accessing nested user properties
4. ✅ **Check `isAuthenticated`** before using user data
5. ✅ **Use async/await** with logout dispatch

## Backward Compatibility

The `useAuth` hook provides `userData` object that matches the old localStorage structure:

```javascript
// This pattern still works
const { userData } = useAuth();
const userId = userData?.user?._id;
const userRole = userData?.user?.role;

// But this is cleaner
const { userId, userRole } = useAuth();
```

## Next Steps

1. Update all components to use `useAuth` hook
2. Remove all direct localStorage access for auth data
3. Test thoroughly
4. Remove old `login.js` component (use new Auth forms)
5. Update auth guards to use Redux state

---

**Questions?** Check the Redux Persist documentation: https://github.com/rt2zz/redux-persist

**Updated:** December 2025

