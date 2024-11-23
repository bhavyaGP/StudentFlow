import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice';
import studentDataReducer from './StudentDataSlice';
import teacherDataReducer from './teacherDataSlice';
import ResultReducer from "./resultSlice";
import achievementsReducer from './AchievementSlice';
import DashboardReducer from './DashboardSlice';
import reportReducer from './ReportSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    studentData: studentDataReducer,
    teacherData: teacherDataReducer,
    result: ResultReducer,
    achievements: achievementsReducer,
    dashboard: DashboardReducer,
    report: reportReducer
  },
});

export default store;