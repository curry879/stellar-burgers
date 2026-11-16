import { combineReducers } from '@reduxjs/toolkit';

import { constructorReducer } from './constructorSlice';
import { feedReducer } from './feedSlice';
import { ingredientsReducer } from './ingredientsSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feed: feedReducer,
  burgerConstructor: constructorReducer,
});
