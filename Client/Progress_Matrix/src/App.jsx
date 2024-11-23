import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TeacherLayouts from './Layouts/teacherlayouts';
import AdminLayouts from './Layouts/adminlayouts';
import Auth from './Layouts/auth';
import PageNotFound from './PageNotFound/pagenotfound';
import ProtectedRoute from './Layouts/protectedRoutes';
import Cookies from 'js-cookie';

const userRoles = {
  TEACHER: 'teacher',
  ADMIN: 'admin',
};

const token = Cookies.get('auth_Token');
// console.log("Token from app.js : ",token);


const defaultHomePage = (role) => {
  switch (role) {
    case userRoles.TEACHER:
      return '/teacher/dashboard';
    case userRoles.ADMIN:
      return '/admin/dashboard';
    default:
      return '/';
  }
};

function App() {
  const user = useSelector((state) => state.user);

  return (
    
      <Routes>
        <Route path="/auth/*" element={<Auth />} />
        <Route
          path="/teacher/*"
          element={
            <ProtectedRoute allowedRoles={[userRoles.TEACHER]}>
              <TeacherLayouts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={[userRoles.ADMIN]}>
              <AdminLayouts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            token ? (
              <Navigate to={defaultHomePage(user.role)} replace />
            ) : (
              <Navigate to="/auth/login" />
            )
          }
        />
        <Route
          path="/*"
          element={token ? <PageNotFound /> : <Navigate to="/auth/login" />}
        />
      </Routes>
  );
}

export default App;