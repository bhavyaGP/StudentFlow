import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { selectUserProfile } from '../redux/userSlice';
import { fetchAllTeachers, addTeacher } from '../redux/teacherDataSlice';
import { RiUserAddFill } from "react-icons/ri";
import { Button, Modal } from 'react-bootstrap';
import styled from 'styled-components';
import Swal from "sweetalert2";
import { GiTeacher } from "react-icons/gi";
import { FcAbout } from "react-icons/fc";
import { FaUser, FaEnvelope, FaUserTag, FaSchool, FaCalendarAlt, FaChalkboardTeacher } from "react-icons/fa";


const StyledModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
`;

const StyledFormGroup = styled.div`
  margin-bottom: 1rem;

  label {
    font-weight: bold;
    margin-bottom: 0.5rem;
    display: block;
  }

  input, select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }

  input:focus, select:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }

  .error {
    color: red;
    font-size: 0.875rem;
  }
`;

const HeaderSection = styled.div`
  color: #8400ED;
  padding: 1rem;
  padding-top: 2rem;
  text-align: center;
  border-radius: 8px;
  font-size: 1.5rem;
  font-weight: 700;
`;

const StyledTable = styled.table`
  width: 95%;
  margin: 0 auto;
  border-collapse: collapse;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px; 
  overflow: hidden; 
`;

const TeacherProfile = styled.div`
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

const Staff = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const profile = useSelector(selectUserProfile);
  const schoolId = profile.school.school_id;
  const schoolName = profile?.school?.school_name || '';
  const teachers = useSelector((state) => state.teacherData.teachers);
  const [formData, setFormData] = useState({
    teacher_fname: "",
    teacher_lname: "",
    teacher_email: "",
    allocated_standard: "",
    dob: "",
    school_id: schoolId,
  });
  const [availableClasses, setAvailableClasses] = useState([]);
  const [errors, setErrors] = useState({});

  const nameRegex = /^[a-zA-Z]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    dispatch(fetchAllTeachers());
  }, [dispatch]);

  useEffect(() => {
    const allocatedClasses = teachers.map(teacher => parseInt(teacher.allocated_standard, 10));
    const allClasses = Array.from({ length: 10 }, (_, i) => i + 1);
    const unallocatedClasses = allClasses.filter(cls => !allocatedClasses.includes(cls));
    setAvailableClasses(unallocatedClasses);
  }, [teachers]);

  const openModal = () => { setShowModal(true); };

  const closeModal = () => { setShowModal(false); };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Convert the date to DD/MM/YYYY format
  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.teacher_fname || !nameRegex.test(formData.teacher_fname)) {
      newErrors.teacher_fname = 'First name is required and should only contain letters.';
    }

    if (!formData.teacher_lname || !nameRegex.test(formData.teacher_lname)) {
      newErrors.teacher_lname = 'Last name is required and should only contain letters.';
    }

    if (!formData.teacher_email || !emailRegex.test(formData.teacher_email)) {
      newErrors.teacher_email = 'Valid email is required.';
    }

    if (!formData.allocated_standard) {
      newErrors.allocated_standard = 'Allocated standard is required.';
    }

    if (!formData.dob || new Date(formData.dob) >= new Date()) {
      newErrors.dob = 'Date of Birth is required and must be in the past.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      dob: formatDate(formData.dob),
    };

    try {
      await dispatch(addTeacher(formattedData)).unwrap();
      setShowModal(false);
      setFormData({
        teacher_fname: "",
        teacher_lname: "",
        teacher_email: "",
        allocated_standard: "",
        dob: "",
        school_id: schoolId,
      });

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Teacher added successfully!',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Error: ${error.message}`,
      });
    }
  };

  const handleSubmitWithValidation = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      handleSubmit(e);
    }
  };

  const handleShowProfile = (teacher) => {
    setSelectedTeacher(teacher);
    setShowProfileModal(true);
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
    setSelectedTeacher(null);
  };

  const formatDOB = (date) => {
    if (!date) return '';
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
  };


  return (
    <>
      <div className="container bg-[#f4ecff]" style={{ fontFamily: "Nunito", height: 'calc(100vh - 70px)' ,width:"100vw" }}>
        <HeaderSection>
          <h1> Our Teaching Staff </h1>
          <p style={{ color: 'black' }}>Our dedicated teachers who shape the future of our students.</p>
        </HeaderSection>
        <div className="flex justify-end mb-3">
          <button className="d-flex btn btn-outline-dark bg-[#8400ED] text-white border-none me-5 mb-1"
            onClick={openModal}
            style={{ boxShadow: "0 6px 10px rgba(0, 0, 0, 0.4)" }}
          >
            <RiUserAddFill className="me-2" size={20} />
            Add Teacher
          </button>
        </div>
        <StyledTable className="table table-striped table-bordered table-hover align-middle">
          <thead>
            <tr>
              <th style={{ width: '10%' , backgroundColor:'#1b263b' }} className="text-white border border-gray-300 px-4 py-2 ">Sr. No.</th>
              <th style={{ width: '20%' , backgroundColor:'#1b263b'  }} className="text-white border border-gray-300 px-4 py-2">Teacher ID</th>
              <th style={{ width: '30%' , backgroundColor:'#1b263b'  }} className="text-white border border-gray-300 px-4 py-2">Teacher Name</th>
              <th style={{ width: '20%' , backgroundColor:'#1b263b'  }} className="text-white border border-gray-300 px-4 py-2">Assigned Class</th>
              <th style={{ width: '20%' , backgroundColor:'#1b263b'  }} className="text-white border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, index) => (
              <tr key={teacher.teacher_id}>
                <td className="border border-gray-300 px-4 py-2">
                  {index + 1}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {teacher.teacher_id}
                </td>
                <td className="border border-gray-300 px-4 py-2">{`${teacher.teacher_fname} ${teacher.teacher_lname}`}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {teacher.allocated_standard}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button className="d-flex btn btn-info border border-black" style={{backgroundColor:'#caf0f8'}} onClick={() => handleShowProfile(teacher)}>More details... <FcAbout className="mt-0 ms-2" size={25}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </StyledTable>

        {/* Modal for adding teacher */}
        {showModal && (
          <div className="d-flex justify-content-center align-items-center position-fixed top-0 left-0 w-100 h-100 bg-dark bg-opacity-50">
            <StyledModalContent >
              <h2 className="d-flex mb-3 fs-4 text-[#8400ED]"><GiTeacher className="me-3" size={25} /> Register New Teacher</h2>
              <h2 className="d-flex mb-4 fs-5 text-decoration-underline text-[#284b63]">New Teacher, New Job Role.</h2>
              <form onSubmit={handleSubmitWithValidation}>
                <StyledFormGroup>
                  <label>First Name</label>
                  <input
                    type="text"
                    name="teacher_fname"
                    value={formData.teacher_fname}
                    onChange={handleInputChange}
                  />
                  {errors.teacher_fname && <div className="error">{errors.teacher_fname}</div>}
                </StyledFormGroup>

                <StyledFormGroup>
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="teacher_lname"
                    value={formData.teacher_lname}
                    onChange={handleInputChange}
                  />
                  {errors.teacher_lname && <div className="error">{errors.teacher_lname}</div>}
                </StyledFormGroup>

                <StyledFormGroup>
                  <label>Email</label>
                  <input
                    type="email"
                    name="teacher_email"
                    value={formData.teacher_email}
                    onChange={handleInputChange}
                  />
                  {errors.teacher_email && <div className="error">{errors.teacher_email}</div>}
                </StyledFormGroup>

                <StyledFormGroup>
                  <label>Allocate Standard</label>
                  <select
                    name="allocated_standard"
                    value={formData.allocated_standard}
                    onChange={handleInputChange}
                  >
                    <option value="">Un-allocated standards</option>
                    {availableClasses.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                  {errors.allocated_standard && <div className="error">{errors.allocated_standard}</div>}
                </StyledFormGroup>

                <StyledFormGroup>
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                  />
                  {errors.dob && <div className="error">{errors.dob}</div>}
                </StyledFormGroup>

                <div className="d-flex justify-content-end">
                  <Button type="submit" variant="success" className="me-2">
                    Save
                  </Button>
                  <Button variant="secondary" onClick={closeModal}>
                    Cancel
                  </Button>
                </div>
              </form>
            </StyledModalContent>
          </div>
        )}

        {/* Modal for showing teacher profile */}
        {showProfileModal && selectedTeacher && (
        <Modal show={showProfileModal} onHide={handleCloseProfileModal}>
          <Modal.Header closeButton className="bg-[#3a86ff]">
            <Modal.Title className="d-flex text-[white] "><GiTeacher className="mx-3 mt-2"/>Teacher Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <TeacherProfile className="hr">
              <div className="d-flex profile-field">
                <FaUser className="profile-icon me-2 mt-1" />
                <label>First Name : </label>
                <div className="ms-1">{selectedTeacher.teacher_fname}</div>
              </div>
                <hr className="hr"/>
                <div className="d-flex profile-field">
                <FaUser className="profile-icon me-2 mt-1" />
                <label>Last Name : </label>
                <div className="ms-1">{selectedTeacher.teacher_lname}</div>
              </div>
                <hr className="hr"/>
                <div className="d-flex profile-field">
                <FaEnvelope className="profile-icon me-2 mt-1" />
                <label>Email : </label>
                <div className="ms-1">{selectedTeacher.teacher_email}</div>
              </div>
                <hr className="hr"/>
                <div className="d-flex profile-field">
                <FaUserTag className="profile-icon me-2 mt-1" />
                <label>Username : </label>
                <div className="ms-1">{selectedTeacher.username}</div>
              </div>
                <hr className="hr"/>
                <div className="d-flex profile-field">
                <FaChalkboardTeacher className="profile-icon me-2 mt-1" />
                <label>Allocated Standard : </label>
                <div className="ms-1">{selectedTeacher.allocated_standard}</div>
              </div>
                <hr className="hr"/>
                <div className="d-flex profile-field">
                <FaCalendarAlt className="profile-icon me-2 mt-1" />
                <label>Date of Birth : </label>
                <div className="ms-1">{formatDOB(selectedTeacher.DOB)}</div>
              </div>
                <hr className="hr"/>
                <div className="d-flex profile-field">
                <FaSchool className="profile-icon me-2 mt-1" />
                <label>School Name : </label>
                <div className="ms-1">{schoolName}</div>
              </div>
                <hr className="hr"/>
            </TeacherProfile>
          </Modal.Body>
        </Modal>
        )}
      </div>
    </>
  );
};

export default Staff;