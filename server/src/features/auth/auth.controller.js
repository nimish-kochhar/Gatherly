import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import * as authService from './auth.service.js';
import config from '../../config/index.js';
import { catchAsync } from '../../utils/catchAsync.js';

/**
 * Shared cookie options for the refresh token.
 * sameSite 'lax' is required because the Google OAuth callback is a
 * cross-site GET redirect from accounts.google.com — 'strict' would
 * drop the cookie set during that redirect.
 */
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ─── Email / Password ────────────────────────────────────────────────

export const register = catchAsync(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.register(req.body);
  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
  res.status(201).json({ user, accessToken });
});

export const login = catchAsync(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);
  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
  res.json({ user, accessToken });
});

export const refresh = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken;
  const { accessToken } = await authService.refreshAccessToken(token);
  res.json({ accessToken });
});

export const logout = catchAsync(async (_req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
});

export const me = catchAsync(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.userId);
  res.json({ user });
});

// ─── Google OAuth ────────────────────────────────────────────────────

const oAuth2Client = new OAuth2Client(
  config.google.clientId,
  config.google.clientSecret,
  config.google.redirectUri,
);

/**
 * GET /api/auth/google
 *
 * Generate a cryptographically random state token, store it in a
 * short-lived HttpOnly cookie (the "oauth_state" cookie), and redirect
 * the user's browser to Google's authorization endpoint.
 */
export const googleRedirect = catchAsync(async (req, res) => {
  if (!config.google.clientId) {
    return res.redirect(`${config.clientUrl}/?error=google_auth_failed`);
  }

  const state = crypto.randomBytes(32).toString('hex');

  // Store state in a short-lived HttpOnly cookie for CSRF validation
  res.cookie('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 10 * 60 * 1000, // 10 minutes
    path: '/api/auth/google', // scoped to the OAuth callback path
  });

  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['openid', 'email', 'profile'],
    state,
    prompt: 'select_account',
  });

  res.redirect(authorizeUrl);
});

/**
 * GET /api/auth/google/callback?code=...&state=...
 *
 * 1. Validate the state parameter against the stored cookie.
 * 2. Exchange the authorization code for tokens.
 * 3. Verify the id_token using google-auth-library (signature, aud, iss, exp).
 * 4. Extract the verified payload (sub, email, email_verified, name).
 * 5. Find/create/link the Gatherly user via authService.googleLogin().
 * 6. Issue the standard Gatherly refresh cookie and redirect to /home.
 */
export const googleCallback = catchAsync(async (req, res) => {
  const { code, state, error: oauthError } = req.query;

  // Google denied consent or other error from Google
  if (oauthError) {
    return res.redirect(`${config.clientUrl}/?error=google_auth_denied`);
  }

  // ── CSRF state validation ──────────────────────────────────────────
  const storedState = req.cookies.oauth_state;

  // Clear the state cookie regardless of outcome
  res.clearCookie('oauth_state', { path: '/api/auth/google' });

  if (!state || !storedState || state !== storedState) {
    return res.redirect(`${config.clientUrl}/?error=google_auth_failed`);
  }

  if (!code) {
    return res.redirect(`${config.clientUrl}/?error=google_auth_failed`);
  }

  // ── Exchange authorization code for tokens ─────────────────────────
  let tokens;
  try {
    const tokenResponse = await oAuth2Client.getToken(code);
    tokens = tokenResponse.tokens;
  } catch {
    return res.redirect(`${config.clientUrl}/?error=google_auth_failed`);
  }

  if (!tokens.id_token) {
    return res.redirect(`${config.clientUrl}/?error=google_auth_failed`);
  }

  // ── Verify the id_token (signature, aud, iss, exp) ─────────────────
  let payload;
  try {
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: config.google.clientId,
    });
    payload = ticket.getPayload();
  } catch {
    return res.redirect(`${config.clientUrl}/?error=google_auth_failed`);
  }

  // Require verified email from Google
  if (!payload.email_verified) {
    return res.redirect(`${config.clientUrl}/?error=google_email_not_verified`);
  }

  const { sub: googleId, email, name } = payload;

  // ── Find/create/link user and issue Gatherly tokens ────────────────
  const result = await authService.googleLogin({ googleId, email, name });

  res.cookie('refreshToken', result.refreshToken, REFRESH_COOKIE_OPTIONS);
  res.redirect(`${config.clientUrl}/home`);
});
