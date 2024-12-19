import React, { useEffect, useState } from "react";
import { Button, Card, Row, Col } from "react-bootstrap";
import { FaChartBar, FaTable, FaChartLine, FaChartPie } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { useSelector, useDispatch } from "react-redux";
import { fetchDashboardData } from '../../redux/DashboardSlice';
import Swal from 'sweetalert2';
import styled, { keyframes } from 'styled-components';
import { VscTriangleRight } from "react-icons/vsc";
import ReactTypingEffect from 'react-typing-effect';




const slideInFromTop = keyframes`
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

const StyledHeader = styled.div`
  background-color: #2a9d8f;
  color: white;
  padding: 1.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
  animation: ${slideInFromTop} 0.5s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 83%;
  margin : 2rem auto ;
  margin-top: 0.5rem;
  border-radius: 10px;
`;


const ClassDashboard = () => {

  const dispatch = useDispatch();
  // const teacherID = useSelector(selectUserID);
  // console.log('Teacher ID:', teacherID);

  const dashboardData = useSelector((state) => state.dashboard.data);
  const loading = useSelector((state) => state.dashboard.loading);
  const error = useSelector((state) => state.dashboard.error);

  useEffect(() => {
    Swal.fire({
      title: "Loading...",
      text: "Please wait while we fetch the data.",
      icon: "info",
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    if (dashboardData) {
      // console.log(dashboardData);

      Swal.close();
      if (dashboardData.studentsCount === 0 ||
        (dashboardData.activityData && dashboardData.activityData.length === 0) ||
        (dashboardData.avgMarksBySubject && dashboardData.avgMarksBySubject.length === 0)) {
        Swal.fire({
          title: "No Data Found",
          text: "No data available for the dashboard.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
    if (error) {
      Swal.fire({
        title: "Error",
        text: error,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }, [dashboardData, error]);

  if (loading) {
    return null; // Return null to avoid rendering the rest of the component while loading
  }

  if (!dashboardData || dashboardData.studentsCount === 0 ||
    (dashboardData.activityData && dashboardData.activityData.length === 0) ||
    (dashboardData.avgMarksBySubject && dashboardData.avgMarksBySubject.length === 0)) {
    return <div className="d-flex justify-content-center fs-4 no-data-message text-danger fw-bold"><IoIosWarning className=" me-2" style={{ marginTop: '6px' }} size={25} />No data found for Dashboard.</div>;
  }

  const passFailData = dashboardData && dashboardData.passFailCount ? [
    { name: 'Pass', value: dashboardData.passFailCount.pass },
    { name: 'Fail', value: dashboardData.passFailCount.fail },
  ] : [];

  const COLORS = ['#0a9396', '#e76e50'];

  const rangeData = dashboardData && dashboardData.rangeCounts ? [
    { name: '0-50%', value: dashboardData.rangeCounts['0-50%'] },
    { name: '51-60%', value: dashboardData.rangeCounts['51-60%'] },
    { name: '61-70%', value: dashboardData.rangeCounts['61-70%'] },
    { name: '71-80%', value: dashboardData.rangeCounts['71-80%'] },
    { name: '81-90%', value: dashboardData.rangeCounts['81-90%'] },
    { name: '91-100%', value: dashboardData.rangeCounts['91-100%'] },
  ] : [];

  const activityData = dashboardData ? [
    { activityCode: 'ART04', studentCount: dashboardData.activityData[0].studentCount },
    { activityCode: 'INDOOR02', studentCount: dashboardData.activityData[1].studentCount },
    { activityCode: 'OUTDOOR03', studentCount: dashboardData.activityData[2].studentCount },
    { activityCode: 'PROJECT05', studentCount: dashboardData.activityData[3].studentCount },
    { activityCode: 'STAGE01', studentCount: dashboardData.activityData[4].studentCount },
  ] : [];


  return (
    <div >
      {error && <div className="error-message">Error: {error}</div>}
      <StyledHeader className='d-flex justify-content-center'>
        <FaChartLine size={32} />
        <ReactTypingEffect
          text={['Analyze Dashboard of Your Class Annual Performance']}
          speed={100}
          eraseSpeed={50}
          typingDelay={100}
          eraseDelay={1000000} 

        />
        <FaChartPie size={32} />
      </StyledHeader>
      {dashboardData && dashboardData.length === 0 && (
        <div className="no-data-message">No data found.</div>
      )}
      {/* Toggle Button for Analysis and Table View */}
      {dashboardData && (
        <div>

          {/* Analysis Section */}
          {dashboardData && (

            <Row className="justify-content-center">
              <Col xs={8} sm={8} md={5} className="mb-3">
                <Card style={{ height: 'auto' }}>
                  <Card.Title style={{ padding: '20px', paddingBottom: '0px' }}>1. Percentage range vs No. of Student.</Card.Title>
                  <Card.Body>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        data={rangeData}
                        layout="vertical" // Set layout to vertical for horizontal bars
                        margin={{
                          top: 5,
                          right: 30,
                          left: 30,
                          bottom: 20, // Adjusted bottom margin for space between legend and data label
                        }}
                        barSize={35}
                      >
                        <CartesianGrid strokeDasharray="3 1" />
                        <XAxis type="number" /> {/* XAxis for horizontal bar chart */}
                        <YAxis type="category" dataKey="name" /> {/* YAxis for horizontal bar chart */}
                        <Tooltip />
                        <Legend verticalAlign="top" height={45} /> {/* Adjusted legend position */}
                        <Bar dataKey="value" fill="#3b28cc">
                          <LabelList dataKey="value" position="right" /> {/* Adjusted label position */}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <Card.Text className="d-flex"> <VscTriangleRight className="mt-1 me-2" size={20} />This graph shows the no. of student in particular percentage Range.</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={8} sm={8} md={5} className="mb-4">
                <Card style={{ height: 'auto' }}>
                  <Card.Title style={{ padding: '20px', paddingBottom: '0px' }}>2. Activity vs no. of student with A+ grade. </Card.Title>
                  <Card.Body>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        data={activityData}
                        layout="vertical" // Set layout to vertical for horizontal bars
                        margin={{
                          top: 5,
                          right: 30,
                          left: 40,
                          bottom: 20, // Adjusted bottom margin for space between legend and data label
                        }}
                        barSize={35}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" /> {/* CustomXAxis for horizontal bar chart */}
                        <YAxis type="category" dataKey="activityCode" /> {/* CustomYAxis for horizontal bar chart */}
                        <Tooltip />
                        <Legend verticalAlign="top" height={45} /> {/* Adjusted legend position */}
                        <Bar dataKey="studentCount" fill="#ff7300">
                          <LabelList dataKey="studentCount" position="right" /> {/* Adjusted label position */}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <Card.Text className="d-flex"> <VscTriangleRight className="mt-1 me-2" size={25} /> This Graph showing Co-curricular Activity along with No of student having A+ grade.</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={8} sm={8} md={5} className="mb-3">
                <Card style={{ height: 'auto' }}>
                  <Card.Title style={{ padding: '20px', paddingBottom: '0px' }}>3. Subject Average</Card.Title>
                  <Card.Body>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={dashboardData.avgMarksBySubject}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 30,
                          bottom: 40, // Adjusted bottom margin for space between legend and data label
                        }}
                        barSize={35}
                      >
                        <CartesianGrid strokeDasharray="3 1" />
                        <XAxis dataKey="subject" />
                        <YAxis />
                        <Tooltip />
                        <Legend verticalAlign="top" height={45} />
                        <Bar dataKey="avgMarks" fill="#619b8a">
                          <LabelList dataKey="subjectName" position="bottom" />
                          <LabelList dataKey="avgMarks" position="top" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <Card.Text className="d-flex"> <VscTriangleRight className="mt-1 me-2" size={20} /> This graph shows average marks of all student of class in particular subject.</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={8} sm={8} md={5} className="mb-3">
                <Card style={{ height: 'auto' }}>
                  <Card.Title style={{ padding: '20px', paddingBottom: '0px' }}>4. Pass/Fail Distribution</Card.Title>
                  <Card.Body>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={passFailData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label
                        >
                          {passFailData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                    <Card.Text className="d-flex mt-3 mb-2"> <VscTriangleRight className="mt-1 me-2" size={20} />This pie chart gives distribution of pass and failed students</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )
          }
        </div >)
      }
    </div >
  );
};

export default ClassDashboard;