import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';

import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import ProductsPage from '@/pages/ProductsPage';
import RegisterPage from '@/pages/RegisterPage';


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
                <Route path="/san-pham" element={<ProductsPage />} />
            <Route path="*" element={<Navigate to="/dang-nhap" replace />} />
        </Routes>
    );
}
