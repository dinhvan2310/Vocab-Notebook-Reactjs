import { useNavigate, useOutlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedRoute = () => {
    const outlet = useOutlet();
    const navigate = useNavigate();
    const { user } = useAuth();

    if (!user) {
        navigate('/login');
    }

    return outlet;
};

export default ProtectedRoute;
