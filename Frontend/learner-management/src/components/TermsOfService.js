import React from 'react';
import './TermsOfService.css';

const TermsOfService = () => {
  return (
    <div className="terms-of-service">
      <div className="terms-hero">
        <h1>Terms of Service</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="terms-content">
        <section className="terms-section">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using the Early Intervention System, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our services.</p>
        </section>

        <section className="terms-section">
          <h2>2. Description of Service</h2>
          <p>The Early Intervention System provides educational support and intervention services for learners. Our platform includes:</p>
          <ul>
            <li>Educational assessment tools</li>
            <li>Learning progress tracking</li>
            <li>Counseling services</li>
            <li>Resource materials</li>
            <li>Communication tools</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>3. User Accounts</h2>
          <h3>3.1 Registration</h3>
          <p>To use our services, you must:</p>
          <ul>
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Notify us immediately of any security breaches</li>
          </ul>

          <h3>3.2 Account Termination</h3>
          <p>We reserve the right to:</p>
          <ul>
            <li>Suspend or terminate accounts that violate our terms</li>
            <li>Remove or edit content that violates our policies</li>
            <li>Refuse service to anyone for any reason</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>4. User Responsibilities</h2>
          <p>As a user of our service, you agree to:</p>
          <ul>
            <li>Use the service in compliance with all applicable laws</li>
            <li>Respect the privacy and rights of other users</li>
            <li>Not engage in any harmful or disruptive activities</li>
            <li>Not attempt to access unauthorized areas of the system</li>
            <li>Not use the service for any illegal purposes</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>5. Intellectual Property</h2>
          <p>All content and materials available on the Early Intervention System are protected by intellectual property rights. This includes:</p>
          <ul>
            <li>Text, graphics, and logos</li>
            <li>Educational materials and resources</li>
            <li>Software and technology</li>
            <li>User-generated content</li>
          </ul>
          <p>You may not use, copy, or distribute any content without our express written permission.</p>
        </section>

        <section className="terms-section">
          <h2>6. Payment Terms</h2>
          <p>For paid services:</p>
          <ul>
            <li>Fees are billed in advance</li>
            <li>All payments are non-refundable</li>
            <li>Prices may be changed with notice</li>
            <li>You are responsible for all applicable taxes</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>7. Limitation of Liability</h2>
          <p>The Early Intervention System shall not be liable for:</p>
          <ul>
            <li>Any indirect or consequential damages</li>
            <li>Loss of data or profits</li>
            <li>Service interruptions or errors</li>
            <li>Third-party actions or content</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>8. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Continued use of the service after changes constitutes acceptance of the new terms.</p>
        </section>

        <section className="terms-section">
          <h2>9. Governing Law</h2>
          <p>These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which we operate, without regard to its conflict of law provisions.</p>
        </section>

        <section className="terms-section">
          <h2>10. Contact Information</h2>
          <p>For questions about these Terms of Service, please contact us at:</p>
          <div className="contact-info">
            <p><i className="fas fa-envelope"></i> legal@earlyintervention.com</p>
            <p><i className="fas fa-phone"></i> +1 (555) 123-4567</p>
            <p><i className="fas fa-map-marker-alt"></i> 123 Education Street, Learning City, 12345</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService; 