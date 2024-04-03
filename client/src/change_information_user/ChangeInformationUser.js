import React, { useState } from 'react';
import axios from 'axios';
import Header from "../header/Header";
import './ChangeInformationUser.css';

function ChangeProfileInfo() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (email) formData.append('email', email);
    if (name) formData.append('name', name);
    if (surname) formData.append('surname', surname);
    if (profileImage) formData.append('avatar', profileImage);

    try {
      const token = localStorage.getItem('jwt');
      await axios.put('http://localhost:8000/api/user/change-profile-info', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile.');
    }
  };

  return (
      <div>
        <Header/>

    <div className="change-profile-info-form">
      <h2>Profile Information Change</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="New email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="New name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="New surname"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />
        <input
          type="file"
          onChange={(e) => setProfileImage(e.target.files[0])}
        />
        <button type="submit">Confirm Changing</button>
      </form>
    </div>
        </div>
  );
}

export default ChangeProfileInfo;