import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import {AiOutlineUpload,AiOutlineFileExcel,AiOutlineFileText,AiOutlineCloseSquare,AiOutlineDownload} from 'react-icons/ai';
import { FaCalendarAlt, FaUserTie } from 'react-icons/fa';
import { SiGoogleclassroom } from 'react-icons/si';
import styled, { createGlobalStyle } from 'styled-components';
import SchoolLogo from '../../assets/gvm.png';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Poppins', sans-serif;
    margin: 0;
    padding: 0;
    background: linear-gradient(42deg, rgba(242,232,236,0.9669117647058824) 0%, rgba(187,213,245,1) 100%);
    min-height: 80vh;
  }
`;

const StyledCard = styled(Card)`
  background: linear-gradient(180deg, rgba(242,232,236,0.9669117647058824) 0%, rgba(187,213,245,1) 100%);
  border-radius: 15px ;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-top: 3rem;
  margin-bottom: 2rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const HeaderText = styled.h2`
  font-family: 'Nunito', 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 1.5rem;
  color: #DFE2E2;
`;

const IconWrapper = styled.div`
  font-size: 1.2rem;
  color: #F04419;
  margin-right: 0.5rem;
`;

const token = Cookies.get('auth_Token');

const UploadFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (validateFile(file)) {
      setSelectedFile(file);
      // console.log('file', file);

    } else {
      showValidationError();
    }
  };

  const validateFile = (file) => {
    const validTypes = [
      'text/csv',
    ];
    return file && validTypes.includes(file.type);
  };

  const showValidationError = () => {
    Swal.fire({
      icon: 'error',
      title: 'Invalid File Type',
      text: 'Please upload a valid CSV file.',
      confirmButtonColor: '#8400EB',
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (validateFile(file)) {
      setSelectedFile(file);
    } else {
      showValidationError();
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Swal.fire({
        icon: 'warning',
        title: 'No File Selected',
        text: 'Please select a file to upload.',
        confirmButtonColor: '#8400EB',
      });
      return;
    }

    Swal.fire({
      title: 'Uploading...',
      text: 'Please wait while your file is being uploaded.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = new FormData();
    formData.append('excelFile', selectedFile);


    try {
      const response = await axios.post('http://localhost:3000/api/teacher/addstudent', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      console.log("response : ", response);


      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Upload Successful',
          text: `${selectedFile.name} has been uploaded successfully.`,
          confirmButtonColor: '#8400EB',
        }).then(() => {
          window.location.reload();
        });
        

        setSelectedFile(null);
        window.location.reload();
      }
    } catch (error) {
      console.log("uploading error ", error);

      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: error.response?.data || error.message,
        confirmButtonColor: '#8400EB',
      });
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
  };

  const Teacher = useSelector((state) => state.user);
  const TeacherName = Teacher.userProfile.teacher_fname + " " + Teacher.userProfile.teacher_lname;
  const Class = Teacher.userProfile.allocated_standard;
  const AcademicYear = '2024-2025';

  return (
    <>
      <GlobalStyle />
      <Container className="mt-4">
        <StyledCard>
          <Card.Header className="bg-[#F04419] text-center py-3">
            <HeaderText>Upload Student Data</HeaderText>
          </Card.Header>
          <Card.Body className="p-3">
            <Row className="mb-3">
              <Col md={3} className="text-center">
                <img src={SchoolLogo} alt="School Logo" className="img-fluid mb-2" style={{ maxWidth: '140px' }} />
              </Col>
              <Col md={9} style={{ fontSize: '1.1rem', marginTop: '10px' }} >
                <div className="d-flex align-items-center mb-1">
                  <IconWrapper><SiGoogleclassroom /></IconWrapper>
                  <span><strong>Class : </strong>{Class}</span>
                </div>
                <div className="d-flex align-items-center mb-1">
                  <IconWrapper><FaCalendarAlt /></IconWrapper>
                  <span><strong>Academic Year : </strong> {AcademicYear}</span>
                </div>
                <div className="d-flex align-items-center mb-1">
                  <IconWrapper><FaUserTie /></IconWrapper>
                  <span><strong>Class Teacher : </strong>{TeacherName}</span>
                </div>
              </Col>
            </Row>

            <Card className="mb-2">
              <Card.Body>
                <h6><strong>Instructions:</strong></h6>
                <ul className="mb-2 ps-4" style={{ listStyleType: 'disc' }}>
                  <li>The file should be in .csv format.</li>
                  <li>Follow the structure of the example file provided.</li>
                  <li>Ensure all required fields are filled out correctly.</li>
                  <li>Re-uploading file will replace the previous data.</li>
                </ul>
                <div className="d-flex align-items-center">
                  <Button variant="outline-primary" size="sm" href="https://drive.google.com/uc?export=download&id=1wMiQ0mFadaWBxtdOjdERF50p_dH-1t6j" download
                    className="d-flex align-items-center">
                    <AiOutlineDownload className="me-2" style={{ fontSize: '1.2rem' }} />
                    <span>Download Student file format</span>
                  </Button>
                </div>
              </Card.Body>
            </Card>
            <div
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-md mb-3 cursor-pointer transition-colors ${isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300 bg-gray-50'
                }`}
              style={{ height: '100px' }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
              onDrop={handleDrop}
              onClick={() => document.getElementById('fileInput').click()}
            >
              <AiOutlineUpload className="text-3xl text-gray-400 mb-1" />
              <p className="text-gray-500 font-nunito text-sm">
                {isDragging ? 'Drop the file here...' : 'Drag and drop file here or click to select'}
              </p>
            </div>

            {selectedFile && (
              <div className="flex items-center justify-between bg-gray-100 p-2 rounded mb-3">
                <div className="flex items-center">
                  {selectedFile.type.includes('excel') ? (
                    <AiOutlineFileExcel className="text-xl text-green-500 mr-2" />
                  ) : (
                    <AiOutlineFileText className="text-xl text-blue-500 mr-2" />
                  )}
                  <span className="text-gray-700 font-nunito text-lg">{selectedFile.name}</span>
                </div>
                <AiOutlineCloseSquare
                  className="text-xl text-red-500 cursor-pointer"
                  onClick={handleCancel}
                  style={{ fontSize: '30px' }}
                />
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                variant="primary"
                onClick={handleUpload}
                className="large-button"
                style={{ width:"150px" ,fontSize:'18px',padding:'12px', borderColor: '#8400EB' }}
              >
                Upload
              </Button>
            </div>

            <input
              type="file"
              id="fileInput"
              className="hidden"
              onChange={handleFileChange}
              accept=".csv"
            />
          </Card.Body>
        </StyledCard>
      </Container>
    </>
  );
};

export default UploadFile;
