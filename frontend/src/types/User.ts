// User type - TypeScript interface for authentication
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  donation_points: number;
  volunteer_points: number;
  created_at: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  name: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
