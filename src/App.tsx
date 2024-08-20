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
import WordSetsLayout from './layouts/foldersLayout/wordSetsLayout/WordSetsLayout';
import PaginationComponent from './components/commonComponent/PaginationComponent';

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
                                    path: '/user/:username/folders/:id_folder',
                                    element: <WordSetsLayout />
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
    // return <RouterProvider router={router} />;

    return (
        <PaginationComponent
            currentPage={1}
            total={10}
            pageSize={5}
            onPageChange={(page: number, pageSize: number) => console.log(page, pageSize)}
        />
    );
}

export default App;
