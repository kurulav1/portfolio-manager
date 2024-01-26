import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch as reduxUseDispatch, useSelector as reduxUseSelector } from 'react-redux';

import portfolioReducer from './slices/portfolioSlice';
import deltaReducer from './slices/deltaSlice';
import tickerReducer from './slices/stockOptionSlice'
import hedgedPortfolioReducer from './slices/hedgedPortfolioSlice'

export const store = configureStore({
  reducer: {
    portfolio: portfolioReducer,
    delta: deltaReducer,
    ticker: tickerReducer,
    hedgedPortfolio: hedgedPortfolioReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useDispatch = () => reduxUseDispatch<AppDispatch>();

export const useSelector: TypedUseSelectorHook<RootState> = reduxUseSelector;