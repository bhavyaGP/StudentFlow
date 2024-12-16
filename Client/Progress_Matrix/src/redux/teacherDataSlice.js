import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get('auth_Token');

export const fetchAllTeachers = createAsyncThunk('teachers/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/allteacher`, {
      headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      },
      withCredentials: true,
    });
    // console.log(response.data);
    
    return response.data;
  } catch (error) {
    if (error.response || (error.response.status === 500)) {
      Swal.fire({
        icon: 'error',
        title: 'Session Expired',
        text: 'Your session has expired. Please log in again.',
        confirmButtonColor: '#007bff',
      }).then(() => {
        window.location.href = '/auth/login';
      });
    }
    return rejectWithValue(error.response.data);
  }
});

export const addTeacher = createAsyncThunk('teachers/add', async (teacherData) => {
  const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/addteacher`, teacherData, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return response.data;
});

const teacherDataSlice = createSlice({
  name: 'teacherData',
  initialState: {
    teachers: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTeachers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllTeachers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.teachers = action.payload;
      })
      .addCase(fetchAllTeachers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addTeacher.fulfilled, (state, action) => {
        state.teachers.push(action.payload);
      });
  },
});

export default teacherDataSlice.reducer;
