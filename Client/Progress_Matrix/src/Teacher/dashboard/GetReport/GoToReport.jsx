import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReport } from '../../../redux/ReportSlice';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import ReportGenerator from './reportGenerator';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';


const GoToReport = ({ rollno }) => {
  const dispatch = useDispatch();
  const report = useSelector((state) => state.report);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (rollno) {
      Swal.fire({
        title: 'Loading...',
        text: 'Fetching report data',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      dispatch(fetchReport(rollno)).then((action) => {
        Swal.close();
        if (action.meta.requestStatus === 'fulfilled') {
          // console.log("Report Data:", action.payload);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch report data',
          });
        }
      });
    }
  }, [dispatch, rollno]);

  if (!report.data) {
    return null; // or a loading indicator
  }

  // console.log("Report Data2:", report.data.studentDetails.school.name);


  return (
    <Container className="py-4">
      <Card>
        <Card.Header className='d-flex' style={{ justifyContent: 'space-between', color: '#03045e' }}>
          <Card.Title className="m-0 h4">Student Report Generator</Card.Title>
          <Card.Title className="m-0 h4">Student : {rollno}</Card.Title>
        </Card.Header>
        <Card.Body>
          {showPreview ? (
            <div style={{ width: '100%', height: '600px', border: '1px solid #dee2e6', borderRadius: '4px', overflow: 'hidden' }}>
              <PDFViewer style={{ width: "100%", height: "100%" }}>
                <ReportGenerator ReportData={report.data} />
              </PDFViewer>
              
            </div>
          ) : (
            <div className="text-center p-4 bg-light border rounded">
              <p className="text-muted mb-0">Click 'Generate Preview' to view the report</p>
            </div>
          )}
        </Card.Body>
        <Card.Footer>
          <Row className="justify-content-end">
            <Col xs="auto">
              <Button
                variant={showPreview ? "outline-primary" : "primary"}
                onClick={() => setShowPreview(!showPreview)}
                className="me-2"
              >
                <i className="bi bi-eye me-2"></i>
                {showPreview ? 'Hide Preview' : 'Generate Preview'}
              </Button>

              <PDFDownloadLink
                document={<ReportGenerator ReportData={report.data} />}
                fileName={`${report.data.studentDetails.rollno}-report.pdf`}
                className="text-decoration-none"
              >
                {({ loading }) => (
                  <Button variant="success" disabled={loading}>
                    <i className="bi bi-download me-2"></i>
                    {loading ? 'Loading...' : 'Download PDF'}
                  </Button>
                )}
              </PDFDownloadLink>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default GoToReport;