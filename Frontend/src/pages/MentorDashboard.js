import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const StudentAttendanceStats = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || user.role !== 'mentor') {
                navigate('/login');
                return;
            }
        };

        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await axios.get('http://localhost:8000/api/mentor/student-attendance-stats', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data && response.data.data) {
                    setStats(response.data.data);
                } else {
                    setStats([]);
                }
            } catch (err) {
                console.error('Error fetching stats:', err);
                if (err.response?.status === 401) {
                    toast.error('Session expired. Please login again.');
                    navigate('/login');
                } else {
                    setError(err.response?.data?.message || 'Error fetching attendance statistics');
                }
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
        fetchStats();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('user_email');
        navigate('/login');
        toast.success('Logged out successfully');
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-xl">Loading...</div>
        </div>
    );

    if (error) return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-red-600 mb-4">Error</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <button 
                    onClick={() => navigate('/login')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Back to Login
                </button>
            </div>
        </div>
    );

    return (
        <div className="mt-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Student Attendance Statistics</h2>
                <button 
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 border">Learner ID</th>
                            <th className="px-4 py-2 border">Name</th>
                            <th className="px-4 py-2 border">Module</th>
                            <th className="px-4 py-2 border">Start Date</th>
                            <th className="px-4 py-2 border">End Date</th>
                            <th className="px-4 py-2 border">Present Days</th>
                            <th className="px-4 py-2 border">Absent Days</th>
                            <th className="px-4 py-2 border">Attendance (%)</th>
                            <th className="px-4 py-2 border">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.map((stat, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-4 py-2 border">{stat['Learner ID']}</td>
                                <td className="px-4 py-2 border">{stat['Name']}</td>
                                <td className="px-4 py-2 border">{stat['Module']}</td>
                                <td className="px-4 py-2 border">{stat['Start Date']}</td>
                                <td className="px-4 py-2 border">{stat['End Date']}</td>
                                <td className="px-4 py-2 border">{stat['Present Days']}</td>
                                <td className="px-4 py-2 border">{stat['Absent Days']}</td>
                                <td className="px-4 py-2 border">{stat['Attendance (%)']}%</td>
                                <td className="px-4 py-2 border">
                                    <span className={`px-2 py-1 rounded-full text-sm ${
                                        stat['Status'] === 'At Risk' 
                                            ? 'bg-red-100 text-red-800' 
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                        {stat['Status']}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const MentorDashboard = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <StudentAttendanceStats />
        </div>
    );
};

export default MentorDashboard; 