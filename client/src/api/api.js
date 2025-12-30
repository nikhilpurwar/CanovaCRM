import axiosInstance from './axiosInstance';

// Auth APIs
export const authAPI = {
  register: (data) => axiosInstance.post('/auth/register', data),
  login: (data) => axiosInstance.post('/auth/login', data),
  getCurrentUser: () => axiosInstance.get('/auth/current-user'),
  updateProfile: (data) => axiosInstance.put('/auth/profile', data),
  getAllUsers: () => axiosInstance.get('/auth/all-users'),
  getUserById: (id) => axiosInstance.get(`/auth/user/${id}`),
};

// Employee APIs
export const employeeAPI = {
  createEmployee: (data) => axiosInstance.post('/employees', data),
  getAllEmployees: (page = 1, limit = 10, search = '') =>
    axiosInstance.get(`/employees?page=${page}&limit=${limit}&search=${search}`),
  getEmployeeById: (id) => axiosInstance.get(`/employees/${id}`),
  updateEmployee: (id, data) => axiosInstance.put(`/employees/${id}`, data),
  deleteEmployee: (id) => axiosInstance.delete(`/employees/${id}`),
  getEmployeeStats: () => axiosInstance.get('/employees/stats'),
};

// Lead APIs
export const leadAPI = {
  createLead: (data) => axiosInstance.post('/leads', data),
  getAllLeads: (page = 1, limit = 20, filters = {}) =>
    axiosInstance.get('/leads', { params: { page, limit, ...filters } }),
  getLeadById: (id) => axiosInstance.get(`/leads/${id}`),
  updateLead: (id, data) => axiosInstance.put(`/leads/${id}`, data),
  deleteLead: (id) => axiosInstance.delete(`/leads/${id}`),
  assignLead: (id, data) => axiosInstance.put(`/leads/${id}/assign`, data),
  getLeadStats: () => axiosInstance.get('/leads/stats'),
  bulkCreateLeads: (data) => axiosInstance.post('/leads/bulk-create', data),
};

// Dashboard APIs
export const dashboardAPI = {
  getDashboardStats: () => axiosInstance.get('/dashboard/stats'),
  getActivities: (page = 1, limit = 20) =>
    axiosInstance.get(`/dashboard/activities?page=${page}&limit=${limit}`),
  getRecentActivities: (limit = 10) =>
    axiosInstance.get(`/dashboard/activities/recent?limit=${limit}`),
  getEmployeePerformance: () => axiosInstance.get('/dashboard/performance'),
};

export default axiosInstance;
