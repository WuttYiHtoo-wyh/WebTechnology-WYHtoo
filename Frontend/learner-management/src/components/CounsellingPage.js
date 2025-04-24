import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { createCounselling, getStudentDetails, getMentors } from '../services/apiService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CounsellingPage.css';
import axios from 'axios';

Modal.setAppElement('#root');

const CounsellingPage = () => {
  const { learnerId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [formData, setFormData] = useState({
    ticketId: '',
    mentorId: '',
    date: '',
    notes: ''
  });
  
  const [learnerData, setLearnerData] = useState({
    name: '',
    email: '',
    contact: '',
    parentContact: ''
  });
  
  const [mentors, setMentors] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState({
    page: true,
    submit: false
  });

  // Add new state for error tracking
  const [errors, setErrors] = useState({
    studentData: null,
    mentorData: null,
    submission: null
  });

  // Generate unique ticket ID
  const generateTicketId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TICKET-${timestamp}-${random}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(prev => ({ ...prev, page: true }));
        console.log('[CounsellingPage] Initiating data fetch for student:', learnerId);
        
        // Fetch student details with enhanced error logging
        let studentData;
        try {
          console.log('[CounsellingPage] Fetching student details...');
          studentData = await getStudentDetails(learnerId);
          console.log('[CounsellingPage] Student data received:', {
            id: learnerId,
            dataReceived: !!studentData,
            fields: studentData ? Object.keys(studentData) : []
          });
        } catch (studentError) {
          const errorDetails = {
            component: 'CounsellingPage',
            operation: 'fetchStudentDetails',
            studentId: learnerId,
            timestamp: new Date().toISOString(),
            error: {
              message: studentError.message,
              stack: studentError.stack,
              code: studentError.code
            }
          };
          console.error('[CounsellingPage] Student data fetch failed:', errorDetails);
          setErrors(prev => ({ ...prev, studentData: errorDetails }));
          throw studentError;
        }

        if (!studentData) {
          throw new Error('Student data is empty or invalid');
        }

        // Set learner data
        setLearnerData({
          name: studentData.name || 'N/A',
          email: studentData.email || 'N/A',
          contact: studentData.contact || 'N/A',
          parentContact: 'N/A'
        });

        // Fetch mentors with enhanced error logging
        try {
          console.log('[CounsellingPage] Fetching mentors data...');
          const mentorsData = await getMentors();
          console.log('[CounsellingPage] Mentors data received:', {
            count: mentorsData?.length || 0,
            dataReceived: !!mentorsData
          });
          setMentors(mentorsData);
        } catch (mentorError) {
          const errorDetails = {
            component: 'CounsellingPage',
            operation: 'fetchMentors',
            timestamp: new Date().toISOString(),
            error: {
              message: mentorError.message,
              stack: mentorError.stack,
              code: mentorError.code
            }
          };
          console.error('[CounsellingPage] Mentor data fetch failed:', errorDetails);
          setErrors(prev => ({ ...prev, mentorData: errorDetails }));
          throw mentorError;
        }

        // Generate ticket ID
        const newTicketId = generateTicketId();
        setFormData(prev => ({ ...prev, ticketId: newTicketId }));

      } catch (error) {
        const errorDetails = {
          component: 'CounsellingPage',
          operation: 'initialDataFetch',
          studentId: learnerId,
          timestamp: new Date().toISOString(),
          error: {
            message: error.message,
            stack: error.stack,
            code: error.code,
            type: error.constructor.name
          }
        };
        console.error('[CounsellingPage] Critical error during initialization:', errorDetails);
        
        // Show detailed error toast based on error type
        if (errors.studentData) {
          toast.error('Failed to load student data. Please try again later.');
        } else if (errors.mentorData) {
          toast.error('Failed to load mentor list. Please try again later.');
        } else {
          toast.error(`An unexpected error occurred: ${error.message}`);
        }
        
        navigate(`/student-details/${learnerId}`);
      } finally {
        setLoading(prev => ({ ...prev, page: false }));
      }
    };

    fetchData();
  }, [learnerId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, submit: true }));
    
    try {
        // Get token the same way as StudentDetail.js
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login to continue');
            navigate('/login');
            return;
        }

        // Prepare headers like in StudentDetail.js
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        };

        const formattedDate = formData.date ? new Date(formData.date).toISOString().split('T')[0] : null;

        const submissionData = {
            student_id: parseInt(learnerId),
            mentor_id: parseInt(formData.mentorId),
            date: formattedDate,
            notes: formData.notes.trim()
        };

        console.log('[CounsellingPage] Submitting counselling request:', submissionData);

        // Make the API call directly with axios like StudentDetail.js
        const response = await axios.post(
            'http://localhost:8000/api/counsellings', 
            submissionData,
            { headers }
        );

        if (response.data.success) {
            console.log('[CounsellingPage] Counselling session created successfully');
            toast.success('Counselling session scheduled successfully!');
            setModalIsOpen(true);
        } else {
            throw new Error(response.data.message || 'Failed to create counselling session');
        }
    } catch (error) {
        console.error('[CounsellingPage] API request failed:', {
            error: error.message,
            data: error.response?.data,
            timestamp: new Date().toISOString()
        });
        
        toast.error(error.response?.data?.message || 'Failed to schedule counselling session');
    } finally {
        setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  if (loading.page) {
    return (
      <div className="counselling-container">
        <div className="loading-state">Loading...</div>
      </div>
    );
  }

  return (
    <div className="counselling-container">
      <div className="counselling-header">
        <h1>Schedule Counselling Session</h1>
        <p>Student ID: {learnerId}</p>
      </div>

      <div className="ticket-section">
        <div className="ticket-header">Counselling Ticket Details</div>
        <div className="ticket-content">
          <span className="ticket-label">Ticket ID:</span>
          <span className="ticket-value">{formData.ticketId}</span>
        </div>
      </div>

      <div className="counselling-form">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Student Information</h3>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={learnerData.name}
                readOnly
                className="form-control readonly-field"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={learnerData.email}
                readOnly
                className="form-control readonly-field"
              />
            </div>
            <div className="form-group">
              <label>Contact</label>
              <input
                type="text"
                value={learnerData.contact}
                readOnly
                className="form-control readonly-field"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Counselling Details</h3>
            <div className="form-group">
              <label>Select Mentor</label>
              <select
                name="mentorId"
                value={formData.mentorId}
                onChange={handleInputChange}
                required
                className="form-control"
              >
                <option value="">Choose a mentor...</option>
                {mentors.map((mentor) => (
                  <option key={mentor.id} value={mentor.id}>
                    {mentor.name}
                  </option>
                ))}
              </select>
            </div>
            
            {formData.mentorId && (
              <div className="form-group">
                <label>Mentor Email</label>
                <input
                  type="text"
                  value={mentors.find(m => m.id === parseInt(formData.mentorId))?.email || ''}
                  readOnly
                  className="form-control readonly-field"
                />
              </div>
            )}

            <div className="form-group">
              <label>Preferred Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="form-control"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="form-group">
              <label>Additional Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Enter any additional notes or concerns..."
                required
                className="form-control"
                rows="4"
              />
            </div>
          </div>

          <div className="button-group">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading.submit}
            >
              {loading.submit ? 'Scheduling...' : 'Schedule Session'}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(`/student-details/${learnerId}`)}
              disabled={loading.submit}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => {
          setModalIsOpen(false);
          navigate(`/student-details/${learnerId}`);
        }}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content">
          <h2>Success!</h2>
          <p>Your counselling session has been scheduled successfully.</p>
          <button 
            onClick={() => {
              setModalIsOpen(false);
              navigate(`/student-details/${learnerId}`);
            }} 
            className="modal-btn"
          >
            Return to Student Details
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CounsellingPage;