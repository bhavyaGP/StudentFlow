// import React, { useRef } from 'react';
// import { Bar, Pie, Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   PointElement,
//   LineElement,
// } from 'chart.js';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   PointElement,
//   LineElement
// );

// const studentData = {
//   school: {
//     name: "Charusat VidyaBhavan",
//     logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROxzj0lRIq2Pf8NRgY4d5LH1PYgNy0IRRvXQ&s",
//     academicYear: "2024-2025",
//     address: "Changa , anand-388421"
//   },
//   student: {
//     name: "Aarav Sharma",
//     rollNo: "10001",
//     standard: "10th Grade",
//     classTeacher: "Bhavya Prajapati",
//     parents: "Ashok Sharma",
//     address: "01, Nilam Residency , vadtal Road , Anand",
//     parentContact: "+919999999999"
//   },
//   academicMarks: [
//     { subject: "Mathematics", marks: 95 },
//     { subject: "Science", marks: 92 },
//     { subject: "English", marks: 88 },
//     { subject: "History", marks: 85 },
//     { subject: "Art", marks: 98 }
//   ],
//   cocurricularActivities: [
//     { activity: "Debate Club", grade: "A" },
//     { activity: "Chess Club", grade: "A+" },
//     { activity: "Environmental Club", grade: "A" }
//   ],
//   attendance: 98,
//   achievements: [
//     "1st place in State Science Fair",
//     "Winner of Springfield Spelling Bee"
//   ]
// };

// const StudentReportWithPDF = () => {
//   const reportRef = useRef(null);

//   const averageMarksData = {
//     labels: studentData.academicMarks.map(subject => subject.subject),
//     datasets: [{
//       label: 'Average Marks',
//       data: studentData.academicMarks.map(subject => subject.marks),
//       backgroundColor: 'rgba(75, 192, 192, 0.6)',
//     }]
//   };

//   const passFailData = {
//     labels: ['Pass', 'Fail'],
//     datasets: [{
//       data: [90, 10],
//       backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
//     }]
//   };

//   const percentageRangeData = {
//     labels: ['0-50%', '51-60%', '61-70%', '71-80%', '81-90%', '91-100%'],
//     datasets: [{
//       label: 'Number of Students',
//       data: [5, 10, 15, 25, 30, 15],
//       backgroundColor: 'rgba(153, 102, 255, 0.6)',
//     }]
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       title: {
//         display: true,
//         text: 'Student Performance',
//       },
//     },
//   };

//   const handleGeneratePDF = async () => {
//     const content = reportRef.current;
//     const canvas = await html2canvas(content);
//     const imgData = canvas.toDataURL('image/png');
//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = pdf.internal.pageSize.getHeight();
//     const imgWidth = canvas.width;
//     const imgHeight = canvas.height;
//     const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
//     const imgX = (pdfWidth - imgWidth * ratio) / 2;
//     const imgY = 30;

//     pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
//     pdf.save('student_report.pdf');
//   };

//   return (
//     <div ref={reportRef} style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//         <div>
//           <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>{studentData.school.name}</h1>
//           <p>{studentData.school.address}</p>
//           <p>Academic Year: {studentData.school.academicYear}</p>
//         </div>
//         <img src={studentData.school.logo} alt="School Logo" style={{ width: '100px', height: '100px', objectFit: 'contain' }} />
//       </div>

//       <div style={{ backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
//         <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Student Information</h2>
//         <p><strong>Name:</strong> {studentData.student.name}</p>
//         <p><strong>Roll No:</strong> {studentData.student.rollNo}</p>
//         <p><strong>Standard:</strong> {studentData.student.standard}</p>
//         <p><strong>Class Teacher:</strong> {studentData.student.classTeacher}</p>
//         <p><strong>Parents:</strong> {studentData.student.parents}</p>
//         <p><strong>Address:</strong> {studentData.student.address}</p>
//         <p><strong>Parent Contact:</strong> {studentData.student.parentContact}</p>
//       </div>

//       <div style={{ backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
//         <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Academic Performance</h2>
//         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//           <thead>
//             <tr>
//               <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Subject</th>
//               <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Marks</th>
//             </tr>
//           </thead>
//           <tbody>
//             {studentData.academicMarks.map((subject, index) => (
//               <tr key={index}>
//                 <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{subject.subject}</td>
//                 <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{subject.marks}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div style={{ backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
//         <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Co-curricular Activities</h2>
//         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//           <thead>
//             <tr>
//               <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Activity</th>
//               <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Grade</th>
//             </tr>
//           </thead>
//           <tbody>
//             {studentData.cocurricularActivities.map((activity, index) => (
//               <tr key={index}>
//                 <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{activity.activity}</td>
//                 <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{activity.grade}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div style={{ backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
//         <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Attendance</h2>
//         <p>Attendance: {studentData.attendance}%</p>
//       </div>

//       {studentData.achievements.length > 0 && (
//         <div style={{ backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
//           <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Achievements</h2>
//           <ul>
//             {studentData.achievements.map((achievement, index) => (
//               <li key={index}>{achievement}</li>
//             ))}
//           </ul>
//         </div>
//       )}

//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
//         <div style={{ backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px', padding: '20px' }}>
//           <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Average Marks by Subject</h2>
//           <Bar data={averageMarksData} options={chartOptions} />
//         </div>
//         <div style={{ backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px', padding: '20px' }}>
//           <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Pass/Fail Ratio</h2>
//           <Pie data={passFailData} options={chartOptions} />
//         </div>
//         <div style={{ backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px', padding: '20px', gridColumn: '1 / -1' }}>
//           <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Percentage Range Distribution</h2>
//           <Line data={percentageRangeData} options={chartOptions} />
//         </div>
//       </div>

//       <button 
//         onClick={handleGeneratePDF}
//         style={{
//           backgroundColor: '#4CAF50',
//           border: 'none',
//           color: 'white',
//           padding: '15px 32px',
//           textAlign: 'center',
//           textDecoration: 'none',
//           display: 'inline-block',
//           fontSize: '16px',
//           margin: '4px 2px',
//           cursor: 'pointer',
//           borderRadius: '4px'
//         }}
//       >
//         Generate PDF
//       </button>
//     </div>
//   );
// };

import React, { useEffect, useRef, useState } from 'react';
import { Page, Text, View, Document, StyleSheet, Image, PDFDownloadLink } from '@react-pdf/renderer';
import { Chart } from 'chart.js/auto';

// Create styles
const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 10 },
  title: { fontSize: 20, marginBottom: 10 },
  text: { fontSize: 12, marginBottom: 5 },
  image: { width: '100%', height: 'auto', marginBottom: 10 }, // Ensure full width for image
});

// Create PDF document
const MyDocument = ({ chartImage }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Student Report</Text>
        <Text style={styles.text}>Name: John Doe</Text>
        <Text style={styles.text}>Class: 10</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Performance Graph</Text>
        {chartImage && <Image src={chartImage} style={styles.image} />}
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Activity Results</Text>
        <Text style={styles.text}>Activity 1: Winner</Text>
        <Text style={styles.text}>Activity 2: Participant</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Remarks</Text>
        <Text style={styles.text}>Excellent performance in academics and extracurricular activities.</Text>
      </View>
    </Page>
  </Document>
);

const StudentReport = () => {
  const chartRef = useRef(null);
  const [chartImage, setChartImage] = useState(null);

  useEffect(() => {
    // Create a chart using Chart.js
    const ctx = chartRef.current.getContext('2d');
    
    // Set the canvas dimensions explicitly
    chartRef.current.width = 800;  // Set a high width for better resolution
    chartRef.current.height = 400; // Set a high height for better resolution

    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Math', 'Science', 'English', 'Social Studies'],
        datasets: [{
          label: 'Average Marks',
          data: [85, 90, 78, 88],
          backgroundColor: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'],
        }]
      },
      options: {
        responsive: false,  // Disable responsiveness to ensure fixed size
        maintainAspectRatio: false,
        scales: {
          x: { ticks: { font: { size: 16 } } },  // Customize text sizes for better visibility
          y: { ticks: { font: { size: 16 } } },
        }
      }
    });

    // Convert chart to image after rendering
    setTimeout(() => {
      const image = chartRef.current.toDataURL('image/png');
      setChartImage(image);
    }, 1000); // Timeout to ensure chart is rendered before conversion

    return () => {
      myChart.destroy(); // Cleanup chart instance on component unmount
    };
  }, []);

  return (
    <div>
      {/* Hidden canvas for chart rendering */}
      <canvas ref={chartRef} style={{ display: 'none' }}></canvas>

      {/* PDF Download Link */}
      <PDFDownloadLink document={<MyDocument chartImage={chartImage} />} fileName="student-report.pdf">
        {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
      </PDFDownloadLink>
    </div>
  );
};

export default StudentReport;

