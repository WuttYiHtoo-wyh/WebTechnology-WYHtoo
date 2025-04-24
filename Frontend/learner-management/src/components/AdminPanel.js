import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: #1F2526;
  box-shadow: 0 0 20px rgba(164, 120, 100, 0.1);
  border-radius: 10px;
  min-height: calc(100vh - 4rem);
`;

const Title = styled.h1`
  color: #F5C7A9;
  font-size: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #A47864;
  background: linear-gradient(90deg, #A47864, #FF8C5A);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
  background: #2E3536;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(164, 120, 100, 0.2);
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-weight: 600;
  color: #EDEDED;
  margin-right: 0.5rem;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #A47864;
  border-radius: 6px;
  background: #1F2526;
  min-width: 150px;
  font-size: 0.9rem;
  color: #EDEDED;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #FF8C5A;
  }

  &:focus {
    outline: none;
    border-color: #FF8C5A;
    box-shadow: 0 0 0 2px rgba(255, 140, 90, 0.2);
  }
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #A47864;
  border-radius: 6px;
  background: #1F2526;
  min-width: 200px;
  font-size: 0.9rem;
  color: #EDEDED;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #FF8C5A;
    box-shadow: 0 0 0 2px rgba(255, 140, 90, 0.2);
  }

  &::placeholder {
    color: #A47864;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Button = styled.button`
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #EDEDED;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => props.variant === 'primary' ? '#A47864' : '#FF8C5A'};

  &:hover {
    background: ${props => props.variant === 'primary' ? '#8B5E4A' : '#E57A4A'};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(164, 120, 100, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  background: #2E3536;
  box-shadow: 0 1px 3px rgba(164, 120, 100, 0.1);
  border-radius: 8px;
  overflow: hidden;
`;

const Th = styled.th`
  background: #1F2526;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #F5C7A9;
  border-bottom: 2px solid #A47864;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid rgba(164, 120, 100, 0.2);
  color: #EDEDED;
  vertical-align: middle;
`;

const Tr = styled.tr`
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(164, 120, 100, 0.1);
  }

  &:last-child td {
    border-bottom: none;
  }
`;

const ActionButton = styled.button`
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.delete ? '#FF8C5A' : '#A47864'};
  color: #EDEDED;
  margin: 0 0.2rem;

  &:hover {
    background: ${props => props.delete ? '#E57A4A' : '#8B5E4A'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const FileInput = styled.input`
  display: none;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #A47864;
  font-size: 1.1rem;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 2rem;
  color: #FF8C5A;
`;

const Badge = styled.span`
  padding: 0.3rem 0.6rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
  background: ${props => {
    switch (props.role) {
      case 'admin': return 'rgba(255, 140, 90, 0.2)';
      case 'mentor': return 'rgba(164, 120, 100, 0.2)';
      case 'student': return 'rgba(245, 199, 169, 0.2)';
      default: return 'rgba(46, 53, 54, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.role) {
      case 'admin': return '#FF8C5A';
      case 'mentor': return '#A47864';
      case 'student': return '#F5C7A9';
      default: return '#EDEDED';
    }
  }};
`;

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    phone: '',
    address: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, roleFilter, searchTerm]);

  const filterUsers = () => {
    let filtered = [...users];
    
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        (user.phone && user.phone.toLowerCase().includes(term)) ||
        (user.address && user.address.toLowerCase().includes(term))
      );
    }
    
    setFilteredUsers(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No authentication token found. Please log in.');
        return;
      }

      console.log('Fetching users with token:', token);

      const response = await axios.get('http://localhost:8000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      console.log('Users response:', response.data);

      // Handle both array response and structured response
      const usersData = Array.isArray(response.data) ? response.data : (response.data.data || []);
      
      if (usersData && usersData.length > 0) {
        console.log('Setting users data:', usersData);
        setUsers(usersData);
        setFilteredUsers(usersData);
        toast.success('Users fetched successfully');
      } else {
        console.error('No users found in response:', response.data);
        toast.error('No users found');
        setUsers([]);
        setFilteredUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        toast.error(error.response.data.message || `Error: ${error.response.status}`);
      } else if (error.request) {
        console.error('Error request:', error.request);
        toast.error('No response received from server');
      } else {
        console.error('Error message:', error.message);
        toast.error('Error setting up the request: ' + error.message);
      }
      setUsers([]);
      setFilteredUsers([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      const url = editingId 
        ? `http://localhost:8000/api/users/${editingId}`
        : 'http://localhost:8000/api/users';
      
      // Use FormData to match Laravel's expected format
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('role', formData.role);
      if (formData.phone) formDataToSend.append('phone', formData.phone);
      if (formData.address) formDataToSend.append('address', formData.address);
      
      console.log('Submitting user data as FormData');

      const response = await axios({
        method: editingId ? 'post' : 'post', // Always use POST, Laravel will handle the method internally
        url: url,
        data: formDataToSend,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'X-HTTP-Method-Override': editingId ? 'PUT' : 'POST', // Add method override for PUT requests
        }
      });

      console.log('Server response:', response);

      if (response.status === 200 || response.status === 201) {
        // Reset form
        setFormData({
          name: '',
          email: '',
          password: '',
          role: '',
          phone: '',
          address: ''
        });
        setEditingId(null);
        
        // Show success message and refresh list
        toast.success(editingId ? 'User updated successfully' : 'User created successfully');
        await fetchUsers();
      } else {
        throw new Error('Unexpected response status');
      }

    } catch (error) {
      console.error('Error:', error);
      if (error.response?.status === 422) {
        // Validation errors
        const errors = error.response.data.errors;
        Object.keys(errors).forEach(key => {
          toast.error(`${key}: ${errors[key][0]}`);
        });
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to save user. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      phone: user.phone || '',
      address: user.address || ''
    });
    setEditingId(user.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:8000/api/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        toast.success('User deleted successfully');
        fetchUsers();
      } else {
        toast.error(response.data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const exportToExcel = () => {
    try {
      // Prepare the data for export
      const exportData = filteredUsers.map(user => ({
        'Name': user.name,
        'Email': user.email,
        'Role': user.role,
        'Phone': user.phone || '-',
        'Address': user.address || '-',
        'Email Verified': user.email_verified_at ? 'Yes' : 'No',
        'Created At': formatDate(user.created_at),
        'Updated At': formatDate(user.updated_at)
      }));

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Add column widths
      worksheet['!cols'] = [
        { wch: 20 }, // Name
        { wch: 25 }, // Email
        { wch: 15 }, // Role
        { wch: 15 }, // Phone
        { wch: 30 }, // Address
        { wch: 15 }, // Email Verified
        { wch: 20 }, // Created At
        { wch: 20 }  // Updated At
      ];

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

      // Generate file name
      const fileName = `users_${new Date().toISOString().split('T')[0]}.xlsx`;

      // Save file
      XLSX.writeFile(workbook, fileName);
      toast.success('Data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get first worksheet
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          if (jsonData.length === 0) {
            toast.error('No data found in Excel file');
            return;
          }

          // Show preview of data
          const confirmed = window.confirm(
            `Ready to import ${jsonData.length} users. Continue?`
          );

          if (confirmed) {
            // Transform data to match backend expectations
            const users = jsonData.map(row => ({
              name: row['Name'],
              email: row['Email'],
              role: row['Role'].toLowerCase(),
              phone: row['Phone'] === '-' ? null : row['Phone'],
              address: row['Address'] === '-' ? null : row['Address']
            }));

            const token = localStorage.getItem('token');
            const response = await axios.post(
              'http://localhost:8000/api/users/import',
              { users },
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                }
              }
            );

            if (response.data.success) {
              toast.success(`Successfully imported ${response.data.imported} users`);
              if (response.data.errors && response.data.errors.length > 0) {
                toast.warning(`${response.data.errors.length} errors occurred. Check console for details.`);
                console.log('Import errors:', response.data.errors);
              }
              fetchUsers(); // Refresh the list
            } else {
              toast.error(response.data.message || 'Import failed');
            }
          }
        } catch (error) {
          console.error('Error processing Excel file:', error);
          toast.error('Error processing Excel file');
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error importing users:', error);
      toast.error(error.response?.data?.message || 'Failed to import users');
    }

    // Clear the file input
    event.target.value = '';
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Container>
      <Title>User Management</Title>
      
      <FilterContainer>
        <FilterGroup>
          <FilterLabel>Role:</FilterLabel>
          <FilterSelect value={roleFilter} onChange={handleRoleFilterChange}>
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="mentor">Mentor</option>
            <option value="student">Student</option>
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Search:</FilterLabel>
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </FilterGroup>

        <ButtonGroup>
          <Button onClick={handleImportClick} variant="primary">
            <i className="fas fa-file-import"></i> Import Excel
          </Button>
          <FileInput
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileSelect}
          />
          <Button onClick={exportToExcel}>
            <i className="fas fa-file-export"></i> Export Excel
          </Button>
        </ButtonGroup>
      </FilterContainer>

      {loading ? (
        <LoadingSpinner>Loading users...</LoadingSpinner>
      ) : (
        <Table>
        <thead>
          <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Phone</Th>
              <Th>Address</Th>
              <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <Tr key={user.id}>
                  <Td>{user.name}</Td>
                  <Td>{user.email}</Td>
                  <Td><Badge role={user.role}>{user.role}</Badge></Td>
                  <Td>{user.phone || '-'}</Td>
                  <Td>{user.address || '-'}</Td>
                  <Td>
                    <ActionButton onClick={() => handleEdit(user)}>
                      <i className="fas fa-edit"></i> Edit
                    </ActionButton>
                    <ActionButton delete onClick={() => handleDelete(user.id)}>
                      <i className="fas fa-trash-alt"></i> Delete
                    </ActionButton>
                  </Td>
                </Tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">
                  <NoDataMessage>
                    No users found matching your criteria
                  </NoDataMessage>
                </td>
            </tr>
            )}
        </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AdminPanel;