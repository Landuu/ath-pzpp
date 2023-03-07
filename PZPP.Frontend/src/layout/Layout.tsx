import axios from "axios";
import { Link, Outlet } from "react-router-dom";
import { useUserContext } from "../hooks/useUserContext";
import css from './Layout.module.css';


const Layout = () => {
    const {user, setUser } = useUserContext();

    const handleLogout = async () => {
        try {
            const res = axios.get('/api/auth/logout');
            setUser(null);
        } catch(error) {
            console.log('logout error', error);
        }
    }

    return (<>
        <nav className="w-full px-20 py-4 shadow-lg flex justify-between">
            <div>
                <span className="font-mono text-xl mr-10">POLKOM</span>
                <Link to='/' className={css.link}>Strona główna</Link>
            </div>
            <div>
                {user 
                    ? <button className={css.link} onClick={handleLogout}>Wyloguj</button>
                    : <Link to='/login' className={css.link}>Login</Link>
                }
            </div>
        </nav>

        <Outlet />
    </>);
}
 
export default Layout;