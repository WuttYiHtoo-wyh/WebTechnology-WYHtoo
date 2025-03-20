import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy">
      <div className="privacy-hero">
        <h1>Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="privacy-content">
        <section className="privacy-section">
          <h2>1. Introduction</h2>
          <p>At Early Intervention System, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.</p>
          <p>Please read this privacy policy carefully. By using our services, you consent to the practices described in this policy.</p>
        </section>

        <section className="privacy-section">
          <h2>2. Information We Collect</h2>
          <h3>2.1 Personal Information</h3>
          <p>We may collect personal information that you voluntarily provide to us when you:</p>
          <ul>
            <li>Register for an account</li>
            <li>Use our early intervention services</li>
            <li>Contact us for support</li>
            <li>Participate in our programs</li>
          </ul>
          <p>This information may include:</p>
          <ul>
            <li>Name and contact information</li>
            <li>Educational records</li>
            <li>Health and medical information</li>
            <li>Payment information</li>
          </ul>

          <h3>2.2 Automatically Collected Information</h3>
          <p>When you use our services, we may automatically collect:</p>
          <ul>
            <li>Device information</li>
            <li>Usage data</li>
            <li>IP address</li>
            <li>Browser type</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>3. How We Use Your Information</h2>
          <p>We use the collected information for various purposes:</p>
          <ul>
            <li>To provide and maintain our services</li>
            <li>To improve and personalize your experience</li>
            <li>To communicate with you about our services</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and safety</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>4. Information Sharing and Disclosure</h2>
          <p>We may share your information with:</p>
          <ul>
            <li>Service providers and partners</li>
            <li>Educational institutions</li>
            <li>Healthcare professionals</li>
            <li>Legal authorities when required</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>5. Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information, including:</p>
          <ul>
            <li>Encryption of sensitive data</li>
            <li>Regular security assessments</li>
            <li>Access controls and authentication</li>
            <li>Secure data storage and transmission</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
            <li>Export your data</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>7. Children's Privacy</h2>
          <p>Our services are designed to protect children's privacy. We:</p>
          <ul>
            <li>Obtain parental consent for children under 13</li>
            <li>Limit data collection for children</li>
            <li>Provide parental controls</li>
            <li>Comply with COPPA regulations</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>8. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by:</p>
          <ul>
            <li>Posting the new policy on this page</li>
            <li>Sending you an email notification</li>
            <li>Updating the "Last updated" date</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>9. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <div className="contact-info">
            <p><i className="fas fa-envelope"></i> privacy@earlyintervention.com</p>
            <p><i className="fas fa-phone"></i> +1 (555) 123-4567</p>
            <p><i className="fas fa-map-marker-alt"></i> 123 Education Street, Learning City, 12345</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 