import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import ProductDetailPage from '@/pages/ProductDetailPage/ProductDetailPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import FavoritesPage from '@/pages/FavoritesPage';
import CartPage from '@/pages/CartPage';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import ProductsPage from '@/pages/ProductsPage';
import RegisterPage from '@/pages/RegisterPage';
import ProfilePage from '@/pages/ProfilePage/ProfilePage';
import OrdersPage from '@/pages/OrdersPage';


import '@/styles/main.scss';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tai-khoan" element={<ProfilePage />} />
            <Route path="/yeu-thich" element={<FavoritesPage />} />
            <Route path="/gio-hang" element={<CartPage />} />
            <Route path="/don-hang" element={<OrdersPage />} />
            <Route element={<AuthLayout />}>
                <Route path="/dang-nhap" element={<LoginPage />} />
                <Route path="/dang-ky" element={<RegisterPage />} />
                <Route path="/quen-mat-khau" element={<ForgotPasswordPage />} />
            </Route>
            <Route path="/san-pham" element={<ProductsPage />} />
            <Route path="/san-pham/:id" element={<ProductDetailPage />} />
            <Route path="*" element={<Navigate to="/dang-nhap" replace />} />
        </Routes>
    );
}
