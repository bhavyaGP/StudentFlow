import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name:'user',
  initialState:{
    userID: 1002,
    userName: "Admin0",
    role:'teacher',
  },
  reducers:{
    setUser:(state,action)=>{
      return {...state,...action.payload};
    },
  },
});

export const {} = userSlice.actions;
export default userSlice.reducer;
