// store/index.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import chatReducer from './chatSlice';
import themeConfigReducer from './themeConfigSlice';

import chatSessionReducer from './chatSessionSlice';

const rootReducer = combineReducers({
    chat: chatReducer,
    themeConfig: themeConfigReducer,
    chatSession: chatSessionReducer,
});

export const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 👇 Alias to fix imports using IRootState
export type IRootState = RootState;

export default store;
