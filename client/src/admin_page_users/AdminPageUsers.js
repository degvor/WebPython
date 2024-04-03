import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminUsersPanel.css';
import Header from "../header/Header"; // Подготовьте соответствующий CSS-файл

function AdminUsersPanel() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Предположим, что у вас есть API-эндпоинт для получения списка пользователей
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user/get_users');
        setUsers(response.data);
      } catch (error) {
        console.error('Ошибка при получении списка пользователей:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = () => {
    navigate('/register-user'); // Путь к странице добавления нового пользователя
  };

  const handleGetMoreInfo = (userId) => {
    // Функция для получения более подробной информации о пользователе
    navigate(`/admin-users/${userId}`);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8000/api/user/delete-user/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
    }
  };

  return (
<div>
      <Header />
    <div className="admin-users-panel">

      <h1>Admin Panel Users</h1>
      <button onClick={handleAddUser}>Add User</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Appointments</th>
            <th>Success Deals</th>
            <th colSpan="2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name} {user.surname}</td>
              <td>{user.appointment_total}</td>
              <td>{user.deals_total}</td>
              <td><button className="get-more-info" onClick={() => handleGetMoreInfo(user.id)}>Get more info</button></td>
              <td><button className="delete" onClick={() => handleDeleteUser(user.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}

export default AdminUsersPanel;