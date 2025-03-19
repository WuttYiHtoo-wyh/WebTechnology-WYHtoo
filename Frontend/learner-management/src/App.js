import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
            <ProtectedRoute allowedRoles={['admin']} />
          }
        >
          <Route index element={<HomePage />} />
        </Route>
        <Route
          path="/mentor-dashboard"
          element={
            <ProtectedRoute allowedRoles={['mentor']} />
          }
        >
          <Route index element={<MentorDashboard />} />
        </Route>
        <Route
          path="/admin-panel"
          element={
            <ProtectedRoute allowedRoles={['admin']} />
          }
        >
          <Route index element={<AdminPanel />} />
        </Route>
        <Route
          path="/counselling-overview"
          element={
            <ProtectedRoute allowedRoles={['admin']} />
          }
        >
          <Route index element={<CounsellingOverview />} />
        </Route>
        <Route
          path="/student-details/:learnerId"
          element={
            <ProtectedRoute allowedRoles={['admin', 'mentor']} />
          }
        >
          <Route index element={<StudentDetail />} />
        </Route>
        <Route
          path="/counselling/:learnerId"
          element={
            <ProtectedRoute allowedRoles={['admin', 'mentor']} />
          }
        >
          <Route index element={<CounsellingPage />} />
        </Route>
        <Route
          path="/solution/:learnerId"
          element={
            <ProtectedRoute allowedRoles={['admin', 'mentor']} />
          }
        >
          <Route index element={<SolutionPage />} />
        </Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;