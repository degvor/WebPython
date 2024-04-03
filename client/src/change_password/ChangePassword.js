import React, { useState } from 'react';
import axios from 'axios';
import ProfileSettings from "../user_menu/UserMenu";
import {useNavigate} from "react-router-dom";
import './ChangePassword.css';
import Header from "../header/Header";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatNewPassword, setRepeatNewPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== repeatNewPassword) {
      alert('New passwords do not match!');
      return;
    }

    try {
      const token = localStorage.getItem('jwt'); // Предположим, что jwt токен сохранен в localStorage
      await axios.post('http://localhost:8000/api/user/change-password/', {
        oldPassword,
        newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Password changed successfully!');
    } catch (error) {
      console.error('Failed to change password:', error);
      alert('Failed to change password.');
    }
    navigate('/user-menu')
  };

  return (
      <div>
        <Header/>
    <div className="change-password-form">
      <h2>Password Change</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Old password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Repeat new password"
          value={repeatNewPassword}
          onChange={(e) => setRepeatNewPassword(e.target.value)}
        />
        <button type="submit">Confirm Changing</button>
      </form>
    </div>
        </div>
  );
}

export default ChangePassword;