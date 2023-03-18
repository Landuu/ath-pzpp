import { Provider } from "jotai";
import { axiosAuth } from "../../axiosClient";
import Container from "../../components/Container";
import { useUserContext } from "../../hooks/useUserContext";
import { IoPerson } from "react-icons/io5";
import { NavLink } from "react-router-dom";


const Profile = () => {
    const { user } = useUserContext();

    const handleClick = async () => {
        const res = await axiosAuth.get('/api/authorized');
        console.log('ath', res);
    }

    const handlePost = async () => {
        const formData = new FormData();
        formData.append('test', 'abc');
        const res = await axiosAuth.post('/api/post', formData);
        console.log('post', res);
    }


    return (
        <Container className="my-8">
            <div className="text-3xl mb-5">Twój profil</div>

            <div className="flex">
                <div className="w-96 flex flex-col space-y-5">
                    <NavLink to='/profile'>
                        Twój profil
                    </NavLink>
                    <NavLink to='/orders'>
                        Twoje zamówienia
                    </NavLink>
                    
                </div>

                <div className="w-full">
                    <div className='flex items-center space-x-5'>
                        <div className="bg-gray-300 rounded-full w-20 h-20 flex justify-center items-center">
                            <IoPerson className="text-5xl text-gray-500" />
                        </div>
                        <div>

                            <div>Login: {user?.Login}</div>
                            <div>Imię i nazwisko: {user?.Name}</div>
                        </div>
                    </div>

                    <div className="mt-5">
                        <div className="text-2xl">Twój adres</div>
                        <div>
                            <div>
                                ul. Słoneczna 150/1
                            </div>
                            <div>
                                35-312 Żywiec
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="mt-5 space-y-5">
                            <div>
                                <button className="bg-gray-300 hover:bg-gray-400 px-3 py-2" onClick={handleClick}>Authorized request</button>
                            </div>
                            <div>
                                <button className="bg-gray-300 hover:bg-gray-400 px-3 py-2" onClick={handlePost}>Authroized post</button>
                            </div>
                        </div>
                    </div>
                </div>


            </div>

        </Container>
    );
}

export default Profile;