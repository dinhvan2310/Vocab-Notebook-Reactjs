import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import WebFont from 'webfontloader';
import { AuthLayout } from './features/authentication/AuthLayout';
import ProtectedRoute from './features/authentication/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import HomeLayout from './layouts/homeLayout/HomeLayout';
import SignUpLayout from './layouts/signUpLayout/SignUpLayout';
import FoldersLayout from './layouts/foldersLayout/FoldersLayout';
import ExamsLayout from './layouts/examsLayout/ExamsLayout';

function App() {
    useEffect(() => {
        //  Set the theme
        const theme = localStorage.getItem('theme');
        if (theme) {
            document.body.dataset.theme = theme;
        } else {
            localStorage.setItem('theme', 'light');
            document.body.dataset.theme = 'light';
        }
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
                                    element: <HomeLayout />
                                },
                                {
                                    path: 'user/:username/folders',
                                    element: <FoldersLayout />
                                },
                                {
                                    path: 'exams',
                                    element: <ExamsLayout />
                                }
                            ]
                        }
                    ]
                },
                {
                    path: '/login',
                    element: <SignUpLayout />
                }
            ]
        }
    ]);
    return <RouterProvider router={router} />;
}

export default App;
