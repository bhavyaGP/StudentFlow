import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const token = Cookies.get('auth_Token');  
  const user = useSelector((state) => state.user);
  const location = useLocation();



  useEffect(() => {
    // console.log("token in : ",token);
    
    if (!token) {

      Swal.fire({
        title: 'Access Denied',
        text: `You need to login to access this page.`,
        icon: 'warning',
        confirmButtonText: 'OK'
      }).then(() => {
        setRedirectToLogin(true);
      });
    }
    }, [token, location]);

    if (redirectToLogin) {
      return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const requiredRole = allowedRoles[0].charAt(0).toUpperCase() + allowedRoles[0].slice(1);
    Swal.fire({
      title: 'Unauthorized Access',
      text: `You need to login as ${requiredRole} to access this page.`,
      icon: 'warning',
      confirmButtonText: 'OK'
    });
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;