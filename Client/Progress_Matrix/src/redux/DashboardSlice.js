import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
import { selectRole, selectUserID } from './userSlice';


const initialState = {
  data: null,
  loading: false,
  error: null,
};

// Create an async thunk for fetching the dashboard data
export const fetchDashboardData = createAsyncThunk('dashboard/fetchData', async (_, { getState }) => {
  const token = Cookies.get('auth_Token');
  const state = getState();
  const role = selectRole(state);
  // console.log('Role:', role);
  
  const teacherID = 114;

  // const formdata = new FormData();
  // formdata.append('teacherId', teacherID);

  const data = JSON.stringify({ teacherId: teacherID });


  let url = `${import.meta.env.VITE_BACKEND_URL}/api/teacher/dashboarddata`;

  // if (role === 'admin') {
  //   url += `?teacherId=${teacherID}`;
  // }

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: url,
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}`,
    },
    withCredentials: true,
  };
  if(role === 'admin') {
    config.data = data;
  }

  const response = await axios.request(config);
  // console.log('Dashboard Data:', response.data);
  return response.data;
});

// Create the slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default dashboardSlice.reducer;