import axios from "axios";
import { getDefaultStore } from "jotai";
import { useEffect, useState } from "react";
import { atomUser } from "../atoms";
import { axiosAuth } from "../axiosClient";
import { UserContext } from "../types";
import { useToast } from "./useToast";

export const useUserContext = () => {
    const showToast = useToast();
    const defaultStore = getDefaultStore();
    const [user, setUser] = useState<UserContext | null>(defaultStore.get(atomUser));

    useEffect(() => {
        const unsub = defaultStore.sub(atomUser, () => {
            const usr = defaultStore.get(atomUser);
            setUser(usr);
        })

        return unsub;
    }, [])

    const refreshUser = async () => {
        try {
            const res = await axiosAuth.get<UserContext>('/api/auth/user');
            defaultStore.set(atomUser, res.data);
            return true;
        } catch (error) {
            return false;
        }
    }

    const logoutUser = async () => {
        try {
            const res = await axios.get('/api/auth/logout');
            defaultStore.set(atomUser, null);
        } catch (error) {
            showToast('Wystąpił błąd podczas wylogowywania. Odśwież stronę lub spróbuj ponownie później');
        }
    }

    return { user, refreshUser, logoutUser }
}