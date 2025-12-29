import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { leadAPI } from '../../api/api';

export const createLead = createAsyncThunk(
  'leads/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await leadAPI.createLead(data);
      return response.data.lead;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create lead');
    }
  }
);

export const getAllLeads = createAsyncThunk(
  'leads/getAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await leadAPI.getAllLeads(
        params.page || 1,
        params.limit || 20,
        params.filters || {}
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leads');
    }
  }
);

export const getLeadById = createAsyncThunk(
  'leads/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await leadAPI.getLeadById(id);
      return response.data.lead;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lead');
    }
  }
);

export const updateLead = createAsyncThunk(
  'leads/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await leadAPI.updateLead(id, data);
      return response.data.lead;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update lead');
    }
  }
);

export const deleteLead = createAsyncThunk(
  'leads/delete',
  async (id, { rejectWithValue }) => {
    try {
      await leadAPI.deleteLead(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete lead');
    }
  }
);

export const assignLead = createAsyncThunk(
  'leads/assign',
  async ({ id, assignedTo }, { rejectWithValue }) => {
    try {
      const response = await leadAPI.assignLead(id, { assignedTo });
      return response.data.lead;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign lead');
    }
  }
);

export const getLeadStats = createAsyncThunk(
  'leads/getStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await leadAPI.getLeadStats();
      return response.data.stats;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

export const bulkCreateLeads = createAsyncThunk(
  'leads/bulkCreate',
  async (leads, { rejectWithValue }) => {
    try {
      const response = await leadAPI.bulkCreateLeads({ leads });
      return response.data.leads;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create leads');
    }
  }
);

const initialState = {
  leads: [],
  selectedLead: null,
  stats: null,
  loading: false,
  error: null,
  success: false,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },
};

const leadSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // Create Lead
    builder
      .addCase(createLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLead.fulfilled, (state, action) => {
        state.loading = false;
        state.leads.unshift(action.payload);
        state.success = true;
      })
      .addCase(createLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get All Leads
    builder
      .addCase(getAllLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload.leads;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit || 20,
          total: action.payload.total,
          pages: action.payload.pages,
        };
      })
      .addCase(getAllLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Lead By ID
    builder
      .addCase(getLeadById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLeadById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedLead = action.payload;
      })
      .addCase(getLeadById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Lead
    builder
      .addCase(updateLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.leads.findIndex((lead) => lead._id === action.payload._id);
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
        state.selectedLead = action.payload;
        state.success = true;
      })
      .addCase(updateLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Lead
    builder
      .addCase(deleteLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = state.leads.filter((lead) => lead._id !== action.payload);
        state.success = true;
      })
      .addCase(deleteLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Assign Lead
    builder
      .addCase(assignLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignLead.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.leads.findIndex((lead) => lead._id === action.payload._id);
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
        state.success = true;
      })
      .addCase(assignLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Lead Stats
    builder
      .addCase(getLeadStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLeadStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(getLeadStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Bulk Create Leads
    builder
      .addCase(bulkCreateLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkCreateLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = [...action.payload, ...state.leads];
        state.success = true;
      })
      .addCase(bulkCreateLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess } = leadSlice.actions;
export default leadSlice.reducer;
