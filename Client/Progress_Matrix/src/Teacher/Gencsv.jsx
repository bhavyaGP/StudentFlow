import React, { useRef, useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Chart } from 'chart.js/auto';
import html2canvas from 'html2canvas';

const DownloadReport = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [chartReady, setChartReady] = useState(false); // Track if chart is rendered

  const studentData = {
    studentDetails: {
      name: 'John Doe',
      class: '10',
      teacher: {
        name: 'Bhavya Prajapati'
      },
      school: {
        name: 'Gujarat School',
        address: 'Ahmedabad'
      }
    }
  };

  useEffect(() => {
    if (chartRef.current && !chartInstanceRef.current) {
      const ctx = chartRef.current.getContext('2d');
      chartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Math', 'Science', 'English'],
          datasets: [{
            label: 'Scores',
            data: [85, 90, 78],
            backgroundColor: ['rgba(75, 192, 192, 0.2)'],
            borderColor: ['rgba(75, 192, 192, 1)'],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
      setChartReady(true);
    }
  }, []);

  const generateReport = async () => {
    const doc = new jsPDF();
    doc.text(`Student Name: ${studentData.studentDetails.name}`, 10, 10);
    doc.text(`Class: ${studentData.studentDetails.class}`, 10, 20);
    doc.text(`Teacher: ${studentData.studentDetails.teacher.name}`, 10, 30);
    doc.text(`School: ${studentData.studentDetails.school.name}`, 10, 40);
    doc.text(`Address: ${studentData.studentDetails.school.address}`, 10, 50);

    if (chartReady) {
      const chartElement = chartRef.current;
      const canvas = await html2canvas(chartElement);
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 10, 60, 180, 100);
    }

    doc.save('report.pdf');
  };

  return (
    <div>
      <button onClick={generateReport}>Generate Report</button>
      <canvas ref={chartRef} />
    </div>
  );
};

export default DownloadReport;