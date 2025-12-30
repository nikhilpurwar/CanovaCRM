import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import employeeReducer from './slices/employeeSlice';
import leadReducer from './slices/leadSlice';
import dashboardReducer from './slices/dashboardSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
    leads: leadReducer,
    dashboard: dashboardReducer,
  },
});

export default store;
