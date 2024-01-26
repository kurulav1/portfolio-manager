import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

type PositionType = 'long' | 'short';
type OptionType = 'call' | 'put';

interface HedgedStockOptionData {
  stockOption: string;
  quantity: number;
  position: PositionType;
  optionType: OptionType;
  strikePrice: number; 
  expirationDate: string;
  marketPrice: number;
}

interface HedgedPortfolioState {
  hedgedPortfolio: HedgedStockOptionData[];
}

const initialState: HedgedPortfolioState = {
  hedgedPortfolio: [],
};

export const fetchHedgedPortfolio = createAsyncThunk(
  'hedgedPortfolio/fetchHedgedPortfolio',
  async (username: string): Promise<HedgedStockOptionData[]> => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/portfolio/hedged-portfolio/${username}`);
    return response.data.map((item: any) => ({
      stockOption: item.stockOption,
      quantity: item.quantity,
      position: item.position,
      optionType: item.optionType,
      strikePrice: item.strikePrice || 0,
      expirationDate: item.expirationDate || 'N/A',
      marketPrice: item.marketPrice || 0,
    }));
  }
);

const hedgedPortfolioSlice = createSlice({
  name: 'hedgedPortfolio',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchHedgedPortfolio.fulfilled, (state, action: PayloadAction<HedgedStockOptionData[]>) => {
      state.hedgedPortfolio = action.payload;
    });
  },
});

export default hedgedPortfolioSlice.reducer;
