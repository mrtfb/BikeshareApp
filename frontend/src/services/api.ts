import axios from 'axios';
import {
  User,
  Dock,
  DockWithBikes,
  Bike,
  BikeWithDock,
  CreateUserRequest,
  CreateDockRequest,
  CreateBikeRequest,
  UpdateBikeStatusRequest,
  UpdateBikeBatteryRequest,
  UpdateBikeChargingRequest
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API
export const userAPI = {
  getAll: (): Promise<User[]> => api.get('/users').then(res => res.data),
  getById: (id: number): Promise<User> => api.get(`/users/${id}`).then(res => res.data),
  create: (user: CreateUserRequest): Promise<User> => api.post('/users', user).then(res => res.data),
  update: (id: number, user: CreateUserRequest): Promise<User> => api.put(`/users/${id}`, user).then(res => res.data),
  delete: (id: number): Promise<void> => api.delete(`/users/${id}`).then(() => {}),
};

// Dock API
export const dockAPI = {
  getAll: (): Promise<Dock[]> => api.get('/docks').then(res => res.data),
  getById: (id: number): Promise<Dock> => api.get(`/docks/${id}`).then(res => res.data),
  getWithBikes: (id: number): Promise<DockWithBikes> => api.get(`/docks/${id}/bikes`).then(res => res.data),
  create: (dock: CreateDockRequest): Promise<Dock> => api.post('/docks', dock).then(res => res.data),
  update: (id: number, dock: CreateDockRequest): Promise<Dock> => api.put(`/docks/${id}`, dock).then(res => res.data),
  delete: (id: number): Promise<void> => api.delete(`/docks/${id}`).then(() => {}),
};

// Bike API
export const bikeAPI = {
  getAll: (): Promise<Bike[]> => api.get('/bikes').then(res => res.data),
  getById: (id: number): Promise<BikeWithDock> => api.get(`/bikes/${id}`).then(res => res.data),
  getByDock: (dockId: number): Promise<Bike[]> => api.get(`/bikes/dock/${dockId}`).then(res => res.data),
  create: (bike: CreateBikeRequest): Promise<Bike> => api.post('/bikes', bike).then(res => res.data),
  update: (id: number, bike: CreateBikeRequest): Promise<Bike> => api.put(`/bikes/${id}`, bike).then(res => res.data),
  updateStatus: (id: number, statusUpdate: UpdateBikeStatusRequest): Promise<Bike> => 
    api.patch(`/bikes/${id}/status`, statusUpdate).then(res => res.data),
  updateBattery: (id: number, batteryUpdate: UpdateBikeBatteryRequest): Promise<Bike> => 
    api.patch(`/bikes/${id}/battery`, batteryUpdate).then(res => res.data),
  updateCharging: (id: number, chargingUpdate: UpdateBikeChargingRequest): Promise<Bike> => 
    api.patch(`/bikes/${id}/charging`, chargingUpdate).then(res => res.data),
  delete: (id: number): Promise<void> => api.delete(`/bikes/${id}`).then(() => {}),
};

// Health check
export const healthAPI = {
  check: (): Promise<{ status: string; message: string; timestamp: string }> => 
    api.get('/health').then(res => res.data),
};

export default api;