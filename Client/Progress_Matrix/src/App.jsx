import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppNavbar from './Navbar/navbar';
import Login from './login/login';
// import Dashboard from './Dashboard';
// import Staff from './Staff';
import ManageData from './Faculty/manageData';
// import Result from './Result';

function App() {
  return (
    <Router>
      {/* <AppNavbar /> */} 
      
      {/* <ManageData/> */}
      {/* <Login/> */}
      <Routes>
        {/* <Route path="/dashboard" component={Dashboard} />
        <Route path="/staff" component={Staff} /> */}
        <Route path="/manage-data" element={<ManageData />} />
        {/* <Route path="/result" component={Result} /> */}
      </Routes>
    </Router>
  );
}

export default App;
