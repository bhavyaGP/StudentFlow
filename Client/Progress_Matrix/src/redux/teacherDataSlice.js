import { createSlice } from "@reduxjs/toolkit";
import teacherData from '../Data/teachersData.json';

const initialState = {
  teachers: null,
  teacherClass: null,
};

const teacherDataSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    setTeacher: (state, action) => {
      const teacher = teacherData.find(
        (t) => t.teacher_id === action.payload.teacher_id
      );

      if (teacher) {
        state.teachers = teacher;
        state.teacherClass = teacher.allocated_standard;
      } else {
        state.teachers = null;
        state.teacherClass = null;
      }
    },
  },
});

// Export the setTeacher action and the selector for teacherClass
export const { setTeacher } = teacherDataSlice.actions;

// Selector function to get teacherClass from the state
export const selectTeacherClass = (state) => state.teacher.teacherClass;

export default teacherDataSlice.reducer;
