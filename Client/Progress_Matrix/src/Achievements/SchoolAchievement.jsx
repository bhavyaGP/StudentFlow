import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "react-bootstrap";
import { fetchAchievements } from "../redux/AchievementSlice"; 
import { format } from "date-fns";
import Swal from "sweetalert2";

const SchoolAchievements = () => {

  const dispatch = useDispatch();
  const achievements = useSelector((state) => state.achievements.list);
  const status = useSelector((state) => state.achievements.status);
  const error = useSelector((state) => state.achievements.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAchievements());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (status === 'succeeded' && achievements.length === 0) {
      Swal.fire({
        title: "No Data Found",
        text: "No achievements available.",
        icon: "info",
        confirmButtonText: "OK",
      });
    }
  }, [status, achievements]);

  return (
    <div style={{ fontFamily: 'Nunito', padding: '20px' }}>
      <div className="d-flex justify-content-center">
        <div style={{ backgroundColor: 'white',width:'100%', padding: '15px', borderRadius: '10px', border: 'double 4px' }}>
          <h1 className="d-flex justify-content-center fs-2">🏆 School Achievements 🏆</h1>
          <h2 className="d-flex justify-content-center fs-4 text-success">
            🎉 Congratulations to all our outstanding students! 🎉
          </h2>
          <p className="d-flex justify-content-center fs-5">
            We are incredibly proud of your hard work and dedication. Keep shining!
          </p>
        </div>
      </div>
      {status === 'loading' && <p>Loading achievements...</p>}
      {status === 'failed' && <p>Error: {error}</p>}
      {status === 'succeeded' && (
        <Table className="table table-striped table-bordered" style={{ textAlign: 'center', border: '2px solid #adb5bd', marginTop:'2rem' }}>
          <thead>
            <tr>
              <th style={{color: 'white', backgroundColor: '#03045e'}}>Serial No</th>
              <th style={{color: 'white', backgroundColor: '#03045e'}}>Student GR Number</th>
              <th style={{color: 'white', backgroundColor: '#03045e'}}>Student Name</th>
              <th style={{color: 'white', backgroundColor: '#03045e'}}>Standard</th>
              <th style={{color: 'white', backgroundColor: '#03045e'}}>Achievement Title</th>
              <th style={{color: 'white', backgroundColor: '#03045e'}}>Achievement Date</th>
            </tr>
          </thead>
          <tbody>
            {achievements.map((achievement, index) => (
              <tr key={achievement.achievement_id}>
                <td>{index + 1}</td>
                <td>{achievement.GRno}</td>
                <td>{achievement.student.firstName+" "+achievement.student.lastName}</td>
                <td>{achievement.student_std}</td>
                <td>{achievement.achievement_title}</td>
                <td>{format(new Date(achievement.date), 'dd MMMM, yyyy')}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default SchoolAchievements;