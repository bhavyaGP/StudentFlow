import React from 'react';
import { Navbar, Nav, Dropdown, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../assets/logo.png';

const AppNavbar = () => {
  const user = useSelector((state) => state.user);

  return (
    <Navbar
      
      data-bs-theme="light"
      expand="lg"
      className="py-3"
      style={{ 
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1030,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',backgroundColor:"whitesmoke" }}
    >
      <div className="d-flex align-items-center" style={{ marginLeft: '20px' }}>
        <Navbar.Brand href="#">
          <img
            src={logo}
            alt="Logo"
            style={{ height: '3.5rem', marginRight: '20px' }} // Adjust logo size and spacing
          />
        </Navbar.Brand>
      </div>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
      <Nav className='m-auto'>
          <NavLink
            to="/dashboard"
            className="nav-link px-3"
            style={({ isActive }) => ({
              fontSize: '1.4rem',
              fontWeight: '600',
              color: isActive ? '#8400EB' : 'black',
              fontFamily: 'Nunito, sans-serif',
            })}
          >
            Dashboard
          </NavLink>
          {user.role === 'admin' && (
            <NavLink
              to="/staff"
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
                to="/manage-data"
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
                to="/result"
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
              backgroundColor:"white", 
              color: '#8400EB', 
              fontFamily: 'Nunito, sans-serif',
              fontWeight:'800',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
              border:"none",
            }}
            // className="btn btn-success"
          >
            {user.userID + " " + user.userName+" "}
          </Dropdown.Toggle>
          <Dropdown.Menu >
            <Dropdown.Item
              href="/profile"
              style={{ backgroundColor: 'transparent',fontSize:"1.1rem",fontWeight:"400",fontFamily: 'Nunito, sans-serif'}} 
              onMouseOver={(e) => {e.currentTarget.style.backgroundColor = '#1c8aee ', e.currentTarget.style.color = 'white'}} 
              onMouseOut={(e) => {e.currentTarget.style.backgroundColor = 'transparent' , e.currentTarget.style.color = 'black'}} 
            >
              Profile
            </Dropdown.Item>
            <Dropdown.Item
              href="/logout"
              style={{ backgroundColor: 'transparent',fontSize:"1.1rem",fontWeight:"400",fontFamily: 'Nunito, sans-serif' }}
              onMouseOver={(e) => {e.currentTarget.style.backgroundColor = '#1c8aee', e.currentTarget.style.color = 'white'}} 
              onMouseOut={(e) => {e.currentTarget.style.backgroundColor = 'transparent' , e.currentTarget.style.color = 'black'}}
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
