import axios from "axios";
import Button from "devextreme-react/button";
import { AsyncRule } from "devextreme-react/data-grid";
import { TextBox } from "devextreme-react/text-box";
import { RequiredRule, StringLengthRule, Validator } from "devextreme-react/validator";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useUserContext } from "../../hooks/useUserContext";
import { RegisterDto } from "../../types";
import { atomShowLogin } from "../layoutAtoms";


const RegisterTab = () => {
    const [loading, setLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const { refreshUser } = useUserContext();
    const setShowLogin = useSetAtom(atomShowLogin);
    const showToast = useToast();

    const handleRegister = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        const dto: RegisterDto = {
            FirstName: firstName,
            LastName: lastName,
            Login: login,
            Password: password
        }

        try {
            const res = await axios.post('/api/auth/register', dto);
            showToast('Pomyślnie zarejestrowano!');
            refreshUser();
            setShowLogin(false);
        } catch (e) {
            showToast('Wystąpił błąd podczas rejestracji! Spróbuj ponownie poźniej', 'error')
        }

        setLoading(false);
    }

    return (<>
        <div className="text-center text-gray-500 text-lg">Zarejestruj się do naszego serwisu</div>
        <form onSubmit={handleRegister}>
            <div className="px-20 mt-5 space-y-3">
                <div className="flex space-x-4">
                    <TextBox
                        width='100%'
                        label="Imię"
                        labelMode="floating"
                        value={firstName}
                        onValueChanged={(e) => setFirstName(e.value)}
                        onFocusOut={() => setFirstName(firstName.trim())}
                    >
                        <Validator>
                            <RequiredRule message='Uzupełnij pole imię' />
                            <StringLengthRule max={32} message='Pole imię nie może przekraczać 32 znaków' />
                        </Validator>
                    </TextBox>

                    <TextBox
                        width='100%'
                        label="Nazwisko"
                        labelMode="floating"
                        value={lastName}
                        onValueChanged={(e) => setLastName(e.value)}
                        onFocusOut={() => setLastName(lastName.trim())}
                    >
                        <Validator>
                            <RequiredRule message='Uzupełnij pole nazwisko' />
                            <StringLengthRule max={32} message='Pole nazwisko nie może przekraczać 32 znaków' />
                        </Validator>
                    </TextBox>
                </div>

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
                            <AsyncRule
                                ignoreEmptyValue={true}
                                message='Podany login jest zajęty'
                                reevaluate={false}
                                validationCallback={async (e: any) => {
                                    const promise = new Promise(async (resolve, reject) => {
                                        try {
                                            const res = await axios.get(`/api/auth/availableLogin?login=${e.value}`);
                                            return resolve(res.data);
                                        } catch (error) {
                                            return resolve(false);
                                        }
                                    });
                                    return promise;
                                }} />
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
                    <Button text="Zarejestruj" icon="chevronright" rtlEnabled={true} type="default" width={150} useSubmitBehavior={true} />
                </div>
            </div>
        </form>
    </>)
}

export default RegisterTab;