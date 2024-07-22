import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Admin from './Admin';
import Employee from './Employee';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import { UserRoleProvider } from './UserRoleContext';

const App = () => {
  console.log("App component rendered");

  return (
    <UserRoleProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </UserRoleProvider>
  );
};

export default App;