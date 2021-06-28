export interface LoginResponse {
  authenticationToken: string;
  refreshToken: string;
  expiresAt: string;
  userName: string;
  role: string;
  image: string;
}
