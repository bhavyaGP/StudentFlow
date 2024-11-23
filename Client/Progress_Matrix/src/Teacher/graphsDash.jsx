import React, { useState } from 'react';
import { Bar, Pie, BarChart, PieChart, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';


// Mock data - replace with actual data from your CSV upload
const subjectAverages = [
  { subject: 'MATH101', average: 75 },
  { subject: 'SCI201', average: 60 },
  { subject: 'ENG301', average: 82 },
  { subject: 'SS401', average: 35 },
];

const passFailRatio = [
  { name: 'Pass', value: 17 },
  { name: 'Fail', value: 4 },
];

const percentageRanges = [
  { range: '0-50%', students: 5 },
  { range: '51-60%', students: 10 },
  { range: '61-70%', students: 15 },
  { range: '71-80%', students: 25 },
  { range: '81-90%', students: 30 },
  { range: '91-100%', students: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];


const ProgressMatrixDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
  };

  return (
    <div className="p-4 space-y-4 bg-white text-grey-800">
      <h1 className="text-2xl font-bold">Progress Matrix Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Subject Averages Chart */}
        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-2">Subject Averages</h2>
          <ResponsiveContainer width="80%" height={300}>
            <BarChart data={subjectAverages}>
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="average" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pass/Fail Ratio Chart */}
        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-2">Pass/Fail Ratio</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={passFailRatio}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {passFailRatio.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Percentage Ranges Chart */}
        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-2">Percentage Ranges</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={percentageRanges}>
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="students" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Student List Table */}
      <div className="border rounded p-4">
        <h2 className="text-lg font-semibold mb-2">Student List</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Name</th>
              <th className="text-left">Average Score</th>
              <th className="text-left">Performance</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Aarav Sharma', averageScore: 85, performance: 'Excellent' },
              { name: 'Ankit Patel', averageScore: 72, performance: 'Good' },
              { name: 'Aneri Singh', averageScore: 63, performance: 'Average' },
              { name: 'Nikita Gupta', averageScore: 91, performance: 'Outstanding' },
            ].map((student) => (
              <tr key={student.name} onClick={() => handleStudentClick(student)} className="cursor-pointer hover:bg-gray-100">
                <td>{student.name}</td>
                <td>{student.averageScore}</td>
                <td>{student.performance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected Student Details */}
      {selectedStudent && (
        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-2">{selectedStudent.name} - Detailed Performance</h2>
          <p>Average Score: {selectedStudent.averageScore}</p>
          <p>Performance: {selectedStudent.performance}</p>
          <div>
            <p>Progress:</p>
            <div className="w-full bg-gray-200 rounded">
              <div
                className="bg-blue-600 rounded h-2"
                style={{ width: `${selectedStudent.averageScore}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressMatrixDashboard;