import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Job from './job/Job';
import User from './user/User';
import Application from './application/Application';

function App() {
  return (
    <Router>
        <Routes>
      <Route exact path="/job" element={<Job />} />
        <Route path="/" element={<Navigate to="/job" />} />
        </Routes>
        <Routes>
        <Route exact path="/user" element={<User />}/>
            </Routes>
        <Routes>
        <Route path="/application" element={<Application/>} />
        </Routes>
    </Router>
  );
}

export default App;
