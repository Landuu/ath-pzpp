import { useAtom } from "jotai/react"
import { atomUser } from "../atoms"
import { axiosAuth } from "../axiosClient";

export const useUserContext = () => {
    const [user, setUser] = useAtom(atomUser);
    
    const refreshUser = async () => {
        try {
            const res = await axiosAuth.get<string>('/api/auth/user');
            setUser(res.data);
            return true;
        } catch(error) {
            console.log('fetchUserError', error);
            return false;
        }
    }

    return { user, setUser, refreshUser }
}