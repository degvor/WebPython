import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditProperty.css';
import Header from "../header/Header";

function EditProperty() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState({
    address: '',
    price: '',
    description: '',
    image: null,
    visibility: [],
    commission_rate: '',
  });
    const [users, setUsers] = useState([]);


  useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/user/get_users', {
                    withCredentials: true
                });
                setUsers(response.data); // Предполагается, что ответ содержит массив пользователей
            } catch (error) {
                console.error("Ошибка при получении списка пользователей: ", error);
            }
        };

        fetchUsers();
    }, []);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/management/get-estate/${propertyId}/`);
        setProperty(response.data[0]);
      } catch (error) {
        console.error('Ошибка при получении данных недвижимости', error);
      }
    };

    fetchProperty();
  }, [propertyId]);

  const handleImageChange = (e) => {
    setProperty(prevState => ({
      ...prevState,
      image: e.target.files[0]
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (e.target.multiple) {
    // Обрабатываем select multiple
    const values = Array.from(e.target.selectedOptions, option => option.value);
    setProperty(prevState => ({
      ...prevState,
      [name]: values,
    }));
    } else {
    // Обрабатываем обычный input
    setProperty(prevState => ({
      ...prevState,
      [name]: value,
    }));
  }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
  formData.append('address', property.address);
  formData.append('price', property.price);
  formData.append('description', property.description);
  // formData.append('image', property.image); // Тут должен быть объект File
  formData.append('commission_rate', property.commission_rate);
  if (property.image) {
      formData.append('image', formData.image);
    }

  // Для поля 'visibility', которое является массивом ID пользователей
  property.visibility.forEach(userId => {
      formData.append('visibility', userId);
    });
  // if (property.visibility.length > 0) {
  //   property.visibility.forEach((userId) => {
  //     formData.append('visibility', userId);
  //   });
  // } else {
  //   // Если visibility пустой, можно не добавлять это поле, или обработать как ошибку
  //   console.error('Visibility is required');
  //   return;
  // }
    try {
      // Здесь должна быть логика отправки данных на сервер
      await axios.put(`http://localhost:8000/api/management/edit-estate/${propertyId}/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      });
       // Навигация обратно к списку свойств после сохранения
      console.log(property.visibility);
    } catch (error) {
      console.error('Ошибка при сохранении данных недвижимости', error);
    }
    // navigate('/admin-panel-property');
  };

  return (
      <div>
            <Header />

    <div className="edit-property">
      <form onSubmit={handleSubmit}>
        <label>
          Edit address of property:
          <input
            type="text"
            name="address"
            value={property.address}
            onChange={handleChange}
          />
        </label>
        <label>
          Edit price:
          <input
            type="text"
            name="price"
            value={property.price}
            onChange={handleChange}
          />
        </label>
        <label>
          Edit Description:
          <textarea
            name="description"
            value={property.description}
            onChange={handleChange}
          />
        </label>
        <label>
          Edit Visibility:
          <select
        name="visibility"
        value={property.visibility}
        onChange={handleChange}
        multiple
         >
            {users.map(user => (
            <option key={user.id} value={user.id}>
                {user.name} {user.surname}
            </option>
        ))}
        </select>
        </label>
        <label>
          Edit image:
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
          />
        </label>
        <label>
          Commission rate:
          <input
            type="text"
            name="commission_rate"
            value={property.commission_rate}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
        </div>
  );
}

export default EditProperty;
