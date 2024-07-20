import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import WebFont from "webfontloader";
import LoginSignupPage from "./pages/LoginSignupPage";

function App() {
    useEffect(() => {
        WebFont.load({
            google: {
                families: ["Droid Sans", "Roboto", "Poppins"],
            },
        });
    }, []);

    const router = createBrowserRouter([
        {
            path: "/",
            element: <LoginSignupPage />,
        },
    ]);
    return <RouterProvider router={router} />;
}

export default App;
