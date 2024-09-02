import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Container, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { setTeacher, selectTeacherClass } from '../../redux/teacherDataSlice';
import studentData from '../../Data/studentData.json';

const ClassStudentList = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const teacher_id = 4; // Select the teacher_id you want to use
    dispatch(setTeacher({ teacher_id }));
  }, [dispatch]);

  const teacherClass = useSelector(selectTeacherClass);

  // Filter students based on teacher's class
  const filteredStudents = studentData.filter(student => student.standard === teacherClass);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading && filteredStudents.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'No Data Found',
          text: 'Data not found, please upload data first.',
          html: `<div style="font-size: 1.5rem; font-weight: 600;">Data not found, please upload data first.</div>`,
          confirmButtonColor: '#8400EB',
        });
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [filteredStudents, loading]);

  useEffect(() => {
    // Update loading state once data is filtered
    setLoading(false);
  }, [filteredStudents]);

  return (
    <Container>
      <h2 className="my-4"
        style={{
          fontSize: '2rem',
          backgroundColor: 'transparent',
          color: 'black',
          fontFamily: 'Nunito, sans-serif',
          fontWeight: '800',
        }}>List of Students in Class {teacherClass}</h2>

      {/* {filteredStudents.length > 0 ? ( */}
        <Row>
          {filteredStudents.map(student => (
            <Col md={4} key={student.studentId} className="mb-4">
              <Card style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', borderRadius: '10px' }}>
                <Card.Body>
                  <Card.Title><strong>Student ID : </strong>{student.studentId}</Card.Title>
                  <Card.Text>
                    <strong>Name:</strong> {student.firstName} {student.lastName} <br />
                    <strong>Class:</strong> {student.standard} <br />
                    <strong>Parent Contact:</strong> {student.parentContact} <br />
                    <strong>DOB:</strong> {new Date(student.dateOfBirth).toLocaleDateString('en-GB')}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      {/* ) : (
        <p>No students found</p> // Optionally display a message if no students are found
      )} */}
    </Container>
  );
};

export default ClassStudentList;
