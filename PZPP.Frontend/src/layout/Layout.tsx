import axios from "axios";
import Button from "devextreme-react/button";
import Popup from "devextreme-react/popup";
import Tabs from "devextreme-react/tabs";
import TextBox from "devextreme-react/text-box";
import ValidationSummary from "devextreme-react/validation-summary";
import { Validator, RequiredRule, StringLengthRule } from "devextreme-react/validator";
import { useAtom, useSetAtom } from "jotai";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { useUserContext } from "../hooks/useUserContext";
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
                    ? <Button text="Wyloguj" onClick={() => logoutUser()} type='default' />
                    : <Button type="default" icon='unlock' text="Logowanie" onClick={() => { setRenderLogin(true); setShowLogin(true); }} />
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
            icon: 'add',
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
    const [loading, setLoading] = useState(false);
    const { refreshUser } = useUserContext();
    const setShowLogin = useSetAtom(atomShowLogin);
    const showToast = useToast();
    
    const handleLogin = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                Login: login,
                Password: password
            }
            const res = await axios.post('/api/auth', payload);
            refreshUser();
            showToast('Pomyślnie zalogowano!', 'success');
            setShowLogin(false);
        } catch (e) {
            showToast("Nieprawidłowy login lub hasło!", 'error');
        }
        
        setLoading(false);
    }

    return (<>
        <div className="text-center text-gray-500 text-lg">Zaloguj się do naszego serwisu</div>


        <form onSubmit={handleLogin}>
            <div className="mt-8 px-20 space-y-5">
                <TextBox
                    label="Login"
                    labelMode="floating"
                    value={login}
                    onValueChanged={(e) => setLogin(e.value)}
                    onFocusOut={() => setLogin(login.trim())}
                >
                    <Validator>
                        <RequiredRule message='Uzupełnij pole login' />
                        <StringLengthRule min={3} max={24} message='Login musi składać się z 3-24 znaków' />
                    </Validator>
                </TextBox>
                <TextBox
                    label="Hasło"
                    labelMode="floating"
                    mode="password"
                    value={password}
                    onValueChanged={(e) => setPassword(e.value)}
                    onFocusOut={() => setPassword(password.trim())}
                >
                    <Validator>
                        <RequiredRule message='Uzupełnij pole hasło' />
                        <StringLengthRule min={5} max={32} message='Hasło musi składać się z 5-32 znaków' />
                    </Validator>
                </TextBox>
                <div className="flex justify-center">
                    <Button text="Zaloguj" type="default" width={150} useSubmitBehavior={true} disabled={loading} />
                </div>
            </div>
        </form>
    </>)
}

const RegisterTab = () => {
    return (
        <div className="text-center text-gray-500 text-lg">Zarejestruj się do naszego serwisu</div>
    )
}

export default Layout;