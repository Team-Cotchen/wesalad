import { configureStore } from '@reduxjs/toolkit';
import loginSlice from './reducers/loginSlice';

export const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
