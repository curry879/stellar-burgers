import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';

import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
} from '../utils/burger-api';
import { deleteCookie, setCookie } from '../utils/cookie';

import type { TLoginData, TRegisterData } from '../utils/burger-api';
import type { TUser } from '../utils/types';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null,
};

const saveTokens = (data: { accessToken: string; refreshToken: string }): void => {
  setCookie('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
};

export const loginUser = createAsyncThunk('user/login', async (data: TLoginData) => {
  const response = await loginUserApi(data);
  saveTokens(response);
  return response.user;
});

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    saveTokens(response);
    return response.user;
  }
);

export const checkUserAuth = createAsyncThunk('user/checkAuth', async () => {
  if (!localStorage.getItem('refreshToken')) {
    return null;
  }

  try {
    const response = await getUserApi();
    return response.user;
  } catch {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
    return null;
  }
});

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  try {
    await logoutApi();
  } finally {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      });

    builder
      .addMatcher(
        isAnyOf(loginUser.pending, registerUser.pending, updateUser.pending),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(loginUser.fulfilled, registerUser.fulfilled, updateUser.fulfilled),
        (state) => {
          state.isLoading = false;
        }
      )
      .addMatcher(
        isAnyOf(loginUser.rejected, registerUser.rejected, updateUser.rejected),
        (state, action) => {
          state.isLoading = false;
          state.error = action.error.message ?? 'Ошибка запроса';
        }
      );
  },
});

export const { clearUserError } = userSlice.actions;

export const userReducer = userSlice.reducer;
