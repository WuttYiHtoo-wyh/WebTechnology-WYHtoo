// src/components/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

// Styled Components for the 2025 design
const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 140px);
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

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(255, 140, 90, 0.3);
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
`;

const RoleQuestion = styled.p`
  font-size: 1.1rem;
  color: #EDEDED;
  font-weight: 500;
  margin-bottom: 10px;
`;

const RoleContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 8px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #EDEDED;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 6px;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(164, 120, 100, 0.1);
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

  &:checked {
    border-color: #FF8C5A;
    background: #FF8C5A;
  }

  &:checked::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 6px;
    height: 6px;
    background: #EDEDED;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(164, 120, 100, 0.3);
  }
`;

const Input = styled.input`
  padding: 12px;
  margin-top: 8px;
  border: none;
  border-radius: 10px;
  background: #F5C7A9;
  color: #1F2526;
  font-size: 1rem;
  transition: all 0.3s ease;

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
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(90deg, #A47864, #FF8C5A);
  color: #EDEDED;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 140, 90, 0.4);
    background: linear-gradient(90deg, #FF8C5A, #A47864);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 10px rgba(255, 140, 90, 0.2);
  }
`;

// Custom Dialog Styles
const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(31, 37, 38, 0.8); /* Deep Charcoal with opacity */
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
  background: rgba(46, 53, 54, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(164, 120, 100, 0.5);
  border-radius: 15px;
  padding: 20px 30px;
  max-width: 400px;
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
`;

const DialogButton = styled.button`
  padding: 8px 20px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(90deg, #A47864, #FF8C5A);
  color: #EDEDED;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(90deg, #FF8C5A, #A47864);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 140, 90, 0.4);
  }
`;

// Custom Dialog Component
const Dialog = ({ message, onClose }) => {
  return (
    <DialogOverlay>
      <DialogBox>
        <DialogMessage>{message}</DialogMessage>
        <DialogButton onClick={onClose}>OK</DialogButton>
      </DialogBox>
    </DialogOverlay>
  );
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password || !selectedRole) {
      setDialogMessage('Please fill in all fields, including role.');
      setShowDialog(true);
      return;
    }
    if (password !== '123') {
      setDialogMessage('Invalid password. Please try again.');
      setShowDialog(true);
      return;
    }

    login(selectedRole);
    setDialogMessage('Login successful!');
    setShowDialog(true);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    if (dialogMessage === 'Login successful!') {
      if (selectedRole === 'admin' || selectedRole === 'HomePage') {
        navigate('/home');
      } else if (selectedRole === 'mentor') {
        navigate('/MentorDashboard');
      }
    }
  };

  // Fade-in animation for the login card
  useEffect(() => {
    const card = document.querySelector('.form-container');
    card.style.opacity = '0';
    setTimeout(() => {
      card.style.transition = 'opacity 0.5s ease';
      card.style.opacity = '1';
    }, 100);
  }, []);

  return (
    <>
      <LoginContainer>
        <LoginCard className="form-container">
          <Title>Login</Title>
          <Form onSubmit={handleSubmit}>
            <Label>
              <RoleQuestion>Are you an Admin or Mentor?</RoleQuestion>
              <RoleContainer>
                <RadioLabel>
                  <RadioInput
                    type="radio"
                    value="admin"
                    checked={selectedRole === 'admin'}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    required
                  />
                  Admin
                </RadioLabel>
                <RadioLabel>
                  <RadioInput
                    type="radio"
                    value="mentor"
                    checked={selectedRole === 'mentor'}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    required
                  />
                  Mentor
                </RadioLabel>
              </RoleContainer>
            </Label>
            <Label>
              Username or Email:
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter username or email"
              />
            </Label>
            <Label>
              Password:
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
              />
            </Label>
            <Button type="submit">Login</Button>
          </Form>
        </LoginCard>
      </LoginContainer>
      {showDialog && <Dialog message={dialogMessage} onClose={handleDialogClose} />}
    </>
  );
};

export default LoginPage;