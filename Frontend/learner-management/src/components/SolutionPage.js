import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal'; // Import react-modal
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // Import jspdf-autotable

Modal.setAppElement('#root'); // Set the root element for accessibility

const SolutionPage = () => {
  const { learnerId } = useParams();
  const navigate = useNavigate();
  const [ticketId, setTicketId] = useState('');
  const [mentorName, setMentorName] = useState('');
  const [mentorPosition, setMentorPosition] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [solutionDescription, setSolutionDescription] = useState('');
  const [dateResolved, setDateResolved] = useState('');
  const [status, setStatus] = useState('Pending'); // New state for status
  const [modalIsOpen, setModalIsOpen] = useState(false); // State for modal

  // Fetch existing ticket IDs from localStorage
  useEffect(() => {
    const existingTickets = JSON.parse(localStorage.getItem('counsellingTickets') || '[]');
    if (existingTickets.length > 0) {
      setTicketId(existingTickets[0]); // Default to first ticket
      updateMentorDetails(existingTickets[0]); // Pre-populate mentor details
    }
  }, []);

  // Function to update mentor details based on selected ticketId
  const updateMentorDetails = (selectedTicketId) => {
    // Mock data: In a real app, fetch from backend based on ticketId
    const ticketData = {
      'TICKET-1698001234567-ABCDEF': { mentorName: 'Dr. John Smith', mentorPosition: 'Senior Mentor' },
      'TICKET-1698001234568-XYZ123': { mentorName: 'Ms. Emily Johnson', mentorPosition: 'Junior Mentor' },
      'TICKET-1698001234569-PQR456': { mentorName: 'Mr. David Lee', mentorPosition: 'Lead Mentor' },
    };
    const details = ticketData[selectedTicketId] || { mentorName: '', mentorPosition: '' };
    setMentorName(details.mentorName);
    setMentorPosition(details.mentorPosition);
  };

  const handleTicketChange = (e) => {
    const selectedTicketId = e.target.value;
    setTicketId(selectedTicketId);
    updateMentorDetails(selectedTicketId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Collect form data
    const formData = {
      ticketId,
      learnerId,
      mentorName,
      mentorPosition,
      problemDescription,
      solutionDescription,
      dateResolved,
      status, // Include the status in the form data
    };
    console.log('Solution Data:', formData); // Replace with API call in production

    // Store the full solution record in localStorage
    const existingSolutions = JSON.parse(localStorage.getItem('solutions') || '[]');
    existingSolutions.push(formData);
    localStorage.setItem('solutions', JSON.stringify(existingSolutions));

    // Open modal instead of alert
    setModalIsOpen(true);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18); // Increased font size for title
    doc.setTextColor(245, 199, 169); // Light peach #F5C7A9
    doc.setFillColor(31, 37, 38); // Deep Charcoal #1F2526
    doc.rect(10, 10, 190, 20, 'F'); // Increased height for better title visibility
    doc.text(`Solution Report - Learner ${learnerId} (Ticket: ${ticketId}) - Generated on ${new Date().toLocaleDateString()}`, 14, 20);

    const tableColumn = ['Field', 'Value'];
    const tableRows = [
      ['Ticket ID', ticketId || 'N/A'],
      ['Learner ID', learnerId || 'N/A'],
      ['Mentor Name', mentorName || 'N/A'],
      ['Mentor Position', mentorPosition || 'N/A'],
      ['Problem Description', problemDescription || 'N/A'],
      ['Solution Description', solutionDescription || 'N/A'],
      ['Date Resolved', dateResolved || 'N/A'],
      ['Status', status || 'N/A'],
    ];

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40, // Adjusted startY for better spacing
      styles: {
        fillColor: [31, 37, 38], // Deep Charcoal #1F2526
        textColor: [245, 199, 169], // Light peach #F5C7A9
        fontSize: 14, // Increased font size for table
        cellPadding: 5, // Added padding to prevent text truncation
        lineWidth: 0.1, // Subtle borders
        lineColor: [245, 199, 169], // Light peach #F5C7A9 for borders
      },
      headStyles: {
        fillColor: [31, 37, 38], // Deep Charcoal #1F2526
        textColor: [245, 199, 169], // Light peach #F5C7A9
      },
      bodyStyles: {
        fillColor: [31, 37, 38], // Deep Charcoal #1F2526
        textColor: [245, 199, 169], // Light peach #F5C7A9
      },
    });

    doc.save(`solution-report-${learnerId}-${ticketId}-${new Date().toISOString().split('T')[0]}.pdf`);
    setModalIsOpen(false);
    navigate(`/student-details/${learnerId}`);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    navigate(`/student-details/${learnerId}`);
  };

  return (
    <div className="container">
      <h1>Solution for Learner (ID: {learnerId})</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {/* Ticket ID Selection */}
          <label>
            Ticket ID:
            <select
              value={ticketId}
              onChange={handleTicketChange}
              required
              style={{ width: '100%', padding: '8px', backgroundColor: '#F5C7A9', border: '1px solid #A47864', borderRadius: '6px', color: '#1F2526' }}
            >
              <option value="">Select a Ticket</option>
              {JSON.parse(localStorage.getItem('counsellingTickets') || '[]').map((ticket) => (
                <option key={ticket} value={ticket}>
                  {ticket}
                </option>
              ))}
            </select>
          </label>

          {/* Mentor Details (Pre-filled based on ticketId) */}
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

          {/* Problem, Solution, and Date Resolved */}
          <label style={{ marginTop: '20px' }}>
            Problem Description:
            <textarea
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              required
              placeholder="Describe the problem"
            />
          </label>
          <label style={{ marginTop: '20px' }}>
            Solution Description:
            <textarea
              value={solutionDescription}
              onChange={(e) => setSolutionDescription(e.target.value)}
              required
              placeholder="Describe the solution"
            />
          </label>
          <label style={{ marginTop: '20px' }}>
            Date Resolved:
            <input
              type="date"
              value={dateResolved}
              onChange={(e) => setDateResolved(e.target.value)}
              required
            />
          </label>

          {/* Status Dropdown */}
          <label style={{ marginTop: '20px' }}>
            Status:
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', backgroundColor: '#F5C7A9', border: '1px solid #A47864', borderRadius: '6px', color: '#1F2526' }}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </label>

          <div style={{ marginTop: '30px' }}>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              Submit Solution
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
        <h2 style={{ color: '#F5C7A9' }}>Solution Submitted!</h2>
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

export default SolutionPage;