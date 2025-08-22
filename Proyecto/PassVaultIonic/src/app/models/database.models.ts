// Modelos de base de datos para PassVault

export interface User {
  id?: number;
  email: string;
  password_hash: string;
  pin_hash: string;
  name: string;
  registration_date: string;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface PasswordEntry {
  id?: number;
  user_id: number;
  site_name: string;
  site_url?: string;
  username: string;
  encrypted_password: string;
  notes?: string;
  category?: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id?: number;
  user_id: number;
  name: string;
  color: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface SecurityLog {
  id?: number;
  user_id: number;
  action: string;
  details: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface AppSettings {
  id?: number;
  user_id: number;
  setting_key: string;
  setting_value: string;
  created_at: string;
  updated_at: string;
}

// Interface para respuestas de la base de datos
export interface DatabaseResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Interface para consultas paginadas
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
