import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import WebFont from 'webfontloader';
import { AuthLayout } from './features/authentication/AuthLayout';
import ProtectedRoute from './features/authentication/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LoginSignupPage from './pages/LoginSignupPage';

function App() {
    useEffect(() => {
        //  Set the default theme to light
        document.body.dataset.theme = 'light';
        //  Load the Google fonts
        WebFont.load({
            google: {
                families: ['Droid Sans', 'Roboto', 'Poppins']
            }
        });
    }, []);

    const router = createBrowserRouter([
        {
            path: '/',
            element: <AuthLayout />,
            children: [
                {
                    path: '/',
                    element: <MainLayout />,
                    children: [
                        {
                            path: '/',
                            element: <ProtectedRoute />,
                            children: [
                                {
                                    path: '/',
                                    element: <HomePage />
                                }
                            ]
                        }
                    ]
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
