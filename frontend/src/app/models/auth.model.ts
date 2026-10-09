export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'TEACHER';
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  type: string;
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'TEACHER';
}
