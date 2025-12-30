import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { leadAPI } from '../api/api';

// Async thunks
export const fetchMyLeads = createAsyncThunk(
  'leads/fetchMyLeads',
  async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const response = await leadAPI.getMyLeads(page, limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leads');
    }
  }
);

export const fetchLeadById = createAsyncThunk(
  'leads/fetchLeadById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await leadAPI.getLeadById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lead');
    }
  }
);

export const updateLead = createAsyncThunk(
  'leads/updateLead',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await leadAPI.updateLead(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update lead');
    }
  }
);

const initialState = {
  leads: [],
  currentLead: null,
  totalLeads: 0,
  currentPage: 1,
  totalPages: 1,
  loading: false,
  error: null,
};

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentLead: (state) => {
      state.currentLead = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch my leads
    builder
      .addCase(fetchMyLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload.leads || [];
        state.totalLeads = action.payload.total || 0;
        state.currentPage = action.payload.page || 1;
        state.totalPages = action.payload.pages || 1;
      })
      .addCase(fetchMyLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch lead by ID
    builder
      .addCase(fetchLeadById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeadById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLead = action.payload;
      })
      .addCase(fetchLeadById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update lead
    builder
      .addCase(updateLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        state.loading = false;
        // Update in leads array
        const index = state.leads.findIndex(lead => lead._id === action.payload._id);
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
        // Update current lead if it's the same
        if (state.currentLead?._id === action.payload._id) {
          state.currentLead = action.payload;
        }
      })
      .addCase(updateLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentLead } = leadsSlice.actions;
export default leadsSlice.reducer;
