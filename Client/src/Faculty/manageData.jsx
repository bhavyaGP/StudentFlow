import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Row, Col, Button } from 'react-bootstrap';
import AllStudentData from './StudentData/AllStudentData'; // Adjust the path as necessary
import UploadFile from './uploadStuData'; // Import the UploadFile component

const ManageData = () => {
  const [activeTab, setActiveTab] = useState('data'); // Default to 'upload' tab
  const teacher = useSelector((state) => state.teacher.teachers);
  const teacherClass = useSelector((state) => state.teacher.teacherClass);

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="bg-[#e1ebee] py-3 d-flex flex-column align-items-start">
          <h2 className="mb-3" 
            style={{
              fontSize: '1.4rem',
              fontWeight: '700',
              color:'#8400EB',
              fontFamily: 'Nunito, sans-serif',
            }}>
                    Welcome, {teacher?.teacher_fname}
          </h2>
          <h2 className="mb-4"
            style={{
              fontSize: '1.4rem',
              fontWeight: '700',
              color:'black',
              fontFamily: 'Nunito, sans-serif',
            }}>Manage student data of class {teacherClass}
          </h2>
          <div className="d-flex flex-column w-100">
            
            <Button
              variant={activeTab === 'data' ? 'outline-dark' : 'light'}
              style={{
                fontSize: '1.2rem',
                backgroundColor:activeTab === 'data' ? 'white' : 'transparent', 
                color: activeTab === 'data' ? '#8400EB' : 'black', 
                fontFamily: 'Nunito, sans-serif',
                fontWeight: activeTab === 'data' ? '800' : '500',
                boxShadow: activeTab === 'data' ? '0 4px 8px rgba(0, 0, 0, 0.4)' : 'none',
                border:'none'
              }}
              onClick={() => setActiveTab('data')}
              className='m-2'
            >
              Student Data
            </Button>

            <Button
              variant={activeTab === 'upload' ? 'outline-dark' : 'light'}
              style={{
                fontSize: '1.2rem',
                backgroundColor:activeTab === 'upload' ? 'white' : 'transparent', 
                color: activeTab === 'upload' ? '#8400EB' : 'black', 
                fontFamily: 'Nunito, sans-serif',
                fontWeight: activeTab === 'upload' ? '800' : '500',
                boxShadow: activeTab === 'upload' ? '0 4px 8px rgba(0, 0, 0, 0.4)' : 'none',
                border:'none'
              }}
              onClick={() => setActiveTab('upload')}
              className="m-2"
            >
              Upload Data
            </Button>
          </div>
        </Col>
        <Col md={0} className="py-0 px-0">
          {activeTab === 'upload' && (
              <UploadFile /> 
          )}
          {activeTab === 'data' && (
            <div>
              <AllStudentData />
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ManageData;
