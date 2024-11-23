import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Row, Col } from "react-bootstrap";
import { FaChartBar, FaTable , FaChartLine ,FaChartPie } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import axios from 'axios';
import Swal from 'sweetalert2';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { VscTriangleRight } from "react-icons/vsc";
import ReactTypingEffect from 'react-typing-effect';
import styled, { keyframes } from 'styled-components';



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
  background-color: #061a40;
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

const SchoolDashboard = () => {
  const [viewMode, setViewMode] = useState("analysis");
  const [graphData, setGraphData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [dataGraph2, setDataGraph2] = useState([]);
  const [dataGraph3, setDataGraph3] = useState([]);
  const [dataGraph4, setDataGraph4] = useState([]);


  // fetching graph data
  useEffect(() => {
    const fetchData = async () => {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:3000/api/admin/',
        withCredentials: true,
      };

      try {
        const response = await axios.request(config);
        console.log(response.data);
        setGraphData(response.data.graph1);
        setDataGraph2(response.data.graph2);
        setDataGraph3(response.data.graph3);
        setDataGraph4(response.data.graph4);

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
        });
      }
    };

    fetchData();
  }, []);

  // const data81plus = graphData.map(item => ({

  useEffect(() => {
    if (viewMode === "table") {
      const fetchTableData = async () => {
        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'http://localhost:3000/api/admin/tabulardata',
          withCredentials: true,
        };

        try {
          const response = await axios.request(config);
          console.log(JSON.stringify(response.data));
          const sortedTable1 = response.data.table1.sort((a, b) => a.stuID - b.stuID);
          const sortedTable2 = response.data.table2.sort((a, b) => a.stuID - b.stuID);
          setTableData({ table1: sortedTable1, table2: sortedTable2 });
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
          });
        }
      };

      fetchTableData();
    }
  }, [viewMode]);

  const dataPassFail = graphData.map(item => ({
    std: `Std ${item.std}`,
    pass: parseInt(item.pass),
    fail: parseInt(item.fail),
  }));


  return (
    <div>
      {/* Toggle Button for Analysis and Table View */}
      <div className="d-flex justify-content-end mb-4" style={{ fontFamily: 'Nunito' }}>
        <Button
          className={
            viewMode === "analysis"
              ? "d-flex align-items-center me-2 bg-[#8400EB] border border-white no-hover"
              : "d-flex align-items-center me-2 bg-white border border-dark no-hover"
          }
          style={{
            color: viewMode === "analysis" ? 'white' : 'black',
            fontWeight: '500',
            backgroundColor: viewMode === "analysis" ? '#8400EB' : 'white',
            borderColor: 'black',
            pointerEvents: 'auto',
            transition: 'none',
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
            color: viewMode === "table" ? 'white' : 'black',
            fontWeight: '500',
            backgroundColor: viewMode === "table" ? '#8400EB' : 'white',
            borderColor: 'black',
            pointerEvents: 'auto',
            transition: 'none',
            boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.3)"
          }}
        >
          <FaTable className="me-1" size={20} /> Table Data
        </Button>
      </div>

      <StyledHeader className='d-flex justify-content-center'>
        <FaChartLine size={32} />
        <ReactTypingEffect
          text={['Analyze Dashboard of Performance of overall School']}
          speed={80}
          eraseSpeed={50}
          typingDelay={100}
          eraseDelay={1000000}

        />
        <FaChartPie size={32} />
      </StyledHeader>
      {/* Analysis Section */}
      {viewMode === "analysis" ? (
        // Pass fail distribution all std
        <Row className="justify-content-center">
          <Col xs={12} sm={12} md={5} className="mb-3">
            <Card style={{ height: 'auto' }}>
              <Card.Title style={{ padding: '20px', paddingBottom: '0px' }}>1. Pass and Fail vs standard.</Card.Title>
              <Card.Body>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={dataPassFail} barSize={50}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="std" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pass" fill="#248232">
                      <LabelList dataKey="pass" position="top" />
                    </Bar>
                    <Bar dataKey="fail" fill="#bd1e1e">
                      <LabelList dataKey="fail" position="top" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <Card.Text className="d-flex"> <VscTriangleRight className="mt-1 me-2" size={20} />This Graph will show pass and fail student bars for all the Standard.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={8} sm={8} md={5} className="mb-4">
            <Card style={{ height: 'auto' }}>
              <Card.Title style={{ padding: '20px', paddingBottom: '0px' }}>2. Students having {`>`} 80%. </Card.Title>
              <Card.Body>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={dataGraph2} barSize={50}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="std" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="no_of_students" fill="#00b4d8">
                      <LabelList dataKey="no_of_students" position="top" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <Card.Text className="d-flex"> <VscTriangleRight className="mt-1 me-2" size={20} />This graph shows no of student having {`>`} 80% for all standard.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={8} sm={8} md={5} className="mb-3">
            <Card style={{ height: 'auto' }}>
              <Card.Title style={{ padding: '20px', paddingBottom: '0px' }}>3. Students having {`<`} 50%.</Card.Title>
              <Card.Body>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={dataGraph3} barSize={50}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="std" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="no_of_students" fill="#7b2cbf">
                      <LabelList dataKey="no_of_students" position="top" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <Card.Text className="d-flex mt-3"> <VscTriangleRight className="mt-2 me-2" size={20} /> This graph shows no of student having {`<`} 50% for all standard.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={8} sm={8} md={5} className="mb-3">
            <Card style={{ height: 'auto' }}>
              <Card.Title style={{ padding: '20px', paddingBottom: '0px' }}>4. Student having % in range of (50-80)%</Card.Title>
              <Card.Body>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={dataGraph4} barSize={50}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="std" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="no_of_students" fill="#f0ad4e">
                      <LabelList dataKey="no_of_students" position="top" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <Card.Text className="d-flex mt-3 mb-2"> <VscTriangleRight className="mt-1 me-2" size={20} />This graph shows no of student having % in range of (50-80)% for all standard.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <div style={{ fontFamily: 'Nunito', width: '85%', margin: "0 auto" }}>
          {/* Table Data Section */}
          <div>
            <div style={{ backgroundColor: '#dde7c7', border: '3px double #03045e', padding: '20px', borderRadius: '5px', marginBottom: '1rem', color: '#386641' }}>
              <h2 className='text-center fs-4 fw-bold mb-2'>Academic Result</h2>
              <h2 className='text-center fs-4 fw-bold mb-2'>Annual Summer Exam: 2024</h2>
              <h2 className='text-center fs-4 fw-bold mb-2'>Table - 1 : Toppers of all Standard !</h2>
            </div>

            <table className="table table-striped table-bordered table-hover" style={{ textAlign: 'center', border: '2px solid #adb5bd' }}>
              <thead>
                <tr className='align-middle'>
                  <th style={{ color: '#e3f2fd', backgroundColor: '#08a045' }}>Student ID</th>
                  <th style={{ color: '#e3f2fd', backgroundColor: '#08a045' }}>Student Name</th>
                  <th style={{ color: '#e3f2fd', backgroundColor: '#08a045' }}>Standard</th>
                  <th style={{ color: '#e3f2fd', backgroundColor: '#08a045' }}>% of Student in Academic</th>
                </tr>
              </thead>
              <tbody>
                {tableData.table1 && tableData.table1.map((row, index) => (
                  <tr key={index}>
                    <td>{row.stuID}</td>
                    <td>{row["student name"]}</td>
                    <td>{row.Standard}</td>
                    <td>{row["% of student in Academic"]}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <div style={{ backgroundColor: '#f6cacc', border: '3px double #03045e', padding: '20px', borderRadius: '5px', marginBottom: '20px', marginTop: '5rem', color: '#9c191b' }}>
              <h2 className='text-center fs-4 fw-bold mb-2'>Academic Result</h2>
              <h2 className='text-center fs-4 fw-bold mb-2'>Annual Summer Exam: 2024</h2>
              <h2 className='text-center fs-4 fw-bold mb-2'>Table - 2 : Failed Student of all Standard !</h2>
            </div>
            <table className="table table-striped table-bordered table-hover" style={{ textAlign: 'center', border: '2px solid #adb5bd' }}>
              <thead>
                <tr>
                  <th style={{ color: '#e3f2fd', backgroundColor: '#bd1f21' }}>Student ID</th>
                  <th style={{ color: '#e3f2fd', backgroundColor: '#bd1f21' }}>Student Name</th>
                  <th style={{ color: '#e3f2fd', backgroundColor: '#bd1f21' }}>Standard</th>
                </tr>
              </thead>
              <tbody>
                {tableData.table2 && tableData.table2.map((row, index) => (
                  <tr key={index}>
                    <td>{row.stuID}</td>
                    <td>{row["student name"]}</td>
                    <td>{row.Standard}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolDashboard;