import React from 'react';
import { Link } from 'react-router-dom';
import WYImage from '../WY.JPG';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">Early Intervention System</span>
            <span className="subtitle">Empowering Education for a Brighter Future</span>
          </h1>
          <p className="hero-description">
            A comprehensive platform designed to support student development through 
            personalized learning, counseling, and progress tracking.
          </p>
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-primary pulse">
              Get Started
              <span className="btn-shine"></span>
            </Link>
            <Link to="/about" className="btn btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
        <div className="hero-image-container">
          <div className="hero-image-wrapper">
            <img src={WYImage} alt="Education Illustration" className="hero-image" />
            <div className="floating-elements">
              <div className="float-element element-1"></div>
              <div className="float-element element-2"></div>
              <div className="float-element element-3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Our Core Services</h2>
          <p className="section-subtitle">Comprehensive tools for student development and support</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-book-reader"></i>
            </div>
            <h3>Module Management</h3>
            <p>Track completed, ongoing, and upcoming modules with detailed attendance and results</p>
            <div className="feature-hover-effect"></div>
            <div className="feature-image">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Module Management" />
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-comments"></i>
            </div>
            <h3>Student Counselling</h3>
            <p>Access professional counseling services and personalized guidance for student development</p>
            <div className="feature-hover-effect"></div>
            <div className="feature-image">
              <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Student Counselling" />
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-lightbulb"></i>
            </div>
            <h3>Solution Planning</h3>
            <p>Get tailored solutions and intervention strategies for student support</p>
            <div className="feature-hover-effect"></div>
            <div className="feature-image">
              <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Solution Planning" />
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <h3>Progress Monitoring</h3>
            <p>Comprehensive tracking of student progress with detailed analytics and insights</p>
            <div className="feature-hover-effect"></div>
            <div className="feature-image">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Progress Monitoring" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2 className="section-title">What Our Users Say</h2>
          <p className="section-subtitle">Success stories from our community</p>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <div className="quote-icon">"</div>
              <p>"The Early Intervention System has transformed how we track and support student progress."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-image">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Dr. Sarah Johnson" />
              </div>
              <div className="author-info">
                <h4>Dr. Sarah Johnson</h4>
                <p>Education Director</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <div className="quote-icon">"</div>
              <p>"The counseling services have been invaluable in helping students overcome challenges."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-image">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Michael Chen" />
              </div>
              <div className="author-info">
                <h4>Michael Chen</h4>
                <p>School Counselor</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <div className="quote-icon">"</div>
              <p>"The solution planning tools have made it easier to provide targeted support."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-image">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Lisa Rodriguez" />
              </div>
              <div className="author-info">
                <h4>Lisa Rodriguez</h4>
                <p>Special Education Teacher</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Education?</h2>
          <p>Join thousands of students and educators who are already benefiting from our platform</p>
          <div className="cta-buttons">
            <Link to="/login" className="btn btn-primary pulse">
              Start Your Journey
              <span className="btn-shine"></span>
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              Contact Us
            </Link>
          </div>
        </div>
        <div className="cta-background">
          <div className="cta-pattern"></div>
          <div className="cta-image">
            <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Education Transformation" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 