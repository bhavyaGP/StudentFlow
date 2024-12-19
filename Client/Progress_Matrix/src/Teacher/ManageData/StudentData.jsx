import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents } from '../../redux/StudentDataSlice';
import { selectUserProfile } from '../../redux/userSlice';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TiWarning } from "react-icons/ti";
import { selectResultStatus } from '../../redux/userSlice';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaTrophy, FaUser, FaPhone, FaHome, FaBirthdayCake, FaUserTie, FaEdit } from 'react-icons/fa';
import { MdOutlineNumbers } from "react-icons/md";
import Cookies from 'js-cookie';
import axios from 'axios';
import styled from 'styled-components';
import { format } from 'date-fns';




const StudentProfile = styled.div`
  padding: 1rem;
  line-height: 1.5;
  background-color: #f9f9f9; /* Added background color */
  border-radius: 8px; /* Added border-radius for curved borders */
  max-width: 380px; /* Decreased width */
  margin: 0 auto; /* Center the profile */

  .profile-field {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    font-family: 'Nunito', sans-serif;
  }
  
  .profile-field div {
    margin-top: 0.4rem;
  }

  .profile-field label {
    font-weight: 700;
    display: block;
    margin-right: 0.5rem;
    margin-top: 0.3rem;
  }

  .hr {
    width: 80%;
    border: 0.5px solid #adb5bd;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .profile-icon {
    margin-right: 0.7rem;
    color: #007bff;
  }
`;

const StudentList = () => {
  const dispatch = useDispatch();
  const students = useSelector((state) => state.studentData.students);
  const studentStatus = useSelector((state) => state.studentData.status);
  const resultStatus = useSelector(selectResultStatus);
  const error = useSelector((state) => state.studentData.error);
  const token = Cookies.get('auth_Token');
  const standard = useSelector(selectUserProfile).allocated_standard;

  const [showModal, setShowModal] = useState(false);
  const [modalStudent, setModalStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [achievementTitle, setAchievementTitle] = useState('');
  const [achievementDate, setAchievementDate] = useState('');

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

  const handleShowMore = (student) => {
    setModalStudent(student);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalStudent(null);
  };

  // delete student data section...
  const handleDelete = (rollno) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to delete the student with Roll No: ${rollno}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const data = JSON.stringify({
          rollno: rollno,
          standard: standard, // Replace with the appropriate standard if needed
        });

        // console.log('Deleted student data:', data);

        const config = {
          method: 'delete',
          maxBodyLength: Infinity,
          url: 'http://localhost:3000/api/teacher/deletestudent',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          data: data,
          withCredentials: true,
        };

        axios.request(config)
          .then((response) => {
            // console.log('Deleted student data:', response.data);
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: `Student - Roll no : ${rollno} deleted successfully!`,
            }).then(() => {
              Swal.fire({
                title: 'Reloading...',
                text: 'Please wait while the page reloads.',
                icon: 'info',
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
              });
              setTimeout(() => {
                window.location.reload();
              }, 1000); // Reload the page after 1000ms
            });
          })
          .catch((error) => {
            console.error('There was an error deleting the student data!', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'There was an error deleting the student data!',
            });
          });
      }
    });
  };


  //update data section...
  const handleEdit = (student) => {
    // console.log('Edit student data:', student);

    setEditData(student);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "DOB") {
      // Format the date to dd/mm/yyyy
      const [year, month, day] = value.split("-");
      formattedValue = `${day}/${month}/${year}`;
    }

    setEditData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));
  };

  const handleEditSubmit = () => {
    const data = JSON.stringify({
      rollno: editData.rollno,
      stud_fname: editData.firstName,
      stud_lname: editData.lastName,
      DOB: formatDate(editData.dateOfBirth),
      parent_contact: editData.parentContact,
      parentname: editData.parentName,
      student_add: editData.studentAddress
    });
    // console.log('Updated student data:', data);

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:3000/api/teacher/updatestudent',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      data: data,
      withCredentials: true,
    };

    axios.request(config)
      .then((response) => {
        // console.log('Updated student data:', response.data);
        setShowEditModal(false);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Student data updated successfully!',
        });
      })
      .catch((error) => {
        console.error('There was an error updating the student data!', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error || 'There was an error updating the student data!',
        });
      });

    setShowEditModal(false);
  };

  //Achievement section
  const handleAddAchievement = (student) => {
    setModalStudent(student);
    setShowAchievementModal(true);
  };

  const handleAchievementSubmit = () => {
    // console.log(`Achievement Title : ${achievementTitle}`);
    // console.log(`Roll No: ${modalStudent.rollno}`);
    // console.log(`Achievement Date: ${achievementDate}`);
    if (!achievementTitle || !achievementDate) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'All fields are required.',
        confirmButtonColor: '#8400EB',
      });
      return;
    }

    let data = JSON.stringify({
      "achievement_title": achievementTitle,
      "date": achievementDate,
      "rollno": modalStudent.rollno
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:3000/api/teacher/addachivement',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      data: data,
      withCredentials: true,
    };

    axios.request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Achievement added successfully!',
          confirmButtonColor: '#8400EB',
        });
        setShowAchievementModal(false);
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add achievement.',
          confirmButtonColor: '#8400EB',
        });
      });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy'); // Example format: January 01, 2023
  };


  return (
    <div style={{ fontFamily: 'Nunito', padding: '20px' }}>
      {students.length > 0 ? (
        <div >
          <div style={{ backgroundColor: '#f2ebfb', border: '3px double #03045e', padding: '20px', borderRadius: '5px', marginBottom: '20px', color: '#03045e' }}>
            <h2 className='text-center fs-4 fw-bold mb-2'>Student List</h2>
            <p className='text-center'>Standard : {standard}, Academic Year : 2024-25</p>
          </div>
          <table className="table table-striped table-bordered align-middle" style={{ textAlign: 'center', border: '2px solid #adb5bd' }}>
            <thead>
              <tr>
                <th style={{ color: '#e3f2fd', backgroundColor: '#f24b04' }}>Sr. No</th>
                <th style={{ color: '#e3f2fd', backgroundColor: '#f24b04' }}>Roll No</th>
                <th style={{ color: '#e3f2fd', backgroundColor: '#f24b04' }}>Name</th>
                <th style={{ color: '#e3f2fd', backgroundColor: '#f24b04' }}>Achievement</th>
                <th style={{ color: '#e3f2fd', backgroundColor: '#f24b04' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.rollno}>
                  <td>{index + 1}</td>
                  <td>{student.rollno}</td>
                  <td>{`${student.firstName} ${student.lastName}`}</td>
                  <td>
                    <button
                      className="btn m-1"
                      style={{ backgroundColor: '#81D8D0' }}
                      onClick={() => handleAddAchievement(student)}
                    >
                      Add Achievement
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-info m-1 me-3"
                      onClick={() => handleShowMore(student)}
                    >
                      More Details
                    </button>
                    {resultStatus === false &&
                      <>
                        <button
                          className="btn btn-primary m-1 me-3"
                          onClick={() => handleEdit(student)}
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-danger m-1"
                          onClick={() => handleDelete(student.rollno)}
                        >
                          Delete
                        </button>
                      </>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ color: 'red', fontSize: '1.3rem', display: 'flex' }}><TiWarning className='mt-1 me-2' size={23} />No student data available. Please upload student data.</div>
      )}
      {/* Modal for More Details */}
      {showModal && modalStudent && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton className="bg-[#3a86ff]">
            <Modal.Title className="d-flex text-[white]">
              <FaUser className="mx-3 mt-2" /> Student Profile
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <StudentProfile>
              <div className="d-flex profile-field">
                <MdOutlineNumbers size={25} className="profile-icon me-2 mt-1" />
                <label>Roll No: </label>
                <div className="ms-1">{modalStudent.rollno}</div>
              </div>
              <hr className="hr" />
              <div className="d-flex profile-field">
                <FaUser className="profile-icon me-2 mt-1" />
                <label>Name: </label>
                <div className="ms-1">{modalStudent.firstName} {modalStudent.lastName}</div>
              </div>
              <hr className="hr" />
              <div className="d-flex profile-field">
                <FaBirthdayCake className="profile-icon me-2 mt-1" />
                <label>Date of Birth: </label>
                <div className="ms-1">{formatDate(modalStudent.dateOfBirth)}</div>
              </div>
              <hr className="hr" />
              <div className="d-flex profile-field">
                <FaUserTie className="profile-icon me-2 mt-1" />
                <label>Parent Name: </label>
                <div className="ms-1">{modalStudent.parentName}</div>
              </div>
              <hr className="hr" />
              <div className="d-flex profile-field">
                <FaPhone className="profile-icon me-2 mt-1" />
                <label>Parent Contact: </label>
                <div className="ms-1">{modalStudent.parentContact}</div>
              </div>
              <hr className="hr" />
              <div className="d-flex profile-field">
                <FaHome className="profile-icon me-2 mt-1" size={35}/>
                <label>Address: </label>
                <div className="ms-1">{modalStudent.studentAddress}</div>
              </div>
              <hr className="hr" />

            </StudentProfile>
          </Modal.Body>
        </Modal>
      )}
      {/* Modal for Editing Details */}
      {showEditModal && (
        <Modal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          className="d-flex justify-content-center align-items-center"
          style={{ fontFamily: 'Nunito', fontWeight: '600' }}
        >
          <Modal.Header closeButton style={{ backgroundColor: '#edf2fb', color: '#03045e' }}>
            <Modal.Title className='d-flex fw-bold'><FaEdit className='mt-1 me-3' />Edit Student Details</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ fontSize: '16px' }}>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Roll No (Read Only)</Form.Label>
                <Form.Control
                  type="text"
                  value={editData.rollno}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={editData.firstName}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={editData.lastName}
                  onChange={handleEditChange}
                />
              </Form.Group>
              {/* <Form.Group className="mb-3">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="text"
                  name="DOB"
                  value={formatDate(editData.dateOfBirth)}
                  readOnly
                />
              </Form.Group> */}
              <Form.Group className="mb-3">
                <Form.Label>Enter new Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="DOB"
                  value={editData.dateOfBirth.split('T')[0]} // Format the date to yyyy-MM-dd
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Parent Contact</Form.Label>
                <Form.Control
                  type="text"
                  name="parentContact"
                  value={editData.parentContact}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="studentAddress"
                  value={editData.studentAddress}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleEditSubmit} style={{ marginRight: '15rem' }}>
                Save Changes
              </Button>
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}

      {/* Modal for Adding Achievement */}
      {modalStudent && (
        <Modal show={showAchievementModal} onHide={() => setShowAchievementModal(false)} className='d-flex justify-content-center align-items-center' style={{ fontFamily: 'Nunito', fontWeight: '600' }} >
          <Modal.Header closeButton style={{ backgroundColor: '#edf2fb', color: '#03045e' }}>
            <Modal.Title className="d-flex fw-bold ">
              <FaTrophy className='m-1 me-3 ' size={25} /> Add Achievement
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ fontSize: '18px' }}>
            <Form>
              <Form.Group className="mb-4">
                <Form.Label>Achievement Title : </Form.Label>
                <Form.Control
                  type="text"
                  value={achievementTitle}
                  onChange={(e) => setAchievementTitle(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Roll No (Read Only)</Form.Label>
                <Form.Control
                  type="text"
                  value={modalStudent.rollno}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Date of Achievement : </Form.Label>
                <Form.Control
                  type="date"
                  value={achievementDate}
                  onChange={(e) => setAchievementDate(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleAchievementSubmit}
                style={{ marginRight: '10rem' }}
              >
                Save Achievement
              </Button>
              <Button variant="secondary" onClick={() => setShowAchievementModal(false)}>
                Cancel
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

const modalStyle = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
};

export default StudentList;