import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface DeltaState {
  deltaValue: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: DeltaState = {
  deltaValue: null,
  loading: false,
  error: null,
};

interface CalculateDeltaParams {
  S: string;
  K: string;
  T: string;
  r: string;
  v: string;
  type: string;
}

export const calculateDelta = createAsyncThunk(
  'delta/calculateDelta',
  async ({ S, K, T, r, v, type }: CalculateDeltaParams, thunkAPI) => {
    try {
      const queryParams = new URLSearchParams({ S, K, T, r, v, type }).toString();
       

      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/analytics/calculate_delta?${queryParams}`);
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

const deltaSlice = createSlice({
  name: 'delta',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(calculateDelta.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateDelta.fulfilled, (state, action: PayloadAction<{ delta: number }>) => {
        state.loading = false;
        state.deltaValue = action.payload.delta;
      })
      .addCase(calculateDelta.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error calculating delta';
      });
  },
});

export default deltaSlice.reducer;
