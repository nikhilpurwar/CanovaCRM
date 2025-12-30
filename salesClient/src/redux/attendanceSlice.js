import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { attendanceAPI } from '../api/api';

// Async thunks
export const checkIn = createAsyncThunk(
  'attendance/checkIn',
  async (_, { rejectWithValue }) => {
    try {
      const response = await attendanceAPI.checkIn();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Check-in failed');
    }
  }
);

export const checkOut = createAsyncThunk(
  'attendance/checkOut',
  async (_, { rejectWithValue }) => {
    try {
      const response = await attendanceAPI.checkOut();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Check-out failed');
    }
  }
);

export const getTodayAttendance = createAsyncThunk(
  'attendance/getToday',
  async (_, { rejectWithValue }) => {
    try {
      const response = await attendanceAPI.getMyAttendance(new Date().toISOString().split('T')[0]);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendance');
    }
  }
);

const initialState = {
  attendance: null,
  checkInTime: null,
  checkOutTime: null,
  totalWorkHours: 0,
  totalBreakHours: 0,
  isCheckedIn: false,
  loading: false,
  error: null,
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAttendance: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Check In
    builder
      .addCase(checkIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkIn.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload.attendance;
        state.checkInTime = action.payload.attendance?.checkIn;
        state.isCheckedIn = !action.payload.attendance?.checkOut;
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Check Out
    builder
      .addCase(checkOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload.attendance;
        state.checkOutTime = action.payload.attendance?.checkOut;
        state.totalWorkHours = action.payload.attendance?.totalWorkHours || 0;
        state.totalBreakHours = action.payload.attendance?.totalBreakHours || 0;
        state.isCheckedIn = false;
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Today's Attendance
    builder
      .addCase(getTodayAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTodayAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload;
        state.checkInTime = action.payload?.checkIn;
        state.checkOutTime = action.payload?.checkOut;
        state.isCheckedIn = !!action.payload?.checkIn && !action.payload?.checkOut;
        state.totalWorkHours = action.payload?.totalWorkHours || 0;
        state.totalBreakHours = action.payload?.totalBreakHours || 0;
      })
      .addCase(getTodayAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;
