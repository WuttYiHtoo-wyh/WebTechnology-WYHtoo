import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import StudentDetail from './components/StudentDetail';
import CounsellingPage from './components/CounsellingPage';
import SolutionPage from './components/SolutionPage';
import LoginPage from './components/LoginPage';
import MentorDashboard from './components/MentorDashboard';
import AdminPanel from './components/AdminPanel';
import CounsellingOverview from './components/CounsellingOverview';
import ProtectedRoute from './components/ProtectedRoute';
import './styles.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor-dashboard"
          element={
            <ProtectedRoute allowedRoles={['mentor']}>
              <MentorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-panel"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/counselling-overview"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CounsellingOverview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-details/:learnerId"
          element={
            <ProtectedRoute allowedRoles={['admin', 'mentor']}>
              <StudentDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/counselling/:learnerId"
          element={
            <ProtectedRoute allowedRoles={['admin', 'mentor']}>
              <CounsellingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/solution/:learnerId"
          element={
            <ProtectedRoute allowedRoles={['admin', 'mentor']}>
              <SolutionPage />
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={<div className="container"><h1>Unauthorized Access</h1><p>You do not have permission to view this page.</p></div>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;