import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { getBoardsFirebase } from "../services/firebase/firebaseFunctions";
import { useBoardsStore } from "../store/boardsStore";
import { useNavigate } from "react-router-dom";

interface AuthContextProps {
    userAuth: boolean;
    setUserAuth: React.Dispatch<React.SetStateAction<boolean>>
    fetchData: () => void
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface ChildrenProps {
    children: ReactNode
}

export const AuthProvider = ({children}: ChildrenProps) => {
    const [userAuth, setUserAuth] = useState(false);
    const { loadBoards } = useBoardsStore();
    const navigate = useNavigate();

    const getUserAuthState = () => {
        return new Promise((resolve) => {
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
            resolve(user);
            });
        });
    }

    const fetchData = async () => {
        const boards = await getBoardsFirebase();
        if (boards) {
            loadBoards(boards);
            navigate('/kanbaX');
        }
    }

    const startApp = async () => {
        const userAuth = await getUserAuthState();
        const LS = localStorage.getItem('boards-storage');
        if (userAuth) {
            setUserAuth(true);
            fetchData();
            navigate('/kanbaX');
        } else if (LS) {
            setUserAuth(false);
            console.log('usuario no auth en contexto', userAuth);
        } 
    }
    
    useEffect(() => {
        startApp();
    }, [userAuth]);

    return (
        <AuthContext.Provider value={{userAuth, setUserAuth, fetchData}}>
            {children}
        </AuthContext.Provider>
    )
}