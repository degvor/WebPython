import './App.css';
import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './login_page/LoginPage'; // Импорт вашего компонента LoginPage
import AddPropertyAdmin from './add_property_admin/AddPropertyAdmin'; // Импорт вашего компонента AddPropertyAdmin
import MyEstateUser from './my_estate_user/MyEstateUser'; // Импорт вашего компонента MyEstateUser
import AddUserPage from "./add_user_page/AddUserPage";
import BookingProperty from "./booking_property/BookingProperty";
import UserMenu from "./user_menu/UserMenu";
import ChangePassword from "./change_password/ChangePassword";
import ChangeProfileInfo from "./change_information_user/ChangeInformationUser";
import AdminPageUsers from "./admin_page_users/AdminPageUsers";
import AdminPanel from "./admin_page/AdminPage";
import AdminPageUserInfo from "./admin_page_user_info/AdminPageUserInfo";
import AdminPanelProperty from "./admin_page_property/AdminPanelProperty";
import EditProperty from "./admin_edit_property/EditProperty";
import AccessDenied from "./access_denied/AccessDenied";
import ProtectedRoute from "./protected-route/ProtecredRoute";
import axios from "axios";

function App() {
  const isAdminString = localStorage.getItem('is_admin');
  const isAdmin = isAdminString === 'true';
  // const [isAdmin, setIsAdmin] = useState(false);
  // useEffect(() => {
  // const fetchEstates = async () => {
  //       const token = localStorage.getItem('jwt');
  //     try {
  //       // Предполагается, что у вас есть эндпоинт /api/my-estates для получения недвижимости текущего пользователя
  //       const response = await axios.get('http://localhost:8000/api/user/user',{
  //           headers: {
  //               Authorization: `Bearer ${token}`,
  //           },
  //
  //       });
  //       setIsAdmin(response.data.is_superuser);
  //       console.log(response.data.is_superuser);
  //     } catch (error) {
  //       console.error('Ошибка при получении списка недвижимости:', error);
  //       setIsAdmin(false);
  //     }
  //   };
  // fetchEstates();
  // }, []);
  return (
    <Router>
      <Routes>
        <Route exact path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" />} />

        <Route exact path="/add-property-admin" element={<ProtectedRoute isAdmin={isAdmin} adminOnly={true}><AddPropertyAdmin /></ProtectedRoute>} />

        <Route exact path="/my-estate-user" element={<ProtectedRoute isAdmin={isAdmin} adminOnly={false}><MyEstateUser /></ProtectedRoute>} />

        <Route exact path="/register-user" element={<ProtectedRoute isAdmin={isAdmin} adminOnly={true}><AddUserPage /></ProtectedRoute>} />

        <Route exact path="/user-menu" element={<UserMenu />} />
        <Route exact path="/change-password" element={<ChangePassword />} />
        <Route exect path="/change-profile-info" element={<ChangeProfileInfo />} />

        <Route exact path="/admin-users" element={<ProtectedRoute isAdmin={isAdmin} adminOnly={true}><AdminPageUsers /></ProtectedRoute>} />
        <Route exact path="/admin-panel" element={<ProtectedRoute isAdmin={isAdmin} adminOnly={true}><AdminPanel /></ProtectedRoute>} />
        <Route path="/my-estate-user/:estateId/book" element={<ProtectedRoute isAdmin={isAdmin} adminOnly={false}><BookingProperty /></ProtectedRoute>} />

        <Route path="/admin-users/:userId" element={<ProtectedRoute isAdmin={isAdmin} adminOnly={true}><AdminPageUserInfo /></ProtectedRoute>} />
        <Route path="/admin-panel-property" element={<ProtectedRoute isAdmin={isAdmin} adminOnly={true}><AdminPanelProperty /></ProtectedRoute>} />
        <Route path={"/edit-property/:propertyId"} element={<ProtectedRoute isAdmin={isAdmin} adminOnly={true}><EditProperty /></ProtectedRoute>} />

        <Route path="/access-denied" element={<AccessDenied />} />
      </Routes>
    </Router>
  );
}

export default App;
