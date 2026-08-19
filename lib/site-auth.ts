/**
 * Member sign-in for the public directory.
 *
 * The directory is a separate app from the player portal and on its own origin,
 * so a member signed in there is not signed in here — this drives the same
 * server endpoints (captcha → OTP → verify) and keeps its own token.
 *
 * Deliberately minimal: the directory needs an access token only to prove a
 * reviewer is a member. There is no refresh loop and no session restore, so an
 * expired token surfaces as a 401 on submit and the member signs in again,
 * which is the right trade for a form used once in a while.
 */

const TOKEN_KEY = 'BrisaDirectoryToken';
const EMAIL_KEY = 'BrisaDirectoryEmail';

export type AuthResult<T> = { ok: true; data: T } | { ok: false; message: string };

export type Captcha = { captchaId: string; question: string };

/** Reads the stored token. Returns '' during SSR, where there is no storage. */
export function storedToken(): string {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(TOKEN_KEY) ?? '';
}

export function storedEmail(): string {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(EMAIL_KEY) ?? '';
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(EMAIL_KEY);
}

function rememberSession(token: string, email: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(EMAIL_KEY, email);
}

/** Unwraps the API's {success, data} envelope, or the message when it failed. */
async function post<T>(path: string, body: unknown, fallback: string): Promise<AuthResult<T>> {
  try {
    const response = await fetch(path, {
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST'
    });
    const payload = (await response.json().catch(() => null)) as
      | { success?: boolean; data?: T; message?: string; errors?: string[] }
      | null;

    if (!response.ok || !payload?.success) {
      const firstError = Array.isArray(payload?.errors) ? payload?.errors[0] : undefined;
      return { message: firstError || payload?.message || fallback, ok: false };
    }
    return { data: payload.data as T, ok: true };
  } catch {
    return { message: 'We could not reach the server. Please try again.', ok: false };
  }
}

/** Step 1 — a sum the member answers, so OTP email cannot be triggered in bulk. */
export function requestCaptcha() {
  return post<Captcha>('/api/auth/send-captcha', { role: 'member' }, 'Unable to load the captcha.');
}

/** Step 2 — emails the six-digit code. Wrong captcha answers fail here. */
export function requestOtp(email: string, captchaId: string, captchaAnswer: string) {
  return post<unknown>(
    '/api/auth/send-otp',
    {
      captchaAnswer: Number(captchaAnswer),
      captchaId,
      email: email.trim().toLowerCase(),
      role: 'member'
    },
    'Unable to send the code. Check the email and captcha answer.'
  );
}

/**
 * Step 3 — exchanges the code for an access token.
 *
 * `role: 'member'` matters: it is what stops an admin account being signed in
 * through the public directory.
 */
export async function verifyOtp(email: string, otp: string): Promise<AuthResult<string>> {
  const normalizedEmail = email.trim().toLowerCase();
  const result = await post<{ accessToken?: string }>(
    '/api/auth/verify-otp',
    { email: normalizedEmail, otp: otp.trim(), role: 'member' },
    'That code was not accepted. Please try again.'
  );

  if (!result.ok) return result;
  const token = result.data?.accessToken;
  if (!token) return { message: 'Sign-in failed. Please try again.', ok: false };

  rememberSession(token, normalizedEmail);
  return { data: token, ok: true };
}
