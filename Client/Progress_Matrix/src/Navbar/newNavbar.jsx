import React from 'react';
import { Navbar, Nav, Dropdown, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import logo from '../assets/logo.png';
import { clearUser, selectUserID, selectUserName } from '../redux/userSlice';
import schoolIcon from '../assets/schoolcolor.png';
import teacherIcon from '../assets/teacher.png';

const AppNavbar = () => {
  const user = useSelector((state) => state.user);
  const userID = useSelector(selectUserID);
  const userName = useSelector(selectUserName);

  console.log('Navbar rendering');
  console.log('User:', user);
  console.log('UserID:', userID);
  console.log('UserName:', userName);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure you want to logout?',
      text: "You will be redirected to the login page.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(clearUser());
        navigate('/auth/login');
        Swal.fire(
          'Logged Out!',
          'You have been successfully logged out.',
        )
      }
    })
  };
 
  return (
    <Navbar
      data-bs-theme="light"
      expand="lg"
      className="py-3"
      style={{
        height: "70px",
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1030,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: "white"
      }}
    >
      <div className="d-flex align-items-center" style={{ marginLeft: '20px' }}>
        <Navbar.Brand href="/">
          <img
            src={logo}
            alt="Logo"
            style={{ height: '3.5rem', marginRight: '20px' }}
          />
        </Navbar.Brand>
      </div>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
        <Nav className='m-auto'>
          <NavLink to={user.role === 'admin' ? "/admin/dashboard" : "/teacher/dashboard"}
            className="nav-link px-3"
            style={({ isActive }) => ({
              fontSize: '1.4rem',
              fontWeight: '600',
              color: isActive ? '#8400EB' : 'black',
              fontFamily: 'Nunito, sans-serif',
            })}>
            Dashboard
          </NavLink>
          {user.role === 'admin' && (
            <NavLink
              to="/admin/staff"
              className="nav-link px-3"
              style={({ isActive }) => ({
                fontSize: '1.4rem',
                fontWeight: '600',
                color: isActive ? '#8400EB' : 'black',
                fontFamily: 'Nunito, sans-serif',
              })}
            >
              Staff
            </NavLink>
          )} 
          {user.role === 'teacher' && ( 
            <>
              <NavLink
                to="/teacher/manage-data"
                className="nav-link px-3"
                style={({ isActive }) => ({
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  color: isActive ? '#8400EB' : 'black',
                  fontFamily: 'Nunito, sans-serif',
                })}
              >
                Manage Data
              </NavLink>
              <NavLink
                to="/teacher/result"
                className="nav-link px-3"
                style={({ isActive }) => ({
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  color: isActive ? '#8400EB' : 'black',
                  fontFamily: 'Nunito, sans-serif',
                })}
              >
                Result
              </NavLink>
            </>
          )} 
        </Nav>
        <Dropdown align="end" style={{ marginRight: '20px' }}>
          <Dropdown.Toggle
            as={Button}
            variant="outline-dark"
            style={{
              fontSize: '1.2rem',
              backgroundColor: "white",
              color: '#8400EB',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: '800',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
              border: "none",
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >drop
            {user.role === 'admin' ? (
              <img src={schoolIcon} alt="School Icon" style={{ height: '1.6rem' }} />
            ) : (
              <img src={teacherIcon} alt="Teacher Icon" style={{ height: '2.0rem' }} />
            )}
            <span>{user.role === 'admin' ? `${userName}` : `${userID} ${userName}`}</span> 
          </Dropdown.Toggle>
          <Dropdown.Menu >
            <Dropdown.Item
              href="/profile"
              style={{ backgroundColor: 'transparent', fontSize: "1.1rem", fontWeight: "400", fontFamily: 'Nunito, sans-serif' }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#1c8aee ', e.currentTarget.style.color = 'white' }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent', e.currentTarget.style.color = 'black' }}
            >
              Profile
            </Dropdown.Item>
            <Dropdown.Item
              onClick={handleLogout}
              style={{ backgroundColor: 'transparent', fontSize: "1.1rem", fontWeight: "400", fontFamily: 'Nunito, sans-serif' }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#1c8aee', e.currentTarget.style.color = 'white' }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent', e.currentTarget.style.color = 'black' }}
            >
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default AppNavbar;