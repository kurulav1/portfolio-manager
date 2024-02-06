import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { combineReducers } from '@reduxjs/toolkit';

import { TypedUseSelectorHook, useDispatch as reduxUseDispatch, useSelector as reduxUseSelector } from 'react-redux';

import portfolioReducer from './slices/portfolioSlice';
import deltaReducer from './slices/deltaSlice';
import tickerReducer from './slices/stockOptionSlice'
import hedgedPortfolioReducer from './slices/hedgedPortfolioSlice'
import userReducer from './slices/userSlice'
import portfolioStatsReducer from './slices/statisticsSlice';

const persistConfig = {
  key: 'root',
  storage,
};

 

const rootReducer = combineReducers({
  portfolio: portfolioReducer,
  delta: deltaReducer,
  ticker: tickerReducer,
  hedgedPortfolio: hedgedPortfolioReducer,
  user: userReducer,
  portfolioStats: portfolioStatsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
});


export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useDispatch = () => reduxUseDispatch<AppDispatch>();
export const persistor = persistStore(store);

export const useSelector: TypedUseSelectorHook<RootState> = reduxUseSelector;