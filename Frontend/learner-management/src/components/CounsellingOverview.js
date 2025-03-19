// src/components/CounsellingOverview.js
import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CounsellingOverview = () => {
  const navigate = useNavigate();
  const [counsellingRecords, setCounsellingRecords] = useState([]);
  const [searchLearnerName, setSearchLearnerName] = useState('');

  useEffect(() => {
    // Fetch counselling records from localStorage (replace with backend API call)
    const storedCounselling = JSON.parse(localStorage.getItem('counselling')) || [];
    // Add mock data if none exists
    if (storedCounselling.length === 0) {
      const mockData = [
        { ticketId: 'C001', learnerName: 'John Doe', mentorName: 'Mentor John', date: '2025-03-15', notes: 'Academic struggles', result: 'In Progress' },
        { ticketId: 'C002', learnerName: 'Jane Smith', mentorName: 'Mentor Jane', date: '2025-03-17', notes: 'Personal stress', result: 'Pending' },
      ];
      localStorage.setItem('counselling', JSON.stringify(mockData));
      setCounsellingRecords(mockData);
    } else {
      setCounsellingRecords(storedCounselling);
    }
  }, []);

  // Filter records based on search input
  const filteredRecords = counsellingRecords.filter(record =>
    record.learnerName.toLowerCase().includes(searchLearnerName.toLowerCase())
  );

  // Download as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Counselling Overview Report - Generated on March 18, 2025', 14, 20);

    const tableColumn = ['Ticket ID', 'Mentor Name', 'Learner Name', 'Date', 'Issues', 'Result'];
    const tableRows = filteredRecords.map(record => [
      record.ticketId,
      record.mentorName,
      record.learnerName,
      record.date,
      record.notes || 'No issues specified',
      record.result || 'Pending',
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fillColor: [164, 120, 100] }, // Mocha Mousse #A47864
      headStyles: { textColor: [237, 237, 237], fillColor: [31, 37, 38] }, // Soft White #EDEDED, Deep Charcoal #1F2526
      bodyStyles: { textColor: [237, 237, 237], fillColor: [46, 53, 54] }, // Soft White #EDEDED, Slate Gray #2E3536
    });

    doc.save('counselling-overview-2025-03-18.pdf');
  };

  return (
    <div className="container">
      <h1>Counselling Overview</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Learner Name"
          value={searchLearnerName}
          onChange={(e) => setSearchLearnerName(e.target.value)}
        />
      </div>
      <button className="btn-primary" onClick={downloadPDF} style={{ marginBottom: '20px' }}>
        Download as PDF
      </button>
      {filteredRecords.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Mentor Name</th>
              <th>Learner Name</th>
              <th>Date</th>
              <th>Issues</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record, index) => (
              <tr key={index}>
                <td>{record.ticketId}</td>
                <td>{record.mentorName}</td>
                <td>{record.learnerName}</td>
                <td>{record.date}</td>
                <td>{record.notes || 'No issues specified'}</td>
                <td>{record.result || 'Pending'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ color: '#EDEDED', textAlign: 'center' }}>No counselling records found.</p>
      )}
    </div>
  );
};

export default CounsellingOverview;