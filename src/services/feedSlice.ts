import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getFeedsApi, getOrderByNumberApi } from '../utils/burger-api';

import type { TOrder } from '../utils/types';
import type { RootState } from './store';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  currentOrder: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  currentOrder: null,
  isLoading: false,
  error: null,
};

export const fetchFeeds = createAsyncThunk('feed/fetchFeeds', getFeedsApi);

export const fetchOrderByNumber = createAsyncThunk(
  'feed/fetchOrderByNumber',
  getOrderByNumberApi
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки заказов';
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.currentOrder = action.payload.orders[0] ?? null;
      });
  },
});

export const selectFeed = (state: RootState): TFeedState => state.feed;

export const selectFeedOrders = (state: RootState): TOrder[] => state.feed.orders;

export const selectCurrentOrder = (state: RootState): TOrder | null =>
  state.feed.currentOrder;

export const feedReducer = feedSlice.reducer;
