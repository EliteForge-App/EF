import { apiFetch } from "./client"

export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
}

export interface AuthResponse {
  accessToken: string
  user: AuthUser
}

export function register(payload: {
  name: string
  email: string
  password: string
}): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function login(payload: {
  email: string
  password: string
}): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}
