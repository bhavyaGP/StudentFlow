import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Button } from 'react-bootstrap';
import UploadFile from './uploadStuData';
import ResultUpload from '../result/resultUpload';
import 'bootstrap/dist/css/bootstrap.min.css';
import StudentData from './StudentData';
import ResultList from '../result/studentResult';
import CoCurricularResult from '../result/StudentActivityResult';


const ManageData = (props) => {
  const [activeTab, setActiveTab] = useState('data');
  
  const Teacher = useSelector((state) => state.user);
  const TeacherName = Teacher.userProfile.teacher_fname + " " + Teacher.userProfile.teacher_lname;
  const Class = Teacher.userProfile.allocated_standard;

  return (
    <>
      <Container fluid style={{ display: 'flex',  height: 'calc(100vh - 70px)', padding: "0px",overflow: "hidden" }}>
        {/* Sidebar (First column) */}
        <div
          className="bg-[#f2edf7] py-3 d-flex flex-column align-items-start"
          // className="bg-[#bbdbfe] py-3 d-flex flex-column align-items-start"
          // className="bg-black py-3 d-flex flex-column align-items-start"
          style={{
            width: '20rem', 
            padding: "20px",
            paddingTop:"80px",
            position: 'sticky',
            height: "100vh", 
            borderRight: "2px solid black",
            overflow: 'hidden',
          }}
        >
          <h2
            className="mb-3"
            style={{
              fontSize: '1.4rem',
              fontWeight: '700',
              color: '#8400EB',
              fontFamily: 'Nunito, sans-serif',
            }}
          >
            Welcome, {TeacherName}
          </h2>
          <h2
            className="mb-4"
            style={{
              fontSize: '1.4rem',
              fontWeight: '700',
              color: 'black',
              fontFamily: 'Nunito, sans-serif',
            }}
          >
            {props.isResult ? "Manage Result of class " + Class : "Manage student data of class " + Class}
          </h2>
          <div className="d-flex flex-column w-100">
            <Button
              variant={activeTab === 'data' ? 'outline-dark' : 'light'}
              style={{
                fontSize: '1.2rem',
                backgroundColor:  'white',
                color: activeTab === 'data' ? '#8400EB' : 'black',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: activeTab === 'data' ? '800' : '500',
                boxShadow: activeTab === 'data' ? '0 4px 8px rgba(0, 0, 0, 0.4)' : 'none',
              
              }}
              onClick={() => setActiveTab('data')}
              className="m-2"
            >
              {props.isResult ? "Student Result" : "Student Data"}
            </Button>

            {props.isResult &&
            <Button
              variant={activeTab === 'CoCurricular' ? 'outline-dark' : 'light'}
              style={{
                fontSize: '1.2rem',
                backgroundColor: 'white',
                color: activeTab === 'CoCurricular' ? '#8400EB' : 'black',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: activeTab === 'CoCurricular' ? '800' : '500',
                boxShadow: activeTab === 'CoCurricular' ? '0 4px 8px rgba(0, 0, 0, 0.4)' : 'none',
                
              }}
              onClick={() => setActiveTab('CoCurricular')}
              className="m-2"
            >
              Co-curricular Result
            </Button>}

            <Button
              variant={activeTab === 'upload' ? 'outline-dark' : 'light'}
              style={{
                fontSize: '1.2rem',
                backgroundColor: 'white',
                color: activeTab === 'upload' ? '#8400EB' : 'black',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: activeTab === 'upload' ? '800' : '500',
                boxShadow: activeTab === 'upload' ? '0 4px 8px rgba(0, 0, 0, 0.4)' : 'none',
              }}
              onClick={() => setActiveTab('upload')}
              className="m-2"
            >
              
              {props.isResult ? "Upload Result" : "Upload Data"}
            </Button>
            
            {props.isResult &&
            <Button
              variant={activeTab === 'uploadResult2' ? 'outline-dark' : 'light'}
              style={{
                fontSize: '1.2rem',
                backgroundColor: 'white',
                color: activeTab === 'uploadResult2' ? '#8400EB' : 'black',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: activeTab === 'uploadResult2' ? '800' : '500',
                boxShadow: activeTab === 'uploadResult2' ? '0 4px 8px rgba(0, 0, 0, 0.4)' : 'none',
              }}
              onClick={() => setActiveTab('uploadResult2')}
              className="m-2"
            >
              Upload Co-curricular Result
            </Button>}
          </div>
        </div>

        {/* Main Content (Second column) */}
        <div
          style={{
            flexGrow: 1, 
            flexBasis: '0', 
            overflow: 'auto', 
            paddingLeft: '20px',
            // backgroundColor:"#f2fcfc",
            backgroundColor: 'white',
            maxWidth: 'calc(100% - 20rem)'  
          }}
        >
          {activeTab === 'upload' && !props.isResult && <UploadFile />}
          {activeTab === 'data' && !props.isResult && <StudentData />}
          {activeTab === 'data' && props.isResult && <ResultList/>}
          {activeTab === 'CoCurricular' && props.isResult && <CoCurricularResult/>}
          {activeTab === 'upload' && props.isResult && <ResultUpload isAcademic={true}/>}
          {activeTab === 'uploadResult2' && props.isResult && <ResultUpload isAcademic={false}/>}
        </div>
      </Container>
    </>
  )
};

export default ManageData;
