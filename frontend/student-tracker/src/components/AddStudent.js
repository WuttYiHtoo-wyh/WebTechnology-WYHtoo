import React, { useState } from 'react';

function AddStudent() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        enrollmentDate: '',
        status: 'active'
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
            <h3 className="text-center mb-4">Add New Student</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Name *</label>
                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email *</label>
                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Enrollment Date *</label>
                    <input type="date" className="form-control" name="enrollmentDate" value={formData.enrollmentDate} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="graduated">Graduated</option>
                    </select>
                </div>
                <div className="text-center">
                    <button type="submit" className="btn btn-custom">Add Student</button>
                </div>
            </form>
        </div>
    );
}

export default AddStudent;