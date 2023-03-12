import { atom } from "jotai";
import { UserContext } from "./types";

export const atomUser = atom<UserContext | null>(null);