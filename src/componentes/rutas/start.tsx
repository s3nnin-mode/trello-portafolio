import { useEffect, useState } from "react";
import { Home } from './home';

export const Start = () => {
    const [userAuth, setUserAuth] = useState(true);
    const [isLocalStorage, setIsLocalStorage] = useState(false); //solo es de ejemplo este estado

    useEffect(() => {
        if (userAuth) {
            //se redirige a /app
        } else if (isLocalStorage) {
            //si se detecta localstorage con localstorage.getItem se redirecciona a la app con los datos del localstorage
        }
        //si ninguna de las dos es true se queda en Home(modal para eleigir si usar la app como reclutador o para usarla realmente)
    }, []);

    return <Home />
}