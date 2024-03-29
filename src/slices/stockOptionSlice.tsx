import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
type PositionType = 'long' | 'short';
type OptionType = 'call' | 'put';


interface StockOption {
    id: number;
    stockOption: string;
    strikePrice: string;
    expirationDate: string;
    optionType: OptionType;
    marketPrice: string | null;
    delta?: number;
    impliedVolatility?: number;
}

interface TickerState {
  stockOptions: StockOption[];
  loading: boolean;
  error: string | null;
}

const initialState: TickerState = {
  stockOptions: [],
  loading: false,
  error: null,
};

interface FetchStockOptionsPayload {
  stockOption: string;
  startDate: string;
  endDate: string;
}

const getBackendUrl = () => {
  return process.env.REACT_APP_BACKEND_URL || process.env.BACKEND_URL;
}

export const fetchStockOptionsByTicker = createAsyncThunk(
  'ticker/fetchByTicker',
  async ({ stockOption, startDate, endDate }: FetchStockOptionsPayload, thunkAPI) => {
    try {
      let url = `${getBackendUrl()}/portfolio/stock-options/${stockOption}`;
      if (startDate && endDate) {
        url += `?start_date=${startDate}&end_date=${endDate}`;
      }
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      let errorMessage = 'Unknown error occurred';
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        errorMessage = error.response.data;
      }
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);
  
const tickerSlice = createSlice({
  name: 'ticker',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchStockOptionsByTicker.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchStockOptionsByTicker.fulfilled, (state, action: PayloadAction<StockOption[]>) => {
      state.stockOptions = action.payload;
      state.loading = false;
    })
    .addCase(fetchStockOptionsByTicker.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    .addCase(addStockOptionToPortfolio.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(addStockOptionToPortfolio.fulfilled, (state) => {
      state.loading = false;
    })
    .addCase(addStockOptionToPortfolio.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});


export const addStockOptionToPortfolio = createAsyncThunk(
  'ticker/addToPortfolio',
  async (data: {
    username: string;
    stockOption: {
      tickerSymbol: string;
      strikePrice: string;
      expirationDate: string;
      optionType: string;
      marketPrice: number;
      impliedVolatility: number;
    };
    position: PositionType;
    quantity: number;
  }, thunkAPI) => {
    try {
      const response = await axios.post(`${getBackendUrl()}/portfolio/add-to-portfolio`, data);
      return response.data;
    } catch (error) {
      let errorMessage = 'Unknown error occurred';
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        errorMessage = error.response.data;
      }
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export default tickerSlice.reducer;
