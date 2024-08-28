import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import WebFont from 'webfontloader';
import AuthProvider from './contexts/AuthProvider';
import ProtectedRoute from './features/authentication/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import ExamsLayout from './layouts/examsLayout/ExamsLayout';
import FoldersLayout from './layouts/foldersLayout/FoldersLayout';
import HomeLayout from './layouts/homeLayout/HomeLayout';
import NotFoundLayout from './layouts/notFoundLayout/NotFoundLayout';
import SignUpLayout from './layouts/signUpLayout/SignUpLayout';
import WordLayout from './layouts/wordLayout/WordLayout';
import WordSetsLayout from './layouts/wordSetsLayout/WordSetsLayout';

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
                families: [
                    'Droid Sans',
                    'Roboto',
                    'Poppins:400,500,600,700,800',
                    'Montserrat:400,500,600,700,800'
                ]
            }
        });
    }, []);

    const router = createBrowserRouter([
        {
            path: '/',
            element: <MainLayout />,
            errorElement: <NotFoundLayout />,
            children: [
                {
                    path: '/',
                    element: <HomeLayout />
                },
                {
                    path: 'user/:userid/folders',
                    element: <FoldersLayout />
                },
                {
                    path: '/user/:userid/folders/:folderid',
                    element: <WordSetsLayout />
                },
                {
                    path: 'exams',
                    element: <ExamsLayout />
                },
                {
                    path: '/create-wordset',
                    element: (
                        <ProtectedRoute>
                            <WordLayout />
                        </ProtectedRoute>
                    )
                },
                {
                    path: '/not-found',
                    element: <NotFoundLayout />
                }
            ]
        },
        {
            path: '/login',
            element: <SignUpLayout />
        }
    ]);

    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;
