import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CompletedModulesSection = ({ studentId }) => {
    const [completedModules, setCompletedModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompletedModules = async () => {
            try {
                const response = await axios.get(`/api/student/${studentId}/completed-modules-details`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setCompletedModules(response.data.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching completed modules');
            } finally {
                setLoading(false);
            }
        };

        fetchCompletedModules();
    }, [studentId]);

    if (loading) return <div>Loading completed modules...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Completed Modules</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 border">Module Name</th>
                            <th className="px-4 py-2 border">Attendance (%)</th>
                            <th className="px-4 py-2 border">Completion Date</th>
                            <th className="px-4 py-2 border">Result</th>
                            <th className="px-4 py-2 border">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {completedModules.map((module, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-4 py-2 border">{module.Module_Name}</td>
                                <td className="px-4 py-2 border">{module.Attendance_Percentage}%</td>
                                <td className="px-4 py-2 border">
                                    {new Date(module.Completion_Date).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-2 border">{module.Result}</td>
                                <td className="px-4 py-2 border">
                                    <span className={`px-2 py-1 rounded-full text-sm ${
                                        module.Status === 'Completed' 
                                            ? 'bg-green-100 text-green-800'
                                            : module.Status === 'Ongoing'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {module.Status}
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

const StudentDetail = () => {
    const { id } = useParams();
    
    return (
        <div className="container mx-auto px-4 py-8">
            <CompletedModulesSection studentId={id} />
        </div>
    );
};

export default StudentDetail; 