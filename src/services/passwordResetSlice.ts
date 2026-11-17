import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';

import { forgotPasswordApi, resetPasswordApi } from '../utils/burger-api';

type TPasswordResetState = {
  isLoading: boolean;
  error: string | null;
};

const initialState: TPasswordResetState = {
  isLoading: false,
  error: null,
};

export const forgotPassword = createAsyncThunk(
  'passwordReset/forgotPassword',
  async (email: string) => {
    await forgotPasswordApi({ email });
  }
);

export const resetPassword = createAsyncThunk(
  'passwordReset/resetPassword',
  async (data: { password: string; token: string }) => {
    await resetPasswordApi(data);
  }
);

const passwordResetSlice = createSlice({
  name: 'passwordReset',
  initialState,
  reducers: {
    clearPasswordResetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isAnyOf(forgotPassword.pending, resetPassword.pending), (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        isAnyOf(forgotPassword.fulfilled, resetPassword.fulfilled),
        (state) => {
          state.isLoading = false;
        }
      )
      .addMatcher(
        isAnyOf(forgotPassword.rejected, resetPassword.rejected),
        (state, action) => {
          state.isLoading = false;
          state.error = action.error.message ?? 'Ошибка восстановления пароля';
        }
      );
  },
});

export const { clearPasswordResetError } = passwordResetSlice.actions;

export const passwordResetReducer = passwordResetSlice.reducer;
