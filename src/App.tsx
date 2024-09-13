import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import WebFont from 'webfontloader';
import AuthProvider from './contexts/AuthProvider';
import ProtectedRoute from './features/authentication/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import FoldersLayout from './layouts/foldersLayout/FoldersLayout';
import HomeLayout from './layouts/homeLayout/HomeLayout';
import NotFoundLayout from './layouts/notFoundLayout/NotFoundLayout';
import SignUpLayout from './layouts/signUpLayout/SignUpLayout';
import WordSetsLayout from './layouts/wordSetsLayout/WordSetsLayout';
import MessageProvider from './contexts/MessageProvider';
import WordEditLayout from './layouts/wordEditLayout/WordEditLayout';
import { getWordSet } from './firebase/wordSetAPI';
import WordLearnLayout from './layouts/wordLearnLayout/WordLearnLayout';
import { getUser } from './firebase/userAPI';
import { getFolder } from './firebase/folderAPI';

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
                    path: '/create-wordset',
                    element: (
                        <ProtectedRoute>
                            <WordEditLayout />
                        </ProtectedRoute>
                    )
                },
                {
                    path: '/edit-wordset/:wordsetid',
                    element: (
                        <ProtectedRoute>
                            <WordEditLayout />
                        </ProtectedRoute>
                    ),
                    loader: async ({ params }) => {
                        return await getWordSet(params.wordsetid ?? '');
                    }
                },
                {
                    path: '/user/:userid/folders/:folderid/wordset/:wordsetid',
                    element: <WordLearnLayout />,
                    loader: async ({ params }) => {
                        return {
                            wordSet: await getWordSet(params.wordsetid ?? ''),
                            user: await getUser(params.userid ?? ''),
                            folder: await getFolder(params.folderid ?? '')
                        };
                    }
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

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                // staleTime: 1000 * 60 * 5
            }
        }
    });

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <MessageProvider>
                    <RouterProvider router={router} />
                </MessageProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;
