export interface Admin {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface AdminSession {
  id: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  admin?: AdminSession;
}
