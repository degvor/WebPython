import {Link, Navigate, useNavigate} from 'react-router-dom';
import React, {useEffect, useState} from "react";
import axios from "axios";
import './Header.css';
import AdminPanel from "../admin_page/AdminPage";


function Header() {
    const [user, setUser] = useState([]);
    const baseUrl = 'http://localhost:8000';
    const navigate = useNavigate();
    useEffect(() => {
    // Функция для получения списка недвижимости
    const fetchEstates = async () => {
        const token = localStorage.getItem('jwt');
      try {
        // Предполагается, что у вас есть эндпоинт /api/my-estates для получения недвижимости текущего пользователя
        const response = await axios.get('http://localhost:8000/api/user/user',{
            headers: {
                Authorization: `Bearer ${token}`,
            },

        });
        setUser(response.data); // Установка данных в состояние
      } catch (error) {
        console.error('Ошибка при получении списка недвижимости:', error);
      }
    };

    fetchEstates();
  }, []);

    const handleProfileClick = () => {
        navigate('/user-menu');
};
    const handleLogoClick = () => {
        const isAdminString = localStorage.getItem('is_admin');
        const isAdmin = isAdminString === 'true';
        if (isAdmin) {
            navigate('/admin-panel');
        } else {
            navigate('/my-estate-user');
        }
    };
    return (
        // isAdmin ? <AdminPanel /> : <Navigate to="/access-denied" />
        <header className="my-estates-header">
        <button className="logo" onClick={handleLogoClick}>
            <h1>RealEstate</h1>
        </button>
        <button className="profile-button">
          <img src={`${baseUrl}${user.avatar}`} alt="Profile" onClick={handleProfileClick}/>
        </button>
      </header>
    );
}

export default Header;