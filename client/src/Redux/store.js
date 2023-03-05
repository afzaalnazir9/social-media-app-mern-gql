import { configureStore } from '@reduxjs/toolkit';
import authSlice from './Reducers/auth';

const store = configureStore({
    reducer: {
      auth: authSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;