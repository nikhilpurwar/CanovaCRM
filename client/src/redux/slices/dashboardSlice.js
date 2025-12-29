import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardAPI } from '../../api/api';

export const getDashboardStats = createAsyncThunk(
  'dashboard/getStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.getDashboardStats();
      return response.data.stats;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

export const getActivities = createAsyncThunk(
  'dashboard/getActivities',
  async ({ page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.getActivities(page, limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch activities');
    }
  }
);

export const getRecentActivities = createAsyncThunk(
  'dashboard/getRecentActivities',
  async (limit = 10, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.getRecentActivities(limit);
      return response.data.activities;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch activities');
    }
  }
);

export const getEmployeePerformance = createAsyncThunk(
  'dashboard/getPerformance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.getEmployeePerformance();
      return response.data.performance;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch performance');
    }
  }
);

const initialState = {
  stats: {
    unassignedLeads: 0,
    assignedThisWeek: 0,
    activeSalespeople: 0,
    conversionRate: 0,
    totalLeads: 0,
    totalClosedLeads: 0,
    salesData: [],
  },
  activities: [],
  performance: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get Dashboard Stats
    builder
      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Activities
    builder
      .addCase(getActivities.pending, (state) => {
        state.loading = true;
      })
      .addCase(getActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload.activities;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit || 20,
          total: action.payload.total,
          pages: action.payload.pages,
        };
      })
      .addCase(getActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Recent Activities
    builder
      .addCase(getRecentActivities.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRecentActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(getRecentActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Employee Performance
    builder
      .addCase(getEmployeePerformance.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEmployeePerformance.fulfilled, (state, action) => {
        state.loading = false;
        state.performance = action.payload;
      })
      .addCase(getEmployeePerformance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
