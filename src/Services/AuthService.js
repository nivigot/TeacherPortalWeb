import { api } from './api';

const TOKEN_KEY = 'token';

function parseJwt(token) {
  try {
    const base64 = token.split('.')[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const json = JSON.parse(atob(base64));
    return json;
  } catch {
    return null;
  }
}

class AuthService {
  async login(username, password) {
    const { data } = await api.post('/auth/login', { username, password });

    const token = typeof data === 'string' ? data : data?.token;
    if (!token) throw new Error('Login did not return a token');

    localStorage.setItem(TOKEN_KEY, token);   
    return token;
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  }

  getCurrentUserToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  getClaims() {
    const t = this.getCurrentUserToken();
    return t ? parseJwt(t) : null;
  }

  getTeacherId() {
    const c = this.getClaims();
    if (!c) return null;
    return (
      c.teacherId ??
      c.tid ??
      c.nameid ??
      c.sub ??
      c['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ??
      null
    );
  }

  isAuthenticated() {
    const t = this.getCurrentUserToken();
    if (!t) return false;
    const c = parseJwt(t);
    if (!c?.exp) return true; 
    const now = Math.floor(Date.now() / 1000);
    return c.exp > now;
  }
}

const authService = new AuthService();
export default authService;
