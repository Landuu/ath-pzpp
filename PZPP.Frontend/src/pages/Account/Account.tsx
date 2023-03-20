import { Button, TextBox } from "devextreme-react";
import { useState } from "react";
import { IoHome, IoPerson, IoPersonOutline } from "react-icons/io5";
import AccountNav from "../../components/AccountNav";
import Container from "../../components/Container";
import { useUserContext } from "../../hooks/useUserContext";


const Account = () => {
    const { user } = useUserContext();
    const [isEditUser, setIsEditUser] = useState(false);
    const [isEditAddress, setIsEditAddress] = useState(false);

    return (
        <Container className="my-8">
            <div className="text-3xl flex items-center text-gray-700 p-3">
                <IoPersonOutline className="mr-2" />
                Twoje konto
            </div>

            <div className="flex space-x-8">
                <AccountNav />

                <div className="w-full flex flex-col space-y-10 border p-8">
                    <div>
                        <div className="text-2xl mb-2 flex space-x-5 items-center">
                            <div>Dane osobowe</div>
                            <div className="space-x-3">
                                {!isEditUser && <Button text='Edytuj' onClick={() => setIsEditUser(true)} />}
                                {isEditUser && <>
                                    <Button text='Anuluj' onClick={() => setIsEditUser(false)} />
                                    <Button text="Zapisz" type="success" />
                                </>}
                            </div>
                        </div>

                        <div className='flex space-x-5'>
                            <div className="bg-gray-300 rounded-full w-20 h-20 flex justify-center items-center">
                                <IoPerson className="text-5xl text-gray-500" />
                            </div>
                            <div>
                                <UserDetail title="Login:" value={user?.Login} />
                                <UserDetail title="Imię i nazwisko:" value={user?.Name} />
                                <UserDetail title="Adres e-mail:" value='-' />
                                <UserDetail title="Telefon:" value='-' />
                            </div>
                        </div>

                        {isEditUser &&
                            <div className="pl-24 w-96 space-y-3">
                                <TextBox label="Imię" defaultValue={user?.FirstName} />
                                <TextBox label="Nazwisko" defaultValue={user?.LastName} />
                                <TextBox label="Adres e-mail" />
                                <TextBox label="Telefon" />
                            </div>
                        }
                    </div>

                    <div>
                        <div className="text-2xl mb-2 flex space-x-5">
                            <div>Adres dostawy</div>
                            <div className="space-x-3 flex items-center">
                                {!isEditAddress && <Button text='Edytuj' onClick={() => setIsEditAddress(true)} />}
                                {isEditAddress && <>
                                    <Button text='Anuluj' onClick={() => setIsEditAddress(false)} />
                                    <Button text="Zapisz" type="success" />
                                </>}
                            </div>
                        </div>

                        <div className='flex space-x-5'>
                            <div className="bg-gray-300 rounded-full w-20 h-20 flex justify-center items-center">
                                <IoHome className="text-5xl text-gray-500" />
                            </div>
                            <div>
                                <UserDetail title="Ulica i numer:" value="ul. Mostowa 34" />
                                <UserDetail title="Kod pocztowy:" value="34-321" />
                                <UserDetail title="Miejscowość:" value="Żywiec" />
                            </div>
                        </div>

                        {isEditAddress &&
                            <div className="pl-24 w-96 space-y-3">
                                <TextBox label="Ulica i numer" />
                                <TextBox label="Kod pocztowy" />
                                <TextBox label="Miejscowość" />
                            </div>
                        }
                    </div>
                </div>

            </div>

        </Container>
    );
}

const UserDetail = ({ title, value }: { title: string, value?: string }) => {
    return (
        <div>
            <span className="text-gray-800 mr-2">{title}</span>
            <span className="font-bold">{value}</span>
        </div>
    );
}

export default Account;