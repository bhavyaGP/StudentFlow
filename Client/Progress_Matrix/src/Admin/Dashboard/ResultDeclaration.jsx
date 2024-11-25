import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector ,useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { selectResultStatus , updateResultStatus } from '../../redux/userSlice';
import Cookies from 'js-cookie';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { GrAnnounce } from "react-icons/gr";



const ResultDeclaration = () => {
  const token = Cookies.get('auth_Token');
  const resultStatus = useSelector(selectResultStatus);
  // console.log(resultStatus);
  
  const dispatch = useDispatch();
  const [error, setError] = useState(null);


  const handleToggleResult = () => {
    const dataPass = JSON.stringify({
      "isResultOut": !resultStatus
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:3000/api/admin/declareresult',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      data: dataPass,
      withCredentials: true,
    };

    axios.request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        dispatch(updateResultStatus(!resultStatus));
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Result status updated to ${!resultStatus ? 'Declared.' : 'Not Declared.'}`,
          confirmButtonColor: '#8400EB',
        });
      })
      .catch((error) => {
        setError(error.response?.data?.error || error.message);
        console.log(error);
      });
  };

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

  return (
    <div style={{ fontFamily: 'Nunito', padding: '20px' }}>
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <div className="card-body text-center">
        <h4 className="d-flex card-title" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8400EB' }}>
          <GrAnnounce className='me-2' size={25}/>  Result Declaration 
        </h4>
        <p className="d-flex card-text" style={{ fontSize: '1.3rem', margin: '20px 0' }}>
          Current Result Status: <span className= {resultStatus ? 'd-flex card-text fw-bold text-success' : 'd-flex card-text fw-bold text-danger'}> {resultStatus ? <FaCheckCircle className="m-1 ms-2 text-success" size={20} /> : <FaTimesCircle className="m-1 ms-2 text-danger" />} {resultStatus ? 'Result Declared' : 'Result Not Declared Yet'}</span>
        </p>
        <button className="btn btn-primary" onClick={handleToggleResult}>
          Toggle Result Status
        </button>
      </div>
    </div>
  </div>
  );
};

export default ResultDeclaration;