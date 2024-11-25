import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get('auth_Token');

// Async thunk to fetch achievements
export const fetchAchievements = createAsyncThunk(
  'achievements/fetchAchievements',
  async () => {
    const response = await axios.get('http://localhost:3000/api/teacher/allachivement', {
      headers: { 
        'Authorization': `Bearer ${token}`,
      },
      withCredentials: true,
    });
    // console.log('Achievements:', response.data);
    return response.data;
  }
);

const achievementsSlice = createSlice({
  name: 'achievements',
  initialState: {
    list: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAchievements.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAchievements.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchAchievements.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default achievementsSlice.reducer;