import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import WebFont from 'webfontloader';
import LoginSignupPage from './pages/LoginSignupPage';
import HomePage from './pages/HomePage';
import AuthProvider from './utils/AuthProvider';
import MainLayout from './layouts/MainLayout';
import FolderPage from './pages/FolderPage';
import { getUser } from './firebase/userAPI';

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
                    element: <MainLayout />,
                    children: [
                        {
                            path: '/',
                            element: <HomePage />
                        },
                        {
                            path: '/user/:userId/folders',
                            element: <FolderPage />,
                            loader: async ({ params }) => {
                                const user = await getUser(params.userId ?? '');
                                return { user };
                            }
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
