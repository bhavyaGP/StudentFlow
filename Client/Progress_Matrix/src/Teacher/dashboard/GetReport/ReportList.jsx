import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents } from '../../../redux/StudentDataSlice';
import { selectUserProfile } from '../../../redux/userSlice';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TiWarning } from "react-icons/ti";
import { BsPersonVcard } from "react-icons/bs";
import { FaRegDotCircle } from "react-icons/fa";
import { Button, Modal } from 'react-bootstrap';
import GoToReport from './GoToReport';

const StudentList = () => {
  const dispatch = useDispatch();
  const students = useSelector((state) => state.studentData.students);
  const studentStatus = useSelector((state) => state.studentData.status);
  const error = useSelector((state) => state.studentData.error);
  const standard = useSelector(selectUserProfile).allocated_standard;
  const [selectedRollno, setSelectedRollno] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (studentStatus === 'idle') {
      dispatch(fetchStudents());
    }
  }, [studentStatus, dispatch]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error,
        confirmButtonColor: '#8400EB',
      });
    }
  }, [error]);

  useEffect(() => {
    if (studentStatus === 'succeeded' && students.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'No Data Found',
        text: 'No students found. Please add students first.',
        confirmButtonColor: '#8400EB',
      });
    }
  }, [studentStatus, students]);

  const handleViewReport = (student) => {
    setSelectedRollno(student.rollno);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRollno(null);
  };

  return (
    <div style={{ fontFamily: 'Nunito', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {students.length > 0 ? (
        <div style={{ fontFamily: 'Nunito', padding: '20px', width: '70vw' }}>
          <div style={{ backgroundColor: '#f2ebfb', border: '3px double #03045e', padding: '20px', borderRadius: '5px', marginBottom: '20px', color: '#03045e' }}>
            <h2 className='text-center fs-4 fw-bold mb-2'>Student List - Reporting</h2>
            <p className='text-center fs-5 mb-2'>Standard : {standard}, Academic Year : 2024-25</p>
            <p className='text-center fs-5'>---Get Annual Result card of Students---</p>
          </div>
          <table className="table table-striped table-bordered align-middle" style={{ textAlign: 'center', border: '2px solid #343a40' }}>
            <thead>
              <tr>
                <th style={{ width: "5%", color: '#e3f2fd', backgroundColor: '#f24b04' }}>Sr. No</th>
                <th style={{ width: "10%", color: '#e3f2fd', backgroundColor: '#f24b04' }}>Roll No</th>
                <th style={{ width: "15%", color: '#e3f2fd', backgroundColor: '#f24b04' }}>Name</th>
                <th style={{ width: "7%", color: '#e3f2fd', backgroundColor: '#f24b04' }}>Reporting</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.rollno}>
                  <td>{index + 1}</td>
                  <td>{student.rollno}</td>
                  <td>{`${student.firstName} ${student.lastName}`}</td>
                  <td style={{ display: 'flex', justifyContent: 'center', border: 'none' }}>
                    <button
                      className="d-flex btn m-1"
                      style={{ backgroundColor: '#b7e4c7', border: '1px solid black' }}
                      onClick={() => handleViewReport(student)}
                    >
                      <BsPersonVcard className='mt-0.5 me-2' size={20} />Go To Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ color: 'red', fontSize: '1.3rem', display: 'flex' }}><TiWarning className='mt-1 me-2' size={23} />No student data available. Please upload student data.</div>
      )}

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton style={{backgroundColor:'#edf6f9' , color:'#03071e'}}>
          <Modal.Title style={{paddingLeft : '20px' , display:'flex'}}> 
            <FaRegDotCircle className='mt-2 me-2'/>Generate and Download Annual Report of Student . . .</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRollno && <GoToReport rollno={selectedRollno} />}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default StudentList;