import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarContainer = styled.div`
  background: #2A3132;
  padding: 2rem;
  border-radius: 15px;
  margin: 2rem 0;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  color: #F5C7A9;
  font-size: 1.8rem;
  margin: 0;
`;

const TimeSlotsContainer = styled.div`
  margin-top: 2rem;
`;

const TimeSlot = styled.button`
  background: ${props => props.$selected ? '#4ABDAC' : '#343a40'};
  color: ${props => props.$selected ? '#fff' : '#EDEDED'};
  border: 1px solid ${props => props.$selected ? '#4ABDAC' : '#A47864'};
  padding: 0.8rem 1.5rem;
  margin: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.$selected ? '#3AA89A' : '#A47864'};
    transform: translateY(-2px);
  }

  &:disabled {
    background: #2A3132;
    color: #666;
    cursor: not-allowed;
    border-color: #666;
  }
`;

const BookingForm = styled.form`
  margin-top: 2rem;
  background: #343a40;
  padding: 2rem;
  border-radius: 15px;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  color: #F5C7A9;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  background: #2A3132;
  border: 1px solid #A47864;
  border-radius: 8px;
  color: #EDEDED;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4ABDAC;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  background: #2A3132;
  border: 1px solid #A47864;
  border-radius: 8px;
  color: #EDEDED;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #4ABDAC;
  }
`;

const SubmitButton = styled.button`
  background: #4ABDAC;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.3s ease;

  &:hover {
    background: #3AA89A;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #2A3132;
    cursor: not-allowed;
  }
`;

const MentorCalendar = ({ mentorId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [duration, setDuration] = useState(30);
  const [purpose, setPurpose] = useState('');
  const [notes, setNotes] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00'
  ];

  useEffect(() => {
    fetchAvailableSlots();
  }, [selectedDate]);

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/api/mentors/${mentorId}/available-slots`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        params: {
          date: selectedDate.toISOString().split('T')[0]
        }
      });
      setAvailableSlots(response.data.available_slots);
    } catch (error) {
      toast.error('Error fetching available slots');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTime) {
      toast.error('Please select a time slot');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:8000/api/students/${localStorage.getItem('user_id')}/bookings`,
        {
          mentor_id: mentorId,
          date: selectedDate.toISOString().split('T')[0],
          time: selectedTime,
          duration: duration,
          purpose: purpose,
          notes: notes
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success('Booking request submitted successfully!');
      // Reset form
      setSelectedTime(null);
      setDuration(30);
      setPurpose('');
      setNotes('');
      fetchAvailableSlots();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting booking request');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CalendarContainer>
      <CalendarHeader>
        <Title>Book a Session</Title>
      </CalendarHeader>

      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        minDate={new Date()}
        className="react-calendar"
      />

      <TimeSlotsContainer>
        <Label>Available Time Slots</Label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {timeSlots.map((slot) => (
            <TimeSlot
              key={slot}
              $selected={selectedTime === slot}
              onClick={() => setSelectedTime(slot)}
              disabled={!availableSlots.includes(slot)}
            >
              {slot}
            </TimeSlot>
          ))}
        </div>
      </TimeSlotsContainer>

      <BookingForm onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Duration (minutes)</Label>
          <Input
            type="number"
            min="15"
            max="120"
            step="15"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Purpose</Label>
          <Input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Brief description of what you'd like to discuss"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Additional Notes</Label>
          <TextArea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional information you'd like to share"
          />
        </FormGroup>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Book Session'}
        </SubmitButton>
      </BookingForm>
    </CalendarContainer>
  );
};

export default MentorCalendar; 