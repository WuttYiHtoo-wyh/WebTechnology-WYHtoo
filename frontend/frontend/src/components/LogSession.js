import React, { useState } from 'react';

function LogSession() {
    const [formData, setFormData] = useState({
        student: '',
        mentor: '',
        startDate: '',
        endDate: '',
        notes: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData); // Replace with PHP API call later
    };

    return (
        <div className="form-container">
            <h3 className="text-center mb-4">Log Mentoring Session</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Student *</label>
                    <select className="form-select" name="student" value={formData.student} onChange={handleChange} required>
                        <option value="">Select Student</option>
                        <option value="1">John Doe</option>
                        <option value="2">Jane Smith</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Mentor</label>
                    <select className="form-select" name="mentor" value={formData.mentor} onChange={handleChange}>
                        <option value="">Select Mentor</option>
                        <option value="1">Mentor A</option>
                        <option value="2">Mentor B</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Start Date/Time *</label>
                    <input type="datetime-local" className="form-control" name="startDate" value={formData.startDate} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">End Date/Time *</label>
                    <input type="datetime-local" className="form-control" name="endDate" value={formData.endDate} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Notes</label>
                    <textarea className="form-control" name="notes" value={formData.notes} onChange={handleChange} rows="3"></textarea>
                </div>
                <div className="text-center">
                    <button type="submit" className="btn btn-custom">Log Session</button>
                </div>
            </form>
        </div>
    );
}

export default LogSession;