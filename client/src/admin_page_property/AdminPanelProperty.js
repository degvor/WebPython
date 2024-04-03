import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanelProperty.css'; // Здесь подключаем ваш CSS файл
import Modal from 'react-modal';
import {useNavigate} from "react-router-dom";
import Header from "../header/Header";

Modal.setAppElement('#root');

function AdminPanelProperty() {
  const [properties, setProperties] = useState([]);
    const token = localStorage.getItem('jwt');
    const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const baseUrl = 'http://localhost:8000';
  const navigate = useNavigate();

  useEffect(() => {
    // Получаем список недвижимости
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/management/get-all-estates/`);
        setProperties(response.data);
      } catch (error) {
        console.error('Ошибка при получении списка недвижимости:', error);
      }
    };

    fetchProperties();
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit-property/${id}`)
    console.log('Переход к редактированию недвижимости с ID:', id);
    // navigate(`/edit-property/${id}`); // Если используете react-router-dom
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/management/delete-estate/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Ошибка при обновлении бонуса:', error);
    }
    console.log('Удаление недвижимости с ID:', id);
    // Отправляем запрос на удаление и обновляем состояние
  };

  const openModal = (property) => {
    setSelectedProperty(property);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleAddProperty = () => {
    navigate('/add-property-admin')
  }

  return (
      <div>
            <Header />
    <div className="admin-panel-property">
      <h1>Admin panel property</h1>
      <button onClick={() => handleAddProperty()}>Add new property</button>
      <table>
        <thead>
          <tr>
            <th>Street</th>
            <th>Price</th>
            <th>Visibility</th>
            <th>Desc</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr key={property.id}>
              <td>{property.address}</td>
              <td>${property.price}</td>
              <td>{property.visibility.length} users</td>
              <td><button onClick={() => openModal(property)}>Get whole info</button></td>
              <td><button onClick={() => handleEdit(property.id)}>Edit</button></td>
              <td><button onClick={() => handleDelete(property.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Property Details"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Property Details</h2>
        {selectedProperty && (
          <div>
            <img src={`${baseUrl}${selectedProperty.image}`} alt={selectedProperty.address} />
            <h3>{selectedProperty.address}</h3>
            <p>Price: ${selectedProperty.price}</p>
            <p>Description: {selectedProperty.description}</p>
            <p>Visibility: {selectedProperty.visibility.length} users</p>
            <button onClick={closeModal}>Close</button>
          </div>
        )}
      </Modal>
    </div>
      </div>

  );
}

export default AdminPanelProperty;
