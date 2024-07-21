import React from 'react';
import { useAuth } from '../hooks/useAuth';

function HomePage() {
    const { signOut } = useAuth();
    return (
        <div>
            <h1>Home Page</h1>
            <button onClick={signOut}>Sign Out</button>
        </div>
    );
}

export default HomePage;
