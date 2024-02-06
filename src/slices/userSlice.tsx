import { createSlice, createAsyncThunk, PayloadAction, SerializedError } from '@reduxjs/toolkit';
import { setAuthToken } from '../utils/axiosConfig';

import axios from 'axios';

interface UserState {
  user: { userId: number; username: string } | null;
  isLoggedIn: boolean;
  error: string | null;
  loading: boolean; 
}

const initialState: UserState = {
  user: null,
  isLoggedIn: false,
  error: null,
  loading: false, // Initialize loading state
};

export const loginUser = createAsyncThunk(
    'user/login',
    async (userData: { username: string; password: string }, thunkAPI) => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/login`, userData);
        localStorage.setItem('token', response.data.token);
        setAuthToken(response.data.token);
        return { userId: response.data.userId, username: userData.username };
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          return thunkAPI.rejectWithValue(error.response.data);
        }
        return thunkAPI.rejectWithValue('Login failed');
      }
    }
  );

  export const validateToken = createAsyncThunk(
    'user/validateToken',
    async (_, thunkAPI) => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/validateToken`);
          setAuthToken(token); 
          return { user: response.data.user, token };
        }
        return thunkAPI.rejectWithValue('No token found');
      } catch (error) {
        return thunkAPI.rejectWithValue('Token validation failed');
      }
    }
  );
  
  const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      logoutUser: (state) => {
        state.user = null;
        state.isLoggedIn = false;
        state.error = null;
        state.loading = false;
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(loginUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ userId: number, username: string }>) => {
          state.user = action.payload;
          state.isLoggedIn = true;
          state.error = null;
          state.loading = false;
        })
        .addCase(loginUser.rejected, (state, action) => {
          state.error = action.error.message || 'An error occurred';
          state.loading = false;
        })
        .addCase(validateToken.fulfilled, (state, action) => {
          state.user = action.payload.user;
          state.isLoggedIn = true;
          state.error = null;
          state.loading = false;
        })
        .addCase(validateToken.rejected, (state, action) => {
          state.error = action.error.message || 'Token validation failed';
          state.loading = false;
        });
    },
  });
  
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
