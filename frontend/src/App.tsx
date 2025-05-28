import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import HomePage from './UserPage/HomePage';
import LoginPage from './UserPage/LoginPage';
import ServicesPage from './UserPage/CareServicesPage';
import PetInfoPage from './UserPage/PetInformationPage';
import UserInformationPage from './UserPage/UserInformationPage';
import AppointmentPage from './UserPage/AppointmentPage';
import PayPage from './UserPage/PayPage';
import CareServices_GroomingPage from './UserPage/CareServices_GroomingPage';
import CareServices_PetTrainingPage  from './UserPage/CareServices_PetTrainingPage';
import CareServices_PetBathingPage  from './UserPage/CareServices_PetBathingPage';
import CareServices_PetBoardingPage  from './UserPage/CareServices_PetBoardingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/pet-info" element={<PetInfoPage />} />
        <Route path="/account" element={<UserInformationPage />} />
        <Route path="/appointment" element={<AppointmentPage />} />
        <Route path="/payment" element={<PayPage />} />
        <Route path="/services/grooming" element={<CareServices_GroomingPage />} />
        <Route path="/services/training" element={<CareServices_PetTrainingPage />} />
        <Route path="/services/bathing" element={<CareServices_PetBathingPage />} />
        <Route path="/services/boarding" element={<CareServices_PetBoardingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
