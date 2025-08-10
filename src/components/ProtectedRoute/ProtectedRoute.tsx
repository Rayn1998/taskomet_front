import { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface IProtectedRouteProps {
    isAuth: boolean;
    redirectingPath?: string;
}

const ProtectedRoute: FC<IProtectedRouteProps> = ({ isAuth, redirectingPath = '/signup' }) => {
    if (!isAuth) {
        return <Navigate to='/signup' replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;
