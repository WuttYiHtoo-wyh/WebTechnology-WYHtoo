// src/components/CounsellingOverview.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  background: #1F2526;
  min-height: 100vh;
  color: #EDEDED;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: transparent;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 600;
  background: linear-gradient(90deg, #A47864, #FF8C5A);
  -webkit-background-clip: text;
  background-clip: text;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 1rem;
`;

const SearchInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #A47864;
  border-radius: 6px;
  background: rgba(46, 53, 54, 0.7);
  color: #EDEDED;
  font-size: 1rem;
  width: 300px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #FF8C5A;
    box-shadow: 0 0 0 2px rgba(255, 140, 90, 0.2);
  }

  &::placeholder {
    color: #A47864;
  }
`;

const SearchButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(90deg, #A47864, #FF8C5A);
  color: #EDEDED;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(90deg, #FF8C5A, #A47864);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(255, 140, 90, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #2E3536;
    cursor: not-allowed;
  }
`;

const TableContainer = styled.div`
  background: rgba(46, 53, 54, 0.7);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  border: 1px solid rgba(164, 120, 100, 0.2);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: #1F2526;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: rgba(46, 53, 54, 0.7);
  }

  &:nth-child(odd) {
    background: rgba(31, 37, 38, 0.95);
  }

  &:hover {
    background: rgba(164, 120, 100, 0.1);
  }
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #F5C7A9;
  border-bottom: 2px solid #A47864;
  text-transform: uppercase;
  font-size: 0.9rem;
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #EDEDED;
  border-bottom: 1px solid rgba(164, 120, 100, 0.2);
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;

  &.resolved {
    background: rgba(74, 189, 172, 0.2);
    color: #4ABDAC;
    border: 1px solid rgba(74, 189, 172, 0.4);
  }

  &.pending {
    background: rgba(255, 140, 90, 0.2);
    color: #FF8C5A;
    border: 1px solid rgba(255, 140, 90, 0.4);
  }

  &.not-yet-completed {
    background: rgba(164, 120, 100, 0.2);
    color: #A47864;
    border: 1px solid rgba(164, 120, 100, 0.4);
  }

  &.in-progress {
    background: rgba(245, 199, 169, 0.2);
    color: #F5C7A9;
    border: 1px solid rgba(245, 199, 169, 0.4);
  }
`;

const NotesCell = styled(TableCell)`
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #EDEDED;

  &:hover {
    cursor: pointer;
    color: #F5C7A9;
  }
`;

const NameCell = styled(TableCell)`
  font-weight: 500;
  color: #F5C7A9;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #F5C7A9;
  font-size: 1.5rem;
  background: rgba(46, 53, 54, 0.7);
  border-radius: 8px;
  margin: 2rem auto;
  max-width: 800px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #FF8C5A;
  font-size: 1.5rem;
  background: rgba(46, 53, 54, 0.7);
  border-radius: 8px;
  margin: 2rem auto;
  max-width: 800px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
`;

const NoDataMessage = styled(TableCell)`
  text-align: center;
  padding: 2rem;
  color: #A47864;
  font-style: italic;
`;

const CounsellingOverview = () => {
  const [counsellingData, setCounsellingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTicket, setSearchTicket] = useState('');

  const fetchCounsellingData = async (ticketId = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const url = ticketId 
        ? `http://localhost:8000/api/counselling-overview?ticket_id=${encodeURIComponent(ticketId)}`
        : 'http://localhost:8000/api/counselling-overview';

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setCounsellingData(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch counselling data');
      }
    } catch (err) {
      console.error('Error fetching counselling data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load counselling data');
      toast.error(err.response?.data?.message || err.message || 'Failed to load counselling data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounsellingData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCounsellingData(searchTicket);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>Loading counselling data...</LoadingMessage>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Title>Error</Title>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Counselling Overview</Title>
      </Header>
      
      <SearchContainer>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
          <SearchInput
            type="text"
            placeholder="Search by ticket ID..."
            value={searchTicket}
            onChange={(e) => setSearchTicket(e.target.value)}
          />
          <SearchButton type="submit">Search</SearchButton>
        </form>
      </SearchContainer>

      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Ticket ID</TableHeaderCell>
              <TableHeaderCell>Learner</TableHeaderCell>
              <TableHeaderCell>Mentor</TableHeaderCell>
              <TableHeaderCell>Counselling Date</TableHeaderCell>
              <TableHeaderCell>Notes</TableHeaderCell>
              <TableHeaderCell>Problem</TableHeaderCell>
              <TableHeaderCell>Solution</TableHeaderCell>
              <TableHeaderCell>Date Resolved</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {counsellingData.map((item) => (
              <TableRow key={item.counselling_id}>
                <TableCell>{item.ticket_id}</TableCell>
                <NameCell>{item.learner_name || 'N/A'}</NameCell>
                <NameCell>{item.mentor_name || 'N/A'}</NameCell>
                <TableCell>{formatDate(item.counselling_date)}</TableCell>
                <NotesCell title={item.notes}>
                  {item.notes || 'N/A'}
                </NotesCell>
                <NotesCell title={item.problem_description}>
                  {item.problem_description || 'N/A'}
                </NotesCell>
                <NotesCell title={item.solution_description}>
                  {item.solution_description || 'N/A'}
                </NotesCell>
                <TableCell>{formatDate(item.date_resolved)}</TableCell>
                <TableCell>
                  <StatusBadge className={item.solution_status.toLowerCase().replace(/\s+/g, '-')}>
                    {item.solution_status}
                  </StatusBadge>
                </TableCell>
              </TableRow>
            ))}
            {counsellingData.length === 0 && (
              <TableRow>
                <NoDataMessage colSpan="9">
                  No counselling sessions found
                </NoDataMessage>
              </TableRow>
            )}
          </tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default CounsellingOverview;