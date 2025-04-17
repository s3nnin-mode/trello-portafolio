import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { getBoardsFirebase } from "../services/firebase/firebaseFunctions";
import { useBoardsStore } from "../store/boardsStore";

interface AuthContextProps {
    userAuth: boolean;
    setUserAuth: React.Dispatch<React.SetStateAction<boolean>>
    fetchBoards: () => void
    getUserAuthState: () => Promise<User | null>
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface ChildrenProps {
    children: ReactNode
}

export const AuthProvider = ({children}: ChildrenProps) => {
    const [userAuth, setUserAuth] = useState(false);
    const { loadBoards } = useBoardsStore();

    const getUserAuthState = (): Promise<User | null> => {
        return new Promise((resolve) => {
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
            resolve(user);
            });
        });
    }

    const fetchBoards = async () => {
        const boards = await getBoardsFirebase();
        if (boards) {
            loadBoards(boards);
            // navigate('/kanbaX');
        }
    }

    const startApp = async () => {
        const userAuth = await getUserAuthState();
        const LS = localStorage.getItem('boards-storage');
        if (userAuth) {
            setUserAuth(true);
            // fetchBoards();
            // navigate('/kanbaX');
        } else if (LS) {
            setUserAuth(false);
            console.log('usuario no auth en contexto', userAuth);
        }
    }
    
    useEffect(() => {
        startApp();
    }, [userAuth]);

    return (
        <AuthContext.Provider value={{userAuth, setUserAuth, fetchBoards, getUserAuthState}}>
            {children}
        </AuthContext.Provider>
    )
}