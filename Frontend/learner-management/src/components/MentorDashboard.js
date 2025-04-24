import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import './MentorDashboard.css';

const DashboardContainer = styled.div`
  padding: 0;
  background: #1e2124;
  min-height: 100vh;
  color: #ffffff;
`;

const MainContent = styled.main`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  color: #ffffff;
  margin: 0;
  font-weight: 500;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 250px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 1rem;
  padding-left: 2rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  background: #ffffff;
  color: #333;

  &::placeholder {
    color: #666;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(233, 150, 122, 0.2);
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 0.9rem;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatBox = styled.div`
  background: #2b3035;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const StatLabel = styled.span`
  display: block;
  font-size: 0.9rem;
  color: #a0aec0;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
`;

const StatValue = styled.span`
  display: block;
  font-size: 2rem;
  font-weight: 600;
  color: #ffffff;

  &.warning {
    color: #f56565;
  }

  &.success {
    color: #48bb78;
  }
`;

const TableContainer = styled.div`
  background: #2b3035;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: #1e2124;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #1e2124;
  }

  &:nth-child(odd) {
    background: #2b3035;
  }

  &:hover {
    background: #3d4852;
  }
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #a0aec0;
  border-bottom: 2px solid #3d4852;
  text-transform: uppercase;
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #ffffff;
  border-bottom: 1px solid #3d4852;
`;

const StyledButton = styled.button`
  background: transparent;
  padding: 0.4rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
`;

const StatusButton = styled(StyledButton)`
  min-width: 100px;
  text-align: center;

  &.status-at-risk {
    background: rgba(245, 101, 101, 0.1);
    color: #f56565;
    border: 1px solid #f56565;

    &:hover {
      background: rgba(245, 101, 101, 0.2);
    }
  }

  &.status-ontrack {
    background: rgba(72, 187, 120, 0.1);
    color: #48bb78;
    border: 1px solid #48bb78;

    &:hover {
      background: rgba(72, 187, 120, 0.2);
    }
  }
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 2rem;
  background: #2b3035;
  border-radius: 8px;
  color: #a0aec0;
`;

const WelcomeSection = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const WelcomeTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
`;

const WelcomeText = styled.p`
  font-size: 16px;
  margin-bottom: 20px;
`;

const EditButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const LoadingText = styled.p`
  font-size: 18px;
  margin-top: 20px;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid #3d4852;
`;

const Tab = styled.button`
  padding: 1rem 2rem;
  background: transparent;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;

  &:hover {
    color: #ffffff;
  }

  &.active {
    color: #ffffff;
    border-bottom: 2px solid #007bff;
  }
`;

const RequestForm = styled.div`
  background: #2b3035;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #a0aec0;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  background: #1e2124;
  border: 1px solid #3d4852;
  border-radius: 4px;
  color: #ffffff;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  background: #1e2124;
  border: 1px solid #3d4852;
  border-radius: 4px;
  color: #ffffff;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  background: #1e2124;
  border: 1px solid #3d4852;
  border-radius: 4px;
  color: #ffffff;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const SubmitButton = styled.button`
  background: #007bff;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #3d4852;
    cursor: not-allowed;
  }
`;

const RequestTableContainer = styled(TableContainer)`
  margin-top: 2rem;
  background: #2b3035;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const RequestTable = styled(Table)`
  width: 100%;
  border-collapse: collapse;
`;

const RequestTableHeader = styled(TableHeader)`
  background: #1e2124;
`;

const RequestTableRow = styled(TableRow)`
  &:nth-child(even) {
    background: #1e2124;
  }

  &:nth-child(odd) {
    background: #2b3035;
  }

  &:hover {
    background: #3d4852;
    transition: background-color 0.3s ease;
  }
`;

const RequestTableCell = styled(TableCell)`
  padding: 1rem;
  color: #ffffff;
  border-bottom: 1px solid #3d4852;
  font-size: 0.9rem;
`;

const RequestTableHeaderCell = styled(TableHeaderCell)`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #a0aec0;
  border-bottom: 2px solid #3d4852;
  text-transform: uppercase;
  font-size: 0.8rem;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;

  &.status-pending {
    background-color: rgba(245, 158, 11, 0.1);
    color: #f59e0b;
  }

  &.status-completed {
    background-color: rgba(16, 185, 129, 0.1);
    color: #10b981;
  }

  &.status-cancelled {
    background-color: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }
`;

const DateCell = styled(RequestTableCell)`
  white-space: nowrap;
`;

const NotesCell = styled(RequestTableCell)`
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MentorDashboard = () => {
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mentorData, setMentorData] = useState(null);
  const [requestsData, setRequestsData] = useState({
    data: [],
    loading: false,
    error: null
  });
  const [activeTab, setActiveTab] = useState('attendance');

  useEffect(() => {
    const checkAuth = () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || user.role !== 'mentor') {
        navigate('/login');
        return;
      }
    };

    const fetchMentorData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userEmail = localStorage.getItem('user_email');

        if (!token || !userEmail) {
          throw new Error('Authentication required');
        }

        const response = await axios.get(`http://localhost:8000/api/mentors`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          params: {
            email: userEmail
          }
        });

        if (response.data && Array.isArray(response.data)) {
          const mentor = response.data.find(mentor => mentor.email === userEmail);
          if (mentor) {
            setMentorData(mentor);
          } else {
            throw new Error('Mentor data not found');
          }
        }
      } catch (err) {
        console.error('Error fetching mentor data:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load data');
        toast.error(err.response?.data?.message || err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    fetchMentorData();
  }, [navigate]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get('http://localhost:8000/api/student-attendance', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data.success) {
          setAttendanceData(response.data.data);
          setError(null);
        } else {
          setError(response.data.message || 'Failed to fetch attendance data');
        }
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        setError(error.response?.data?.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  useEffect(() => {
    const fetchCounselingRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get('http://localhost:8000/api/counselling-requests', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success) {
          setRequestsData({
            data: response.data.data || [],
            loading: false,
            error: null
          });
        } else {
          toast.error(response.data.message || 'Failed to fetch counseling requests');
        }
      } catch (err) {
        console.error('Error fetching counseling requests:', err);
        toast.error(err.response?.data?.message || 'Failed to fetch counseling requests');
      }
    };

    if (activeTab === 'requests') {
      fetchCounselingRequests();
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_email');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleRiskClick = (studentId) => {
    navigate(`/student-details/${studentId}`);
  };

  const filteredStudents = attendanceData.filter(student =>
    student['Name'].toLowerCase().includes(searchName.toLowerCase())
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingText>Loading mentor data...</LoadingText>
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
            <EditButton onClick={() => navigate('/login')}>Back to Login</EditButton>
          </WelcomeSection>
        </DashboardContent>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <MainContent>
        <Header>
          <SearchContainer>
            <SearchIcon>🔍</SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search learners..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </SearchContainer>
          <Title>Mentor Dashboard</Title>
        </Header>

        <TabContainer>
          <Tab 
            className={activeTab === 'attendance' ? 'active' : ''}
            onClick={() => handleTabChange('attendance')}
          >
            Attendance
          </Tab>
          <Tab 
            className={activeTab === 'requests' ? 'active' : ''}
            onClick={() => handleTabChange('requests')}
          >
            Request Counselling
          </Tab>
        </TabContainer>

        {activeTab === 'requests' && (
          <RequestTableContainer>
            <RequestTable>
              <RequestTableHeader>
                <RequestTableRow>
                  <RequestTableHeaderCell>ID</RequestTableHeaderCell>
                  <RequestTableHeaderCell>Student ID</RequestTableHeaderCell>
                  <RequestTableHeaderCell>Mentor ID</RequestTableHeaderCell>
                  <RequestTableHeaderCell>Reason</RequestTableHeaderCell>
                  <RequestTableHeaderCell>Preferred Date</RequestTableHeaderCell>
                  <RequestTableHeaderCell>Notes</RequestTableHeaderCell>
                  <RequestTableHeaderCell>Status</RequestTableHeaderCell>
                  <RequestTableHeaderCell>Created At</RequestTableHeaderCell>
                </RequestTableRow>
              </RequestTableHeader>
              <tbody>
                {requestsData.loading ? (
                  <RequestTableRow>
                    <RequestTableCell colSpan="8" style={{ textAlign: 'center' }}>
                      Loading...
                    </RequestTableCell>
                  </RequestTableRow>
                ) : requestsData.data.length > 0 ? (
                  requestsData.data.map((request) => (
                    <RequestTableRow key={request.id}>
                      <RequestTableCell>{request.id}</RequestTableCell>
                      <RequestTableCell>{request.student_id}</RequestTableCell>
                      <RequestTableCell>{request.mentor_id}</RequestTableCell>
                      <RequestTableCell>{request.reason}</RequestTableCell>
                      <DateCell>{new Date(request.preferred_date).toLocaleDateString()}</DateCell>
                      <NotesCell title={request.additional_notes || ''}>{request.additional_notes || 'N/A'}</NotesCell>
                      <RequestTableCell>
                        <StatusBadge className={`status-${request.status.toLowerCase()}`}>
                          {request.status}
                        </StatusBadge>
                      </RequestTableCell>
                      <DateCell>{new Date(request.created_at).toLocaleString()}</DateCell>
                    </RequestTableRow>
                  ))
                ) : (
                  <RequestTableRow>
                    <RequestTableCell colSpan="8" style={{ textAlign: 'center' }}>
                      No counseling requests found
                    </RequestTableCell>
                  </RequestTableRow>
                )}
              </tbody>
            </RequestTable>
          </RequestTableContainer>
        )}

        {activeTab === 'attendance' && (
          <>
            <StatsContainer>
              <StatBox>
                <StatLabel>Total Learners</StatLabel>
                <StatValue>{filteredStudents.length}</StatValue>
              </StatBox>
              <StatBox>
                <StatLabel>At Risk</StatLabel>
                <StatValue className="warning">
                  {filteredStudents.filter(s => s['Status'] === 'At Risk').length}
                </StatValue>
              </StatBox>
              <StatBox>
                <StatLabel>On Track</StatLabel>
                <StatValue className="success">
                  {filteredStudents.filter(s => s['Status'] === 'OnTrack').length}
                </StatValue>
              </StatBox>
            </StatsContainer>

            <TableContainer>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell>Name</TableHeaderCell>
                    <TableHeaderCell>Module</TableHeaderCell>
                    <TableHeaderCell>Duration</TableHeaderCell>
                    <TableHeaderCell>Present</TableHeaderCell>
                    <TableHeaderCell>Absent</TableHeaderCell>
                    <TableHeaderCell>Attendance</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <TableRow key={index}>
                      <TableCell>{student['Name']}</TableCell>
                      <TableCell>{student['Module']}</TableCell>
                      <TableCell>
                        {student['Start Date'] ? new Date(student['Start Date']).toLocaleDateString('en-GB') : 'N/A'} - 
                        {student['End Date'] ? new Date(student['End Date']).toLocaleDateString('en-GB') : 'N/A'}
                      </TableCell>
                      <TableCell>{student['Present Days'] || 0}</TableCell>
                      <TableCell>{student['Absent Days'] || 0}</TableCell>
                      <TableCell>{student['Attendance (%)'] || 0}%</TableCell>
                      <TableCell>
                        <StatusButton 
                          className={`status-button ${student['Status'] === 'At Risk' ? 'status-at-risk' : 'status-ontrack'}`}
                          onClick={() => handleRiskClick(student['Learner ID'])}
                        >
                          {student['Status']}
                        </StatusButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </TableContainer>
          </>
        )}

        {filteredStudents.length === 0 && activeTab === 'attendance' && (
          <NoDataMessage>
            <p>No learners found matching your search criteria.</p>
          </NoDataMessage>
        )}
      </MainContent>
    </DashboardContainer>
  );
};

export default MentorDashboard;