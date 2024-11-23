import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { fetchReport } from '../../../redux/ReportSlice';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import SchoolLogo from '../../../assets/gvm.png';
import { format } from 'date-fns'

//style for reportPDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    backgroundColor: '#f8f9fa', // Light background for page
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#ffffff', // White background for header
    borderRadius: 8,
    borderBottomWidth: 3,
    borderBottomColor: '#4a90e2',
  },
  logoSection: {
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 2,
    borderRightColor: '#e0e0e0',
    paddingRight: 15,
  },
  schoolInfo: {
    width: '60%',
    paddingLeft: 15,
    justifyContent: 'center',
  },
  schoolName: {
    fontSize: 24,
    marginBottom: 5,
    color: '#2c3e50', // Dark blue text
    fontWeight: 'bold',
  },
  slogan: {
    fontSize: 12,
    marginBottom: 5,
    fontStyle: 'italic',
    color: '#7f8c8d', // Gray text
  },
  academicYear: {
    fontSize: 14,
    marginBottom: 20,
    color: '#e74c3c', // Red text for emphasis
  },
  section: {
    marginTop: 40,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4a90e2', // Blue accent
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    backgroundColor: '#caf0f8',   // Light blue background for section title
    color: '#03045e',  // Dark blue text
    padding: 8,
    borderRadius: 4,
    textTransform: 'uppercase',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  label: {
    width: 150,
    fontSize: 14,
    color: '#34495e', // Dark gray
    fontWeight: 'bold',
  },
  percentage: {
    fontSize: 18,
    color: '#023e8a',
    fontWeight: 'bold',
    marginTop: 20,
  },
  value: {
    fontSize: 14,
    flex: 1,
    color: '#14213d', // Slightly darker text
  },
  table: {
    display: 'table',
    width: 'auto',
    marginBottom: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableHeader: {
    backgroundColor: '#dcdcdd', //table header color
  },
  tableHeaderText: {
    color: '#13505b',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 8,
    borderStyle: 'solid',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  subjectCell: {
    width: '40%',
  },
  marksCell: {
    width: '30%',
    textAlign: 'center',
  },
  achievementItem: {
    marginBottom: 8,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 16,
  },
  achievementBullet: {
    color: '#4a90e2',
    fontSize: 16,
    marginRight: 5,
  },
  logo: {
    width: 120,
    height: 120,
    objectFit: 'contain',
  },
  totalRow: {
    backgroundColor: '#f8f9fa',
    fontWeight: 'bold',
  },
  percentageBox: {
    backgroundColor: '#4a90e2',
    padding: 10,
    borderRadius: 4,
    marginTop: 10,
  },
  percentageText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  remarksBox: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginTop: 10,
  },
  graphSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    alignItems: 'center',
  },
  graphTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
    textAlign: 'center',
  }
});

const ReportGenerator = ({ ReportData }) => {

  console.log("report generator recieved : ", ReportData);
  

  const getGrade = (marks) => {
    if (marks >= 45) return 'A+';
    if (marks >= 40) return 'A';
    if (marks >= 35) return 'B+';
    if (marks >= 30) return 'B';
    if (marks >= 25) return 'C';
    return 'D';
  };

  const data = {
    schoolName: ReportData.studentDetails.school.name,
    schoolAddress: ReportData.studentDetails.school.address,
    schoolSlogan: 'A Building With Four Walls And Tomorrow Inside',
    student: ReportData.studentDetails,
    academics: ReportData.grades,
    totalObtained: ReportData.grades.reduce((total, grade) => total + grade.marksObtained, 0),
    totalMarks: ReportData.grades.reduce((total, grade) => total + grade.maxMarks, 0),
    coCurricular: ReportData.activities,
    achievements: ReportData.achievements,
    remarks: ReportData.grades.reduce((total, grade) => total + grade.marksObtained, 0) >= 430
      ? "An excellent student with outstanding academic performance. Great Job! Congratulation!"
      : ReportData.grades.reduce((total, grade) => total + grade.marksObtained, 0) >= 350
        ? "A good student with satisfactory academic performance. Good Luck."
        : "A student with poor academic performance. Needs improvement.",
    schoolLogo: SchoolLogo,
    resultStatus: ReportData.grades.every(subject => subject.marksObtained >= 33) ? "Pass" : "Fail",
  };

  // console.log(data.totalMarks);
  

  if (!ReportData || !ReportData.studentDetails ||  !ReportData.grades || data.totalMarks === 0) {
    return <Text>Invalid report data</Text>;
  }


  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <Image style={styles.logo} src={data.schoolLogo} />
          </View>
          <View style={styles.schoolInfo}>
            <Text style={styles.schoolName}>{data.schoolName}</Text>
            <Text style={styles.slogan}>{data.schoolSlogan}</Text>
            <Text style={styles.slogan}>Address : {data.schoolAddress}</Text>
            <Text style={styles.academicYear}>Academic Year: 2024-25</Text>
          </View>
        </View>

        {/* Student Details Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <Text>Student Details</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Student Name:</Text>
            <Text style={styles.value}>{`${data.student.firstName} ${data.student.lastName}`}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Roll No:</Text>
            <Text style={styles.value}>{data.student.rollno}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>GR No:</Text>
            <Text style={styles.value}>{data.student.GRno}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Standard:</Text>
            <Text style={styles.value}>{data.student.standard}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Class Teacher:</Text>
            <Text style={styles.value}>{data.student.teacher.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date of Birth:</Text>
            <Text style={styles.value}>{data.student.dateOfBirth}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Parent Name:</Text>
            <Text style={styles.value}>{data.student.parentName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Contact Number:</Text>
            <Text style={styles.value}>{data.student.parentContact}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{data.student.address}</Text>
          </View>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        {/* Academic Results Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <Text>Academic Results</Text>
            <Text>Result Status : {data.resultStatus}</Text>
          </View>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={[styles.tableCell, styles.subjectCell]}>
                <Text>Subject</Text>
              </View>
              <View style={[styles.tableCell, styles.marksCell]}>
                <Text>Marks Obtained</Text>
              </View>
              <View style={[styles.tableCell, styles.marksCell]}>
                <Text>Total Marks</Text>
              </View>
            </View>
            {data.academics.map((subject, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={[styles.tableCell, styles.subjectCell]}>
                  <Text>{subject.subject}</Text>
                </View>
                <View style={[styles.tableCell, styles.marksCell]}>
                  <Text>{subject.marksObtained}</Text>
                </View>
                <View style={[styles.tableCell, styles.marksCell]}>
                  <Text>{subject.maxMarks}</Text>
                </View>
              </View>
            ))}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={[styles.tableCell, styles.subjectCell]}>
                <Text>Total</Text>
              </View>
              <View style={[styles.tableCell, styles.marksCell]}>
                <Text>{data.totalObtained}</Text>
              </View>
              <View style={[styles.tableCell, styles.marksCell]}>
                <Text>{data.totalMarks}</Text>
              </View>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.percentage}>PERCENTAGE : </Text>
            <Text style={styles.percentage}>{((data.totalObtained / data.totalMarks) * 100).toFixed(2)}</Text>
          </View>
        </View>

        {/* Co-curricular Activities Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <Text>Co-curricular Activities</Text>
          </View>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={[styles.tableCell, styles.subjectCell]}>
                <Text>Activity</Text>
              </View>
              <View style={[styles.tableCell, styles.marksCell]}>
                <Text>Marks</Text>
              </View>
              <View style={[styles.tableCell, styles.marksCell]}>
                <Text>Grade</Text>
              </View>
            </View>
            {data.coCurricular.map((activity, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={[styles.tableCell, styles.subjectCell]}>
                  <Text>{activity.activityName}</Text>
                </View>
                <View style={[styles.tableCell, styles.marksCell]}>
                  <Text>{activity.marksObtained}</Text>
                </View>
                <View style={[styles.tableCell, styles.marksCell]}>
                  <Text>{getGrade(activity.marksObtained)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        {/* Achievements Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <Text>Achievements</Text>
          </View>
          {data.achievements.length > 0 ? (
            data.achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementItem}>
                <Text>{`• Title : ${achievement.title}`}</Text>
                <Text>{`Date : ${format(new Date(achievement.date), 'dd MMMM, yyyy')}`}</Text>
              </View>
            ))
          ) : (
            <Text>No Achievement</Text>
          )}
        </View>

        {/* Remarks Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <Text>Remarks</Text>
          </View >
          <Text style={styles.achievementItem}>{data.remarks}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ReportGenerator;