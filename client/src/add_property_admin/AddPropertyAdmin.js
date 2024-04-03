import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './AddPropertyAdmin.css';
import Header from "../header/Header";
import {useNavigate} from "react-router-dom";

const AddPropertyAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: '',
    price: '',
    description: '',
    visibility: [],
    image: null,
    percentage: ''
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

  const handleChange = (e) => {
    // const { name } = e.target;
    // const value = e.target.options
    //     ? Array.from(e.target.options).filter(o => o.selected).map(o => o.value)
    //     : e.target.value;
    //
    // setFormData(prevState => ({
    //     ...prevState,
    //     [name]: value
    // }));
    const { name, value } = e.target;
    if (e.target.multiple) {
      // Для <select multiple> нужно обрабатывать массив значений
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setFormData(prevState => ({
        ...prevState,
        [name]: selectedOptions,
      }));
    } else {
      // Для обычных полей обновляем значение напрямую
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
};

  const handleImageChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('address', formData.address);
    formDataToSend.append('price', parseFloat(formData.price));
    formDataToSend.append('description', formData.description);
    formDataToSend.append('commission_rate', parseFloat(formData.percentage));

    // Для поля visibility отправляем каждый ID как отдельное поле
    formData.visibility.forEach(userId => {
      formDataToSend.append('visibility', userId);
    });

  // Добавляем файл изображения, если он есть
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/management/real-estate/', formDataToSend, {
         headers: {
                'Content-Type': 'multipart/form-data'
            }
      });
      console.log(response.data);
      navigate('/admin-panel-property')
      // Обработка успешного входа
      // Сохраните токен в local storage или состояние для дальнейшего использования
    } catch (error) {
      console.error(error);
      // Обработка ошибок входа
      navigate('/admin-panel-property')
    }
  };

  return (
      <div>
        <Header/>
    <div className="add-property-admin">
      <form onSubmit={handleSubmit} className="add-property-form">
        <label>
          Add address of property:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </label>
        <label>
          Add price:
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </label>
        <label>
          Add Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>
        <label>
          Add Visibility:
          <select
        name="visibility"
        value={formData.visibility}
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
          Add image:
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
          />
        </label>
        <label>
          Percentage:
          <input
            type="text"
            name="percentage"
            value={formData.percentage}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
        </div>
  );
};

export default AddPropertyAdmin;
