import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { FavoritesProvider } from '@/features/favorites/FavoritesContext';
import { CartProvider } from '@/features/cart/CartContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <FavoritesProvider>
                <CartProvider>
                    <App />
                </CartProvider>
            </FavoritesProvider>
        </BrowserRouter>
    </React.StrictMode>
);
