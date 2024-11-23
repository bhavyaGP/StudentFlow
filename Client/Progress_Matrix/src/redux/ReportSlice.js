import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

// Async thunk to fetch report data
export const fetchReport = createAsyncThunk('report/fetchReport', async (rollno, thunkAPI) => {
  const token = Cookies.get('token');
  try {
    const response = await axios.get(`http://localhost:3000/api/teacher/report?rollno=${rollno}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      withCredentials: true,
    });
    // console.log("GetReport response : ",response.data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const reportSlice = createSlice({
  name: 'report',
  initialState: {
    data: null,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReport.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReport.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchReport.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default reportSlice.reducer;