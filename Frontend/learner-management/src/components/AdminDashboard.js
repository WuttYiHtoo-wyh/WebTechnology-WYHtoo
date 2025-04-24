import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import './AdminDashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const DashboardContainer = styled.div`
  padding: 2rem;
  background: #1F2526;
  min-height: 100vh;
  color: #ffffff;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const DashboardTitle = styled.h1`
  font-size: 2rem;
  color: #F5C7A9;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 500;
`;

const GreetingMessage = styled.div`
  font-size: 1.5rem;
  color: #F5C7A9;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #2A3132;
  border-radius: 8px;
  text-align: center;
`;

const StatsTable = styled.table`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  border-collapse: collapse;
  margin-top: 2rem;
  background: #2A3132;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
`;

const TableHeader = styled.th`
  padding: 1.25rem;
  text-align: left;
  font-weight: 600;
  color: #F5C7A9;
  background: #1F2526;
  font-size: 1.1rem;
  border-bottom: 2px solid #A47864;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #2A3132;
  }

  &:nth-child(odd) {
    background: #343a40;
  }
`;

const TableCell = styled.td`
  padding: 1.25rem;
  color: #ffffff;
  border-bottom: 1px solid #A47864;
  font-size: 1.05rem;
  
  &:last-child {
    font-weight: 500;
    color: #F5C7A9;
  }
`;

const StatValue = styled.span`
  color: #F5C7A9;
  font-weight: 600;
  font-size: 1.2rem;
`;

const LoadingMessage = styled.div`
  font-size: 1.5rem;
  color: #F5C7A9;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #2A3132;
  border-radius: 8px;
  text-align: center;
  max-width: 800px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
`;

const ErrorMessage = styled.div`
  font-size: 1.5rem;
  color: #F5C7A9;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #2A3132;
  border-radius: 8px;
  text-align: center;
  max-width: 800px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
`;

const ChartContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 2rem 0;
  flex-wrap: wrap;
`;

const ChartWrapper = styled.div`
  background: #2A3132;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  width: 400px;
`;

const ChartTitle = styled.h3`
  color: #F5C7A9;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const AdminDashboard = () => {
  const [statistics, setStatistics] = useState({
    total_learners: 0,
    at_risk_learners: 0,
    on_track_learners: 0
  });
  const [counsellingStats, setCounsellingStats] = useState({
    total_counselling: 0,
    not_yet_completed: 0,
    in_progress: 0,
    pending: 0,
    resolved: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Fetch learner statistics
        const learnerResponse = await axios.get('http://localhost:8000/api/student-statistics', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        // Fetch counselling statistics
        const counsellingResponse = await axios.get('http://localhost:8000/api/counselling-statistics', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (learnerResponse.data.success) {
          setStatistics({
            total_learners: learnerResponse.data.data.total_learners || 0,
            at_risk_learners: learnerResponse.data.data.at_risk_learners || 0,
            on_track_learners: learnerResponse.data.data.on_track_learners || 0
          });
        }

        if (counsellingResponse.data.success) {
          setCounsellingStats({
            total_counselling: counsellingResponse.data.data.total_counselling || 0,
            not_yet_completed: counsellingResponse.data.data.not_yet_completed || 0,
            in_progress: counsellingResponse.data.data.in_progress || 0,
            pending: counsellingResponse.data.data.pending || 0,
            resolved: counsellingResponse.data.data.resolved || 0
          });
        }
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load statistics');
        toast.error(err.response?.data?.message || err.message || 'Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const counsellingStatusData = {
    labels: ['Not Yet Completed', 'In Progress', 'Pending', 'Resolved'],
    datasets: [
      {
        data: [
          counsellingStats.not_yet_completed,
          counsellingStats.in_progress,
          counsellingStats.pending,
          counsellingStats.resolved
        ],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0'
        ],
        borderColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0'
        ],
        borderWidth: 1,
      },
    ],
  };

  const learnerStatusData = {
    labels: ['At Risk', 'On Track'],
    datasets: [
      {
        label: 'Number of Learners',
        data: [statistics.at_risk_learners, statistics.on_track_learners],
        backgroundColor: [
          '#FF6384',
          '#4BC0C0'
        ],
        borderColor: [
          '#FF6384',
          '#4BC0C0'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#F5C7A9',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <DashboardContainer>
        <DashboardTitle>Loading statistics...</DashboardTitle>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <DashboardTitle>Error</DashboardTitle>
        <p>{error}</p>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardTitle>Admin Dashboard</DashboardTitle>
      
      <ChartContainer>
        <ChartWrapper>
          <ChartTitle>Counselling Status Distribution</ChartTitle>
          <Pie data={counsellingStatusData} options={options} />
        </ChartWrapper>
        
        <ChartWrapper>
          <ChartTitle>Learner Status Distribution</ChartTitle>
          <Bar data={learnerStatusData} options={options} />
        </ChartWrapper>
      </ChartContainer>

      <StatsTable>
        <thead>
          <tr>
            <TableHeader>Learner Statistics</TableHeader>
            <TableHeader>Count</TableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TableCell>Total Learners</TableCell>
            <TableCell>{statistics.total_learners}</TableCell>
          </tr>
          <tr>
            <TableCell>At Risk Learners</TableCell>
            <TableCell>{statistics.at_risk_learners}</TableCell>
          </tr>
          <tr>
            <TableCell>On Track Learners</TableCell>
            <TableCell>{statistics.on_track_learners}</TableCell>
          </tr>
        </tbody>
      </StatsTable>

      <StatsTable style={{ marginTop: '2rem' }}>
        <thead>
          <tr>
            <TableHeader>Counselling Statistics</TableHeader>
            <TableHeader>Count</TableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TableCell>Total Counselling Sessions</TableCell>
            <TableCell>{counsellingStats.total_counselling}</TableCell>
          </tr>
          <tr>
            <TableCell>Not Yet Completed</TableCell>
            <TableCell>{counsellingStats.not_yet_completed}</TableCell>
          </tr>
          <tr>
            <TableCell>In Progress</TableCell>
            <TableCell>{counsellingStats.in_progress}</TableCell>
          </tr>
          <tr>
            <TableCell>Pending</TableCell>
            <TableCell>{counsellingStats.pending}</TableCell>
          </tr>
          <tr>
            <TableCell>Resolved</TableCell>
            <TableCell>{counsellingStats.resolved}</TableCell>
          </tr>
        </tbody>
      </StatsTable>
    </DashboardContainer>
  );
};

export default AdminDashboard; 