import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

// User Pages
import HomePage from "./pages/UserPage/HomePage";
import LoginPage from "./pages/UserPage/LoginPage";
import RegisterPage from "./pages/UserPage/RegisterPage";
import ForgotPage from "./pages/UserPage/ForgotPage";
import UserInformationPage from "./pages/UserPage/UserInformationPage";
import PetInformationPage from "./pages/UserPage/PetInformationPage";
import AppointmentPage from "./pages/UserPage/AppointmentPage";
import PayPage from "./pages/UserPage/PayPage";
import ViewBookedServicesPage from "./pages/UserPage/ViewBookedServicesPage";

// Services Pages
import CareServicesPage from "./pages/UserPage/CareServicesPage";
import CareServices_GroomingPage from "./pages/servicesPage/CareServices_GroomingPage";
import CareServices_PetBoardingPage from "./pages/servicesPage/CareServices_PetBoardingPage";
import CareServices_PetTrainingPage from "./pages/servicesPage/CareServices_PetTrainingPage";
import CareServices_PetBathingPage from "./pages/servicesPage/CareServices_PetBathingPage";

// Doctor Pages
import DoctorPage from "./pages/DoctorPage/DoctorPage";
import DoctorMedicalRecordPage from "./pages/DoctorPage/DoctorMedicalRecordPage";
import DoctorAppointmentPage from "./pages/DoctorPage/DoctorAppointmentPage";

// Admin & Employee Pages
import AdminPage from "./pages/AdminPage/AdminPage";
import EmployeePage from "./pages/EmployeePage/EmployeePage";

function App() {
    return (
        <Router>
            <Routes>
                {/* User Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPage />} />
                <Route path="/account" element={<UserInformationPage />} />
                <Route path="/pet-info" element={<PetInformationPage />} />
                <Route path="/appointment" element={<AppointmentPage />} />
                <Route path="/payment" element={<PayPage />} />
                <Route
                    path="/services/booked"
                    element={<ViewBookedServicesPage />}
                />
                <Route path="/services" element={<CareServicesPage />} />

                {/* Services Routes */}
                <Route
                    path="/services/grooming"
                    element={<CareServices_GroomingPage />}
                />
                <Route
                    path="/services/boarding"
                    element={<CareServices_PetBoardingPage />}
                />
                <Route
                    path="/services/training"
                    element={<CareServices_PetTrainingPage />}
                />
                <Route
                    path="/services/bathing"
                    element={<CareServices_PetBathingPage />}
                />

                {/* Doctor Routes */}
                <Route path="/doctor" element={<DoctorPage />} />
                <Route
                    path="/doctor/medical-records"
                    element={<DoctorMedicalRecordPage />}
                />
                <Route
                    path="/doctor/appointments"
                    element={<DoctorAppointmentPage />}
                />

                {/* Admin & Employee Routes */}
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/employee" element={<EmployeePage />} />
            </Routes>
        </Router>
    );
}

export default App;
