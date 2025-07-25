export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Dock {
  id: number;
  name: string;
  location_lat: number;
  location_lng: number;
  capacity: number;
  status: 'active' | 'maintenance' | 'offline';
  created_at: string;
  updated_at: string;
}

export interface DockWithBikes extends Dock {
  bikes: Bike[];
  availableBikes: number;
  totalBikes: number;
}

export interface Bike {
  id: number;
  dock_id: number;
  battery_level: number;
  status: 'available' | 'rented' | 'maintenance' | 'charging';
  charging_status: 'not_charging' | 'charging' | 'fully_charged';
  last_maintenance?: string;
  created_at: string;
  updated_at: string;
}

export interface BikeWithDock extends Bike {
  dock?: Dock;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  phone?: string;
}

export interface CreateDockRequest {
  name: string;
  location_lat: number;
  location_lng: number;
  capacity: number;
  status?: 'active' | 'maintenance' | 'offline';
}

export interface CreateBikeRequest {
  dock_id: number;
  battery_level?: number;
  status?: 'available' | 'rented' | 'maintenance' | 'charging';
  charging_status?: 'not_charging' | 'charging' | 'fully_charged';
}

export interface UpdateBikeStatusRequest {
  status: 'available' | 'rented' | 'maintenance' | 'charging';
}

export interface UpdateBikeBatteryRequest {
  battery_level: number;
}

export interface UpdateBikeChargingRequest {
  charging_status: 'not_charging' | 'charging' | 'fully_charged';
}