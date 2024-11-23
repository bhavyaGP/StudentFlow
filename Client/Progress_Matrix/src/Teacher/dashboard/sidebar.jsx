import React from "react";
import { ListGroup } from 'react-bootstrap';
import { FaChalkboardTeacher, FaTrophy, FaFileSignature } from "react-icons/fa";
import SchoolLogo from '../../assets/gvm.png'
import { selectUserProfile, selectResultStatus } from '../../redux/userSlice';
import { useSelector } from "react-redux";


const Sidebar = ({ setActiveComponent, activeComponent }) => {

  const TeachersData = useSelector(selectUserProfile);
  const resultStatus = useSelector(selectResultStatus);
  const standard = TeachersData.allocated_standard;
  // console.log(TeachersData);

  // const TeacherName = profile.school.school_name;

  const renderListItems = () => {
    const items = [
      {
        key: 'class',
        icon: <FaChalkboardTeacher className="me-3" size={25} />,
        label: 'My Class Dashboard',
      },
      {
        key: 'achievements',
        icon: <FaTrophy className="me-3" size={20} />,
        label: 'School Achievements',
      },
      {
        key: 'reporting',
        icon: <FaFileSignature className="me-3" size={25} />,
        label: 'Result Reports',
      },
    ];

    const filteredItems = resultStatus
      ? items
      : items.filter(item => item.key === 'achievements');

    return filteredItems.map((item) => (

        <ListGroup.Item
          key={item.key}
          action
          onClick={() => !item.disabled && setActiveComponent(item.key)}
          className={`d-flex pb-2 mb-2 bg-transparent border-dark ${activeComponent === item.key ? 'fw-bold ' : ''}`}
          style={{
            color: activeComponent === item.key ? '#8400EB' : 'black',
          }}
        >
          {item.icon} {item.label}
        </ListGroup.Item>
    ));
  };

  return (
    <ListGroup variant="flush" className="p-2 text-center" style={{ fontFamily: 'Nunito' }}>
      <div className="d-flex justify-content-center">
        <img
          src={SchoolLogo}
          alt="School Logo"
          className="mb-3"
          style={{ width: '80%', maxWidth: '150px' }}
        />
      </div>
      <h4 className="mb-4" style={{ fontFamily: 'Nunito', fontSize: '20px', color: '#8400EB' }}>
        Dashboard for class : {standard}
      </h4>
      {renderListItems()}
    </ListGroup>
  );
};

export default Sidebar;