import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parse } from 'papaparse';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([
    { id: 'A1', name: 'Admin User', role: 'admin' },
    { id: 'M1', name: 'Mentor John', role: 'mentor' },
  ]);
  const [newUser, setNewUser] = useState({ name: '', role: '' });

  const handleAddUser = (e) => {
    e.preventDefault();
    setUsers([...users, { id: `U${users.length + 1}`, ...newUser }]);
    setNewUser({ name: '', role: '' });
  };

  const exportData = () => {
    const data = [
      { id: '1', name: 'John Doe', attendance: 85 },
      { id: '2', name: 'Jane Smith', attendance: 60 },
    ]; // Replace with actual learner data
    const csv = parse(data, { header: true });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'learners-report.csv');
    a.click();
  };

  return (
    <div className="container">
      <h1>Admin Panel</h1>
      <h2>Manage Users</h2>
      <form onSubmit={handleAddUser}>
        <label>
          Name:
          <input
            type="text"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            required
            style={{ backgroundColor: '#F5C7A9', border: '1px solid #A47864', borderRadius: '6px' }}
          />
        </label>
        <label style={{ marginTop: '20px' }}>
          Role:
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            required
            style={{ backgroundColor: '#F5C7A9', border: '1px solid #A47864', borderRadius: '6px' }}
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="mentor">Mentor</option>
          </select>
        </label>
        <button type="submit" className="btn-primary" style={{ marginTop: '20px' }}>
          Add User
        </button>
      </form>
      <table style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn-primary" onClick={exportData} style={{ marginTop: '20px' }}>
        Export Learner Data
      </button>
    </div>
  );
};

export default AdminPanel;