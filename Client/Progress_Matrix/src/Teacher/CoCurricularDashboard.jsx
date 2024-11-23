import React, { useState } from "react";
import { Button, Card, Row, Col } from "react-bootstrap";
import { FaMusic, FaFutbol, FaBrush, FaBook, FaRunning } from "react-icons/fa";

const CoCurricularDashboard = () => {
  const [viewMode, setViewMode] = useState("overview");

  return (
    <div>
      {/* Toggle Button for Overview and Detailed View */}
      <div className="d-flex justify-content-end mb-4"
        style={{fontFamily : 'Nunito'}}
        >
        <Button
          className={
            viewMode === "overview"
              ? "d-flex align-items-center me-2 bg-[#8400EB] border border-white no-hover"
              : "d-flex align-items-center me-2 bg-white border border-dark no-hover"
          }
          style={{
            color: viewMode === "overview" ? 'white' : 'black',
            fontWeight: '500',
            backgroundColor: viewMode === "overview" ? '#8400EB' : 'white',
            borderColor: viewMode === "overview" ? 'white' : 'black',
            // Disable hover effect
            pointerEvents: 'auto', // Ensures button still works
            transition: 'none', // Removes any animation on hover
            boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.3)"
          }}
          onClick={() => setViewMode("overview")}
        >
          Overview
        </Button>

        <Button
          onClick={() => setViewMode("detailed")}
          className={
            viewMode === "detailed"
              ? "d-flex align-items-center me-2 bg-[#8400EB] border border-white no-hover"
              : "d-flex align-items-center me-2 bg-white border border-dark no-hover"
          }
          style={{
            color: viewMode === "detailed" ? 'white' : 'black',
            fontWeight: '500',
            backgroundColor: viewMode === "detailed" ? '#8400EB' : 'white',
            borderColor: viewMode === "detailed" ? 'white' : 'black',
            // Disable hover effect
            pointerEvents: 'auto', // Ensures button still works
            transition: 'none', // Removes any animation on hover
            boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.3)"
          }}
        >
          Detailed
        </Button>
      </div>

      {/* Overview Section */}
      {viewMode === "overview" ? (
        <Row>
          <Col sm={6} md={4} className="mb-3">
            <Card>
              <Card.Body>
                <div className="d-flex align-items-center">
                  <FaMusic className="me-3" size={30} />
                  <Card.Title>Music Club</Card.Title>
                </div>
                <Card.Text>Achievements and performances by students in the music club.</Card.Text>
                <Button variant="outline-primary" className="w-100">
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} md={4} className="mb-3">
            <Card>
              <Card.Body>
                <div className="d-flex align-items-center">
                  <FaFutbol className="me-3" size={30} />
                  <Card.Title>Sports</Card.Title>
                </div>
                <Card.Text>Performance in inter-school and district level sports competitions.</Card.Text>
                <Button variant="outline-primary" className="w-100">
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} md={4} className="mb-3">
            <Card>
              <Card.Body>
                <div className="d-flex align-items-center">
                  <FaBrush className="me-3" size={30} />
                  <Card.Title>Art Club</Card.Title>
                </div>
                <Card.Text>Exhibitions and achievements in visual arts and crafts.</Card.Text>
                <Button variant="outline-primary" className="w-100">
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} md={4} className="mb-3">
            <Card>
              <Card.Body>
                <div className="d-flex align-items-center">
                  <FaBook className="me-3" size={30} />
                  <Card.Title>Literature Club</Card.Title>
                </div>
                <Card.Text>Writing competitions, debates, and public speaking events.</Card.Text>
                <Button variant="outline-primary" className="w-100">
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} md={4} className="mb-3">
            <Card>
              <Card.Body>
                <div className="d-flex align-items-center">
                  <FaRunning className="me-3" size={30} />
                  <Card.Title>Track & Field</Card.Title>
                </div>
                <Card.Text>Achievements in school-level and district-level track events.</Card.Text>
                <Button variant="outline-primary" className="w-100">
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <div>
          {/* Detailed View Section */}
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Activity</th>
                <th>Participation</th>
                <th>Achievements</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Music Club</td>
                <td>15 Students</td>
                <td>3 Gold Medals</td>
                <td>Great performances in singing competition.</td>
              </tr>
              <tr>
                <td>Sports</td>
                <td>20 Students</td>
                <td>5 District-level wins</td>
                <td>Outstanding in football and athletics.</td>
              </tr>
              <tr>
                <td>Art Club</td>
                <td>12 Students</td>
                <td>2 Exhibitions</td>
                <td>Successful exhibitions in school art gallery.</td>
              </tr>
              <tr>
                <td>Literature Club</td>
                <td>10 Students</td>
                <td>2 Debate Wins</td>
                <td>Excellent debating and writing skills.</td>
              </tr>
              <tr>
                <td>Track & Field</td>
                <td>18 Students</td>
                <td>3 Gold Medals</td>
                <td>Great results in district track events.</td>
              </tr>
              {/* Add more rows as necessary */}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CoCurricularDashboard;
