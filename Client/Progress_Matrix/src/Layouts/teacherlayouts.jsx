import React from 'react'
import { Navigate, Route, Routes } from 'react-router';
import TeacherDashboard from '../Teacher/dashboard/TeacherDashboard';
import ManageData from '../Teacher/ManageData/manageData';
import PageNotFound from '../PageNotFound/pagenotfound';
import AppNavbar from '../Navbar/navbar';

const TeacherLayouts = () => {
  return (
    <>
      <AppNavbar />
      <Routes>.
        <Route path="/" element={<Navigate to="/teacher/dashboard" />} />
        <Route path="/dashboard" element={<TeacherDashboard />} />
        <Route path="/manage-data" element={<ManageData isResult={false} />} />
        <Route path="/result" element={<ManageData isResult={true}/>} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  )
}

export default TeacherLayouts;