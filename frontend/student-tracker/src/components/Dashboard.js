import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [totalStudents, setTotalStudents] = useState(0);
    const [atRiskStudents, setAtRiskStudents] = useState(0);
    const [onTrackStudents, setOnTrackStudents] = useState(0);
    const [sortBy, setSortBy] = useState('status');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Sample data instead of API call
        const sampleStudents = [
            { student_id: 1, name: "Alice Johnson", email: "alice@example.com", attendance_percentage: 85 },
            { student_id: 2, name: "Bob Smith", email: "bob@example.com", attendance_percentage: 60 },
            { student_id: 3, name: "Charlie Brown", email: "charlie@example.com", attendance_percentage: 90 },
            { student_id: 4, name: "David Lee", email: "david@example.com", attendance_percentage: 70 },
            { student_id: 5, name: "Eve Adams", email: "eve@example.com", attendance_percentage: 95 },
        ];

        console.log('Using Sample Data:', sampleStudents);

        const total = sampleStudents.length;
        const atRiskCount = sampleStudents.filter(student => student.attendance_percentage < 75).length;
        const onTrackCount = total - atRiskCount;

        setStudents(sampleStudents);
        setFilteredStudents(sampleStudents);
        setTotalStudents(total);
        setAtRiskStudents(atRiskCount);
        setOnTrackStudents(onTrackCount);
    }, []);

    const getAttendanceStatus = (percentage) => {
        return percentage < 75 ? 'At Risk' : 'On Track';
    };

    const handleSort = (e) => {
        const sortOption = e.target.value;
        setSortBy(sortOption);

        const sortedStudents = [...filteredStudents].sort((a, b) => {
            if (sortOption === 'Name') {
                return a.name.localeCompare(b.name);
            } else if (sortOption === 'Attendance') {
                return (b.attendance_percentage || 0) - (a.attendance_percentage || 0);
            } else {
                return getAttendanceStatus(a.attendance_percentage).localeCompare(getAttendanceStatus(b.attendance_percentage));
            }
        });
        setFilteredStudents(sortedStudents);
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = students.filter(student => student.name.toLowerCase().includes(term));
        setFilteredStudents(filtered);
    };

    return (
        <div className="container mt-5">
            <div className="row g-4">
                <div className="col-md-4"><div className="summary-box">Total Students: {totalStudents}</div></div>
                <div className="col-md-4"><div className="summary-box">At-Risk Students: {atRiskStudents}</div></div>
                <div className="col-md-4"><div className="summary-box">On-Track Students: {onTrackStudents}</div></div>
            </div>

            <div className="row mt-4">
                <div className="col-md-6 mb-3">
                    <select className="form-select" onChange={handleSort} value={sortBy}>
                        <option value="Status">Sort by: Status</option>
                        <option value="Name">Name</option>
                        <option value="Attendance">Attendance</option>
                    </select>
                </div>
                <div className="col-md-6 mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            <table className="table table-striped shadow-sm">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Attendance %</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStudents.map(student => (
                        <tr key={student.student_id}>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.attendance_percentage?.toFixed(1) || 'N/A'}%</td>
                            <td>{getAttendanceStatus(student.attendance_percentage)}</td>
                            <td>
                                <Link
                                    to={`/student-profile/${student.student_id}`}
                                    className="btn btn-custom btn-sm"
                                >
                                    View
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="text-center mt-4 dashboard-actions">
                <Link to="/add-student" className="btn btn-custom mx-2">Add Student</Link>
                <Link to="/log-session" className="btn btn-custom mx-2">Log Session</Link>
                <Link to="/reports" className="btn btn-custom mx-2">View Reports</Link>
            </div>
        </div>
    );
}

export default Dashboard;
