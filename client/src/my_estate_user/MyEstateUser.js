import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import defaultProfilePic from './path-to-default-profile-pic.jpg'; // Путь к изображению профиля по умолчанию
import './MyEstateUser.css';
import Header from "../header/Header";
import {useNavigate} from "react-router-dom";

const MyEstatesPage = () => {
  const [estates, setEstates] = useState([]); // Состояние для хранения списка недвижимости
  const baseUrl = 'http://localhost:8000';
  const navigate = useNavigate();

  useEffect(() => {
    // Функция для получения списка недвижимости
    const fetchEstates = async () => {
        const token = localStorage.getItem('jwt');
      try {
        // Предполагается, что у вас есть эндпоинт /api/my-estates для получения недвижимости текущего пользователя
        const response = await axios.get('http://localhost:8000/api/management/my-estates/',{
            headers: {
                Authorization: `Bearer ${token}`,
            },

        });
        setEstates(response.data); // Установка данных в состояние
      } catch (error) {
        console.error('Ошибка при получении списка недвижимости:', error);
      }
    };

    fetchEstates();
  }, []);

  const handleEstateClick = (estateId) => {
    navigate(`/my-estate-user/${estateId}/book`)
  };

  return (
    <div className="my-estates-page">
        <Header />
      <div className="estates-list">
        {estates.map((estate) => (
          <div key={estate.id} onClick={() => handleEstateClick(estate.id)} className="estate-item">
            {/*<button onClick={() => /!* Обработчик клика по недвижимости *!/}>*/}
              <img src={`${baseUrl}${estate.image}`} alt={estate.address} />
              <div className="estate-info">
                <h2>{estate.address}</h2>
                <p>{estate.description}</p>
                <p>Price: {estate.price}</p>
              </div>
            {/*</button>*/}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyEstatesPage;