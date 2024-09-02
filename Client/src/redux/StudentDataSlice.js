import { createSlice } from '@reduxjs/toolkit';
import studentData from '../Data/studentData.json';

const studentDataSlice = createSlice({
  name:'AllstudentData',
  initialState:{
    data: studentData,
  },
  reducers:{
    
  },
});

export const getStudentData = (state) => state.AllstudentData.data;
export default studentDataSlice.reducer;