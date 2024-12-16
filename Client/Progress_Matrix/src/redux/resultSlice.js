import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

const token = Cookies.get('auth_Token');

// Async thunk to fetch the result list
export const fetchResultList = createAsyncThunk('result/fetchResultList', async () => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${import.meta.env.VITE_BACKEND_URL}/api/teacher/getallmarks`,
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    withCredentials: true,
  };

  const response = await axios.request(config);
  // console.log('Result List:', response.data);
  return response.data;
});

const resultSlice = createSlice({
  name: 'result',
  initialState: {
    status: 'idle',
    error: null,
    resultList: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResultList.pending, (state) => {
        state.status = 'loading';
        Swal.fire({
          icon: 'info',
          title: 'Loading',
          text: 'Fetching result list...',
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .addCase(fetchResultList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.resultList = action.payload;
      })
      .addCase(fetchResultList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: action.error.message,
          confirmButtonColor: '#8400EB',
        });
      });
  },
});

export default resultSlice.reducer;