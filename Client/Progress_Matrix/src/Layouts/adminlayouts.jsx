import React from 'react'
import AppNavbar from '../Navbar/navbar';
import {Navigate, Route, Routes} from 'react-router-dom';
import AdminDashboard from '../Admin/Dashboard/AdminDashboard';
import Staff from '../Admin/Staff';
import PageNotFound from '../PageNotFound/pagenotfound';

const AdminLayouts = () => {
  return (
    <>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard"/>} />
        <Route path="/dashboard" element={<AdminDashboard/>} />
        <Route path="/staff" element={<Staff/>} />
        <Route path="*" element={<PageNotFound/>} />
      </Routes>
    </>
  )
}

export default AdminLayouts;