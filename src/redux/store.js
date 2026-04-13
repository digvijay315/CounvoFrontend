import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { combineReducers } from "redux";
import authReducer from "./slices/authSlice";

// Persist configuration for auth slice
const authPersistConfig = {
  key: "auth",
  storage,
  blacklist: ["isLoading", "error"],
};

// Combine reducers with nested persistence
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
});

// Root persist config (now minimal as logic moved to nested reducers)
const persistConfig = {
  key: "root",
  storage,
  whitelist: [], // Slices handle their own persistence
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
          "persist/FLUSH",
        ],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

export default store;

