import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';
import Header from "../header/Header"; // Убедитесь, что у вас есть CSS-файл для стилизации

function AdminPanel() {
  const navigate = useNavigate();

  const navigateToAddProperty = () => navigate('/add-property-admin');
  const navigateToAdminUsers = () => navigate('/admin-users');
  const navigateToAdminProperty = () => navigate('/admin-panel-property');

  return (
      <div>
    <Header />
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <button onClick={navigateToAddProperty}>Add New Property</button>
      <button onClick={navigateToAdminUsers}>Admin Panel Users</button>
      <button onClick={navigateToAdminProperty}>Admin Panel Property</button>
    </div>
    </div>
  );
}

export default AdminPanel;
