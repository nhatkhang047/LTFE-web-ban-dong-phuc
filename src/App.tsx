
import { Navigate, Route, Routes } from 'react-router-dom';

import AuthLayout from '@/layouts/AuthLayout';
import MainLayout from '@/layouts/MainLayout';

import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import Products from '@/pages/Products/Products';

import '@/styles/main.scss';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route element={<AuthLayout />}>
                <Route path="/dang-nhap" element={<LoginPage />} />
                <Route path="/dang-ky" element={<RegisterPage />} />
                <Route path="/quen-mat-khau" element={<ForgotPasswordPage />} />
            </Route>
            <Route element={<MainLayout />}>
                <Route path="/san-pham" element={<Products />} />
            </Route>
            <Route path="*" element={<Navigate to="/dang-nhap" replace />} />
        </Routes>
    );
}
