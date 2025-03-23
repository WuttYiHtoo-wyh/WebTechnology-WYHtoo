import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal'; // Import react-modal
import { createCounselling, getStudentDetails, getMentors } from '../services/apiService';
import { toast } from 'react-toastify';
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
  const [mentors, setMentors] = useState([]);
  const [mentorId, setMentorId] = useState('');
  const [mentorName, setMentorName] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false); // State for modal
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching student details for ID:', learnerId);
        
        // Fetch student details
        const studentData = await getStudentDetails(learnerId);
        console.log('Received student data:', studentData);
        
        // Check if student data exists
        if (!studentData) {
          throw new Error('No student data received from server');
        }

        // Set learner data directly from student data
        setLearnerData({
          name: studentData.name || 'N/A',
          email: studentData.email || 'N/A',
          contact: studentData.contact || 'N/A',
          parentContact: 'N/A', // Add parent contact to student model if needed
        });

        // Fetch mentors
        console.log('Fetching mentors...');
        const mentorsData = await getMentors();
        console.log('Received mentors data:', mentorsData);
        setMentors(mentorsData);

        // Generate unique ticket ID
        const generateTicketId = () => {
          const timestamp = Date.now();
          const random = Math.random().toString(36).substring(2, 8).toUpperCase();
          return `TICKET-${timestamp}-${random}`;
        };

        const existingTickets = JSON.parse(localStorage.getItem('counsellingTickets')) || [];
        let newTicketId;
        do {
          newTicketId = generateTicketId();
        } while (existingTickets.includes(newTicketId));

        setTicketId(newTicketId);
      } catch (error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          studentId: learnerId
        });
        toast.error(`Failed to load student data: ${error.message}`);
        // Redirect to student details page if there's an error
        navigate(`/student-details/${learnerId}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [learnerId, navigate]);

  const handleMentorChange = (e) => {
    const selectedMentor = mentors.find(m => m.id === parseInt(e.target.value));
    setMentorId(e.target.value);
    setMentorName(selectedMentor ? `${selectedMentor.name} (${selectedMentor.email})` : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format the date to ensure it's in the correct format (YYYY-MM-DD)
      const formattedDate = date ? new Date(date).toISOString().split('T')[0] : null;

      if (!formattedDate) {
        toast.error('Please select a valid date');
        return;
      }

      // Get the selected mentor's email
      const selectedMentor = mentors.find(m => m.id === parseInt(mentorId));
      console.log('Selected Mentor:', {
        name: selectedMentor?.name,
        email: selectedMentor?.email
      });
      console.log('Student:', {
        name: learnerData.name,
        email: learnerData.email
      });

      console.log('Submitting counselling data:', {
        student_id: parseInt(learnerId),
        mentor_id: parseInt(mentorId),
        date: formattedDate,
        notes: notes,
        status: 'scheduled'
      });

      const counsellingData = {
        student_id: parseInt(learnerId),
        mentor_id: parseInt(mentorId),
        date: formattedDate,
        notes: notes,
        status: 'scheduled'
      };

      const response = await createCounselling(counsellingData);
      console.log('Counselling created successfully:', response);

      const existingTickets = JSON.parse(localStorage.getItem('counsellingTickets')) || [];
      existingTickets.push(ticketId);
      localStorage.setItem('counsellingTickets', JSON.stringify(existingTickets));

      toast.success('Counselling session scheduled successfully!');
      setModalIsOpen(true);
    } catch (error) {
      console.error('Error creating counselling:', {
        message: error.message,
        stack: error.stack,
        data: {
          student_id: learnerId,
          mentor_id: mentorId,
          date,
          notes
        }
      });
      toast.error(error.message || 'Failed to schedule counselling session. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    navigate(`/student-details/${learnerId}`);
  };

  const handleOk = () => {
    setModalIsOpen(false);
    navigate(`/student-details/${learnerId}`);
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Counselling for Learner (ID: {learnerId})</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {/* Ticket ID */}
          <label>
            Ticket ID:
            <input
              type="text"
              value={ticketId}
              readOnly
              style={{ backgroundColor: '#2E3536', color: '#EDEDED' }}
            />
          </label>

          {/* Learner Information */}
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

          {/* Mentor Selection */}
          <label style={{ marginTop: '20px' }}>
            Mentor:
            <select
              value={mentorId}
              onChange={handleMentorChange}
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
          <label style={{ marginTop: '20px' }}>
            Mentor Email:
            <input
              type="text"
              value={mentors.find(m => m.id === parseInt(mentorId))?.email || ''}
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

      {/* Modal for Confirmation */}
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
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <button
            onClick={handleOk}
            style={{
              padding: '10px 20px',
              backgroundColor: '#A47864',
              color: '#EDEDED',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            OK
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CounsellingPage;