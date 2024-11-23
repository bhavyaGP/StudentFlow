import React, { useRef, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import icon from '../assets/icon2.png';
import backgroundImage from '../assets/background.png';
import { setUser } from '../redux/userSlice'; 

const LoginPage = () => {
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();

    const username = event.target.formUsername.value.trim();
    const password = event.target.formPassword.value.trim();


    const newErrors = {};
    if (!username) {
      newErrors.username = 'Username is required.';
    }
    if (!password) {
      newErrors.password = 'Password is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    } else {
      setErrors({});
    }

    const data = JSON.stringify({
      username,
      password
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:3000/login',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data,
      withCredentials: true
    };
    
    axios(config)
      .then((response) => {
        const responseMessage = response.data.message;
        const { token } = response.data;
        // console.log(responseMessage);
        // console.log(response.data);        
        
        const role = jwtDecode(token).role;
        Cookies.set('auth_Token', token, { expires: 1,path: '/' });
        
        let userData;
        if (role === 'teacher') {
          userData = response.data.user;
        } else if (role === 'admin') {
          // console.log(response.data);
          
          userData = {admin : response.data.admin , school : response.data.school};
        }

        if (userData) {
          dispatch(setUser({ 
            role,
            userProfile: userData
          }));
          const userName = role === 'teacher' ? userData.teacher_fname : 'admin';
          showMessage(token, userName, responseMessage);

          setTimeout(() => {
            navigate(`/${role}/dashboard`);
          }, 1500);
        }
      })
      .catch((error) => {
        let errorMessage = 'An error occurred. Please try again.';
        if (error.response) {
          errorMessage = error.response.data.message || 'Invalid username or password';
        } else if (error.request) {
          errorMessage = 'No response from server. Please try again later.';
        }

        showMessage(null, null, errorMessage);
        console.error('Login error:', error);
      });
  };

  const showMessage = (token, userName, message = '') => {
    Swal.fire({
      icon: token ? 'success' : 'error',
      title: token ? 'Login Successful' : 'Login Failed',
      text: token ? `Welcome back, ${userName}! ${message}` : message,
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });
  };

  return (
    <div style={{
      position: 'relative',
      height: '100vh',
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Nunito, sans-serif'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.5)', 
        zIndex: 1
      }}>
      </div>
      <Container style={{
        maxWidth: '900px',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        zIndex: 2,
      }}>
        <Row>
          <Col md={6} style={{
            borderRight: '1px solid #ddd',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <img src={icon} alt="Icon" style={{ width: '25rem', height: "auto", margin: '1em' }} />
            <p style={{ fontStyle: 'italic', color: '#222', fontWeight: 600, fontSize: "1.5rem", marginLeft: "1.4rem" }}>“Empowering students through every aspect of their growth!”</p>
          </Col>
          <Col md={6} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ marginBottom: "2rem", fontSize: "2rem" }}>Login,</h2>
            <Form onSubmit={handleLogin}>
              <Form.Group controlId="formUsername" style={{ marginBottom: '15px' }}>
                <Form.Label style={{ color: '#222', fontWeight: "600", fontSize: "1.2rem" }}>Username</Form.Label>
                <div style={{ position: 'relative' }}>
                  <FontAwesomeIcon icon={faUser} style={{ position: 'absolute', top: '10px', left: '10px', color: '#999' }} />
                  <Form.Control type="text" placeholder="Enter username" style={{ paddingLeft: '30px' }} />
                  {errors.username && <span style={{ color: 'red', fontSize: '0.9rem' }}>{errors.username}</span>}
                </div>
              </Form.Group>

              <Form.Group controlId="formPassword" style={{ marginBottom: '15px' }}>
                <Form.Label style={{ color: '#222', fontWeight: "600", fontSize: "1.2rem" }}>Password</Form.Label>
                <div style={{ position: 'relative' }}>
                  <FontAwesomeIcon icon={faLock} style={{ position: 'absolute', top: '10px', left: '10px', color: '#999' }} />
                  <Form.Control type="password" placeholder="Enter password" style={{ paddingLeft: '30px' }} />
                  {errors.password && <span style={{ color: 'red', fontSize: '0.9rem' }}>{errors.password}</span>}
                </div>
              </Form.Group>

              <Button type="submit" style={{
                width: '100%',
                backgroundColor: '#8400EB',
                borderColor: '#8400EB',
                padding: '10px',
                fontSize: '1.2rem',
                fontWeight: '600',
                fontFamily: 'Nunito, sans-serif',
                marginTop: "2rem"
              }}>
                Login
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
