import React, { useState } from "react";
import Sidebar from "./sidebar";
import ClassDashboard from "./ClassDashboard";
import SchoolAchievements from "../../Achievements/SchoolAchievement";
import Reporting from "./GetReport/ReportList";
import { Container, Row, Col } from "react-bootstrap";
import { selectResultStatus } from '../../redux/userSlice';
import { useSelector } from "react-redux";

const AdminDashboard = () => {

  const isResultOut = useSelector(selectResultStatus);
  // console.log(isResultOut);
  
  const [activeComponent, setActiveComponent] = useState(isResultOut ? "class" : 'achievements');

  const renderComponent = () => {
    switch (activeComponent) {
      case "class":
        return <ClassDashboard />;
      case "achievements":
        return <SchoolAchievements />;
      case "reporting":
        return <Reporting />;
      default:
        return isResultOut ? <ClassDashboard /> : <SchoolAchievements />;
    }
  };

  return (
    <Container fluid style={{ height: 'calc(100vh - 70px)', overflow: 'hidden' }}>
      <Row>
        {/* Sidebar with Component Titles */}
        <Col xs={2} className="p-0 border-end border-dark overflow-auto" style={{ position: 'fixed', top: 70, bottom: 0, left: 0, backgroundColor: '#f2edf7', minWidth: "150px" }}>
          <Sidebar setActiveComponent={setActiveComponent} activeComponent={activeComponent} />
        </Col>

        {/* Main Content Area */}
        <Col xs={{ span: 10, offset: 2 }} className="p-4" style={{ height: 'calc(100vh - 70px)', overflow: 'auto', backgroundColor: '#f2fcfc' }}>
          {renderComponent()}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;