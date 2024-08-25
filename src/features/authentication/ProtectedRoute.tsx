import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user } = useAuth();

    if (user === null) {
        document.location.href = '/login';
    }

    return children;
};

export default ProtectedRoute;
