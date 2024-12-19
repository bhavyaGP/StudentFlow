import React from 'react';
import { ListGroup , OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectUserProfile, selectResultStatus } from '../../redux/userSlice';
import { FaSchool } from 'react-icons/fa';
import { GrAnnounce, GrAchievement } from 'react-icons/gr';
import SchoolLogo from '../../assets/gvm.png';

const Sidebar = ({ setActiveComponent, activeComponent }) => {
  const SchoolDetail = useSelector(selectUserProfile);
  const resultStatus = useSelector(selectResultStatus);
  const schoolName = SchoolDetail.school.school_name;
  // console.log(resultStatus);


  const renderListItems = () => {
    const items = [
      {
        key: 'school',
        icon: <FaSchool className="me-3" size={25} />,
        label: 'Overall School',
        disabled: !resultStatus,
      },
      {
        key: 'achievements',
        icon: <GrAchievement className="me-3" size={20} />,
        label: 'Achievements',
        disabled: false,
      },
      {
        key: 'resultDeclaration',
        icon: <GrAnnounce className="me-3" size={25} />,
        label: 'Result Declaration',
        disabled: false,
      },
    ];


    if (resultStatus === false) {
      // Move resultDeclaration to the first position
      const resultDeclarationItem = items.pop();
      items.unshift(resultDeclarationItem);
    }

    const filteredItems = resultStatus ? items : items.filter((item) => item.key === 'achievements' || item.key === 'resultDeclaration');

    return filteredItems.map((item) => (
      <OverlayTrigger
        key={item.key}
        placement="right"
        overlay={
          item.disabled ? (
            <Tooltip id={`tooltip-${item.key}`}>
              Result is not declared yet
            </Tooltip>
          ) : (
            <></>
          )
        }
      >
        <ListGroup.Item
          key={item.key}
          action
          onClick={() => !item.disabled && setActiveComponent(item.key)}
          className={`d-flex pb-2 mb-2 bg-transparent border-dark ${activeComponent === item.key ? 'fw-bold ' : ''}`}
          style={{
            color: activeComponent === item.key ? '#8400EB' : '#000',
            opacity: item.disabled ? 0.5 : 1,
            cursor: item.disabled ? 'not-allowed' : 'pointer',
          }}
        >
          {item.icon} {item.label}
        </ListGroup.Item>
      </OverlayTrigger>
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
        {schoolName}'s Dashboard
      </h4>
      {renderListItems()}
    </ListGroup>
  );
};

export default Sidebar;