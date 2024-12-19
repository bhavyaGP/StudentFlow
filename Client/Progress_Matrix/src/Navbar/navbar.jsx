import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { clearUser, selectUserID, selectUserName, selectRole, selectUserProfile } from '../redux/userSlice';
import logo from '../assets/logo.png';
import schoolLogo from '../assets/gvm.png';
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { FaSchool, FaMapMarkerAlt, FaAddressCard, FaIdBadge, FaCalendarAlt, FaUser, FaEnvelope, FaUserTag, FaChalkboardTeacher } from 'react-icons/fa';



const NavbarContainer = styled.nav`
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  position: sticky;
`;

const Logo = styled(RouterNavLink)``;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const NavLink = styled(RouterNavLink)`
  color: black;
  text-decoration: none;
  font-size: 1.4rem;
  font-weight: 600;
  transition: color 0.3s ease;
  font-family: Nunito, sans-serif;

  &.active  {
    color: #8400EB;
  }
`;

const UserInfo = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DropButton = styled.button`
  background-color: #8400EB;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: black;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
  z-index: 1000;

  & > button {
    background: none;
    border: none;
    padding: 0.8rem 1.5rem;
    width: 100%;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #bde0fe;
    }
  }
`;

const SchoolInfo = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin-bottom: 1rem;

  img {
    height: 8rem;
    width: 8.5rem;
    border-radius: 50%;
    margin-right: 1rem;
  }

  div {
    text-align: left;
  }

  h1 {
    font-size: 1.7rem;
    color: #8400EB;
    margin: 0;
  }


  p {
    font-size: 1rem;
    color: black;
    margin: 0;
  }
`;

const AppNavbar = () => {

  const getCurrentAcademicYear = () => {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    return `${currentYear}-${nextYear}`;
  };

  const formatDOB = (dob) => {
    const date = new Date(dob);
    return date.toLocaleDateString();
  };

  const userID = useSelector(selectUserID);
  const userName = useSelector(selectUserName);
  const userRole = useSelector(selectRole);
  const profile = useSelector(selectUserProfile);
  const academicYear = getCurrentAcademicYear();

  // console.log(profile);


  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);


  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        Swal.fire('Logged Out!', 'You have been successfully logged out.', 'success');
      }
    });
  };

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleClose = () => setShowProfile(false);
  const handleShow = () => setShowProfile(true);

  const userInfoRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userInfoRef.current && !userInfoRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userInfoRef]);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };


  return (
    <>
      <NavbarContainer>
        <Logo to="/">
          <img src={logo} alt="Progress Matrix" style={{ height: '3.5rem', marginRight: '20px' }} />
        </Logo>
        <NavLinks style={{ textShadow: "0 4px 6px rgba(0, 0, 0, 0.4)" }}>
          <NavLink to={userRole === 'admin' ? "/admin/dashboard" : "/teacher/dashboard"}>Dashboard</NavLink>
          {userRole === 'admin' && <NavLink to="/admin/staff">Staff</NavLink>}
          {userRole === 'teacher' && (
            <>
              <NavLink to="/teacher/manage-data">Manage Data</NavLink>
              <NavLink to="/teacher/result">Result</NavLink>
            </>
          )}
        </NavLinks>

        <UserInfo ref={userInfoRef}>
          <DropButton onClick={handleDropdownToggle} style={{ display: 'flex', fontFamily: 'Nunito', boxShadow: "0 6px 8px rgba(0, 0, 0, 0.4)" }}>
            {userName} <span style={{ marginLeft: '7px' }} />
            {userRole === 'teacher' && <span>ID: {userID}</span>}
            <span>
              <IoIosArrowDropdownCircle style={{ marginTop: '2px', marginLeft: '10px', fontSize: '20px' }} />
            </span>
          </DropButton>
          {dropdownOpen && (
            <DropdownMenu style={{zIndex:1000}}>
              <button onClick={handleShow}>Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </DropdownMenu>
          )}
        </UserInfo>
      </NavbarContainer>

      <Modal show={showProfile} onHide={handleClose}>
        <Modal.Header closeButton style={{ background: 'linear-gradient(90deg, hsla(39, 100%, 77%, 1) 0%, hsla(22, 90%, 57%, 1) 100%)' }}>
          <Modal.Title className="d-flex text-[black]">
            <FaSchool className="mx-3 mt-2" />
            {userRole === 'admin' ? 'School Profile' : "Teacher's Profile"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userRole === 'admin' ? (
            <SchoolInfo>
              <img
                src={schoolLogo}
                alt="School Logo"
              />
              <div>
                <h1 className='font-monospace'>{profile.school.school_name}</h1>
                <p>"Empowering Students for a Brighter Future"</p>
              </div>
            </SchoolInfo>) : (<></>)}
          {userRole === 'admin' ? (
            <div className="profile-details">
              <hr className="hr" style={{ borderColor: '#F04419' }} />
              <div className="d-flex profile-field" style={{ marginBottom: '1rem', marginTop: '1rem', fontSize: '1.2rem' }}>
                <FaCalendarAlt className="profile-icon me-2 mt-1" style={{ color: '#F04419' }} />
                <label style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>Academic Year : </label>
                <div className="ms-1">{academicYear}</div>
              </div>
              <hr className="hr" style={{ borderColor: '#F04419' }} />

              <hr className="hr" style={{ borderColor: '#F04419' }} />
              <div className="d-flex profile-field" style={{ marginBottom: '1rem', marginTop: '1rem', fontSize: '1.2rem' }}>
                <FaMapMarkerAlt className="profile-icon me-2 mt-1" style={{ color: '#F04419' }} />
                <label style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>District : </label>
                <div className="ms-1">{profile.school.school_dist}</div>
              </div>
              <hr className="hr" style={{ borderColor: '#F04419' }} />
              <div className="d-flex profile-field" style={{ marginBottom: '1rem', marginTop: '1rem', fontSize: '1.2rem' }}>
                <FaAddressCard className="profile-icon me-2 mt-1" style={{ color: '#F04419' }} />
                <label style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>Address : </label>
                <div className="ms-1">{profile.school.school_add}</div>
              </div>
              <hr className="hr" style={{ borderColor: '#F04419' }} />
            </div>
          ) : (
            <div className="profile-details">
              <div className="d-flex profile-field" style={{ marginBottom: '1rem', marginTop: '1rem', fontSize: '1.2rem' }}>
                <FaUser className="profile-icon me-2 mt-1" style={{ color: '#F04419' }} />
                <label style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>First Name : </label>
                <div className="ms-1">{profile.teacher_fname}</div>
              </div>
              <hr className="hr" style={{ borderColor: '#F04419' }} />
              <div className="d-flex profile-field" style={{ marginBottom: '1rem', marginTop: '1rem', fontSize: '1.2rem' }}>
                <FaUser className="profile-icon me-2 mt-1" style={{ color: '#F04419' }} />
                <label style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>Last Name : </label>
                <div className="ms-1">{profile.teacher_lname}</div>
              </div>
              <hr className="hr" style={{ borderColor: '#F04419' }} />
              <div className="d-flex profile-field" style={{ marginBottom: '1rem', marginTop: '1rem', fontSize: '1.2rem' }}>
                <FaEnvelope className="profile-icon me-2 mt-1" style={{ color: '#F04419' }} />
                <label style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>Email : </label>
                <div className="ms-1">{profile.teacher_email}</div>
              </div>
              <hr className="hr" style={{ borderColor: '#F04419' }} />
              <div className="d-flex profile-field" style={{ marginBottom: '1rem', marginTop: '1rem', fontSize: '1.2rem' }}>
                <FaUserTag className="profile-icon me-2 mt-1" style={{ color: '#F04419' }} />
                <label style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>Username : </label>
                <div className="ms-1">{profile.username}</div>
              </div>
              <hr className="hr" style={{ borderColor: '#F04419' }} />
              {/* <div className="d-flex profile-field" style={{ marginBottom: '1rem',marginTop: '1rem', fontSize: '1.2rem' }}>
                <FaUserTag className="profile-icon me-2 mt-1" style={{ color: '#F04419' }} />
                <label style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>password : </label>
                <div className="ms-1">{profile.password}</div>
              </div>
              <hr className="hr" style={{ borderColor: '#F04419' }} /> */}
              <div className="d-flex profile-field" style={{ marginBottom: '1rem', marginTop: '1rem', fontSize: '1.2rem' }}>
                <FaChalkboardTeacher className="profile-icon me-2 mt-1" style={{ color: '#F04419' }} />
                <label style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>Allocated Standard : </label>
                <div className="ms-1">{profile.allocated_standard}</div>
              </div>
              <hr className="hr" style={{ borderColor: '#F04419' }} />
              <div className="d-flex profile-field" style={{ marginBottom: '1rem', marginTop: '1rem', fontSize: '1.2rem' }}>
                <FaCalendarAlt className="profile-icon me-2 mt-1" style={{ color: '#F04419' }} />
                <label style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>Date of Birth : </label>
                <div className="ms-1">{formatDOB(profile.DOB)}</div>
              </div>
              <hr className="hr" style={{ borderColor: '#F04419' }} />
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AppNavbar;
