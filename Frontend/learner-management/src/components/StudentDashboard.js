import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1F2526 0%, #2E3536 100%);
  padding: 2rem;
  color: #EDEDED;
  font-family: 'Inter', sans-serif;
`;

const DashboardContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

const WelcomeSection = styled.div`
  background: rgba(46, 53, 54, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(164, 120, 100, 0.5);
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2.5rem;
  box-shadow: 0 8px 32px rgba(255, 140, 90, 0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const WelcomeTitle = styled.h1`
  font-size: 2.8rem;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #A47864, #4ABDAC);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 700;
`;

const WelcomeText = styled.p`
  font-size: 1.2rem;
  color: #EDEDED;
  opacity: 0.9;
  line-height: 1.6;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const DashboardCard = styled.div`
  background: rgba(46, 53, 54, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(164, 120, 100, 0.5);
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.3s ease;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(255, 140, 90, 0.3);
  }
`;

const CardTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #F5C7A9;
  font-weight: 600;
  border-bottom: 2px solid rgba(164, 120, 100, 0.3);
  padding-bottom: 0.5rem;
`;

const CardContent = styled.div`
  color: #EDEDED;
`;

const InfoItem = styled.div`
  margin-bottom: 1.2rem;
  padding: 1rem;
  background: rgba(164, 120, 100, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(164, 120, 100, 0.2);
    transform: translateX(5px);
  }
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: #F5C7A9;
  margin-right: 0.5rem;
  font-size: 1.1rem;
`;

const InfoValue = styled.span`
  color: #EDEDED;
  font-size: 1.1rem;
`;

const LoadingText = styled.div`
  text-align: center;
  font-size: 1.4rem;
  color: #F5C7A9;
  padding: 3rem;
`;

const EditButton = styled.button`
  background: linear-gradient(90deg, #A47864, #4ABDAC);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 1.5rem;
  font-size: 1.1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(164, 120, 100, 0.4);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled.div`
  background: #2E3536;
  padding: 2.5rem;
  border-radius: 20px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgba(164, 120, 100, 0.5);
  box-shadow: 0 8px 32px rgba(255, 140, 90, 0.3);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.8rem;
  color: #F5C7A9;
  font-size: 1.1rem;
  font-weight: 500;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid rgba(164, 120, 100, 0.5);
  border-radius: 12px;
  background: rgba(46, 53, 54, 0.9);
  color: #EDEDED;
  font-size: 1.1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #A47864;
    box-shadow: 0 0 0 2px rgba(164, 120, 100, 0.3);
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid rgba(164, 120, 100, 0.5);
  border-radius: 12px;
  background: rgba(46, 53, 54, 0.9);
  color: #EDEDED;
  font-size: 1.1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #A47864;
    box-shadow: 0 0 0 2px rgba(164, 120, 100, 0.3);
  }
`;

const FormDateInput = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid rgba(164, 120, 100, 0.5);
  border-radius: 12px;
  background: rgba(46, 53, 54, 0.9);
  color: #EDEDED;
  font-size: 1.1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #A47864;
    box-shadow: 0 0 0 2px rgba(164, 120, 100, 0.3);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
`;

const SaveButton = styled.button`
  background: #4ABDAC;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  flex: 1;
  font-size: 1.1rem;
  transition: all 0.3s ease;

  &:hover {
    background: #3AA89A;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(74, 189, 172, 0.4);
  }
`;

const CancelButton = styled.button`
  background: #A47864;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  flex: 1;
  font-size: 1.1rem;
  transition: all 0.3s ease;

  &:hover {
    background: #8B6757;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(164, 120, 100, 0.4);
  }
`;

const FilterButton = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 12px;
  background-color: ${props => props.$active ? '#A47864' : 'rgba(46, 53, 54, 0.9)'};
  color: ${props => props.$active ? 'white' : '#EDEDED'};
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0.5rem;
  font-size: 1rem;
  min-width: 120px;
  text-align: center;
  border: 1px solid rgba(164, 120, 100, 0.5);

  &:hover {
    background-color: ${props => props.$active ? '#8c6a5a' : 'rgba(164, 120, 100, 0.2)'};
    transform: translateY(-2px);
  }
`;

const FilterButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
  padding: 1rem;
  background: rgba(46, 53, 54, 0.9);
  border-radius: 12px;
  border: 1px solid rgba(164, 120, 100, 0.5);
`;

const RequestForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const FormTextArea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid rgba(164, 120, 100, 0.5);
  border-radius: 12px;
  background: rgba(46, 53, 54, 0.9);
  color: #EDEDED;
  font-size: 1.1rem;
  width: 100%;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #A47864;
    box-shadow: 0 0 0 2px rgba(164, 120, 100, 0.3);
  }
`;

const SubmitButton = styled.button`
  background: #4ABDAC;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  align-self: flex-end;
  transition: all 0.3s ease;
  font-size: 1.1rem;

  &:hover {
    background: #3AA89A;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(74, 189, 172, 0.4);
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ModuleTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 1rem;
`;

const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  color: #F5C7A9;
  font-weight: 600;
  border-bottom: 2px solid rgba(164, 120, 100, 0.5);
`;

const TableRow = styled.tr`
  transition: all 0.3s ease;

  &:hover {
    background: rgba(164, 120, 100, 0.1);
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid rgba(164, 120, 100, 0.3);
  color: #EDEDED;
`;

const StatusBadge = styled.span`
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case 'Completed':
        return 'rgba(74, 189, 172, 0.2)';
      case 'Ongoing':
        return 'rgba(255, 140, 90, 0.2)';
      case 'Upcoming':
        return 'rgba(164, 120, 100, 0.2)';
      default:
        return 'rgba(46, 53, 54, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'Completed':
        return '#4ABDAC';
      case 'Ongoing':
        return '#FF8C5A';
      case 'Upcoming':
        return '#A47864';
      default:
        return '#EDEDED';
    }
  }};
`;

const ChatbotButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4ABDAC, #A47864);
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 1000;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
`;

const ChatbotContainer = styled.div`
  position: fixed;
  bottom: 100px;
  right: 20px;
  width: 350px;
  height: 500px;
  background: rgba(46, 53, 54, 0.95);
  border-radius: 20px;
  border: 1px solid rgba(164, 120, 100, 0.5);
  box-shadow: 0 8px 32px rgba(255, 140, 90, 0.3);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  backdrop-filter: blur(10px);
`;

const ChatbotHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid rgba(164, 120, 100, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatbotTitle = styled.h3`
  color: #F5C7A9;
  margin: 0;
  font-size: 1.2rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #EDEDED;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.5rem;
  
  &:hover {
    color: #F5C7A9;
  }
`;

const ChatbotMessages = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Message = styled.div`
  max-width: 80%;
  padding: 0.8rem;
  border-radius: 15px;
  color: #EDEDED;
  font-size: 0.9rem;
  line-height: 1.4;
  
  &.user {
    background: rgba(74, 189, 172, 0.2);
    align-self: flex-end;
    border-bottom-right-radius: 0;
  }
  
  &.bot {
    background: rgba(164, 120, 100, 0.2);
    align-self: flex-start;
    border-bottom-left-radius: 0;
  }
`;

const ChatbotInput = styled.div`
  padding: 1rem;
  border-top: 1px solid rgba(164, 120, 100, 0.3);
  display: flex;
  gap: 0.5rem;
`;

const InputField = styled.input`
  flex: 1;
  padding: 0.8rem;
  border: 1px solid rgba(164, 120, 100, 0.5);
  border-radius: 12px;
  background: rgba(46, 53, 54, 0.9);
  color: #EDEDED;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #A47864;
  }
`;

const SendButton = styled.button`
  padding: 0.8rem 1.2rem;
  background: #4ABDAC;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #3AA89A;
  }
`;

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [moduleData, setModuleData] = useState([]);
  const [moduleLoading, setModuleLoading] = useState(false);
  const [moduleError, setModuleError] = useState(null);
  const [moduleFilter, setModuleFilter] = useState('all');
  const [mentors, setMentors] = useState([]);
  const [requestForm, setRequestForm] = useState({
    mentor_id: '',
    reason: '',
    date: '',
    notes: ''
  });
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [showChatbot, setShowChatbot] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI assistant. How can I help you today? You can ask me about:\n- Teaching center locations\n- Course information\n- Counseling requests\n- Module details", sender: 'bot' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const teachingCenters = {
    yangon: [
      {
        name: "Yangon Teaching Center 1",
        address: "No. 239, Pyay Road, Near Myaynigone City Mart, Sanchaung Township, Yangon, Myanmar."
      },
      {
        name: "Yangon Teaching Centre 2",
        address: "No. 237, Corner of U Wisara Road & Dhamazedi Road, Sanchaung Township, Yangon, Myanmar."
      },
      {
        name: "Yangon Teaching Centre 3",
        address: "No.142, 146 Sule Pagoda Road, Kyauktada Township, Yangon, Myanmar."
      },
      {
        name: "SFU Panchan Tower Teaching Centre",
        address: "No.8, Ground Floor, Panchan Tower, Myaynigone, Sanchaung Township, Yangon, Myanmar."
      },
      {
        name: "Student Experience Centre (Yangon)",
        address: "Near SFU Teaching Center 2 (U Wisara), No.83, Dhammazedi Road, Sanchaung Township, Yangon, Myanmar."
      }
    ],
    mandalay: [
      {
        name: "Mandalay Teaching Centre 1",
        address: "Block 4, Unit 8, Mingalar Mandalay, 73rd Road, Corner Thazin and Ngu Shwe War Road, Mandalay, Myanmar."
      },
      {
        name: "Mandalay Teaching Centre 2",
        address: "Block 4, Unit 3, Mingalar Mandalay, 73rd Road, Corner Thazin and Ngu Shwe War Road, Mandalay, Myanmar."
      },
      {
        name: "Mandalay Teaching Centre 3",
        address: "Block 3, Unit 2, Mingalar Mandalay, 73rd Road, Corner Thazin and Ngu Shwe War Road, Mandalay, Myanmar."
      }
    ]
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userEmail = localStorage.getItem('user_email');
        
        console.log('Fetching student data with:', { token, userEmail });

        if (!token) {
          throw new Error('No authentication token found. Please log in again.');
        }

        if (!userEmail) {
          throw new Error('No user email found. Please log in again.');
        }

        // Fetch student data
        const response = await axios.get(`http://localhost:8000/api/students`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          params: {
            email: userEmail
          }
        });

        console.log('Student data response:', response.data);

        if (response.data && Array.isArray(response.data)) {
          const student = response.data.find(student => student.email === userEmail);
          
          if (student) {
            setStudentData(student);
            setEditFormData({
              ...student,
              date_of_birth: student.date_of_birth ? new Date(student.date_of_birth).toISOString().split('T')[0] : '',
              enrollment_date: student.enrollment_date ? new Date(student.enrollment_date).toISOString().split('T')[0] : ''
            });

            // Fetch module data for this student
            await fetchModuleData(student.id, token);
          } else {
            throw new Error('Student data not found for the provided email');
          }
        } else {
          throw new Error('Invalid response format');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load data');
        setLoading(false);
        toast.error(err.response?.data?.message || err.message || 'Failed to load data');
      }
    };

    fetchStudentData();
  }, []);

  const fetchModuleData = async (studentId, token) => {
    setModuleLoading(true);
    try {
      const moduleResponse = await axios.get(`http://localhost:8000/api/students/${studentId}/modules`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        params: {
          filter: moduleFilter
        }
      });

      console.log('Module data response:', moduleResponse.data);
      if (moduleResponse.data && moduleResponse.data.modules) {
        setModuleData(moduleResponse.data.modules);
      } else {
        setModuleData([]);
      }
      setModuleError(null);
    } catch (moduleErr) {
      console.error('Error fetching module data:', moduleErr);
      setModuleError(moduleErr.response?.data?.message || moduleErr.message || 'Failed to load module data');
      toast.error(moduleErr.response?.data?.message || moduleErr.message || 'Failed to load module data');
    } finally {
      setModuleLoading(false);
    }
  };

  const handleFilterChange = async (newFilter) => {
    setModuleFilter(newFilter);
    if (studentData) {
      const token = localStorage.getItem('token');
      await fetchModuleData(studentData.id, token);
    }
  };

  const validateForm = () => {
    const errors = {};
    const phoneRegex = /^\+?[\d\s-]{10,}$/;

    if (!editFormData.phone) {
      errors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(editFormData.phone)) {
      errors.phone = 'Invalid phone number format';
    }

    if (!editFormData.address) {
      errors.address = 'Address is required';
    }

    if (!editFormData.date_of_birth) {
      errors.date_of_birth = 'Date of birth is required';
    }

    if (!editFormData.gender) {
      errors.gender = 'Gender is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setFormErrors({});
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData(studentData);
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const userEmail = localStorage.getItem('user_email');

      // Format the data before sending
      const updateData = {
        phone: editFormData.phone,
        address: editFormData.address,
        date_of_birth: editFormData.date_of_birth,
        gender: editFormData.gender
      };

      console.log('Sending update data:', updateData);

      // Update the student data in the database
      const response = await axios.put(
        `http://localhost:8000/api/students/${studentData.id}`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Update response:', response.data);

      // Update the local state with the new data
      setStudentData(response.data.student);
      setIsEditing(false);
      toast.success(response.data.message || 'Student information updated successfully');

      // Refresh the student data to ensure we have the latest from the database
      const refreshResponse = await axios.get(`http://localhost:8000/api/students`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        params: {
          email: userEmail
        }
      });

      console.log('Refresh response:', refreshResponse.data);

      if (refreshResponse.data && Array.isArray(refreshResponse.data)) {
        const updatedStudent = refreshResponse.data.find(student => student.email === userEmail);
        if (updatedStudent) {
          setStudentData(updatedStudent);
          setEditFormData({
            ...updatedStudent,
            date_of_birth: updatedStudent.date_of_birth ? new Date(updatedStudent.date_of_birth).toISOString().split('T')[0] : '',
            enrollment_date: updatedStudent.enrollment_date ? new Date(updatedStudent.enrollment_date).toISOString().split('T')[0] : ''
          });
        }
      }
    } catch (err) {
      console.error('Error updating student data:', err);
      if (err.response) {
        // Handle specific error messages from the backend
        if (err.response.status === 422) {
          const errorMessages = Object.entries(err.response.data.errors || {})
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n');
          toast.error(`Validation error:\n${errorMessages}`);
          
          // Update form errors state to highlight the invalid fields
          if (err.response.data.errors) {
            setFormErrors(err.response.data.errors);
          }
        } else if (err.response.status === 404) {
          toast.error('Student record not found');
        } else if (err.response.data && err.response.data.message) {
          toast.error(err.response.data.message);
        } else {
          toast.error('Failed to update student information');
        }
      } else if (err.request) {
        toast.error('No response from server. Please check your connection.');
      } else {
        toast.error('Error: ' + err.message);
      }
    }
  };

  useEffect(() => {
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
      } catch (err) {
        console.error('Error fetching mentors:', err);
        toast.error('Failed to load mentors');
      }
    };

    fetchMentors();
  }, []);

  const validateRequestForm = () => {
    const errors = {};
    
    if (!requestForm.mentor_id) {
      errors.mentor_id = 'Please select a mentor';
    }
    
    if (!requestForm.reason) {
      errors.reason = 'Please select a reason for counseling';
    }
    
    if (!requestForm.date) {
      errors.date = 'Please select a preferred date';
    } else {
      const selectedDate = new Date(requestForm.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.date = 'Please select a future date';
      }
    }
    
    if (requestForm.notes && requestForm.notes.length > 500) {
      errors.notes = 'Notes cannot exceed 500 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateRequestForm()) {
      return;
    }
    
    setRequestLoading(true);
    setRequestError(null);

    try {
      const token = localStorage.getItem('token');
      
      // Format the date to match backend expectations
      const formattedDate = requestForm.date ? new Date(requestForm.date).toISOString().split('T')[0] : '';
      
      // Get the selected mentor's email
      const selectedMentor = mentors.find(m => m.id === parseInt(requestForm.mentor_id));
      if (!selectedMentor || !selectedMentor.email) {
        throw new Error('Selected mentor email not found');
      }

      const requestData = {
        mentor_id: requestForm.mentor_id,
        mentor_email: selectedMentor.email,
        reason: requestForm.reason,
        date: formattedDate,
        notes: requestForm.notes || '',
        student_name: studentData.name,
        student_email: studentData.email
      };

      console.log('Submitting request with data:', requestData);

      const response = await axios.post(
        `http://localhost:8000/api/students/${studentData.id}/counseling-requests`,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Response from server:', response.data);

      if (response.data.success) {
        setSuccessMessage(`Counseling request submitted successfully! Your request has been recorded and will be reviewed by ${selectedMentor.name}.`);
        setShowSuccessDialog(true);
        // Reset form and validation errors
        setRequestForm({
          mentor_id: '',
          reason: '',
          date: '',
          notes: ''
        });
        setValidationErrors({});
      } else {
        toast.error(response.data.message || 'Failed to submit request');
      }
    } catch (err) {
      console.error('Error submitting request:', err);
      
      // Handle validation errors
      if (err.response?.status === 422) {
        const validationErrors = err.response.data.errors || {};
        setValidationErrors(validationErrors);
        
        // Show validation error messages
        Object.values(validationErrors).forEach(error => {
          toast.error(error);
        });
        
        setRequestError('Please correct the validation errors above');
      } else {
        const errorMessage = err.response?.data?.message || 
                           err.response?.data?.errors?.join(', ') || 
                           err.message ||
                           'Failed to submit request';
        setRequestError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setRequestLoading(false);
    }
  };

  const handleRequestChange = (e) => {
    const { name, value } = e.target;
    setRequestForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    setSuccessMessage('');
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const newMessages = [...messages, { text: inputMessage, sender: 'user' }];
    setMessages(newMessages);
    setInputMessage('');

    // Process the message and generate response
    setTimeout(() => {
      let botResponse = "";
      const message = inputMessage.toLowerCase();

      if (message.includes('location') || message.includes('center') || message.includes('centre')) {
        if (message.includes('yangon')) {
          botResponse = "Here are the Yangon teaching centers:\n\n" +
            teachingCenters.yangon.map(center => 
              `${center.name}\n${center.address}\n`
            ).join('\n');
        } else if (message.includes('mandalay')) {
          botResponse = "Here are the Mandalay teaching centers:\n\n" +
            teachingCenters.mandalay.map(center => 
              `${center.name}\n${center.address}\n`
            ).join('\n');
        } else {
          botResponse = "Here are all our teaching centers:\n\n" +
            "Yangon Centers:\n" +
            teachingCenters.yangon.map(center => 
              `${center.name}\n${center.address}\n`
            ).join('\n') +
            "\nMandalay Centers:\n" +
            teachingCenters.mandalay.map(center => 
              `${center.name}\n${center.address}\n`
            ).join('\n');
        }
      } else {
        botResponse = "I'm here to help! You can ask me about:\n" +
          "- Teaching center locations (e.g., 'Show me Yangon centers')\n" +
          "- Course information\n" +
          "- Counseling requests\n" +
          "- Module details";
      }

      setMessages([...newMessages, { text: botResponse, sender: 'bot' }]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const renderRequestForm = () => (
    <DashboardCard style={{ marginTop: '2rem' }}>
      <CardTitle>Request Mentor Counseling</CardTitle>
      <CardContent>
        <RequestForm onSubmit={handleRequestSubmit}>
          <FormGroup>
            <FormLabel>Select Mentor *</FormLabel>
            <FormSelect
              name="mentor_id"
              value={requestForm.mentor_id}
              onChange={handleRequestChange}
              required
              className={validationErrors.mentor_id ? 'error' : ''}
            >
              <option value="">Select a mentor</option>
              {mentors.map(mentor => (
                <option key={mentor.id} value={mentor.id}>
                  {mentor.name}
                </option>
              ))}
            </FormSelect>
            {validationErrors.mentor_id && (
              <span style={{ color: '#ff6b6b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {validationErrors.mentor_id}
              </span>
            )}
          </FormGroup>

          <FormGroup>
            <FormLabel>Reason for Counseling *</FormLabel>
            <FormSelect
              name="reason"
              value={requestForm.reason}
              onChange={handleRequestChange}
              required
              className={validationErrors.reason ? 'error' : ''}
            >
              <option value="">Select a reason</option>
              <option value="personal_issues">Personal Issues</option>
              <option value="assignment_support">Assignment Support</option>
              <option value="coding_issues">Coding Issues</option>
            </FormSelect>
            {validationErrors.reason && (
              <span style={{ color: '#ff6b6b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {validationErrors.reason}
              </span>
            )}
          </FormGroup>

          <FormGroup>
            <FormLabel>Preferred Date *</FormLabel>
            <FormInput
              type="date"
              name="date"
              value={requestForm.date}
              onChange={handleRequestChange}
              required
              className={validationErrors.date ? 'error' : ''}
            />
            {validationErrors.date && (
              <span style={{ color: '#ff6b6b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {validationErrors.date}
              </span>
            )}
          </FormGroup>

          <FormGroup>
            <FormLabel>Additional Notes</FormLabel>
            <FormTextArea
              name="notes"
              value={requestForm.notes}
              onChange={handleRequestChange}
              placeholder="Please provide any additional details about your request..."
              className={validationErrors.notes ? 'error' : ''}
            />
            {validationErrors.notes && (
              <span style={{ color: '#ff6b6b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {validationErrors.notes}
              </span>
            )}
          </FormGroup>

          {requestError && (
            <p style={{ color: '#ff6b6b' }}>{requestError}</p>
          )}

          <SubmitButton 
            type="submit" 
            disabled={requestLoading}
          >
            {requestLoading ? 'Submitting...' : 'Submit Request'}
          </SubmitButton>
        </RequestForm>
      </CardContent>
    </DashboardCard>
  );

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingText>Loading student data...</LoadingText>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <DashboardContent>
          <WelcomeSection>
            <WelcomeTitle>Error</WelcomeTitle>
            <WelcomeText>{error}</WelcomeText>
          </WelcomeSection>
        </DashboardContent>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardContent>
        <WelcomeSection>
          <WelcomeTitle>Welcome, {studentData?.name || 'Student'}!</WelcomeTitle>
          <WelcomeText>
            Here's your dashboard where you can view your details and manage your learning journey.
          </WelcomeText>
          <EditButton onClick={handleEditClick}>Edit Information</EditButton>
        </WelcomeSection>

        <DashboardGrid>
          <DashboardCard>
            <CardTitle>Personal Information</CardTitle>
            <CardContent>
              <InfoItem>
                <InfoLabel>Name:</InfoLabel>
                <InfoValue>{studentData?.name}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Email:</InfoLabel>
                <InfoValue>{studentData?.email}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Phone:</InfoLabel>
                <InfoValue>{studentData?.phone || 'Not provided'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Address:</InfoLabel>
                <InfoValue>{studentData?.address || 'Not provided'}</InfoValue>
              </InfoItem>
            </CardContent>
          </DashboardCard>

          <DashboardCard>
            <CardTitle>Additional Information</CardTitle>
            <CardContent>
              <InfoItem>
                <InfoLabel>Date of Birth:</InfoLabel>
                <InfoValue>{studentData?.date_of_birth ? new Date(studentData.date_of_birth).toLocaleDateString() : 'Not provided'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Gender:</InfoLabel>
                <InfoValue>{studentData?.gender || 'Not provided'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Enrollment Date:</InfoLabel>
                <InfoValue>{studentData?.enrollment_date ? new Date(studentData.enrollment_date).toLocaleDateString() : 'Not provided'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Status:</InfoLabel>
                <InfoValue>{studentData?.status || 'Not provided'}</InfoValue>
              </InfoItem>
            </CardContent>
          </DashboardCard>
        </DashboardGrid>

        <DashboardCard style={{ marginTop: '2rem' }}>
          <CardTitle>Module Progress</CardTitle>
          <FilterButtonContainer>
            <FilterButton 
              $active={moduleFilter === 'all'} 
              onClick={() => handleFilterChange('all')}
            >
              All Modules
            </FilterButton>
            <FilterButton 
              $active={moduleFilter === 'completed'} 
              onClick={() => handleFilterChange('completed')}
            >
              Completed
            </FilterButton>
            <FilterButton 
              $active={moduleFilter === 'ongoing'} 
              onClick={() => handleFilterChange('ongoing')}
            >
              Ongoing
            </FilterButton>
            <FilterButton 
              $active={moduleFilter === 'upcoming'} 
              onClick={() => handleFilterChange('upcoming')}
            >
              Upcoming
            </FilterButton>
          </FilterButtonContainer>
          <CardContent>
            {moduleLoading ? (
              <p>Loading module data...</p>
            ) : moduleError ? (
              <p style={{ color: '#ff6b6b' }}>{moduleError}</p>
            ) : moduleData.length > 0 ? (
              <ModuleTable>
                <thead>
                  <tr>
                    <TableHeader>Module Name</TableHeader>
                    <TableHeader>Attendance</TableHeader>
                    <TableHeader>Completion Date</TableHeader>
                    <TableHeader>Result</TableHeader>
                    <TableHeader>Status</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {moduleData.map((module, index) => (
                    <TableRow key={index}>
                      <TableCell>{module.Module_Name}</TableCell>
                      <TableCell>{module.Attendance_Percentage}%</TableCell>
                      <TableCell>{new Date(module.Completion_Date).toLocaleDateString()}</TableCell>
                      <TableCell>{module.Result}</TableCell>
                      <TableCell>
                        <StatusBadge status={module.Status}>{module.Status}</StatusBadge>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </ModuleTable>
            ) : (
              <p>No module data available.</p>
            )}
          </CardContent>
        </DashboardCard>

        {renderRequestForm()}

        {isEditing && (
          <ModalOverlay>
            <ModalContent>
              <h2>Edit Student Information</h2>
              <FormGroup>
                <FormLabel>Phone *</FormLabel>
                <FormInput
                  type="text"
                  name="phone"
                  value={editFormData.phone || ''}
                  onChange={handleInputChange}
                />
                {formErrors.phone && <span style={{ color: '#ff6b6b' }}>{formErrors.phone}</span>}
              </FormGroup>
              <FormGroup>
                <FormLabel>Address *</FormLabel>
                <FormInput
                  type="text"
                  name="address"
                  value={editFormData.address || ''}
                  onChange={handleInputChange}
                />
                {formErrors.address && <span style={{ color: '#ff6b6b' }}>{formErrors.address}</span>}
              </FormGroup>
              <FormGroup>
                <FormLabel>Date of Birth *</FormLabel>
                <FormDateInput
                  type="date"
                  name="date_of_birth"
                  value={editFormData.date_of_birth || ''}
                  onChange={handleInputChange}
                />
                {formErrors.date_of_birth && <span style={{ color: '#ff6b6b' }}>{formErrors.date_of_birth}</span>}
              </FormGroup>
              <FormGroup>
                <FormLabel>Gender *</FormLabel>
                <FormSelect
                  name="gender"
                  value={editFormData.gender || ''}
                  onChange={handleInputChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </FormSelect>
                {formErrors.gender && <span style={{ color: '#ff6b6b' }}>{formErrors.gender}</span>}
              </FormGroup>
              <ButtonGroup>
                <SaveButton onClick={handleSave}>Save Changes</SaveButton>
                <CancelButton onClick={handleCancelEdit}>Cancel</CancelButton>
              </ButtonGroup>
            </ModalContent>
          </ModalOverlay>
        )}

        {showSuccessDialog && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(46, 53, 54, 0.95)',
            padding: '2rem',
            borderRadius: '20px',
            border: '1px solid rgba(164, 120, 100, 0.5)',
            boxShadow: '0 8px 32px rgba(255, 140, 90, 0.3)',
            zIndex: 1000,
            width: '90%',
            maxWidth: '500px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '4rem', color: '#4ABDAC', marginBottom: '1rem' }}>✓</div>
            <h2 style={{ color: '#F5C7A9', fontSize: '1.8rem', marginBottom: '1rem' }}>
              Request Submitted Successfully!
            </h2>
            <p style={{ color: '#EDEDED', fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              {successMessage}
            </p>
            <button
              onClick={handleCloseSuccessDialog}
              style={{
                background: '#4ABDAC',
                color: 'white',
                border: 'none',
                padding: '0.8rem 1.5rem',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease'
              }}
            >
              Close
            </button>
          </div>
        )}

        <ChatbotButton onClick={() => setShowChatbot(!showChatbot)}>
          💬
        </ChatbotButton>

        {showChatbot && (
          <ChatbotContainer>
            <ChatbotHeader>
              <ChatbotTitle>AI Assistant</ChatbotTitle>
              <CloseButton onClick={() => setShowChatbot(false)}>×</CloseButton>
            </ChatbotHeader>
            <ChatbotMessages>
              {messages.map((message, index) => (
                <Message key={index} className={message.sender}>
                  {message.text}
                </Message>
              ))}
            </ChatbotMessages>
            <ChatbotInput>
              <InputField
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
              />
              <SendButton onClick={handleSendMessage}>Send</SendButton>
            </ChatbotInput>
          </ChatbotContainer>
        )}
      </DashboardContent>
    </DashboardContainer>
  );
};

export default StudentDashboard; 