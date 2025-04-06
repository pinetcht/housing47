// components/UserCard.jsx
import React from 'react';

const UserCard = ({ user, getClassYearName }) => {
  return (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>{user.username}</h2>
      <div style={styles.cardContent}>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Class Year:</strong> {getClassYearName(user.class_year)}</p>
      </div>
    </div>
  );
};

export default UserCard;

// Reuse your styles object from wherever it's defined
const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  cardTitle: {
    backgroundColor: '#F3F4F6',
    padding: '1rem',
    borderBottom: '1px solid #E5E7EB',
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#374151',
    margin: 0,
  },
  cardContent: {
    padding: '1.5rem',
    color: '#4B5563',
  },
};
