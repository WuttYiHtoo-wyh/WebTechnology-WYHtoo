import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal'; // Import react-modal
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // Import jspdf-autotable
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root'); // Set the root element for accessibility

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
  const [modalIsOpen, setModalIsOpen] = useState(false); // State for modal

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

    // Open modal instead of alert
    setModalIsOpen(true);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(237, 237, 237); // Soft White #EDEDED
    doc.setFillColor(31, 37, 38); // Deep Charcoal #1F2526 for background
    doc.rect(10, 10, 190, 15, 'F'); // Draw a filled rectangle for the title background
    doc.text(`Counselling Report - ${learnerData.name} (ID: ${learnerId}) - Generated on ${new Date().toLocaleDateString()}`, 14, 18);

    const tableColumn = ['Field', 'Value'];
    const tableRows = [
      ['Ticket ID', ticketId],
      ['Learner ID', learnerId],
      ['Name', learnerData.name],
      ['Email', learnerData.email],
      ['Contact', learnerData.contact],
      ['Parent Contact', learnerData.parentContact],
      ['Mentor ID', mentorId],
      ['Mentor Name', mentorName],
      ['Mentor Position', mentorPosition],
      ['Date', date],
      ['Notes', notes],
    ];

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      styles: {
        fillColor: [31, 37, 38], // Deep Charcoal #1F2526 for all cells
        textColor: [237, 237, 237], // Soft White #EDEDED
        lineWidth: 0.1, // Optional: Add subtle borders for clarity
        lineColor: [237, 237, 237], // White borders
      },
      headStyles: {
        fillColor: [31, 37, 38], // Deep Charcoal #1F2526
        textColor: [237, 237, 237], // Soft White #EDEDED
      },
      bodyStyles: {
        fillColor: [31, 37, 38], // Deep Charcoal #1F2526
        textColor: [237, 237, 237], // Soft White #EDEDED
      },
    });

    doc.save(`counselling-report-${learnerId}-${new Date().toISOString().split('T')[0]}.pdf`);
    setModalIsOpen(false);
    navigate(`/student-details/${learnerId}`);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
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

      {/* Modal for PDF Download Confirmation */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#2E3536',
            color: '#EDEDED',
            border: '2px solid #A47864',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <h2 style={{ color: '#F5C7A9' }}>Counselling Submitted!</h2>
        <p>Do you want to download the PDF?</p>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <button
            onClick={handleDownloadPDF}
            style={{
              padding: '10px 20px',
              backgroundColor: '#A47864', // Mocha Mousse for Yes button
              color: '#EDEDED', // Soft White text for contrast
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Yes
          </button>
          <button
            onClick={handleCloseModal}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1F2526', // Deep Charcoal for No button
              color: '#EDEDED', // Soft White text for contrast
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            No
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CounsellingPage;