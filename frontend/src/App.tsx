import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import HomePage from './UserPage/HomePage';
import LoginPage from './UserPage/LoginPage';
import RegisterPage from './UserPage/RegisterPage';
import ServicesPage from './UserPage/CareServicesPage';
import PetInfoPage from './UserPage/PetInformationPage';
import UserInformationPage from './UserPage/UserInformationPage';
import AppointmentPage from './UserPage/AppointmentPage';
import PayPage from './UserPage/PayPage';
import CareServices_GroomingPage from './UserPage/CareServices_GroomingPage';
import CareServices_PetTrainingPage  from './UserPage/CareServices_PetTrainingPage';
import CareServices_PetBathingPage  from './UserPage/CareServices_PetBathingPage';
import CareServices_PetBoardingPage  from './UserPage/CareServices_PetBoardingPage';
import ForgotPage from './UserPage/ForgotPage';
import ViewBookedServicesPage from './UserPage/ViewBookedServicesPage';
import DoctorPage from './DoctorPage/DoctorPage';
import DoctorMedicalRecordPage from './DoctorPage/DoctorMedicalRecordPage';
import DoctorAppointmentPage from './DoctorPage/DoctorAppointmentPage';
import AdminPage from './AdminPage/AdminPage';
import EmployeePage from './EmployeePage/EmployeePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/pet-info" element={<PetInfoPage />} />
        <Route path="/account" element={<UserInformationPage />} />
        <Route path="/appointment" element={<AppointmentPage />} />
        <Route path="/payment" element={<PayPage />} />
        <Route path="/services/grooming" element={<CareServices_GroomingPage />} />
        <Route path="/services/training" element={<CareServices_PetTrainingPage />} />
        <Route path="/services/bathing" element={<CareServices_PetBathingPage />} />
        <Route path="/services/boarding" element={<CareServices_PetBoardingPage />} />
        <Route path="/services/booked" element={<ViewBookedServicesPage />} />
        
        {/* Doctor Routes */}
        <Route path="/doctor" element={<DoctorPage />} />
        <Route path="/doctor/medical-records" element={<DoctorMedicalRecordPage />} />
        <Route path="/doctor/appointments" element={<DoctorAppointmentPage />} />
        
        {/* Admin & Employee Routes */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/employee" element={<EmployeePage />} />
      </Routes>
    </Router>
  );
}

export default App;
