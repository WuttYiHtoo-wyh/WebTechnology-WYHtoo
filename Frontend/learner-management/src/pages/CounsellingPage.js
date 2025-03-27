import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './CounsellingPage.css';

const CounsellingPage = () => {
    const [mentors, setMentors] = useState([]);
    const [selectedMentor, setSelectedMentor] = useState('');
    const [counsellingHistory, setCounsellingHistory] = useState([]);
    const [formData, setFormData] = useState({
        topic: '',
        description: '',
        preferred_date: '',
        preferred_time: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchMentors();
        fetchCounsellingHistory();
    }, []);

    const fetchMentors = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/mentors');
            setMentors(response.data);
        } catch (error) {
            console.error('Error fetching mentors:', error);
            toast.error('Failed to load mentors');
        }
    };

    const fetchCounsellingHistory = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/counselling/history');
            setCounsellingHistory(response.data);
        } catch (error) {
            console.error('Error fetching counselling history:', error);
            toast.error('Failed to load counselling history');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedMentor) {
            toast.error('Please select a mentor');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/api/counselling/request', {
                ...formData,
                mentor_id: selectedMentor
            });

            toast.success('Counselling request submitted successfully!');
            setFormData({
                topic: '',
                description: '',
                preferred_date: '',
                preferred_time: ''
            });
            setSelectedMentor('');
            fetchCounsellingHistory();
        } catch (error) {
            console.error('Error submitting counselling request:', error);
            toast.error(error.response?.data?.message || 'Failed to submit counselling request');
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'status-pending';
            case 'confirmed':
                return 'status-confirmed';
            case 'completed':
                return 'status-completed';
            case 'cancelled':
                return 'status-cancelled';
            default:
                return '';
        }
    };

    return (
        <div className="counselling-container">
            <div className="counselling-header">
                <h1>Book a Counselling Session</h1>
                <p>Get personalized guidance from our experienced mentors to help you achieve your academic goals</p>
            </div>

            <div className="counselling-form">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="mentor">Select Mentor</label>
                        <select
                            id="mentor"
                            className="mentor-select"
                            value={selectedMentor}
                            onChange={(e) => setSelectedMentor(e.target.value)}
                        >
                            <option value="">Choose a mentor...</option>
                            {mentors.map(mentor => (
                                <option key={mentor.id} value={mentor.id}>
                                    {mentor.name} - {mentor.specialty}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="topic">Topic</label>
                        <input
                            type="text"
                            id="topic"
                            name="topic"
                            className="form-control"
                            value={formData.topic}
                            onChange={handleInputChange}
                            placeholder="Enter the topic you want to discuss"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            className="form-control"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe what you'd like to discuss in detail"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="preferred_date">Preferred Date</label>
                        <input
                            type="date"
                            id="preferred_date"
                            name="preferred_date"
                            className="form-control"
                            value={formData.preferred_date}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="preferred_time">Preferred Time</label>
                        <input
                            type="time"
                            id="preferred_time"
                            name="preferred_time"
                            className="form-control"
                            value={formData.preferred_time}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit Request'}
                    </button>
                </form>
            </div>

            <div className="counselling-history">
                <h2>Your Counselling History</h2>
                <div className="counselling-list">
                    {counsellingHistory.map(session => (
                        <div key={session.id} className="counselling-item">
                            <h3>{session.topic}</h3>
                            <p>{session.description}</p>
                            <div className="counselling-meta">
                                <div>
                                    <strong>Mentor:</strong> {session.mentor_name}<br />
                                    <strong>Date:</strong> {new Date(session.preferred_date).toLocaleDateString()}<br />
                                    <strong>Time:</strong> {session.preferred_time}
                                </div>
                                <span className={`counselling-status ${getStatusClass(session.status)}`}>
                                    {session.status}
                                </span>
                            </div>
                        </div>
                    ))}
                    {counsellingHistory.length === 0 && (
                        <p style={{ textAlign: 'center', color: '#666' }}>
                            No counselling sessions found. Book your first session above!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CounsellingPage; 