import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>Welcome to Early Intervention System</h1>
        <p>
          Transforming education through early detection and support.
          Our platform empowers educators and students with tools for timely
          intervention and personalized guidance.
        </p>
      </header>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">
            📊
          </div>
          <h3>Early Detection</h3>
          <p>
            Advanced analytics and monitoring tools to identify learning challenges
            early, ensuring timely support and intervention strategies.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            🤝
          </div>
          <h3>Personalized Support</h3>
          <p>
            Tailored counselling sessions and guidance from experienced mentors,
            designed to address individual learning needs.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            📈
          </div>
          <h3>Progress Tracking</h3>
          <p>
            Comprehensive monitoring and reporting tools to track improvement
            and ensure continuous development in the learning journey.
          </p>
        </div>
      </div>

      <div className="cta-section">
        <button 
          className="cta-button"
          onClick={() => navigate('/login')}
        >
          Start Your Journey
        </button>
      </div>

      <footer className="footer">
        <p>© 2024 Early Intervention System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage; 