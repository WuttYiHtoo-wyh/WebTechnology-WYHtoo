import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal'; // Import react-modal
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // Import jspdf-autotable
import axios from 'axios';
import { toast } from 'react-toastify';

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
        toast.error('Please login to view counselling sessions');
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
          {/* Counselling Session Selection */}
          <label>
            Ticket ID:
            <select
              value={counsellingId}
              onChange={handleCounsellingChange}
              required
              style={{ width: '100%', padding: '8px', backgroundColor: '#F5C7A9', border: '1px solid #A47864', borderRadius: '6px', color: '#1F2526' }}
            >
              <option value="">Select a Ticket</option>
              {counsellingSessions.map((session) => (
                <option key={session.id} value={session.id}>
                  Ticket #{session.ticket_id}
                </option>
              ))}
            </select>
          </label>

          {/* Mentor Selection Dropdown */}
          <label style={{ marginTop: '20px' }}>
            Mentor:
            <select
              value={mentorId}
              onChange={(e) => {
                const selectedMentorId = parseInt(e.target.value);
                setMentorId(selectedMentorId);
                const selectedMentor = mentors.find(m => m.id === selectedMentorId);
                if (selectedMentor) {
                  setMentorName(selectedMentor.name);
                } else {
                  setMentorName('Unknown Mentor');
                }
              }}
              required
              style={{ width: '100%', padding: '8px', backgroundColor: '#F5C7A9', border: '1px solid #A47864', borderRadius: '6px', color: '#1F2526' }}
            >
              <option value="">Select a Mentor</option>
              {mentors.map((mentor) => (
                <option key={mentor.id} value={mentor.id}>
                  {mentor.name}
                </option>
              ))}
            </select>
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
              <option value="Resolved">Resolved</option>
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