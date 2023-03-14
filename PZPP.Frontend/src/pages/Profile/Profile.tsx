import { Provider } from "jotai";
import { axiosAuth } from "../../axiosClient";
import Container from "../../components/Container";
import { useUserContext } from "../../hooks/useUserContext";


const Profile = () => {
    const {user} = useUserContext();

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
            <div className="text-lg mb-2">Twój profil</div>
            <div>Login: {user?.Login}</div>
            <div>Imię i nazwisko: {user?.Name}</div>

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
        </Container>
    );
}

export default Profile;