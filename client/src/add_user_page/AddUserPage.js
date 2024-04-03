import React, { useState } from 'react';
import axios from 'axios';
import './AddUserPage.css';
import Header from "../header/Header";
import {useNavigate} from "react-router-dom";

const AddUserPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    surname: '',
    password: '',
    avatar: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      avatar: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = new FormData();
    dataToSend.append('email', formData.email);
    dataToSend.append('name', formData.name);
    dataToSend.append('surname', formData.surname);
    dataToSend.append('password', formData.password); // Оставьте этот параметр пустым, если пароль должен генерироваться
    // if (formData.avatar) {
    //   dataToSend.append('avatar', formData.avatar);
    // }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/user/register', dataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      // Обработка успешной регистрации
    } catch (error) {
      console.error('Ошибка при добавлении пользователя', error);
      // Обработка ошибок регистрации
    }
    const imgToSend = new FormData();
    imgToSend.append('email', formData.email);
    imgToSend.append('avatar', formData.avatar);
    try {
      const responseImg = await axios.post('http://127.0.0.1:8000/api/user/create-avatar', imgToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(responseImg.data);
      // Обработка успешной регистрации
    } catch (error) {
      console.error('Ошибка при добавлении пользователя', error);
      // Обработка ошибок регистрации
    }
    navigate('/admin-users')

  };

  return (
      <div>
            <Header />
    <div className="add-user-page">
      <h1>Adding user</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        <input type="text" name="surname" value={formData.surname} onChange={handleChange} placeholder="Surname" required />
        <input type="file" name="avatar" onChange={handleFileChange} />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter password or leave empty for genetic password" />
        <button type="submit">Register</button>
      </form>
    </div>
    </div>
  );
};

export default AddUserPage;