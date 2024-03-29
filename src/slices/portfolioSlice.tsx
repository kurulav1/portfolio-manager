import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import StockOption from '../types/StockOption';

type PositionType = 'long' | 'short';
type OptionType = 'call' | 'put';

interface StockOptionData {
  stockOption: string;
  quantity: number;
  position: PositionType;
  optionType: OptionType;
  strikePrice: number; 
  expirationDate: string;
  marketPrice: number;
  delta?: number; 
}

interface PortfolioState {
  portfolio: StockOptionData[];
}

const initialState: PortfolioState = {
  portfolio: [],
};

const getAnalysisServiceUrl = () => {
  return process.env.REACT_APP_ANALYSIS_SERVICE_URL || process.env.ANALYSIS_SERVICE_URL;
}

export const fetchPortfolio = createAsyncThunk(
  'portfolio/fetchPortfolio',
  async (username: string, thunkAPI) => {
    try {
      console.log("Getting portfolio from:" , process.env.REACT_APP_BACKEND_URL)
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/portfolio/${username}`);

      if (!Array.isArray(response.data)) {
        return thunkAPI.rejectWithValue('Data is not an array');
      }

      const portfolioData = await Promise.all(response.data.map(async (item: any) => {
        let delta;
        try {
          const queryParams = new URLSearchParams({
            S: item.marketPrice.toString(),
            K: item.strikePrice.toString(),
            T: calculateTimeToExpiration(item.expirationDate).toString(),
            r: '0.05', 
            v: item.impliedVolatility.toString(), 
            type: item.optionType
          }).toString();

          const deltaResponse = await axios.get(`${getAnalysisServiceUrl()}/calculate_delta?${queryParams}`);
          delta = deltaResponse.data.delta;
        } catch (error) {
          console.error('Error fetching delta:', error);
          delta = 0;
        }

        return {
          stockOption: item.stockOption,
          quantity: item.quantity,
          position: item.position,
          optionType: item.optionType,
          strikePrice: item.strikePrice || 0,
          expirationDate: item.expirationDate || 'N/A',
          marketPrice: item.marketPrice || 0,
          delta: delta,
        };
      }));

      return portfolioData;
    } catch (error) {
      let errorMessage = 'Unknown error occurred';
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        errorMessage = error.response.data;
      }
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    addStockOption: (state, action: PayloadAction<StockOptionData>) => {
      state.portfolio.push(new StockOption(
        action.payload.stockOption,
        action.payload.quantity,
        action.payload.position,
        action.payload.optionType,
        action.payload.strikePrice,
        action.payload.expirationDate,
        action.payload.marketPrice,
        action.payload.delta 
      ));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPortfolio.fulfilled, (state, action: PayloadAction<StockOptionData[]>) => {
      state.portfolio = action.payload;
    });
  },
});

function calculateTimeToExpiration(expirationDate: string): number {
  const expiration = new Date(expirationDate);
  const now = new Date();
  const millisecondsPerYear = 31557600000;
  return (expiration.getTime() - now.getTime()) / millisecondsPerYear;

}

export const { addStockOption } = portfolioSlice.actions;
export default portfolioSlice.reducer;
