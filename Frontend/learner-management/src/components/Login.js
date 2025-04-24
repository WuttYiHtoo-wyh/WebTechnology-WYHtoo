import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Get CSRF cookie first
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
        withCredentials: true
      });

      // Then make login request
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        withCredentials: true
      });

      if (response.data.token) {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Get user role and redirect accordingly
        const userRole = response.data.user.role;
        
        switch(userRole) {
          case 'admin':
            toast.success('Welcome, Admin!');
            navigate('/admin-dashboard');
            break;
          case 'mentor':
            toast.success('Welcome, Mentor!');
            navigate('/mentor-dashboard');
            break;
          case 'student':
            toast.success('Welcome, Student!');
            navigate('/student-dashboard');
            break;
          default:
            toast.error('Unknown user role');
            navigate('/');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  // ... rest of the component code ...
};

export default Login;