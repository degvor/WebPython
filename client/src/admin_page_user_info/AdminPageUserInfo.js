// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './UserProfile.css'; // Стили для страницы
//
// function UserProfile() {
//   const { userId } = useParams(); // Получаем ID пользователя из параметра URL
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();
//   const [properties, setProperties] = useState([]);
//   const baseUrl = 'http://localhost:8000';
//
//   // useEffect(() => {
//   //   const fetchUser = async () => {
//   //     try {
//   //       const response = await axios.get(`http://localhost:8000/api/user/get_users/${userId}/`);
//   //       setUser(response.data);
//   //     } catch (error) {
//   //       console.error('Ошибка при получении информации о пользователе:', error);
//   //     }
//   //   };
//   //
//   //   fetchUser();
//   // }, [userId]);
//
//   useEffect(() => {
//     const fetchUserAndProperties = async () => {
//       try {
//         // Получаем информацию о пользователе
//         const userResponse = await axios.get(`http://localhost:8000/api/user/get_users/${userId}/`);
//         const user = userResponse.data;
//         setUser(user);
//
//         // Получаем список всей недвижимости
//         const propertiesResponse = await axios.get('http://localhost:8000/api/management/get-all-estates');
//         // Фильтруем недвижимость на основе ID, доступных пользователю
//         const filteredProperties = propertiesResponse.data.filter(property =>
//           property.visibility.includes(parseInt(userId))
//         );
//         setProperties(filteredProperties);
//       } catch (error) {
//         console.error('Ошибка при получении данных:', error);
//       }
//     };
//
//     fetchUserAndProperties();
//   }, [userId]);
//
//   const handleEditSalary = () => {
//     // Логика для редактирования зарплаты
//     navigate(`/edit-salary/${userId}`);
//   };
//
//   const handleEditBonus = () => {
//     // Логика для редактирования бонуса
//     navigate(`/edit-bonus/${userId}`);
//   };
//
//   // Проверяем, загружены ли данные пользователя
//   if (!user) return <div>Loading...</div>;
//
//   return (
//     <div className="user-profile">
//       <div className="user-info">
//         <img src={user.avatar} alt={user.name} className="avatar" />
//         <h1>{user.name}</h1>
//         <div className="statistics">
//           <div>Number of appointments in month: {user.appointmentsMonth}</div>
//           <div>Number of appointments in total: {user.appointmentsTotal}</div>
//           <div>Number of deals in month: {user.dealsMonth}</div>
//           <div>Number of deals in total: {user.dealsTotal}</div>
//           <div>Salary: ${user.salary} <button onClick={handleEditSalary}>Edit salary</button></div>
//           <div>Bonus: ${user.bonus} <button onClick={handleEditBonus}>Edit bonus</button></div>
//         </div>
//       </div>
//       <div className="properties">
//         {/* Предполагаем, что у user есть свойство properties, которое является массивом */}
//         {user.properties.map((property) => (
//           <div key={property.id} className="property">
//             <img src={`${baseUrl}${property.image}`} alt="Property" />
//             <h3>{property.address}</h3>
//             <p>{property.description}</p>
//             <div>Price: ${property.price}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
//
// export default UserProfile;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserProfile.css';
import Header from "../header/Header";

function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(
      {
        name: "",
        surname: "",
        avatar: null,
        deals_total: 0,
        appointment_total: 0,
        salary: 0,
        bonus: 0,
        appointment_month: 0,
        deals_month: 0
      }
  );
  const [properties, setProperties] = useState([]);
  const [editSalary, setEditSalary] = useState(false);
  const [editBonus, setEditBonus] = useState(false);
  const [newSalary, setNewSalary] = useState(0);
  const [newBonus, setNewBonus] = useState(0);
  const navigate = useNavigate();
  const baseUrl = 'http://localhost:8000';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Получаем информацию о пользователе
        const userResponse = await axios.get(`http://localhost:8000/api/user/get_users/${userId}/`);
        setUser(userResponse.data[0]);
      } catch (error) {
        console.error('Ошибка при получении информации о пользователе:', error);
      }
    };

    const fetchProperties = async () => {
      try {
        // Получаем недвижимость доступную пользователю
        const propertiesResponse = await axios.get(`http://localhost:8000/api/management/get-user-estates/${userId}/`);
        setProperties(propertiesResponse.data);
      } catch (error) {
        console.error('Ошибка при получении списка недвижимости:', error);
      }
    };

    fetchUser();
    fetchProperties();
  }, [userId]);

  const handleSalaryChange = async () => {
    try {
      await axios.put(`http://localhost:8000/api/user/change-profile-info/${userId}/`, {
        salary: newSalary
      });
      setUser(prevUser => ({ ...prevUser, salary: newSalary }));
      setEditSalary(false);
    } catch (error) {
      console.error('Ошибка при обновлении зарплаты:', error);
    }
  };

  const handleBonusChange = async () => {
    try {
      await axios.put(`http://localhost:8000/api/user/change-profile-info/${userId}/`, {
        bonus: newBonus
      });
      setUser(prevUser => ({ ...prevUser, bonus: newBonus }));
      setEditBonus(false);
    } catch (error) {
      console.error('Ошибка при обновлении бонуса:', error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
      <div>
          <Header />
    <div className="user-profile">
      <div className="user-info">
        <img src={`${baseUrl}${user.avatar}`} alt={user.name} className="avatar" />
        <h1>{user.name} {user.surname}</h1>
        <div className="statistics">
          <div>Number of appointments in month: {user.appointment_month}</div>
            <div>Number of appointments in total: {user.appointment_total}</div>
            <div>Number of deals in month: {user.deals_month}</div>
            <div>Number of deals in total: {user.deals_total}</div>
            <div>
          Salary: ${user.salary}
          {editSalary ? (
            <>
              <input
                type="number"
                value={newSalary}
                onChange={(e) => setNewSalary(e.target.value)}
              />
              <button onClick={handleSalaryChange}>Save</button>
              <button onClick={() => setEditSalary(false)}>Cancel</button>
            </>
          ) : (
            <button onClick={() => { setEditSalary(true); setNewSalary(user.salary); }}>
              Edit salary
            </button>
          )}
        </div>
        <div>
          Bonus: ${user.bonus}
          {editBonus ? (
            <>
              <input
                type="number"
                value={newBonus}
                onChange={(e) => setNewBonus(e.target.value)}
              />
              <button onClick={handleBonusChange}>Save</button>
              <button onClick={() => setEditBonus(false)}>Cancel</button>
            </>
          ) : (
            <button onClick={() => { setEditBonus(true); setNewBonus(user.bonus); }}>
              Edit bonus
            </button>
          )}
        </div>
        </div>
      </div>
      <div className="properties">
        {properties.map(property => (
          <div key={property.id} className="property">
            <img src={`${baseUrl}${property.image}`} alt={property.address} />
            <h3>{property.address}</h3>
            <p>{property.description}</p>
            <div>Price: ${property.price}</div>
          </div>
        ))}
      </div>
    </div>
          </div>
  );
}

export default UserProfile;
