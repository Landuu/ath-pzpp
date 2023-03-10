import axios from "axios";
import Button from "devextreme-react/button";
import Popup from "devextreme-react/popup";
import Tabs from "devextreme-react/tabs";
import TextBox from "devextreme-react/text-box";
import { Provider, useAtom, useSetAtom } from "jotai";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { useUserContext } from "../hooks/useUserContext";
import { atomRenderLogin, atomShowLogin } from "./layoutAtoms";

const LayoutWithProvider = () => {
    return (
        <Provider>
            <Layout />
        </Provider>
    )
}

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
                    ? <Button text="Wyloguj" onClick={() => logoutUser()} type='default' />
                    : <Button type="default" text="Logowanie" onClick={() => { setRenderLogin(true); setShowLogin(true); }} />
                }
            </div>
        </nav>

        {renderLogin && <Popup
            width={660}
            height={540}
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


const LoginModal = () => {
    const [tab, setTab] = useState(0);

    const tabs = [
        {
            id: 0,
            text: 'Logowanie',
            icon: 'user',
        },
        {
            id: 1,
            text: 'Rejestracja',
            icon: 'comment',
        }
    ];

    return (
        <div>
            <Tabs
                dataSource={tabs}
                selectedIndex={tab}
                keyExpr="id"
                onSelectedIndexChange={(e) => setTab(e)}
            />

            <div className="pt-5">
                {tab == 0 && <>
                    <LoginTab />
                </>}

                {tab == 1 && <>
                    <RegisterTab />
                </>}
            </div>
        </div>
    )
}

const LoginTab = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [valid, setValid] = useState([true, true]);
    const showToast = useToast();
    const { refreshUser } = useUserContext();
    const setShowLogin = useSetAtom(atomShowLogin);

    const getToken = async () => {
        try {
            const res = await axios.get('/api/auth');
            console.log('login', res);
            return true;
        } catch (e) {
            console.log('loginError', e);
            return false;
        }
    }

    const handleLogin = async () => {
        let isValid = [true, true];
        if (login == '') isValid[0] = false;
        if (password == '') isValid[1] = false;
        setValid(isValid);

        if (isValid.includes(false)) {
            return;
        }

        const success = await getToken();
        if (success) {
            refreshUser();
            showToast('Pomyślnie zalogowano!', 'success');
            setShowLogin(false);
        } else {
            showToast('Błąd logowania', 'error');
        }
    }

    return (<>
        <div className="text-center text-gray-500 text-lg">Zaloguj się do naszego serwisu</div>

        <div className="mt-8 px-20 space-y-5">
            <TextBox
                label="Login"
                labelMode="floating"
                value={login}
                onValueChanged={(e) => setLogin(e.value)}
                isValid={valid[0]}
                onFocusOut={() => setLogin(login.trim())}
            />
            <TextBox
                label="Hasło"
                labelMode="floating"
                mode="password"
                value={password}
                onValueChanged={(e) => setPassword(e.value)}
                onFocusOut={() => setPassword(password.trim())} isValid={valid[1]}
            />
            <div className="flex justify-center">
                <Button text="Zaloguj" type="default" width={150} onClick={handleLogin} />
            </div>
        </div>
    </>)
}

const RegisterTab = () => {
    return (
        <div className="text-center text-gray-500 text-lg">Zarejestruj się do naszego serwisu</div>
    )
}

export default LayoutWithProvider;