import React, { useState , useEffect } from "react";
import Sidebar from "./sidebar";
import SchoolDashboard from "./SchoolDashboard";
// import ClassWiseDashboard from "./ClassWiseDashboard";
import SchoolAchievements from "../../Achievements/SchoolAchievement";
import ResultDeclaration from "./ResultDeclaration";
import { Container, Row, Col } from "react-bootstrap";
import { selectResultStatus } from '../../redux/userSlice';
import { useSelector } from "react-redux";

const AdminDashboard = () => {
  
  const isResultOut = useSelector(selectResultStatus);

  const [activeComponent, setActiveComponent] = useState(isResultOut ? "school" : "resultDeclaration");

  const renderComponent = () => {
    switch (activeComponent) {
      case "school":
        return <SchoolDashboard />;
      // case "class":
      //   return <ClassWiseDashboard />;
      case "achievements":
        return <SchoolAchievements />;
      case "resultDeclaration":
        return <ResultDeclaration />;
      default:
        return isResultOut ? <SchoolDashboard /> : <ResultDeclaration />;
    }
  };

  return (
    <Container fluid style={{ height: 'calc(100vh - 70px)', overflow: 'hidden' }}>
      <Row>
        {/* Sidebar with Component Titles */}
        <Col xs={2} className="p-0 border-end border-dark overflow-auto" style={{ position: 'fixed', top: 70, bottom: 0, left: 0, backgroundColor: '#f2edf7' }}>
          <Sidebar setActiveComponent={setActiveComponent} activeComponent={activeComponent} />
        </Col>

        {/* Main Content Area */}
        <Col xs={{ span: 10, offset: 2 }} className="p-4" style={{ height: 'calc(100vh - 70px)', overflow: 'auto', backgroundColor: 'whitesmoke' }}>
          {renderComponent()}
        </Col>
      </Row> 
    </Container>
  );
};

export default AdminDashboard;