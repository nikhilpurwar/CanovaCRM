import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import leadsReducer from './leadsSlice';
import attendanceReducer from './attendanceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leads: leadsReducer,
    attendance: attendanceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
