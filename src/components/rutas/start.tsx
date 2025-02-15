import { useEffect, useState } from "react";
import '../../styles/components/routes/start.scss';

import { useAuthContext } from "../boards/boards";
import { Link, useNavigate } from "react-router-dom";

export const Start = () => {
    const { userAuth } = useAuthContext();
    const [isLocalStorage, setIsLocalStorage] = useState(false); //solo es de ejemplo este estado

    const navigate = useNavigate();

    useEffect(() => {
        const testAuth = true;
        if (!testAuth) {      //aqui poner mas condicioes: userAuth || LS
            navigate('/kanbaX')
        }
    }, []);

    useEffect(() => {
        if (userAuth) {
            //se redirige a /app
        } else if (isLocalStorage) {
            //si se detecta localstorage con localstorage.getItem se redirecciona a la app con los datos del localstorage
        }
        //si ninguna de las dos es true se queda en Home(modal para eleigir si usar la app como reclutador o para usarla realmente)
    }, []);

    return(
        <div className='container_home'>
            <div className='modal_home'>
                <p>Usaras la app formalmente o eres reclutador</p>
                <div>
                    <button>
                        <Link to='/kanbaX'>
                            Solo estoy viendo, gracias
                        </Link>
                    </button>
                    <button>
                        Uso profesional
                    </button>
                </div>
            </div>
        </div>
    )
}