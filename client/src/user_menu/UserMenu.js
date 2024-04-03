import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserMenu.css';
import Header from "../header/Header";

function ProfileSettings() {
  const navigate = useNavigate();

  const handleChangePassword = () => {
    // Перенаправление на страницу изменения пароля
    navigate('/change-password');
  };

  const handleChangeProfileInfo = () => {
    // Перенаправление на страницу изменения информации профиля
    navigate('/change-profile-info');
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('is_admin');
    navigate('/login');

  };

  return (
      <div>
          <Header />
    <div className="profile-settings">
      <h1>Profile settings</h1>
      <button onClick={handleChangePassword}>Change password</button>
      <button onClick={handleChangeProfileInfo}>Change profile information</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
      </div>
  );
}

export default ProfileSettings;