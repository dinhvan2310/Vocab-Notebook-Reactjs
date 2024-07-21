import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import WebFont from 'webfontloader';
import LoginSignupPage from './pages/LoginSignupPage';
import HomePage from './pages/HomePage';
import AuthProvider from './utils/AuthProvider';

function App() {
    useEffect(() => {
        WebFont.load({
            google: {
                families: ['Droid Sans', 'Roboto', 'Poppins']
            }
        });
    }, []);

    const router = createBrowserRouter([
        {
            path: '/',
            element: <AuthProvider />,
            children: [
                {
                    path: '/',
                    element: <HomePage />
                },
                {
                    path: '/login',
                    element: <LoginSignupPage />
                }
            ]
        }
    ]);
    return <RouterProvider router={router} />;
}

export default App;
