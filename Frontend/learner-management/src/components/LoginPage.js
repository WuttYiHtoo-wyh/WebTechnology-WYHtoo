// src/components/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';

// Styled Components for the 2025 design
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1F2526 0%, #2E3536 100%);
  overflow: hidden;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(164, 120, 100, 0.2) 0%, transparent 70%);
    animation: pulse 10s infinite alternate;
  }

  @keyframes pulse {
    0% { transform: scale(0.5); opacity: 0.5; }
    100% { transform: scale(1.5); opacity: 0; }
  }
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 140px);
  padding: 2rem;
  position: relative;
  z-index: 1;
`;

const LoginCard = styled.div`
  background: rgba(46, 53, 54, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(164, 120, 100, 0.5);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(255, 140, 90, 0.2);
  transform: translateY(0);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, transparent, rgba(255, 140, 90, 0.1), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(255, 140, 90, 0.3);

    &:before {
      transform: translateX(100%);
    }
  }
`;

const Title = styled.h1`
  font-family: 'Inter', sans-serif;
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 30px;
  background: linear-gradient(90deg, #A47864, #4ABDAC);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
  display: inline-block;

  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #A47864, #4ABDAC);
    border-radius: 2px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  text-align: left;
  font-size: 1rem;
  color: #EDEDED;
  font-weight: 500;
  position: relative;
`;

const RoleQuestion = styled.p`
  font-size: 1rem;
  color: #EDEDED;
  font-weight: 500;
  margin-bottom: 8px;
  text-align: center;
`;

const RoleContainer = styled.div`
  display: flex;
  gap: 30px;
  justify-content: center;
  margin-top: 4px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #EDEDED;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  background: rgba(164, 120, 100, 0.1);

  &:hover {
    background: rgba(164, 120, 100, 0.2);
    border-color: rgba(164, 120, 100, 0.3);
  }
`;

const RadioInput = styled.input`
  appearance: none;
  width: 14px;
  height: 14px;
  border: 2px solid #A47864;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;

  &:checked {
    border-color: #FF8C5A;
    background: #FF8C5A;
    transform: scale(0.9);
  }

  &:checked::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 4px;
    height: 4px;
    background: #EDEDED;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(164, 120, 100, 0.3);
  }
`;

const Input = styled.input`
  padding: 12px 16px;
  margin-top: 8px;
  border: none;
  border-radius: 10px;
  background: #F5C7A9;
  color: #1F2526;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(164, 120, 100, 0.3);
    background: #FFDAB9;
  }

  &::placeholder {
    color: #A47864;
    opacity: 0.7;
  }
`;

const Button = styled.button`
  padding: 14px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(90deg, #A47864, #FF8C5A);
  color: #EDEDED;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 140, 90, 0.4);
    background: linear-gradient(90deg, #FF8C5A, #A47864);

    &:before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 10px rgba(255, 140, 90, 0.2);
  }
`;

// Dialog Components
const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(31, 37, 38, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const DialogBox = styled.div`
  background: rgba(46, 53, 54, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(164, 120, 100, 0.5);
  border-radius: 15px;
  padding: 25px 35px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 8px 32px rgba(255, 140, 90, 0.2);
  transform: scale(0.7);
  animation: popIn 0.3s ease forwards;

  @keyframes popIn {
    to { transform: scale(1); }
  }
`;

const DialogMessage = styled.p`
  font-size: 1.1rem;
  color: #EDEDED;
  margin-bottom: 20px;
  line-height: 1.4;
`;

const DialogButton = styled.button`
  padding: 8px 24px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(90deg, #A47864, #FF8C5A);
  color: #EDEDED;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 140, 90, 0.3);
  }
`;

const Dialog = ({ message, onClose }) => {
  return (
    <DialogOverlay onClick={onClose}>
      <DialogBox onClick={e => e.stopPropagation()}>
        <DialogMessage>{message}</DialogMessage>
        <DialogButton onClick={onClose}>Close</DialogButton>
      </DialogBox>
    </DialogOverlay>
  );
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  });
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Debug: Log the raw response
      const rawResponse = await response.text();
      console.log('Raw response:', rawResponse);
      
      let data;
      try {
        data = JSON.parse(rawResponse);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Response status:', response.status);
        console.error('Response headers:', Object.fromEntries(response.headers.entries()));
        setDialogMessage('Server error. Please try again.');
        setShowDialog(true);
        return;
      }

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setDialogMessage('Login successful! Redirecting...');
        setShowDialog(true);
        setTimeout(() => {
          if (data.user.role === 'admin') {
            navigate('/admin-dashboard');
          } else if (data.user.role === 'mentor') {
            navigate('/mentor-dashboard');
          }
        }, 1500);
      } else {
        setDialogMessage(data.message || 'Login failed. Please try again.');
        setShowDialog(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      setDialogMessage('An error occurred. Please try again.');
      setShowDialog(true);
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
  };

  return (
    <PageContainer>
      <Navbar />
      <LoginContainer>
        <LoginCard>
          <Title>Welcome Back</Title>
          <Form onSubmit={handleSubmit}>
            <Label>
              Email
              <Input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Label>
            <Label>
              Password
              <Input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </Label>
            <RoleQuestion>Select your role:</RoleQuestion>
            <RoleContainer>
              <RadioLabel>
                <RadioInput
                  type="radio"
                  name="role"
                  value="student"
                  checked={formData.role === 'student'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
                Student
              </RadioLabel>
              <RadioLabel>
                <RadioInput
                  type="radio"
                  name="role"
                  value="mentor"
                  checked={formData.role === 'mentor'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
                Mentor
              </RadioLabel>
              <RadioLabel>
                <RadioInput
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formData.role === 'admin'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
                Admin
              </RadioLabel>
            </RoleContainer>
            <Button type="submit">Login</Button>
          </Form>
        </LoginCard>
      </LoginContainer>
      {showDialog && <Dialog message={dialogMessage} onClose={handleDialogClose} />}
    </PageContainer>
  );
};

export default LoginPage;