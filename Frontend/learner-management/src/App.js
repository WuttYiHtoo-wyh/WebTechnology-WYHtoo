import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import { toast } from 'react-toastify';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user?.role;

  console.log('PrivateRoute check:', {
    token,
    userRole,
    allowedRoles
  });

  if (!token) {
    toast.error('Please login to access this page');
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(userRole)) {
    toast.error('You do not have permission to access this page');
    return <Navigate to="/login" />;
  }

  return children;
};

const AppContent = () => {
  return (
    <div className="App">
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        
        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/mentor-dashboard"
          element={
            <PrivateRoute allowedRoles={['mentor']}>
              <MentorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-panel"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminPanel />
            </PrivateRoute>
          }
        />
        <Route
          path="/counselling-overview"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <CounsellingOverview />
            </PrivateRoute>
          }
        />
        <Route
          path="/student-details/:learnerId"
          element={
            <PrivateRoute allowedRoles={['admin', 'mentor']}>
              <StudentDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/counselling/:learnerId"
          element={
            <PrivateRoute allowedRoles={['admin', 'mentor']}>
              <CounsellingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/solution/:learnerId"
          element={
            <PrivateRoute allowedRoles={['admin', 'mentor']}>
              <SolutionPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/student-dashboard"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <StudentDashboard />
            </PrivateRoute>
          }
        />
        
        <Route path="/unauthorized" element={
          <div className="container">
            <h1>Unauthorized Access</h1>
            <p>You do not have permission to view this page.</p>
          </div>
        } />
      </Routes>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;