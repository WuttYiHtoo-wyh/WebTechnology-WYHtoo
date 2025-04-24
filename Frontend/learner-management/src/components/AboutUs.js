import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us">
      <div className="about-hero">
        <h1>About Early Intervention System</h1>
        <p>Empowering Education for a Brighter Future</p>
      </div>

      <section className="about-section mission">
        <div className="section-content">
          <h2>Our Mission</h2>
          <p>To provide early intervention support and educational resources that empower learners to reach their full potential, ensuring no child is left behind in their educational journey.</p>
        </div>
      </section>

      <section className="about-section vision">
        <div className="section-content">
          <h2>Our Vision</h2>
          <p>To create a world where every child has access to quality early intervention services and educational support, fostering an inclusive learning environment that celebrates diversity and individual growth.</p>
        </div>
      </section>

      <section className="about-section values">
        <div className="section-content">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <i className="fas fa-heart"></i>
              <h3>Compassion</h3>
              <p>We approach every child with understanding and empathy, recognizing their unique needs and potential.</p>
            </div>
            <div className="value-card">
              <i className="fas fa-star"></i>
              <h3>Excellence</h3>
              <p>We strive for the highest quality in our services and support systems.</p>
            </div>
            <div className="value-card">
              <i className="fas fa-users"></i>
              <h3>Inclusivity</h3>
              <p>We believe in creating an environment where every child feels valued and supported.</p>
            </div>
            <div className="value-card">
              <i className="fas fa-lightbulb"></i>
              <h3>Innovation</h3>
              <p>We continuously improve our methods and embrace new technologies to better serve our community.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section team">
        <div className="section-content">
          <h2>Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image">
                <i className="fas fa-user-circle"></i>
              </div>
              <h3>Dr. Sarah Johnson</h3>
              <p className="member-role">Founder & Director</p>
              <p className="member-bio">With over 15 years of experience in early childhood education and intervention.</p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <i className="fas fa-user-circle"></i>
              </div>
              <h3>Michael Chen</h3>
              <p className="member-role">Lead Educator</p>
              <p className="member-bio">Specializing in special education and inclusive learning environments.</p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <i className="fas fa-user-circle"></i>
              </div>
              <h3>Lisa Rodriguez</h3>
              <p className="member-role">Program Coordinator</p>
              <p className="member-bio">Expert in developing personalized learning plans and support systems.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section contact">
        <div className="section-content">
          <h2>Get in Touch</h2>
          <p>We're always here to help and answer any questions you may have about our services.</p>
          <div className="contact-info">
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <p>contact@earlyintervention.com</p>
            </div>
            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <p>+1 (555) 123-4567</p>
            </div>
            <div className="contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <p>123 Education Street, Learning City, 12345</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs; 