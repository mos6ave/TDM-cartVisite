import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  withCredentials: false,
});

export const getEmployees   = (params) => API.get('/employees/', { params });
export const getEmployee    = (id) => API.get(`/employees/${id}/`);
export const deleteEmployee = (id) => API.delete(`/employees/${id}/`);

export const createEmployee = (data) =>
  API.post('/employees/', data, { headers: { 'Content-Type': 'multipart/form-data' } });

export const updateEmployee = (id, data) =>
  API.patch(`/employees/${id}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } });

export const getBusinessCardUrl = (id) => `/api/employees/${id}/business-card/`;

export const getDepartments   = () => API.get('/departments/');
export const createDepartment = (data) => API.post('/departments/', data);
