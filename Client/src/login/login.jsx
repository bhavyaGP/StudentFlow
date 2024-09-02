import React, { useState }  from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import icon from '../assets/icon2.png';
import backgroundImage from '../assets/background.png';

const LoginPage = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState('');

  const handleLogin = (event) => {
    event.preventDefault();
    // Implement your login logic here, possibly dispatching an action
    const isLoginSuccessful = true ; // Simulate a failed login attempt
    if (!isLoginSuccessful) {
      setError('Invalid username or password'); // Set error message
    } else {
      setError(''); // Clear error message if login is successful
    }
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
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // Adjust opacity here
        zIndex: 1
      }}>
      </div>
      <Container style={{
        maxWidth: '1000px',
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
            {/* <h2 style={{ marginBottom: '20px', color: '#333',fontFamily:"Aldrich,sans-serif;",fontStyle:"normal",fontWeight:"400"  }}> Progress Matrix</h2> */}
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
                </div>
              </Form.Group>

              <Form.Group controlId="formPassword" style={{ marginBottom: '15px' }}>
                <Form.Label style={{ color: '#222', fontWeight: "600", fontSize: "1.2rem" }}>Password</Form.Label>
                <div style={{ position: 'relative' }}>
                  <FontAwesomeIcon icon={faLock} style={{ position: 'absolute', top: '10px', left: '10px', color: '#999' }} />
                  <Form.Control type="password" placeholder="Enter password" style={{ paddingLeft: '30px' }} />
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
              {error && (
                <div style={{
                  marginTop: '15px',
                  color: 'red',
                  textAlign: 'center',
                  fontSize: '1rem'
                }}>
                  {error}
                </div>
              )}
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
