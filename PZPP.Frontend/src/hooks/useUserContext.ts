import axios from "axios";
import { getDefaultStore } from "jotai";
import { useState } from "react";
import { atomUser } from "../atoms"
import { axiosAuth } from "../axiosClient";
import { useToast } from "./useToast";

export const useUserContext = () => {
    const [user, setUser] = useState<string | null>(null);
    const showToast = useToast();

    const store = getDefaultStore();
    store.sub(atomUser, () => {
        setUser(store.get(atomUser));
    });
    
    const refreshUser = async () => {
        try {
            const res = await axiosAuth.get<string>('/api/auth/user');
            store.set(atomUser, res.data);
            return true;
        } catch(error) {
            console.log('fetchUserError', error);
            return false;
        }
    }

    const logoutUser = async () => {
        try {
            const res = axios.get('/api/auth/logout');
            store.set(atomUser, null);
        } catch(error) {
            showToast('Wystąpił błąd podczas wylogowywania. Odśwież stronę lub spróbuj ponownie później');
        }
    }

    return { user, refreshUser, logoutUser }
}