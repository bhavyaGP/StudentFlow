import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col } from 'react-bootstrap';
import icon from '../assets/logo.png'; // Update with your logo path

const PageNotFound = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); 
  };

  return (
    <div style={{
      height: '87vh',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Nunito, sans-serif'
    }}>
      <Container style={{
        maxWidth: '600px',
        textAlign: 'center',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <Row className="mb-4">
          <Col>
            <center><img src={icon} alt="Website Logo" style={{ width: '250px' }} /></center>
          </Col>
        </Row>
        <Row>
          <Col>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#8400EB' }}>404</h2>
            <p style={{
              fontSize: '1.2rem',
              color: '#333',
              marginBottom: '20px',
              fontWeight: '600'
            }}>
              Oops! The page you are looking for does not exist.
            </p>
            <p style={{
              fontSize: '1rem',
              color: '#666',
              marginBottom: '30px',
              fontWeight: '500'
            }}>
              Please check the URL or click the button below to return to the previous page.
            </p>
            <Button 
              onClick={goBack}
              style={{
                backgroundColor: '#8400EB',
                borderColor: '#8400EB',
                padding: '10px 20px',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
              Go to Previous Page
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PageNotFound;
