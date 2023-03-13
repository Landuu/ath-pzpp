import Button from "devextreme-react/button";
import DropDownButton, { DropDownOptions } from "devextreme-react/drop-down-button";
import Popup from "devextreme-react/popup";
import { ItemClickEvent } from "devextreme/ui/drop_down_button";
import { useAtom } from "jotai";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { useUserContext } from "../hooks/useUserContext";
import LoginModal from "./components/LoginModal";
import { atomRenderLogin, atomShowLogin } from "./layoutAtoms";

type ProfileDropdownOption = {
    id: number
    text: string
    icon: string
}

const profileDropdownOptions: ProfileDropdownOption[] = [
    {
        id: 0,
        text: 'Twój profil',
        icon: 'user'
    },
    {
        id: 1,
        text: 'Twoje zamówienia',
        icon: 'alignleft'
    },
    {
        id: 2,
        text: 'Wyloguj',
        icon: 'undo'
    }
];


const Layout = () => {
    const { user, logoutUser } = useUserContext();
    const showToast = useToast();
    const [showLogin, setShowLogin] = useAtom(atomShowLogin);
    const [renderLogin, setRenderLogin] = useAtom(atomRenderLogin);
    const navigate = useNavigate();

    const handleDropdownClick = (e: ItemClickEvent) => {
        const item: ProfileDropdownOption = e.itemData;
        if (item.id == 0) {
            showToast('Twój profil');
            navigate('/profile');
        } else if (item.id == 1) {
            showToast('Twoje zamówienia');
        } else if (item.id == 2) {
            logoutUser();
        }
    }

    return (<>
        <nav className="w-full px-20 py-3 shadow-lg flex justify-between">
            <div className="flex items-center space-x-3">
                <span className="font-mono text-xl mr-5">VOLCIK</span>
                <Link to='/'>
                    <Button text='Strona główna' />
                </Link>
            </div>
            <div>
                {user
                    ? <>
                        <DropDownButton
                            text={user.Name}
                            icon="user"
                            width={200}
                            items={profileDropdownOptions}
                            onItemClick={handleDropdownClick}
                        />
                    </>

                    : <Button type="default" icon='unlock' text="Logowanie" onClick={() => { setRenderLogin(true); setShowLogin(true); }} />
                }
            </div>
        </nav>

        {renderLogin && <Popup
            maxWidth={600}
            height='auto'
            dragEnabled={false}
            hideOnOutsideClick={true}
            visible={showLogin}
            contentComponent={LoginModal}
            onHiding={() => setShowLogin(false)}
            onHidden={() => setRenderLogin(false)}
        />}


        <Outlet />
    </>);
}


export default Layout;