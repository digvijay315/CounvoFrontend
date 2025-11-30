# Redux Setup Documentation

## 📦 Redux Architecture Overview

This project uses **Redux Toolkit** for state management, providing a clean and efficient way to manage authentication state across the application.

## 🏗️ Structure

```
src/
├── redux/
│   ├── store.js                 # Redux store configuration
│   └── slices/
│       └── authSlice.js         # Authentication slice
├── components/
│   └── Auth/
│       ├── SignInForm.jsx       # Uses Redux for signin
│       └── SignUpForm.jsx       # Uses Redux for signup
└── App.js                       # Redux Provider wrapper
```

## 🔧 Installation

Redux Toolkit and React-Redux are already installed:

```bash
npm install @reduxjs/toolkit react-redux
```

## 📝 Store Configuration

### `src/redux/store.js`

```javascript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
```

**Key Features:**
- Single source of truth for auth state
- Automatic Redux DevTools integration
- Built-in middleware configuration

## 🔐 Auth Slice

### `src/redux/slices/authSlice.js`

#### State Structure

```javascript
{
  user: null,              // User object (client/lawyer/admin)
  token: null,             // JWT token
  isAuthenticated: false,  // Auth status
  isLoading: false,        // Loading state for async operations
  error: null,             // Error messages
  userType: null,          // 'client', 'lawyer', or 'admin'
}
```

#### Async Thunks

**1. Login Thunk**

```javascript
dispatch(login({ email, password }))
```

- **API Endpoint:** `POST /api/v2/auth/login`
- **Success:** Stores user data and token in Redux + localStorage
- **Error:** Returns error message for display

**2. Register Thunk**

```javascript
dispatch(register({ fullName, email, mobile, password, userType }))
```

- **API Endpoint:** `POST /api/v2/auth/register`
- **Success:** Returns success message
- **Error:** Returns error message for display

**3. Logout Thunk**

```javascript
dispatch(logout())
```

- Clears all user data from Redux and localStorage
- Resets authentication state

#### Reducers

**Synchronous Actions:**
- `clearError()` - Clear error messages
- `setUser()` - Manually set user data
- `clearUser()` - Clear user data

#### Selectors

```javascript
import { 
  selectAuth,
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectError,
  selectUserType 
} from './redux/slices/authSlice';

const auth = useSelector(selectAuth);              // Full auth state
const user = useSelector(selectUser);              // User object
const isAuthenticated = useSelector(selectIsAuthenticated);
const isLoading = useSelector(selectIsLoading);
const error = useSelector(selectError);
const userType = useSelector(selectUserType);
```

## 🎯 Usage in Components

### SignInForm Implementation

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError, selectIsLoading, selectError, selectIsAuthenticated } from '../../redux/slices/authSlice';

const SignInForm = () => {
  const dispatch = useDispatch();
  
  // Get state from Redux
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Clear errors on mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Handle successful login
  useEffect(() => {
    if (isAuthenticated) {
      Swal.fire({ /* success message */ });
      navigate('/ClientDashboard');
    }
  }, [isAuthenticated, navigate]);

  // Handle errors
  useEffect(() => {
    if (error) {
      Swal.fire({ /* error message */ });
    }
  }, [error]);

  const onSubmit = (data) => {
    dispatch(login({ email: data.email, password: data.password }));
  };
};
```

### SignUpForm Implementation

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { register as registerUser, clearError, selectIsLoading, selectError } from '../../redux/slices/authSlice';

const SignUpForm = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  const onSubmit = async (data) => {
    const resultAction = await dispatch(registerUser({
      fullName: data.fullName,
      email: data.email,
      mobile: data.mobile,
      password: data.password,
      userType: data.userType,
    }));

    if (registerUser.fulfilled.match(resultAction)) {
      // Registration successful
      navigate('/auth/signin');
    }
  };
};
```

## 🔄 Data Flow

### Login Flow

```
1. User submits form
   ↓
2. dispatch(login({ email, password }))
   ↓
3. Redux Thunk calls API: POST /api/v2/auth/login
   ↓
4a. Success:
    - Store user & token in Redux state
    - Store user & token in localStorage
    - Set isAuthenticated = true
    - Navigate to dashboard
    
4b. Error:
    - Set error message in Redux state
    - Display error via Swal
```

### Register Flow

```
1. User submits form
   ↓
2. dispatch(register({ userData }))
   ↓
3. Redux Thunk calls API: POST /api/v2/auth/register
   ↓
4a. Success:
    - Show success message
    - Navigate to signin page
    
4b. Error:
    - Set error message in Redux state
    - Display error via Swal
```

## 💾 Local Storage Persistence

Redux state is persisted to localStorage:

```javascript
// On successful login
localStorage.setItem('userDetails', JSON.stringify({ user, token }));
localStorage.setItem('authToken', token);

// On logout
localStorage.removeItem('userDetails');
localStorage.removeItem('lawyerDetails');
localStorage.removeItem('adminDetails');
localStorage.removeItem('authToken');
```

**State Rehydration:**
On app load, the auth slice automatically loads user data from localStorage:

```javascript
const loadUserFromStorage = () => {
  const userDetails = localStorage.getItem('userDetails');
  const token = localStorage.getItem('authToken');
  // ... restore state
};
```

## 🎨 Benefits of Redux

### ✅ Centralized State
- Single source of truth for authentication
- Easy to access user data from any component
- No prop drilling

### ✅ Predictable State Updates
- All state changes go through reducers
- Easy to track and debug
- Time-travel debugging with Redux DevTools

### ✅ Async Operations
- Built-in handling with createAsyncThunk
- Loading states managed automatically
- Error handling simplified

### ✅ Type Safety
- Full TypeScript support (if needed)
- Auto-generated action types
- Compile-time checks

### ✅ Performance
- Only re-renders components that use changed state
- Memoized selectors
- Optimized updates

## 🛠️ Redux DevTools

Install Redux DevTools browser extension:
- **Chrome:** [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools)
- **Firefox:** [Redux DevTools](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)

Features:
- Inspect current state
- View action history
- Time-travel debugging
- Export/import state

## 🧪 Testing with Redux

```javascript
import { Provider } from 'react-redux';
import { store } from './redux/store';

// Wrap component with Provider for testing
<Provider store={store}>
  <SignInForm />
</Provider>
```

## 🔐 Security Best Practices

1. **Token Storage:** JWT tokens stored in localStorage (consider httpOnly cookies for production)
2. **Error Messages:** Generic error messages to avoid information leakage
3. **State Clearing:** All sensitive data cleared on logout
4. **API Security:** Always use HTTPS in production

## 📊 State Management Patterns

### Loading States

```javascript
const isLoading = useSelector(selectIsLoading);

<button disabled={isLoading}>
  {isLoading ? 'Loading...' : 'Submit'}
</button>
```

### Error Handling

```javascript
const error = useSelector(selectError);

useEffect(() => {
  if (error) {
    // Display error to user
    Swal.fire({ icon: 'error', text: error });
  }
}, [error]);
```

### Authentication Check

```javascript
const isAuthenticated = useSelector(selectIsAuthenticated);

useEffect(() => {
  if (isAuthenticated) {
    navigate('/dashboard');
  }
}, [isAuthenticated]);
```

## 🔮 Future Enhancements

### Potential Additions:
1. **Refresh Token Logic:** Auto-refresh expired tokens
2. **User Profile Updates:** Add updateUser thunk
3. **Multi-device Support:** Track active sessions
4. **Persistent Login:** Remember me functionality
5. **Role-based Access:** Enhanced permission checks
6. **API Middleware:** Request/response interceptors
7. **Offline Support:** Queue actions when offline

## 📚 Additional Resources

- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [React-Redux Hooks](https://react-redux.js.org/api/hooks)
- [createAsyncThunk](https://redux-toolkit.js.org/api/createAsyncThunk)
- [Redux Best Practices](https://redux.js.org/style-guide/style-guide)

## 🎯 Quick Reference

### Import Redux Hooks
```javascript
import { useDispatch, useSelector } from 'react-redux';
```

### Dispatch Actions
```javascript
const dispatch = useDispatch();
dispatch(login({ email, password }));
dispatch(clearError());
dispatch(logout());
```

### Select State
```javascript
const user = useSelector(selectUser);
const isLoading = useSelector(selectIsLoading);
```

### Async Actions
```javascript
const result = await dispatch(asyncAction(data));
if (asyncAction.fulfilled.match(result)) {
  // Success
}
```

---

**Redux Setup:** ✅ Complete  
**Authentication:** ✅ Implemented  
**State Management:** ✅ Centralized  
**Ready for Production:** ✅ Yes


