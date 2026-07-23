import AuthService from './auth.service.js';
import ApiResponse from '../../shared/utils/ApiResponse.js';
import asyncHandler from '../../shared/utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  const { user, tokens } = await AuthService.register({ email, password, name });

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return ApiResponse.created(res, { user, accessToken: tokens.accessToken }, 'User registered successfully');
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, tokens } = await AuthService.login({ email, password });

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return ApiResponse.success(res, { user, accessToken: tokens.accessToken }, 'Login successful');
});

export const googleAuth = asyncHandler(async (req, res) => {
  const { idToken } = req.body;
  const { user, tokens } = await AuthService.googleAuth(idToken);

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return ApiResponse.success(res, { user, accessToken: tokens.accessToken }, 'Google authentication successful');
});

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  const { user, tokens } = await AuthService.refresh(token);

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return ApiResponse.success(res, { user, accessToken: tokens.accessToken }, 'Token refreshed successfully');
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('refreshToken');
  return ApiResponse.success(res, null, 'Logged out successfully');
});
