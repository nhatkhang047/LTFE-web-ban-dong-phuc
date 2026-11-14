import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts
import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";

// Pages
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import Products from "@/pages/Products/Products";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="/dang-nhap" replace />
            },
            {
                path: "dang-nhap",
                element: <LoginPage />
            },
            {
                path: "dang-ky",
                element: <RegisterPage />
            },
            {
                path: "quen-mat-khau",
                element: <ForgotPasswordPage />
            }
        ]
    },
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: "san-pham",
                element: <Products />
            }
        ]
    }
]);
export default router;