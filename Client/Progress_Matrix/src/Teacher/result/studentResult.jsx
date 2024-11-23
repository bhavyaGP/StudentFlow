import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResultList } from '../../redux/resultSlice';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TiWarning } from "react-icons/ti";


const ResultList = () => {

  const dispatch = useDispatch();
  const resultList = useSelector((state) => state.result?.resultList || []);
  const resultStatus = useSelector((state) => state.result?.status || 'idle');
  const error = useSelector((state) => state.result?.error);

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (resultStatus === 'idle') {
      dispatch(fetchResultList());
    }
  }, [resultStatus, dispatch]);

  useEffect(() => {
    if (resultStatus === 'loading') {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [resultStatus]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error,
        confirmButtonColor: '#8400EB',
      });
    }
  }, [error]);

  useEffect(() => {
    // console.log(resultList.length, resultList);


    if (resultStatus === 'succeeded' && (resultList.length === 0 || resultList.every(student => !student.grades || student.grades.length === 0))) {
      Swal.fire({
        icon: 'info',
        title: 'No Data Found',
        text: 'No results found. Upload result first.',
        confirmButtonColor: '#8400EB',
      });
    }
  }, [resultStatus, resultList]);

  return (
    <div>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : resultList.length > 0 && resultList.some(student => student.grades && student.grades.length > 0) ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ fontFamily: 'Nunito', padding: '20px', width: '70vw' }}>
            <div style={{ backgroundColor: '#e2eafc', border: '3px double #03045e', padding: '20px', borderRadius: '5px', marginBottom: '20px', color: '#03045e' }}>
            <h2 className='text-center fs-4 fw-bold mb-2'>Academic Result</h2>
            <h2 className='text-center fs-4 fw-bold mb-2'>Annual Summer Exam: 2024</h2>
              <p className='text-center'>Exam duration : 15th March 2024 - 25th March 2024</p>
            </div>
            <table className="table table-striped table-bordered" style={{ textAlign: 'center', border: '2px solid #adb5bd' }}>
              <thead>
                <tr className='align-middle'>
                  <th style={{ width: '5%', color: '#e3f2fd', backgroundColor: '#0d47a1' }}>Sr. No</th>
                  <th style={{ width: '7%', color: '#e3f2fd', backgroundColor: '#0d47a1' }}>Roll No</th>
                  <th style={{ width: '13%', color: '#e3f2fd', backgroundColor: '#0d47a1' }}>Name</th>
                  <th style={{ width: '15%', color: '#e3f2fd', backgroundColor: '#0d47a1' }}>Subject</th>
                  <th style={{ width: '10%', color: '#e3f2fd', backgroundColor: '#0d47a1' }}>Marks Obtained</th>
                  <th style={{ width: '10%', color: '#e3f2fd', backgroundColor: '#0d47a1' }}>Total Obtained Marks</th>
                  <th style={{ width: '10%', color: '#e3f2fd', backgroundColor: '#0d47a1' }}>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {resultList.map((student, index) => {
                  const totalMarksObtained = student.grades.reduce((sum, grade) => sum + grade.marksObtained, 0);
                  const totalMaxMarks = student.grades.reduce((sum, grade) => sum + grade.maxMarks, 0);
                  const percentage = ((totalMarksObtained / totalMaxMarks) * 100).toFixed(2);

                  return (
                    <React.Fragment key={student.rollno}>
                      {student.grades.map((grade, gradeIndex) => (
                        <tr key={`${student.rollno}-grade-${grade.subject}`}>
                          {gradeIndex === 0 && (
                            <>
                              <td rowSpan={student.grades.length}>{index + 1}</td>
                              <td rowSpan={student.grades.length}>{student.rollno}</td>
                              <td rowSpan={student.grades.length}>{`${student.firstName} ${student.lastName}`}</td>
                            </>
                          )}
                          <td>{grade.subject}</td>
                          <td style={{ color: grade.marksObtained < 33 ? 'red' : 'inherit' }} >{grade.marksObtained} / {grade.maxMarks}</td>
                          {gradeIndex === 0 && (
                            <>
                              <td rowSpan={student.grades.length}>{totalMarksObtained} / {totalMaxMarks}</td>
                              <td rowSpan={student.grades.length} style={{ fontSize: '18px', fontWeight: '600', color: percentage < 33 || student.grades.some(grade => grade.marksObtained < 33) ? 'red' : 'green' }}>
                                {percentage}%
                                {(percentage < 33 || student.grades.some(grade => grade.marksObtained < 33)) && (
                                  <div style={{ color: 'red', fontSize: '18px', fontWeight: '600' }}>Failed</div>
                                )}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={{ color: 'red', fontSize: '1.3rem', display: 'flex', margin: '2rem' }}><TiWarning className='mt-1 me-2' size={23} />No Result data available. Please upload Result File First.</div>)}
    </div>
  );
};

export default ResultList;