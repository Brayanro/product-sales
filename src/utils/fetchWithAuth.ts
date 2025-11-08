import { AuthService } from '../services/authService';

export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = AuthService.getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    const tokenExpired = response.headers.get('Token-Expired');
    
    if (tokenExpired === 'true') {
      try {
        await AuthService.refreshToken();
        
        const newToken = AuthService.getToken();
        if (newToken) {
          headers['Authorization'] = `Bearer ${newToken}`;
          return fetch(url, { ...options, headers });
        }
      } catch {
        AuthService.logout();
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }
    }
  }

  return response;
};
