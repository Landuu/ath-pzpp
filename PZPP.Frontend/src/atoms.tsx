import { atom } from "jotai";
import { CartProduct, UserContext } from "./types";
import { atomWithStorage } from 'jotai/utils'

export const atomUser = atom<UserContext | null>(null);
export const atomCart = atomWithStorage<CartProduct[]>("cart", []);