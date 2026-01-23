const TOKEN_COOKIE = 'risala_token';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function getCookieToken(): string | null {
  if (!isBrowser()) return null;
  const parts = document.cookie.split(';').map(part => part.trim());
  for (const part of parts) {
    if (part.startsWith(`${TOKEN_COOKIE}=`)) {
      return decodeURIComponent(part.substring(TOKEN_COOKIE.length + 1));
    }
  }
  return null;
}

export function getToken(): string | null {
  return getCookieToken();
}

export function setToken(token: string) {
  if (!isBrowser()) return;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

export function clearToken() {
  if (!isBrowser()) return;
  document.cookie = `${TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function hasToken(): boolean {
  return !!getToken();
}
