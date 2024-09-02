import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice';
import studentdataReducer from './StudentDataSlice';
import teacherDataSlice  from "./teacherDataSlice";

export const store = configureStore({
  reducer:{
    user: userReducer,
    AllstudentData: studentdataReducer,
    teacher: teacherDataSlice,
  },
})

export default store;