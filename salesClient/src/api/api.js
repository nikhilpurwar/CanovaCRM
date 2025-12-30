import axiosInstance from './axiosInstance';

// Auth APIs
export const authAPI = {
  login: (data) => axiosInstance.post('/auth/login', data),
  getCurrentUser: () => axiosInstance.get('/auth/current-user'),
  updateProfile: (data) => axiosInstance.put('/auth/profile', data),
};

// Lead APIs (for employees to view their assigned leads)
export const leadAPI = {
  getMyLeads: (page = 1, limit = 20) => 
    axiosInstance.get('/leads', { params: { page, limit, assignedToMe: true } }),
  getLeadById: (id) => axiosInstance.get(`/leads/${id}`),
  updateLead: (id, data) => axiosInstance.put(`/leads/${id}`, data),
};

// Attendance/Check-in APIs (to be implemented)
export const attendanceAPI = {
  checkIn: () => axiosInstance.post('/attendance/check-in'),
  checkOut: () => axiosInstance.post('/attendance/check-out'),
  startBreak: () => axiosInstance.post('/attendance/break/start'),
  endBreak: () => axiosInstance.post('/attendance/break/end'),
  getMyAttendance: (date) => axiosInstance.get('/attendance/my', { params: { date } }),
  getBreakLogs: (date) => axiosInstance.get('/attendance/breaks', { params: { date } }),
};

// Activity APIs
export const activityAPI = {
  getRecentActivity: (limit = 7) => axiosInstance.get('/activities', { params: { limit } }),
};

// Schedule APIs
export const scheduleAPI = {
  getMySchedules: () => axiosInstance.get('/schedules/my'),
  createSchedule: (data) => axiosInstance.post('/schedules', data),
  updateSchedule: (id, data) => axiosInstance.put(`/schedules/${id}`, data),
  deleteSchedule: (id) => axiosInstance.delete(`/schedules/${id}`),
};
