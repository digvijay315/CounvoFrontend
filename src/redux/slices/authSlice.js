import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';
import Swal from 'sweetalert2';

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  userType: null,
};

// Load user from localStorage on app load
const loadUserFromStorage = () => {
  try {
    const userDetails = localStorage.getItem('userDetails');
    const lawyerDetails = localStorage.getItem('lawyerDetails');
    const adminDetails = localStorage.getItem('adminDetails');
    const token = localStorage.getItem('authToken');

    if (userDetails && token) {
      const parsed = JSON.parse(userDetails);
      return {
        user: parsed.user,
        token,
        isAuthenticated: true,
        userType: 'client',
      };
    } else if (lawyerDetails && token) {
      const parsed = JSON.parse(lawyerDetails);
      return {
        user: parsed.lawyer,
        token,
        isAuthenticated: true,
        userType: 'lawyer',
      };
    } else if (adminDetails && token) {
      const parsed = JSON.parse(adminDetails);
      return {
        user: parsed.user,
        token,
        isAuthenticated: true,
        userType: 'admin',
      };
    }
  } catch (error) {
    console.error('Error loading user from storage:', error);
  }
  return {};
};

// Load initial state from localStorage
const storedUser = loadUserFromStorage();
const preloadedState = {
  ...initialState,
  ...storedUser,
};

// Async Thunks

// Login Thunk
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v2/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });

      if (response.data.success) {
        const { token, user } = response.data;

        // Store in localStorage
        localStorage.setItem('userDetails', JSON.stringify({ user, token }));
        localStorage.setItem('authToken', token);

        return {
          user,
          token,
          userType: 'client',
        };
      }
    } catch (error) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Login failed. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

// Register Thunk
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v2/auth/register', {
        fullName: userData.fullName,
        email: userData.email,
        mobile: userData.mobile,
        password: userData.password,
        userType: userData.userType,
      });

      if (response.data.success) {
        return {
          message: 'Registration successful',
          email: userData.email,
        };
      }
    } catch (error) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Registration failed. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

// Logout Thunk
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Clear localStorage
      localStorage.removeItem('userDetails');
      localStorage.removeItem('lawyerDetails');
      localStorage.removeItem('adminDetails');
      localStorage.removeItem('authToken');
      
      return true;
    } catch (error) {
      return rejectWithValue('Logout failed');
    }
  }
);

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: preloadedState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.userType = action.payload.userType;
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.userType = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.userType = action.payload.userType;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.userType = null;
        state.isLoading = false;
        state.error = null;
      });
  },
});

export const { clearError, setUser, clearUser } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.error;
export const selectUserType = (state) => state.auth.userType;

export default authSlice.reducer;

