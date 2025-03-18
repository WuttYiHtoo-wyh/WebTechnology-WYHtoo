import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import StudentDetail from './components/StudentDetail';
import CounsellingPage from './components/CounsellingPage';
import SolutionPage from './components/SolutionPage';
import LoginPage from './components/LoginPage';
import './styles.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* Default to Login Page */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/student-details/:learnerId" element={<StudentDetail />} />
        <Route path="/counselling/:learnerId" element={<CounsellingPage />} />
        <Route path="/solution/:learnerId" element={<SolutionPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;