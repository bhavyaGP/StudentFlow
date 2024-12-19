import React, { useState } from 'react';
import axios from 'axios';
import { Container, Card, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { FaCloudUploadAlt, FaCalendarAlt, FaUserTie, FaTimes, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { SiGoogleclassroom } from 'react-icons/si';
import { AiOutlineDownload } from 'react-icons/ai';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import School from '../../assets/gvm.png';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { TbReport } from "react-icons/tb";



const GlobalStyle = createGlobalStyle`
  
  body {
    font-family: 'Nunito', sans-serif;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
`;

const CenteredContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(+30px); }
  100% { transform: translateY(0px); }
`;

const GradientBackground = styled.div`
  
  // background: linear-gradient(45deg, rgba(242,232,236,0.9669117647058824) 0%, rgba(187,213,245,1) 100%);
  background: transparent;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledCard = styled(Card)`
  background: linear-gradient(45deg, rgba(242,232,236,0.9669117647058824) 0%, rgba(187,213,245,1) 100%);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 700px;
  // background-color: #F4F5F5;
  margin-top: 3rem;
  margin-bottom: 3rem;
`;

const IconWrapper = styled.div`
  font-size: 1.5rem;
  color: #F04419;
  margin-right: 0.5rem;
`;

const HeaderText = styled.h2`
  font-family: 'Nunito' , 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 1.7rem;
  color: #DFE2E2;
`;

const FloatingImage = styled.img`
  animation: ${floatAnimation} 2.5s ease-in-out infinite;
`;

const GradientButton = styled.button`
  background-image: linear-gradient(to right, #4776E6 0%, #8E54E9  51%, #4776E6  100%);
  margin: 10px;
  padding: 15px 45px;
  text-align: center;
  text-transform: uppercase;
  transition: 0.5s;
  background-size: 200% auto;
  color: white;            
  box-shadow: 0 0 20px #eee;
  border-radius: 10px;
  display: block;
  border: none;
  cursor: pointer;

  &:hover {
    background-position: right center;
    color: #fff;
    text-decoration: none;
  }
`;

const StatusMessage = styled.div`
  margin-top: 10px;
  font-weight: 600;
  font-size: 18px;
  color: ${props => props.success ? '#28a745' : props.warning ? '#f50000' : '#dc3545'};
  display: flex;
  align-items: center;
`;

const ResultUpload = (props) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const allowedExtensions = ['.csv'];

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileExtension = '.' + selectedFile.name.split('.').pop().toLowerCase();
      if (allowedExtensions.includes(fileExtension)) {
        setFile(selectedFile);
        setUploadStatus(null);
      } else {
        setFile(null);
        setUploadStatus({
          success: false,
          warning: true,
          message: `Please upload a file with ${allowedExtensions.join(', ')} format only.`
        });
        event.target.value = '';
      }
    } else {
      setFile(null);
      setUploadStatus(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setUploadStatus({
        success: false,
        warning: true,
        message: 'Please select a file first.'
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append('excelFile', file);

    const apiUrl = !props.isAcademic
      ? `${import.meta.env.VITE_BACKEND_URL}/api/teacher/activitymarks` 
      : `${import.meta.env.VITE_BACKEND_URL}/api/teacher/uploadmarks`;

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      // console.log("response : ", response);

      if (response.status === 200) {
        setUploadStatus({ success: true, message: 'File uploaded successfully!' });
        setTimeout(()=>{
          window.location.reload();
        },2000)
      }
    } catch (error) {
      console.log("uploading error ", error);
      const errorMessage = error.response?.data?.message || 'File upload failed. Please try again.';
      setUploadStatus({ success: false, message: errorMessage });
    } finally {
      setIsUploading(false);
      // window.location.reload();
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadStatus(null);
    const fileInput = document.getElementById('formFile');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const showInstructions = () => {
    Swal.fire({
      title: 'Instructions',
      html: `
        <ul style="text-align: left; list-style-type: disc; padding-left: 20px;">
          <li>The file must be in .csv format.</li>
          <li>Follow the structure of the example file provided.</li>
          <li>Ensure all required fields are filled out correctly.</li>
          <li>Re-uploading a file will replace the previous data.</li>
        </ul>
      `,
      icon: 'info',
      confirmButtonColor: '#8400EB',
    });
  };

  const Teacher = useSelector((state) => state.user);
  const TeacherName = Teacher.userProfile.teacher_fname + " " + Teacher.userProfile.teacher_lname;
  const Class = Teacher.userProfile.allocated_standard;
  const AcademicYear = '2024-2025';



  return (
    <>
      <GlobalStyle />
      <GradientBackground>
        <CenteredContainer>
          <StyledCard>
            <Card.Header className="bg-[#F04419] text-center py-3">
              <HeaderText>Result Portal</HeaderText>
            </Card.Header>
            <Card.Body className="p-4">
              <Row className="mb-4">
                <Col md={7}>
                  <h4 className="mb-3">Basic Information</h4>
                  <div className="d-flex align-items-center mb-2">
                    <IconWrapper><SiGoogleclassroom /></IconWrapper>
                    <span><strong>Class : </strong> {Class}</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <IconWrapper><FaCalendarAlt /></IconWrapper>
                    <span><strong>Academic Year : </strong>{AcademicYear}</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <IconWrapper><TbReport /></IconWrapper>
                    <span><strong>result type : </strong><strong style={{ color: '#F04419', fontSize: '1.1rem' }}>{props.isAcademic ? "Academic" : "Co-curricular"}</strong></span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <IconWrapper><FaUserTie /></IconWrapper>
                    <span><strong>Uploading by : </strong>{TeacherName}</span>
                  </div>
                </Col>
                <Col md={5} className="text-center">
                  <FloatingImage src={School} alt="School Icon" className="img-fluid" style={{ maxWidth: '170px' }} />
                </Col>
              </Row>

              <Button
                variant="outline-primary"
                onClick={showInstructions}
                className="mb-3 d-flex align-items-center justify-content-center"
                style={{ width: '43%', marginTop: '-1.5rem' }}
              >
                <FaInfoCircle className="me-2" />
                Read Instructions
              </Button>

              <Button
                variant="outline-success"
                href={props.isAcademic ? "https://drive.google.com/uc?export=download&id=15z9t4Kl-xLDQi8kuAbxqH77gCThQnoW0" : "https://drive.google.com/uc?export=download&id=1LzD3B6TE2K1e0H4ADJo12AFR3v1CGcvx"}
                download
                className="mb-3 d-flex align-items-center justify-content-center"
                style={{ width: '43%', marginBottom: '1rem' }}
              >
                <AiOutlineDownload className="me-2" style={{ fontSize: '1.3rem' }} />
                Download Result File Format
              </Button>

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formFile" className="mb-1">
                  <Form.Label>Upload Result File ({allowedExtensions.join(', ')} formats only)</Form.Label>
                  <div className="d-flex align-items-center">
                    <Form.Control
                      type="file"
                      onChange={handleFileChange}
                      accept={allowedExtensions.join(',')}
                      className="me-3"
                      style={{ width: '70%', height: '2.5rem', fontSize: '1.1rem' }}
                      disabled={isUploading}
                    />
                    <GradientButton type="submit" disabled={isUploading}
                      className="d-flex align-items-center" style={{ height: '3rem' }}>
                      {isUploading ? (
                        <>
                          <Spinner animation="border" size="sm" />
                          <span className="ms-2">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <FaCloudUploadAlt className="me-2" style={{ fontSize: '1.1rem' }} />
                          <span>Upload</span>
                        </>
                      )}
                    </GradientButton>
                  </div>
                </Form.Group>
              </Form>

              {file && !isUploading && !uploadStatus?.success && (
                <Card className="mt-3 bg-light">
                  <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6>Selected File:</h6>
                      <p className="mb-0">{file.name}</p>
                    </div>
                    <Button variant="outline-danger" onClick={handleRemoveFile}>
                      <FaTimes />
                    </Button>
                  </Card.Body>
                </Card>
              )}

              {file && uploadStatus?.success && (
                <Card className="mt-3 bg-light">
                  <Card.Body>
                    <div>
                      <h6>Uploaded File:</h6>
                      <p className="mb-0">{file.name}</p>
                    </div>
                  </Card.Body>
                </Card>
              )}

              {uploadStatus && (
                <StatusMessage success={uploadStatus.success} warning={uploadStatus.warning}>
                  {uploadStatus.success ? (
                    <FaCheckCircle className="me-2" />
                  ) : uploadStatus.warning ? (
                    <FaExclamationTriangle className="me-2" />
                  ) : (
                    <FaTimes className="me-2" />
                  )}
                  {uploadStatus.message}
                </StatusMessage>
              )}
            </Card.Body>
          </StyledCard>
        </CenteredContainer>
      </GradientBackground>
    </>
  );
};

export default ResultUpload;
