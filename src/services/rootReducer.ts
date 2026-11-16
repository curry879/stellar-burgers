import { combineReducers } from '@reduxjs/toolkit';

import { feedReducer } from './feedSlice';
import { ingredientsReducer } from './ingredientsSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feed: feedReducer,
});
