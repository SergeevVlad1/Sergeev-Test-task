import { create } from "zustand";

interface IUserStore {
    firstName: string
    lastName: string
    bio: string 
    setFirstName: (firstName: string) => void;
    setLastName: (lastName: string) => void;
    setBio: (bio: string) => void;
}

const initialState = {
    id: undefined,
    firstName: '',
    lastName: '',
    bio: ''
}

export const useUserStore = create<IUserStore>((set) => ({
    ...initialState,
    setFirstName: (firstName) => set({ firstName }),
    setLastName: (lastName) => set({ lastName }),
    setBio: (bio) => set({ bio })
}))