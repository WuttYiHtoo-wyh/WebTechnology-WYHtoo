import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal'; // Import react-modal
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // Import jspdf-autotable
import axios from 'axios';
import { toast } from 'react-toastify';
import './SolutionPage.css';

Modal.setAppElement('#root'); // Set the root element for accessibility

const SolutionPage = () => {
  const { learnerId } = useParams();
  const navigate = useNavigate();
  const [counsellingId, setCounsellingId] = useState('');
  const [mentorId, setMentorId] = useState('');
  const [mentorName, setMentorName] = useState('');
  const [mentors, setMentors] = useState([]); // Add state for mentors
  const [problemDescription, setProblemDescription] = useState('');
  const [solutionDescription, setSolutionDescription] = useState('');
  const [dateResolved, setDateResolved] = useState('');
  const [status, setStatus] = useState('Pending'); // New state for status
  const [modalIsOpen, setModalIsOpen] = useState(false); // State for modal
  const [counsellingSessions, setCounsellingSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCounsellingSessions();
    fetchMentors(); // Add mentor fetching
  }, [learnerId]);

  const fetchCounsellingSessions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login to view counselling sessions');
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost:8000/api/counselling/student/${learnerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.data || response.data.length === 0) {
        toast.info('No counselling sessions found for this student');
        setCounsellingSessions([]);
        return;
      }

      // Transform the data to include all necessary fields
      const tickets = response.data.map(session => ({
        id: session.id,
        ticket_id: session.ticket_id,
        display_ticket_id: session.display_ticket_id || `Ticket #${session.ticket_id}`,
        mentor_id: session.mentor_id,
        mentor_name: session.mentor_name || session.mentor?.name || 'Unknown Mentor' // Fallback for mentor name
      }));
      
      setCounsellingSessions(tickets);
      if (tickets.length > 0) {
        setCounsellingId(tickets[0].id);
        setMentorId(tickets[0].mentor_id);
        setMentorName(tickets[0].mentor_name);
      }
    } catch (error) {
      console.error('Error fetching counselling sessions:', error);
      if (error.response?.status === 401) {
        toast.error('Your session has expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else if (error.response?.status === 404) {
        toast.error('No counselling sessions found for this student');
      } else {
        toast.error('Failed to load counselling sessions. Please try again later.');
      }
      setCounsellingSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMentors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/mentors', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      setMentors(response.data);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      toast.error('Failed to load mentors');
    }
  };

  const handleCounsellingChange = (e) => {
    const selectedId = e.target.value;
    setCounsellingId(selectedId);
    
    // Find the selected counselling session
    const selectedSession = counsellingSessions.find(session => session.id === parseInt(selectedId));
    if (selectedSession) {
      setMentorId(selectedSession.mentor_id);
      setMentorName(selectedSession.mentor_name || 'Unknown Mentor');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // Format the date to ensure it's in the correct format (YYYY-MM-DD)
      const formattedDate = dateResolved ? new Date(dateResolved).toISOString().split('T')[0] : null;

      if (!formattedDate) {
        toast.error('Please select a valid date');
        return;
      }

      console.log('Submitting solution data:', {
        counselling_id: parseInt(counsellingId),
        mentor_id: parseInt(mentorId),
        problem_description: problemDescription,
        solution_description: solutionDescription,
        date_resolved: formattedDate,
        status: status
      });

      const response = await axios.post('http://localhost:8000/api/solutions', {
        counselling_id: parseInt(counsellingId),
        mentor_id: parseInt(mentorId),
        problem_description: problemDescription,
        solution_description: solutionDescription,
        date_resolved: formattedDate,
        status: status
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      toast.success('Solution submitted successfully!');
      setModalIsOpen(true);
    } catch (error) {
      console.error('Error submitting solution:', error);
      if (error.response?.status === 401) {
        toast.error('Please login to submit solutions');
        // Optionally redirect to login page
      } else if (error.response?.status === 422) {
        // Handle validation errors
        const errors = error.response.data.errors;
        Object.keys(errors).forEach(key => {
          toast.error(errors[key][0]);
        });
      } else {
        toast.error(error.response?.data?.message || 'Failed to submit solution');
      }
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(255, 0, 0); // Red color for title
    doc.setFillColor(31, 37, 38);
    doc.rect(10, 10, 190, 20, 'F');
    doc.text(`Solution Report - Learner ${learnerId} (Counselling ID: ${counsellingId}) - Generated on ${new Date().toLocaleDateString()}`, 14, 20);

    const tableColumn = ['Field', 'Value'];
    const tableRows = [
      ['Counselling ID', counsellingId || 'N/A'],
      ['Learner ID', learnerId || 'N/A'],
      ['Mentor Name', mentorName || 'N/A'],
      ['Problem Description', problemDescription || 'N/A'],
      ['Solution Description', solutionDescription || 'N/A'],
      ['Date Resolved', dateResolved || 'N/A'],
      ['Status', status || 'N/A'],
    ];

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: {
        fillColor: [31, 37, 38],
        textColor: [255, 0, 0], // Red color for text
        fontSize: 14,
        cellPadding: 5,
        lineWidth: 0.1,
        lineColor: [255, 0, 0], // Red color for borders
      },
      headStyles: {
        fillColor: [31, 37, 38],
        textColor: [255, 0, 0], // Red color for header text
      },
      bodyStyles: {
        fillColor: [31, 37, 38],
        textColor: [255, 0, 0], // Red color for body text
      },
    });

    doc.save(`solution-report-${learnerId}-${counsellingId}-${new Date().toISOString().split('T')[0]}.pdf`);
    setModalIsOpen(false);
    navigate(`/student-details/${learnerId}`);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    navigate(`/student-details/${learnerId}`);
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Solution for Learner (ID: {learnerId})</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Ticket Information</h3>
            <div className="form-group">
              <label>Ticket ID</label>
              <select
                value={counsellingId}
                onChange={handleCounsellingChange}
                required
              >
                <option value="">Select a Ticket</option>
                {counsellingSessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.display_ticket_id}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3>Mentor Information</h3>
            <div className="form-group">
              <label>Mentor</label>
              <select
                value={mentorId}
                onChange={(e) => {
                  const selectedMentorId = parseInt(e.target.value);
                  setMentorId(selectedMentorId);
                  const selectedMentor = mentors.find(m => m.id === selectedMentorId);
                  setMentorName(selectedMentor ? selectedMentor.name : 'Unknown Mentor');
                }}
                required
              >
                <option value="">Select a Mentor</option>
                {mentors.map((mentor) => (
                  <option key={mentor.id} value={mentor.id}>
                    {mentor.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3>Solution Details</h3>
            <div className="form-group">
              <label>Problem Description</label>
              <textarea
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                required
                placeholder="Describe the problem"
              />
            </div>
            <div className="form-group">
              <label>Solution Description</label>
              <textarea
                value={solutionDescription}
                onChange={(e) => setSolutionDescription(e.target.value)}
                required
                placeholder="Describe the solution"
              />
            </div>
            <div className="form-group">
              <label>Date Resolved</label>
              <input
                type="date"
                value={dateResolved}
                onChange={(e) => setDateResolved(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          <div className="button-group">
            <button type="submit" className="btn-primary">
              Submit Solution
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate(`/student-details/${learnerId}`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        className="solution-modal"
        overlayClassName="solution-modal-overlay"
      >
        <div className="modal-content">
          <h2>Solution Submitted!</h2>
          <p>Do you want to download the PDF?</p>
          <div className="modal-buttons">
            <button
              onClick={handleDownloadPDF}
              className="modal-btn modal-btn-primary"
            >
              Yes
            </button>
            <button
              onClick={handleCloseModal}
              className="modal-btn modal-btn-secondary"
            >
              No
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SolutionPage;