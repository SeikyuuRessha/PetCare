import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import UserMedicalHistoryPage from "./pages/UserPage/UserMedicalHistoryPage";

// Services Pages
import CareServicesPage from "./pages/UserPage/CareServicesPage";
import ServiceOptionsPage from "./pages/servicesPage/ServiceOptionsPage";

// Doctor Pages
import DoctorPage from "./pages/DoctorPage/DoctorPage";
import DoctorMedicalRecordPage from "./pages/DoctorPage/DoctorMedicalRecordPage";
import DoctorAppointmentPage from "./pages/DoctorPage/DoctorAppointmentPage";
import DoctorMedicinesPage from "./pages/DoctorPage/DoctorMedicinesPage";
import DoctorHistoryPage from "./pages/DoctorPage/DoctorHistoryPage";

// Admin & Employee Pages
import AdminPage from "./pages/AdminPage/AdminPage";
import AccountManagementPage from "./pages/AdminPage/AccountManagementPage";
import EmployeePage from "./pages/EmployeePage/EmployeePage";
import StatisticsPage from "./pages/AdminPage/StatisticsPage";
import EmployeeAppointmentPage from "./pages/EmployeePage/EmployeeAppointmentPage";
import PetRecordsPage from "./pages/EmployeePage/PetRecordsPage";
import ServiceManagementPage from "./pages/EmployeePage/ServiceManagementPage";
import EmployeeServicesPage from "./pages/EmployeePage/EmployeeServicesPage";

function App() {
    return (
        <Router>
            {" "}
            <Routes>
                {/* Home is default route */}
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPage />} />
                <Route path="/account" element={<UserInformationPage />} />
                <Route path="/pet-info" element={<PetInformationPage />} />
                <Route path="/appointment" element={<AppointmentPage />} />
                <Route path="/payment" element={<PayPage />} />{" "}
                <Route
                    path="/services/booked"
                    element={<ViewBookedServicesPage />}
                />
                <Route
                    path="/user/medical-history"
                    element={<UserMedicalHistoryPage />}
                />
                <Route path="/services" element={<CareServicesPage />} />
                <Route
                    path="/services/:serviceId/options"
                    element={<ServiceOptionsPage />}
                />{" "}
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
                <Route
                    path="/doctor/medicines"
                    element={<DoctorMedicinesPage />}
                />
                <Route path="/doctor/history" element={<DoctorHistoryPage />} />{" "}
                {/* Admin & Employee Routes */}
                <Route path="/admin" element={<AdminPage />} />
                <Route
                    path="/admin/accounts"
                    element={<AccountManagementPage />}
                />
                <Route path="/admin/statistics" element={<StatisticsPage />} />
                <Route path="/employee" element={<EmployeePage />} />
                <Route path="/employee/pets" element={<PetRecordsPage />} />
                <Route
                    path="/employee/appointments"
                    element={<EmployeeAppointmentPage />}
                />{" "}
                <Route
                    path="/employee/services"
                    element={<EmployeeServicesPage />}
                />
            </Routes>
            {/* Toast Container */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </Router>
    );
}

export default App;
