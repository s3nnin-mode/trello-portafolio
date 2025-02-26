import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { createContext, ReactNode, useEffect, useState } from "react";

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

    const getUserAuthState = () => {
        return new Promise((resolve) => {
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
            resolve(user);
            });
        })
    }

    const startApp = async () => {
        const userAuth = await getUserAuthState();
        const LS = localStorage.getItem('boards-storage');

        if (userAuth) {
            setUserAuth(true);

            console.log('usuario auth en contexto', userAuth)
            // navigate('/kanbaX');
            //se redirige a /app y se cargarn los datos de firebase
            //loadBoards([...firebase])
        } else {
            setUserAuth(false)
            console.log('no hay user en context')
        }
        // } else if (LS) {  //aqui podrias agregar si existe listas pero creo que con verificar boards es suficiente
        //     // loadBoards(JSON.parse(LS));
        //     // navigate('/kanbaX'); //RECUERDA DESCOMENTAR ESTO DESPUES DE TERMINAR EL FORMULARIO///////////////////
        //     console.log('hay LS', LS);
        //     setUserAuth(false);
        //     //si se detecta localstorage con localstorage.getItem se redirecciona a la app con los datos del localstorage
        // }
    }
    useEffect(() => {
        startApp();
    }, [userAuth]);

    return (
        <AuthContext.Provider value={{userAuth, setUserAuth}}>
            {children}
        </AuthContext.Provider>
    )
}