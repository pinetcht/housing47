import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [hoveredPrimary, setHoveredPrimary] = useState(false);

  const handleLoginClick = () => {
    navigate("/signin");
  };

  const handleAboutClick = () => {
    navigate("/about");
  };

  return (
    <div style={styles.page}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.logoContainer}>
          <span style={styles.logoIcon}>🏠</span>
          <span style={styles.logoText}>Housing47</span>
        </div>
        <div style={styles.navLinks}>
          <button 
            onClick={handleAboutClick}
            style={styles.navLink}
          >
            About
          </button>
          <button 
            onClick={handleLoginClick}
            style={styles.loginButton}
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={styles.heroSection}>
        <div style={styles.heroContainer}>
          
          {/* Main Content */}
          <div style={styles.mainContent}>
            <h1 style={styles.heading}>
              Find your perfect <span style={styles.headingAccent}>room</span>
            </h1>
            <p style={styles.subheading}>
              Smart housing search tailored for students. Browse rooms, connect with friends, and find your ideal space.
            </p>
            <div style={styles.buttonContainer}>
              <button 
                onClick={handleLoginClick}
                onMouseEnter={() => setHoveredPrimary(true)}
                onMouseLeave={() => setHoveredPrimary(false)}
                style={{
                  ...styles.primaryButton,
                  backgroundColor: hoveredPrimary ? '#4338ca' : '#4f46e5',
                  boxShadow: hoveredPrimary ? '0 10px 15px -3px rgba(79, 70, 229, 0.2)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              >
                Get Started
              </button>
            </div>
            
            {/* Features Highlights */}
            <div style={styles.featuresGrid}>
              <div style={styles.featureItem}>
                <div style={styles.featureIcon}>✓</div>
                <div>
                  <h3 style={styles.featureTitle}>Available Rooms</h3>
                  <p style={styles.featureDescription}>See which rooms speak out to you</p>
                </div>
              </div>
              <div style={styles.featureItem}>
                <div style={styles.featureIcon}>✓</div>
                <div>
                  <h3 style={styles.featureTitle}>Roommate Selection</h3>
                  <p style={styles.featureDescription}>Create the perfect roommate group</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <div style={styles.copyright}>© 2025 Housing47. All rights reserved.</div>
          <div style={styles.footerLinks}>
            <a href="#" style={styles.footerLink}>Privacy</a>
            <a href="#" style={styles.footerLink}>Terms</a>
            <a href="#" style={styles.footerLink}>Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #EBF4FF, #E0E7FF)',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  nav: {
    padding: '1rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  logoIcon: {
    fontSize: '2rem',
  },
  logoText: {
    fontWeight: 'bold',
    fontSize: '1.25rem',
    color: '#4F46E5',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  navLink: {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    color: '#4F46E5',
    fontWeight: '500',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  loginButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#4F46E5',
    color: 'white',
    borderRadius: '0.5rem',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  heroSection: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 1.5rem',
  },
  heroContainer: {
    display: 'flex',
    justifyContent: 'center',
    maxWidth: '800px',
    width: '100%',
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    textAlign: 'center',
    maxWidth: '600px',
  },
  heading: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#1F2937',
    lineHeight: '1.2',
    margin: 0,
  },
  headingAccent: {
    color: '#4F46E5',
  },
  subheading: {
    fontSize: '1.125rem',
    color: '#4B5563',
    margin: 0,
  },
  buttonContainer: {
    paddingTop: '1rem',
    display: 'flex',
    justifyContent: 'center',
  },
  primaryButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#4F46E5',
    color: 'white',
    borderRadius: '0.75rem',
    fontWeight: '500',
    fontSize: '1.125rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  featuresGrid: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    paddingTop: '1.5rem',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
  },
  featureIcon: {
    padding: '0.5rem',
    backgroundColor: '#EEF2FF',
    borderRadius: '0.5rem',
    color: '#4F46E5',
  },
  featureTitle: {
    fontWeight: '500',
    margin: '0',
  },
  featureDescription: {
    fontSize: '0.875rem',
    color: '#6B7280',
    margin: '0',
    textAlign: 'left',
  },
  footer: {
    padding: '1.5rem',
    textAlign: 'center',
    color: '#6B7280',
    fontSize: '0.875rem',
    borderTop: '1px solid rgba(229, 231, 235, 0.5)',
  },
  footerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  copyright: {
    marginBottom: '1rem',
  },
  footerLinks: {
    display: 'flex',
    gap: '1.5rem',
  },
  footerLink: {
    color: '#6B7280',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
};