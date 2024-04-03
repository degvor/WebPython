import React, {useEffect, useState} from 'react';
import axios from "axios";
import Header from "../header/Header";
import {useParams} from "react-router-dom";
import './BookingProperty.css';

// Этот компонент предполагает, что вы получаете данные о бронированиях откуда-то, например, из API
function PropertyBooking() {
  const [bookings, setBookings] = useState({}); // Здесь должна быть логика получения данных о бронированиях
  const { estateId } = useParams();
  const [estate, setEstate] = useState({});
    const [currentUser, setCurrentUser] = useState([]);
  const baseUrl = 'http://localhost:8000';

  // Генерация дат начиная с сегодняшнего дня и на 6 дней вперед
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  useEffect(() => {
    // Функция для получения списка недвижимости
    const fetchBookings = async () => {
        const token = localStorage.getItem('jwt');
      try {
        // Предполагается, что у вас есть эндпоинт /api/my-estates для получения недвижимости текущего пользователя
        const response = await axios.get(`http://localhost:8000/api/management/booking-id/${estateId}/`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },

        });
        const bookings = response.data.reduce((acc, booking) => {
          if (!acc[booking.date]) {
            acc[booking.date] = {};
          }
            acc[booking.date][booking.time] = booking;
            return acc;

        }, {});
        setBookings(bookings); // Установка данных в состояние
      } catch (error) {
        console.error('Ошибка при получении списка бронирования', error);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    // Функция для получения списка недвижимости
    const fetchEstate = async () => {
        const token = localStorage.getItem('jwt');
      try {
        // Предполагается, что у вас есть эндпоинт /api/my-estates для получения недвижимости текущего пользователя
        const response = await axios.get(`http://localhost:8000/api/management/get-estate/${estateId}/`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },

        });
        console.log(response.data[0])
        setEstate(response.data[0]); // Установка данных в состояние
      } catch (error) {
        console.error('Ошибка при получении списка недвижимости:', error);
      }
    };

    fetchEstate();
  }, []);

  useEffect(() => {
    // Функция для получения списка недвижимости
    const fetchUser = async () => {
        const token = localStorage.getItem('jwt');
      try {
        // Предполагается, что у вас есть эндпоинт /api/my-estates для получения недвижимости текущего пользователя
        const response1 = await axios.get(`http://localhost:8000/api/user/user`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },

        });
        console.log(response1.data)
        setCurrentUser(response1.data); // Установка данных в состояние
      } catch (error) {
        console.error('Ошибка при получении списка недвижимости:', error);
      }
    };

    fetchUser();
  }, []);



  const times = [
    '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00',
    '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00',
    '18:00-19:00', '19:00-20:00',
  ];

  const bookSlot = async (date, time) => {
    const token = localStorage.getItem('jwt');
      try {
        // Предполагается, что у вас есть эндпоинт /api/my-estates для получения недвижимости текущего пользователя
        const response = await axios.post(`http://localhost:8000/api/management/booking/`,{
            user: currentUser.id,
            date: date,
            real_estate: estateId,
            time: time,
            }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            // user: currentUser.id,
            // date : date,
            // estate: estateId,
            // time: time,
            // headers: {
            //     Authorization: `Bearer ${token}`,
            // },

        });
        console.log(response.data)
      } catch (error) {
        console.error('Ошибка при получении списка недвижимости:', error);
      }
    console.log(`Booking for ${date} at ${time}`);
      window.location.reload();
  };

  const cancelBooking = async (bookingId) => {
  const token = localStorage.getItem('jwt');
      try {
        // Предполагается, что у вас есть эндпоинт /api/my-estates для получения недвижимости текущего пользователя
        const response = await axios.delete(`http://localhost:8000/api/management/booking-id/${bookingId}/`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },

        });
        console.log(response.data)
      } catch (error) {
        console.error('Ошибка при получении списка недвижимости:', error);
      }
      window.location.reload();
    };

  const handleDealDone = async () => {
  const token = localStorage.getItem('jwt');
  try {
    const response = await axios.post(`http://localhost:8000/api/management/deal-done/`, {
      estateId: estate.id, // ID недвижимости
      userId: currentUser.id, // ID пользователя, который завершает сделку
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Обработка успешного ответа
    console.log(response.data);
  } catch (error) {
    console.error('Ошибка при выполнении сделки:', error);
  }
};

  return (
    <div>
      <Header />
        <div className="estate-wrapper">
  <div className="estate-image">
    <img src={`${baseUrl}${estate.image}`} alt={estate.address} />
  </div>
  <div className="estate-details">
    <h2>{estate.address}</h2>
    <p>Price: {estate.price}</p>
    <button className="deal-done-button" onClick={handleDealDone}>Deal Done</button>
    </div>
        </div>
      {/*<div className="estate-info">*/}
      {/*  <img src={`${baseUrl}${estate.image}`} alt={estate.address} />*/}
      {/*  <h2>{estate.address}</h2>*/}
      {/*  <p>{estate.price}</p>*/}
      {/*  <button className="deal-done">Deal done</button>*/}
      {/*</div>*/}
      <table className="booking-table">
        <thead>
          <tr>
            <th>Date</th>
            {dates.map(date => (
              <th key={date}>{date}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map(time => (
            <tr key={time}>
              <td>{time}</td>
              {dates.map(date => (
                <td key={date}>
                {bookings[date] && bookings[date][time] && bookings[date][time].id ? (
                bookings[date][time].user === currentUser.id ? (
                    <>
          <span>Reserved by You</span>
          <button className="cancel-button" onClick={() => cancelBooking(bookings[date][time].id)}>Cancel</button>
        </>
      ) : (
        `Reserved`
      )
    ) : (
      <button onClick={() => bookSlot(date, time)}>Book</button>
    )}
  </td>
))}
{/*              {dates.map(date => (*/}
{/*                <td key={date}>*/}
{/*                  {bookings[date] && bookings[date][time] ? (*/}
{/*                    `Reserved by ${bookings[date][time].user}`*/}
{/*                  ) : (*/}
{/*                    <button onClick={() => bookSlot(date, time)}>Book</button>*/}
{/*                  )}*/}
{/*                </td>*/}
{/*              ))}*/}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PropertyBooking;