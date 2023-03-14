import { Navigate, Outlet } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { useUserContext } from "../hooks/useUserContext";


const RouteGuard = ({ onlyAdmin }: { onlyAdmin?: boolean }) => {
    const { user } = useUserContext();
    const showToast = useToast();

    if (!user) {
        showToast('Musisz być zalogowany, aby uzyskać dostęp!', 'warning');
        return <Navigate to='/' />
    }

    if (onlyAdmin && !user.IsAdmin) {
        showToast('Brak dostępu!', 'error');
        return <Navigate to='/' />
    }

    return <Outlet />;
}

export default RouteGuard;