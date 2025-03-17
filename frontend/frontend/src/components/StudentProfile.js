import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

function StudentProfile() {
    const { studentId } = useParams(); // Get studentId from URL
    const [student] = useState({
        id: studentId,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "123-456-7890",
        enrollment_date: "2023-09-01",
        status: "Active",
        attendance: [
            { attendance_id: 1, date: "2024-03-01", module_id: "101", status: "Present", notes: "On time" },
            { attendance_id: 2, date: "2024-03-02", module_id: "102", status: "Absent", notes: "Sick leave" },
        ]
    });

    return (
        <div className="container mt-5">
            <div className="row g-4">
                {/* Sidebar: Student Details */}
                <div className="col-md-3 sidebar">
                    <h5>{student.name}</h5>
                    <p>Email: {student.email}</p>
                    <p>Phone: {student.phone}</p>
                    <p>Enrolled: {student.enrollment_date}</p>
                    <p>Status: {student.status}</p>
                </div>

                {/* Main Content: Grades, Interventions, Attendance */}
                <div className="col-md-6">
                    <h5>Grades</h5>
                    <table className="table table-striped shadow-sm">
                        <thead>
                            <tr>
                                <th>Module</th>
                                <th>Term</th>
                                <th>Grade</th>
                                <th>Att %</th>
                                <th>Submitted</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Math 101</td>
                                <td>Fall 2024</td>
                                <td>45</td>
                                <td>60%</td>
                                <td>2024-12-01</td>
                            </tr>
                            <tr>
                                <td>Science 102</td>
                                <td>Fall 2024</td>
                                <td>80</td>
                                <td>85%</td>
                                <td>2024-12-05</td>
                            </tr>
                        </tbody>
                    </table>

                    <h5 className="mt-4">Attendance History</h5>
                    <table className="table table-striped shadow-sm">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Module</th>
                                <th>Status</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {student.attendance.length > 0 ? (
                                student.attendance.map(record => (
                                    <tr key={record.attendance_id}>
                                        <td>{record.date}</td>
                                        <td>Module {record.module_id}</td>
                                        <td>{record.status}</td>
                                        <td>{record.notes || 'N/A'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">No attendance records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <h5 className="mt-4">Interventions</h5>
                    <ul className="list-group shadow-sm">
                        <li className="list-group-item">2025-03-05: Reminder - "Improve attendance!"</li>
                        <li className="list-group-item">2025-03-10: Call Scheduled (Status: Scheduled)</li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="col-md-3 text-center">
                    <button className="btn btn-custom action-btn">Send Reminder</button>
                    <button className="btn btn-custom action-btn">Schedule Call</button>
                    <Link to="/log-session" className="btn btn-custom action-btn">Log Session</Link>
                </div>
            </div>
        </div>
    );
}

export default StudentProfile;
