import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button  } from "devextreme-react/button";
import { TextBox } from "devextreme-react/text-box";
import { StringLengthRule } from "devextreme-react/data-grid";
import {
    EmailRule, RequiredRule, Validator
} from 'devextreme-react/validator';
import { useState } from "react";
import { IoHome, IoPerson, IoPersonOutline } from "react-icons/io5";
import { axiosAuth } from "../../axiosClient";
import AccountNav from "../../components/AccountNav";
import Container from "../../components/Container";
import { useUserContext } from "../../hooks/useUserContext";
import { UserAccountDto } from "../../types";

const Account = () => {
    const { user, refreshUser } = useUserContext();
    const [isEditUser, setIsEditUser] = useState(false);
    const [isEditUserLoading, setIsEditUserLoading] = useState(false);
    const [isEditAddress, setIsEditAddress] = useState(false);
    const [isEditAddressLoading, setIsEditAddressLoading] = useState(false);
    const queryClient = useQueryClient();
    const { data } = useQuery<UserAccountDto>({ queryKey: ['account'], queryFn: async () => (await axiosAuth.get('/api/account')).data });

    const infoMutation = useMutation({
        mutationFn: (data: FormData) => {
            setIsEditUserLoading(true);
            return axiosAuth.put('/api/account', data);
        },
        onSuccess: () => {
            refreshUser();
            setIsEditUser(false);
            queryClient.invalidateQueries(['account']);
        },
        onSettled: () => {
            setIsEditUserLoading(false);
        }
    });

    const addressMutation = useMutation({
        mutationFn: (data: FormData) => {
            setIsEditAddressLoading(true);
            return axiosAuth.put('/api/account/address', data);
        },
        onSuccess: () => {
            setIsEditAddress(false);
            queryClient.invalidateQueries(['account']);
        },
        onSettled: () => {
            setIsEditAddressLoading(false);
        }
    });


    return (
        <Container className="my-8">
            <div className="text-3xl flex items-center text-gray-700 p-3">
                <IoPersonOutline className="mr-2" />
                Twoje konto
            </div>

            <div className="flex space-x-8">
                <AccountNav />

                <div className="w-full flex flex-col space-y-10 border p-8">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        infoMutation.mutate(formData);
                    }}>
                        <div className="text-2xl mb-2 flex space-x-5 items-center">
                            <div>Dane osobowe</div>
                            <div className="space-x-3">
                                {!isEditUser && <Button text='Edytuj' onClick={() => setIsEditUser(true)} />}
                                {isEditUser && <>
                                    <Button text='Anuluj' onClick={() => setIsEditUser(false)} disabled={isEditUserLoading} />
                                    <Button useSubmitBehavior={true} text="Zapisz" type="default" disabled={isEditUserLoading} />
                                </>}
                            </div>
                        </div>

                        <div className='flex space-x-5'>
                            <div className="bg-gray-300 rounded-full w-20 h-20 flex justify-center items-center">
                                <IoPerson className="text-5xl text-gray-500" />
                            </div>
                            <div>
                                <UserDetail title="Login:" value={user?.Login} />
                                <UserDetail title="Imię i nazwisko:" value={data?.Name} />
                                <UserDetail title="Adres e-mail:" value={data?.Email ?? '-'} />
                                <UserDetail title="Telefon:" value={data?.Phone ?? '-'} />
                            </div>
                        </div>

                        {isEditUser &&
                            <div className="pl-24 w-96 space-y-4">
                                <TextBox label="Imię" name='FirstName' defaultValue={data?.FirstName} disabled={isEditUserLoading}>
                                    <Validator>
                                        <RequiredRule />
                                        <StringLengthRule max={32} />
                                    </Validator>
                                </TextBox>
                                <TextBox label="Nazwisko" name='LastName' defaultValue={data?.LastName} disabled={isEditUserLoading}>
                                    <Validator>
                                        <RequiredRule />
                                        <StringLengthRule max={32} />
                                    </Validator>
                                </TextBox>
                                <TextBox label="Adres e-mail" name='Email' defaultValue={data?.Email} disabled={isEditUserLoading}>
                                    <Validator>
                                        <RequiredRule />
                                        <EmailRule />
                                    </Validator>
                                </TextBox>
                                <TextBox label="Telefon" name='Phone' defaultValue={data?.Phone} disabled={isEditUserLoading}>
                                    <Validator>
                                        <RequiredRule />
                                        <StringLengthRule min={9} max={9} />
                                    </Validator>
                                </TextBox>
                            </div>
                        }
                    </form>

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        addressMutation.mutate(formData);
                    }}>
                        <div className="text-2xl mb-2 flex space-x-5">
                            <div>Adres dostawy</div>
                            <div className="space-x-3 flex items-center">
                                {!isEditAddress && <Button text='Edytuj' onClick={() => setIsEditAddress(true)} />}
                                {isEditAddress && <>
                                    <Button text='Anuluj' onClick={() => setIsEditAddress(false)} disabled={isEditAddressLoading} />
                                    <Button text="Zapisz" type="default" useSubmitBehavior={true} disabled={isEditAddressLoading} />
                                </>}
                            </div>
                        </div>

                        <div className='flex space-x-5'>
                            <div className="bg-gray-300 rounded-full w-20 h-20 flex justify-center items-center">
                                <IoHome className="text-5xl text-gray-500" />
                            </div>
                            <div>
                                <UserDetail title="Ulica i numer:" value={data?.Street ?? '-'} />
                                <UserDetail title="Kod pocztowy:" value={data?.PostCode ?? '-'} />
                                <UserDetail title="Miejscowość:" value={data?.City ?? '-'} />
                            </div>
                        </div>

                        {isEditAddress &&
                            <div className="pl-24 w-96 space-y-4">
                                <TextBox label="Ulica i numer" name="Street" defaultValue={data?.Street} disabled={isEditAddressLoading}>
                                    <Validator>
                                        <RequiredRule />
                                    </Validator>
                                </TextBox>
                                <TextBox label="Kod pocztowy" name="PostCode" defaultValue={data?.PostCode} disabled={isEditAddressLoading}>
                                    <Validator> 
                                        <RequiredRule />
                                    </Validator>
                                </TextBox>
                                <TextBox label="Miejscowość" name="City" defaultValue={data?.City} disabled={isEditAddressLoading}>
                                    <Validator>
                                        <RequiredRule />
                                    </Validator>
                                </TextBox>
                            </div>
                        }
                    </form>
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