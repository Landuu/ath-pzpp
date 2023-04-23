import axios from "axios";
import { Button } from "devextreme-react/button";
import { Validator } from "devextreme-react/validator";
import { TextBox} from "devextreme-react/text-box";
import { RequiredRule, StringLengthRule } from "devextreme-react/validator";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useUserContext } from "../../hooks/useUserContext";
import { atomShowLogin } from "../layoutAtoms";


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
            <div className="px-20 mt-5 space-y-3">
                <div className="flex">
                    <TextBox
                        width='100%'
                        label="Login"
                        labelMode="floating"
                        value={login}
                        onValueChanged={(e) => setLogin(e.value)}
                        onFocusOut={() => setLogin(login.trim())}
                    >
                        <Validator>
                            <RequiredRule message='Uzupełnij pole login' />
                            <StringLengthRule min={3} max={32} message='Login musi składać się z 3-32 znaków' />
                        </Validator>
                    </TextBox>
                </div>

                <div className="flex">
                    <TextBox
                        width='100%'
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
                </div>

                <div className="flex justify-center pt-5">
                    <Button text="Zaloguj" icon='chevronright' rtlEnabled={true} type="default" width={150} useSubmitBehavior={true} disabled={loading} />
                </div>
            </div>
        </form>
    </>)
}

export default LoginTab;