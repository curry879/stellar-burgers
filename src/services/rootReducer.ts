import { combineReducers } from '@reduxjs/toolkit';

import { constructorReducer } from './constructorSlice';
import { feedReducer } from './feedSlice';
import { ingredientsReducer } from './ingredientsSlice';
import orderReducer from './orderSlice';
import { passwordResetReducer } from './passwordResetSlice';
import { profileOrdersReducer } from './profileOrdersSlice';
import { userReducer } from './userSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feed: feedReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  user: userReducer,
  profileOrders: profileOrdersReducer,
  passwordReset: passwordResetReducer,
});
