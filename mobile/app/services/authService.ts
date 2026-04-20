import { apiRequest } from '../api/client';
import { API_ROUTES } from '../api/routes';
import { saveAuthData } from '../storage/authStorage';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  phone: string;
  name: string;
}

export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  const response = await apiRequest<LoginResponse>({
    method: 'POST',
    endpoint: API_ROUTES.auth.login,
    body: payload,
  });

  await saveAuthData(response.token, {
    email: response.email,
    phone: response.phone,
    name: response.name,
  });

  return response;
}
