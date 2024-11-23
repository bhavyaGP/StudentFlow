import React from 'react'
import Login from '../login/login';
import {Route, Routes} from 'react-router-dom';
import { Navigate } from 'react-router';

const Auth = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="*" element={<Navigate to="/auth/login"/>} Replace/>
    </Routes>
  )
}

export default Auth;