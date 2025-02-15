import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useBoardsStoree } from "../store/boardsStore";

interface AuthContextProps {
    userAuth: boolean;
    setUserAuth: React.Dispatch<React.SetStateAction<boolean>>
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface ChildrenProps {
    children: ReactNode
}

export const AuthProvider = ({children}: ChildrenProps) => {
    const [userAuth, setUserAuth] = useState(false);
    const { setBoards } = useBoardsStoree();

    useEffect(() => {
        if (!userAuth) {
            let Ls = localStorage.getItem('boards-storage');
            if (Ls) {
                setBoards(JSON.parse(Ls));
                console.log('LS', JSON.parse(Ls))
            } else {
                setBoards([]);
                localStorage.setItem('boards-storage', JSON.stringify([]));
            }
        } else {
            console.log('userAuth sejecutado')
            /*AQUI IRÁ LA LOGICA PARA CARGAR EL ESTADO DESDE FIREBASE */
            //const estadoDeFirebase = firebase.get()
            //state.SetBoards(estadoDeFirebase)
        }
    }, [userAuth]);

    return (
        <AuthContext.Provider value={{userAuth, setUserAuth}}>
            {children}
        </AuthContext.Provider>
    )
}