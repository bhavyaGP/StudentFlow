import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

let Role;
if(Role) {
  jwtDecode(Cookies.get('auth_Token')).role;
}


const initialState = {
  role: localStorage.getItem('role') || Role || '',
  userProfile: JSON.parse(localStorage.getItem('userProfile')) || null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.role = action.payload.role;
      state.userProfile = action.payload.userProfile;
      // console.log(state.userProfile.school.resultout);
      localStorage.setItem('role', state.role);
      localStorage.setItem('userProfile', JSON.stringify(state.userProfile));
    },
    clearUser: (state) => {
      state.role = '';
      state.userProfile = null;
      localStorage.removeItem('role');
      localStorage.removeItem('userProfile');
      Cookies.remove('auth_Token');
    },
    updateResultStatus: (state, action) => {
      if (state.userProfile && state.userProfile.school) {
        state.userProfile.school.resultout = action.payload;
        localStorage.setItem('userProfile', JSON.stringify(state.userProfile));
      }
    },
  },
});

export const { setUser, clearUser, updateResultStatus } = userSlice.actions;

// Selector functions
export const selectUserID = (state) => state.user.userProfile?.[`${state.user.role}_id`] || null;
export const selectUserName = (state) => state.user.role === 'teacher' ? state.user.userProfile?.teacher_fname : 'admin';
export const selectRole = (state) => state.user.role;
export const selectUserProfile = (state) => state.user.userProfile;
export const selectResultStatus = (state) => state.user.userProfile.school.resultout;

export default userSlice.reducer;