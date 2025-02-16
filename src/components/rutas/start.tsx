import { useEffect, useState } from "react";
import '../../styles/components/routes/start.scss';

import { Link, useNavigate } from "react-router-dom";
import { useBoardsStoree } from "../../store/boardsStore";
import { useAuthContext } from "../../customHooks/useAuthContext";

export const Start = () => {
    const { userAuth } = useAuthContext();
    const { setBoards } = useBoardsStoree();
    const navigate = useNavigate();

    //aqui poner mas condicioes: userAuth || LS

    useEffect(() => {
        const LS = localStorage.getItem('boards-storage');
        console.log('Lo que hay en LS', LS)

        //METER ESTO EN UN TRYCATCH Y AGREGARLE UN LOADER
        if (userAuth) {
            //se redirige a /app y se cargarn los datos de firebase
            //setBoards([...firebase])
        } else if (LS) {
            setBoards(JSON.parse(LS));
            navigate('/kanbaX');
            console.log('hay LS', LS);
            //si se detecta localstorage con localstorage.getItem se redirecciona a la app con los datos del localstorage
        }
        //si ninguna de las dos es true se queda en Home(modal para eleigir si usar la app como reclutador o para usarla realmente)
    }, []);

    const demo = () => {
        localStorage.setItem('boards-storage', JSON.stringify([]));
        navigate('/kanbaX');
    }

    return(
        <div className='container_home'>
            <div className='modal_home'>
                <p>Usaras la app formalmente o eres reclutador</p>
                <div>
                    <button onClick={demo}>
                        Solo estoy viendo, gracias
                    </button>
                    <button>
                        <Link to='/form'>
                            Uso profesional
                        </Link>
                    </button>
                </div>
            </div>
        </div>
    )
}