import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CounsellingPage = () => {
  const { learnerId } = useParams();
  const navigate = useNavigate();
  const [ticketId, setTicketId] = useState('');
  const [learnerData, setLearnerData] = useState({
    name: '',
    email: '',
    contact: '',
    parentContact: '',
  });
  const [mentorId, setMentorId] = useState('');
  const [mentorName, setMentorName] = useState('');
  const [mentorPosition, setMentorPosition] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  // Mock data for learner and mentors (replace with API call in production)
  useEffect(() => {
    // Simulate fetching learner data based on learnerId
    const mockLearner = {
      id: learnerId,
      name: `Learner ${learnerId}`,
      email: `learner${learnerId}@example.com`,
      contact: `+1-555-01${learnerId}00`,
      parentContact: `+1-555-02${learnerId}00`,
    };
    setLearnerData(mockLearner);

    // Generate unique ticket ID
    const generateTicketId = () => {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      return `TICKET-${timestamp}-${random}`;
    };

    // Check for existing ticket IDs in localStorage
    const existingTickets = JSON.parse(localStorage.getItem('counsellingTickets')) || [];
    let newTicketId;
    do {
      newTicketId = generateTicketId();
    } while (existingTickets.includes(newTicketId)); // Ensure no duplicates

    setTicketId(newTicketId);
  }, [learnerId]);

  const mentors = [
    { id: 'M1', name: 'Dr. John Smith', position: 'Senior Mentor' },
    { id: 'M2', name: 'Ms. Emily Johnson', position: 'Junior Mentor' },
    { id: 'M3', name: 'Mr. David Lee', position: 'Lead Mentor' },
  ];

  const handleMentorChange = (e) => {
    const selectedMentor = mentors.find(m => m.id === e.target.value);
    setMentorId(selectedMentor.id);
    setMentorName(selectedMentor.name);
    setMentorPosition(selectedMentor.position);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Collect form data
    const formData = {
      ticketId,
      learnerId,
      learnerName: learnerData.name,
      email: learnerData.email,
      contact: learnerData.contact,
      parentContact: learnerData.parentContact,
      mentorId,
      mentorName,
      mentorPosition,
      date,
      notes,
    };
    console.log('Counselling Data:', formData); // Replace with API call in production

    // Store ticketId in localStorage to prevent duplicates
    const existingTickets = JSON.parse(localStorage.getItem('counsellingTickets')) || [];
    existingTickets.push(ticketId);
    localStorage.setItem('counsellingTickets', JSON.stringify(existingTickets));

    alert(`Counselling form submitted for Learner ${learnerId}. Ticket ID: ${ticketId}`);
    navigate(`/student-details/${learnerId}`);
  };

  return (
    <div className="container">
      <h1>Counselling for Learner (ID: {learnerId})</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {/* Ticket ID (Auto-generated, read-only) */}
          <label>
            Ticket ID:
            <input
              type="text"
              value={ticketId}
              readOnly
              style={{ backgroundColor: '#2E3536', color: '#EDEDED' }}
            />
          </label>

          {/* Learner Information (Pre-filled) */}
          <label style={{ marginTop: '20px' }}>
            Learner ID:
            <input
              type="text"
              value={learnerId}
              readOnly
              style={{ backgroundColor: '#2E3536', color: '#EDEDED' }}
            />
          </label>
          <label style={{ marginTop: '20px' }}>
            Name:
            <input
              type="text"
              value={learnerData.name}
              readOnly
              style={{ backgroundColor: '#2E3536', color: '#EDEDED' }}
            />
          </label>
          <label style={{ marginTop: '20px' }}>
            Email:
            <input
              type="email"
              value={learnerData.email}
              readOnly
              style={{ backgroundColor: '#2E3536', color: '#EDEDED' }}
            />
          </label>
          <label style={{ marginTop: '20px' }}>
            Contact:
            <input
              type="text"
              value={learnerData.contact}
              readOnly
              style={{ backgroundColor: '#2E3536', color: '#EDEDED' }}
            />
          </label>
          <label style={{ marginTop: '20px' }}>
            Parent Contact:
            <input
              type="text"
              value={learnerData.parentContact}
              readOnly
              style={{ backgroundColor: '#2E3536', color: '#EDEDED' }}
            />
          </label>

          {/* Mentor Selection */}
          <label style={{ marginTop: '20px' }}>
            Mentor ID:
            <select
              value={mentorId}
              onChange={handleMentorChange}
              required
              style={{ width: '100%', padding: '8px', backgroundColor: '#F5C7A9', border: '1px solid #A47864', borderRadius: '6px', color: '#1F2526' }}
            >
              <option value="">Select a Mentor</option>
              {mentors.map((mentor) => (
                <option key={mentor.id} value={mentor.id}>
                  {mentor.id} - {mentor.name}
                </option>
              ))}
            </select>
          </label>
          <label style={{ marginTop: '20px' }}>
            Mentor Name:
            <input
              type="text"
              value={mentorName}
              readOnly
              style={{ backgroundColor: '#2E3536', color: '#EDEDED' }}
            />
          </label>
          <label style={{ marginTop: '20px' }}>
            Mentor Position:
            <input
              type="text"
              value={mentorPosition}
              readOnly
              style={{ backgroundColor: '#2E3536', color: '#EDEDED' }}
            />
          </label>

          {/* Date and Notes */}
          <label style={{ marginTop: '20px' }}>
            Date:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>
          <label style={{ marginTop: '20px' }}>
            Notes:
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any additional notes"
              required
            />
          </label>

          <div style={{ marginTop: '30px' }}>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              Submit Counselling
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate(`/student-details/${learnerId}`)}
              style={{ marginTop: '10px', width: '100%' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CounsellingPage;