import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface PortfolioStatsState {
  deltaExposure: number | null;
  performanceComparison: {
    portfolioValue: number | null;
    hedgedPortfolioValue: number | null;
    performanceDifference: number | null;
  };
  portfolioValue: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: PortfolioStatsState = {
  deltaExposure: null,
  performanceComparison: {
    portfolioValue: null,
    hedgedPortfolioValue: null,
    performanceDifference: null
  },
  portfolioValue: null,
  loading: false,
  error: null,
};

const getBackendUrl = () => {
  return process.env.REACT_APP_BACKEND_URL || process.env.BACKEND_URL;
};

export const fetchDeltaExposure = createAsyncThunk(
  'portfolioStats/fetchDeltaExposure',
  async (username: string, thunkAPI) => {
    try {
      const response = await axios.get(`${getBackendUrl()}/portfolio/delta-exposure/${username}`);
      return response.data.deltaExposure;
    } catch (error) {
      return thunkAPI.rejectWithValue('Error fetching delta exposure');
    }
  }
);

export const fetchPerformanceComparison = createAsyncThunk(
  'portfolioStats/fetchPerformanceComparison',
  async (username: string, thunkAPI) => {
    try {
      const response = await axios.get(`${getBackendUrl()}/portfolio/compare-performance/${username}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Error fetching performance comparison');
    }
  }
);

export const fetchPortfolioValue = createAsyncThunk(
  'portfolioStats/fetchPortfolioValue',
  async (username: string, thunkAPI) => {
    try {
      const response = await axios.get(`${getBackendUrl()}/portfolio/portfolio-value/${username}`);
      return response.data.portfolioValue;
    } catch (error) {
      return thunkAPI.rejectWithValue('Error fetching portfolio value');
    }
  }
);

const portfolioStatsSlice = createSlice({
  name: 'portfolioStats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeltaExposure.fulfilled, (state, action: PayloadAction<number>) => {
        state.deltaExposure = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchPerformanceComparison.fulfilled, (state, action: PayloadAction<any>) => {
        state.performanceComparison = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchPortfolioValue.fulfilled, (state, action: PayloadAction<number>) => {
        state.portfolioValue = action.payload;
        state.loading = false;
        state.error = null;
      })
  },
});

export default portfolioStatsSlice.reducer;