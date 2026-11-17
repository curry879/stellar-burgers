import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getFeedsApi, getOrderByNumberApi } from '../utils/burger-api';

import type { TFeedState, TOrder } from '../utils/types';
import type { RootState } from './store';

type TFeedSliceState = TFeedState & {
  currentOrder: TOrder | null;
  isOrderLoading: boolean;
  orderError: string | null;
  requestedOrderNumber: number | null;
};

const initialState: TFeedSliceState = {
  orders: [],
  total: 0,
  totalToday: 0,
  currentOrder: null,
  isLoading: false,
  error: null,
  isOrderLoading: false,
  orderError: null,
  requestedOrderNumber: null,
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

      .addCase(fetchOrderByNumber.pending, (state, action) => {
        state.isOrderLoading = true;
        state.orderError = null;
        state.currentOrder = null;
        state.requestedOrderNumber = action.meta.arg;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        if (state.requestedOrderNumber !== action.meta.arg) {
          return;
        }

        state.isOrderLoading = false;
        state.currentOrder = action.payload.orders[0] ?? null;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        if (state.requestedOrderNumber !== action.meta.arg) {
          return;
        }

        state.isOrderLoading = false;
        state.currentOrder = null;
        state.orderError = action.error.message ?? 'Не удалось загрузить заказ';
      });
  },
});

export const selectFeed = (state: RootState): TFeedState => state.feed;

export const selectFeedOrders = (state: RootState): TOrder[] => state.feed.orders;

export const selectCurrentOrder = (state: RootState): TOrder | null =>
  state.feed.currentOrder;

export const selectOrderLoading = (state: RootState): boolean =>
  state.feed.isOrderLoading;

export const selectOrderError = (state: RootState): string | null =>
  state.feed.orderError;

export const selectRequestedOrderNumber = (state: RootState): number | null =>
  state.feed.requestedOrderNumber;

export const feedReducer = feedSlice.reducer;
