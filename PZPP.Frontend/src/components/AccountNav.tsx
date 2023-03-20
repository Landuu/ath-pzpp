import { IoDocumentOutline, IoPersonOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import css from './AccountNav.module.css';

const AccountNav = () => {
    return (
        <div className="w-96 flex flex-col space-y-3 p-5 border">
            <NavLink className={css.link} to='/account' >
                <IoPersonOutline className="mr-2" />
                Twoje konto
            </NavLink>
            <NavLink className={css.link} to='/orders'>
                <IoDocumentOutline className="mr-2" />
                Twoje zamówienia
            </NavLink>
        </div>
    );
}

export default AccountNav;