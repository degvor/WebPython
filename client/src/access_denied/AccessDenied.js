import React from 'react';
import './AccessDenied.css';

const AccessDenied = () => {
  return (
    <div className="access-denied-container">
      <div className="access-denied-content">
        <h1>Error 403</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    </div>
  );
};

export default AccessDenied;
