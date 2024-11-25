import React, { useState, useEffect } from "react";
import { Button, Card, Row, Col, Dropdown, DropdownButton } from "react-bootstrap";
import { FaChartBar, FaTable } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTeachers } from '../../redux/teacherDataSlice';
import Swal from "sweetalert2";

const ClassWiseDashboard = () => {
  const dispatch = useDispatch();
  const teachers = useSelector((state) => state.teacherData.teachers);
  const [viewMode, setViewMode] = useState("analysis");
  const [selectedClass, setSelectedClass] = useState({ standard: 10, teacher: "Bhavya prajapati" });
  const [classData, setClassData] = useState([]);

  useEffect(() => {
    dispatch(fetchAllTeachers());
  }, [dispatch]);

  useEffect(() => {
    if (teachers.length > 0) {
      const mappedClassData = teachers.map((teacher) => ({
        standard: teacher.allocated_standard,
        teacher: `${teacher.teacher_fname} ${teacher.teacher_lname}`,
      }));
      setClassData(mappedClassData);
      setSelectedClass(mappedClassData[0]); // Set the first class as the default selected class
    }
  }, [teachers]);

  const graphData = {
    1: { title: "Graph for Class 1", description: "Details of Graph for Class 1" },
    2: { title: "Graph for Class 2", description: "Details of Graph for Class 2" },
    3: { title: "Graph for Class 3", description: "Details of Graph for Class 3" },
    // Add similar data for other classes
    10: { title: "Graph for Class 10", description: "Details of Graph for Class 10" },
  };

  const studentData = {
    1: [
      { rollNo: 1001, name: "John Doe", totalMarks: "450 / 500", percentage: "90%" },
      { rollNo: 1002, name: "Jane Doe", totalMarks: "420 / 500", percentage: "84%" },
    ],
    2: [
      { rollNo: 2001, name: "Alice", totalMarks: "400 / 500", percentage: "80%" },
      { rollNo: 2002, name: "Bob", totalMarks: "380 / 500", percentage: "76%" },
    ],
    3: [
      { rollNo: 3001, name: "Alice", totalMarks: "400 / 500", percentage: "80%" },
      { rollNo: 3002, name: "Bob", totalMarks: "380 / 500", percentage: "76%" },
    ],
    // Add sample data for other classes
    10: [
      { rollNo: 10001, name: "Michael", totalMarks: "430 / 500", percentage: "86%" },
      { rollNo: 10002, name: "Sara", totalMarks: "410 / 500", percentage: "82%" },
    ],
  };

  const handleSelectClass = (standard, teacher) => {
    setSelectedClass({ standard, teacher });
  };

  useEffect(() => {
    handleCheckDataAndView(selectedClass);
  }, [selectedClass]);

  const handleShowErrorAndReset = () => {
    Swal.fire({
      icon: "error",
      title: "No Data Found",
      text: `No graph or table data found for Standard ${selectedClass.standard}. Redirecting you to default standard data.`,
      confirmButtonText: "OK",
    }).then(() => {
      setSelectedClass(classData[0]);
    });
  };

  const handleCheckDataAndView = (classData) => {
    const graphExists = !!graphData[classData.standard];
    const tableDataExists = !!studentData[classData.standard];
    // console.log("Checking data for Standard:", classData.standard);
    // console.log("Graph Exists:", graphExists, "Table Exists:", tableDataExists);

    if (!graphExists || !tableDataExists) {
      handleShowErrorAndReset();
    }
  };

  return (
    <div>
      <DropdownButton
        id="dropdown-basic-button"
        title={`Standard ${selectedClass.standard} - ${selectedClass.teacher}`}
        variant="outline-primary"
        className="d-flex justify-content-start"
      >
        {classData.map((cls, index) => (
          <Dropdown.Item
            key={index}
            onClick={() => handleSelectClass(cls.standard, cls.teacher)}
          >
            Standard {cls.standard} - {cls.teacher}
          </Dropdown.Item>
        ))}
      </DropdownButton>

      <div className="d-flex justify-content-end mb-4" style={{ fontFamily: "Nunito" }}>
        <Button
          className={
            viewMode === "analysis"
              ? "d-flex align-items-center me-2 bg-[#8400EB] border border-white no-hover"
              : "d-flex align-items-center me-2 bg-white border border-dark no-hover"
          }
          style={{
            color: viewMode === "analysis" ? "white" : "black",
            fontWeight: "500",
            backgroundColor: viewMode === "analysis" ? "#8400EB" : "white",
            borderColor: viewMode === "analysis" ? "white" : "black",
            pointerEvents: "auto",
            transition: "none",
            boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.3)"
          }}
          onClick={() => setViewMode("analysis")}
        >
          <FaChartBar className="me-2" size={20} /> Analysis
        </Button>

        <Button
          onClick={() => setViewMode("table")}
          className={
            viewMode === "table"
              ? "d-flex align-items-center me-2 bg-[#8400EB] border border-white no-hover"
              : "d-flex align-items-center me-2 bg-white border border-dark no-hover"
          }
          style={{
            color: viewMode === "table" ? "white" : "black",
            fontWeight: "500",
            backgroundColor: viewMode === "table" ? "#8400EB" : "white",
            borderColor: viewMode === "table" ? "white" : "black",
            pointerEvents: "auto",
            transition: "none",
            boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.3)"
          }}
        >
          <FaTable className="me-1" size={20} /> Table Data
        </Button>
      </div>

      {viewMode === "analysis" ? (
        graphData[selectedClass.standard] ? (
          <Row>
            <Col sm={6} md={4} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>{graphData[selectedClass.standard].title}</Card.Title>
                  <Card.Text>{graphData[selectedClass.standard].description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : null
      ) : (
        <div>
          <Button variant="outline-primary" className="mb-3">
            Filter Data
          </Button>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Serial No</th>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Standard</th>
                <th>Total Marks</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {studentData[selectedClass.standard]?.map((student, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{student.rollNo}</td>
                  <td>{student.name}</td>
                  <td>{selectedClass.standard}</td>
                  <td>{student.totalMarks}</td>
                  <td>{student.percentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClassWiseDashboard;