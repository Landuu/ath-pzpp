import Button from "devextreme-react/button";
import Popup from "devextreme-react/popup";
import { useAtom } from "jotai";
import { Link, Outlet } from "react-router-dom";
import { useUserContext } from "../hooks/useUserContext";
import LoginModal from "./components/LoginModal";
import { atomRenderLogin, atomShowLogin } from "./layoutAtoms";


const Layout = () => {
    const { user, logoutUser } = useUserContext();
    const [showLogin, setShowLogin] = useAtom(atomShowLogin);
    const [renderLogin, setRenderLogin] = useAtom(atomRenderLogin);

    return (<>
        <nav className="w-full px-20 py-3 shadow-lg flex justify-between">
            <div className="flex items-center space-x-3">
                <span className="font-mono text-xl mr-5">VOLCIK</span>
                <Link to='/'><Button text='Strona główna' /></Link>
                <Link to='/test'><Button text='Test' /></Link>
            </div>
            <div>
                {user
                    ? <Button text="Wyloguj" icon='undo' onClick={() => logoutUser()} type='default' />
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