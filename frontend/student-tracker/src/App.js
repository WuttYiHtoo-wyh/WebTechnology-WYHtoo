import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import StudentProfile from './components/StudentProfile';
import AddStudent from './components/AddStudent';
import LogSession from './components/LogSession';
import Reports from './components/Reports';

function App() {
    return (
        <div>
            <Navbar />
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/student-profile/:studentId" element={<StudentProfile />} /> {/* Updated route */}
                <Route path="/add-student" element={<AddStudent />} />
                <Route path="/log-session" element={<LogSession />} />
                <Route path="/reports" element={<Reports />} />
            </Routes>
        </div>
    );
}

export default App;