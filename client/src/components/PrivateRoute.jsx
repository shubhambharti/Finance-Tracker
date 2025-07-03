import { Navigate, useLocation } from 'react-router-dom';
import { getToken } from '../utils/auth';

export default function PrivateRoute({ children }) {
    let token = getToken();
    let location = useLocation();

    return token ? (
        children
    ) : (
        <Navigate to="/login" replace state={{ from: location }} />
    );
};

