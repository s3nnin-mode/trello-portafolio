import { useEffect, useState } from "react";
import '../../styles/components/routes/start.scss';

import { Link, useNavigate } from "react-router-dom";
import { useBoardsStoree } from "../../store/boardsStore";
import { useAuthContext } from "../../customHooks/useAuthContext";
import { TagsProps } from "../../types/boardProps";

const initialTags: TagsProps[] = [
    { idTag: "1", color: "#FF5733", nameTag: "Urgente", cardsThatUseIt: [] },
    { idTag: "2", color: "#33FF57", nameTag: "Importante", cardsThatUseIt: [] },
    { idTag: "3", color: "#3357FF", nameTag: "Pendiente", cardsThatUseIt: [] },
    { idTag: "4", color: "#FF33A8", nameTag: "Revisión", cardsThatUseIt: [] },
    { idTag: "5", color: "#A833FF", nameTag: "Aprobado", cardsThatUseIt: [] },
    { idTag: "6", color: "#33FFF5", nameTag: "Rechazado", cardsThatUseIt: [] },
    { idTag: "7", color: "#F5FF33", nameTag: "En proceso", cardsThatUseIt: [] },
    { idTag: "8", color: "#FF8C33", nameTag: "Finalizado", cardsThatUseIt: [] },
    { idTag: "9", color: "#8C33FF", nameTag: "Bloqueado", cardsThatUseIt: [] },
    { idTag: "10", color: "#33FF8C", nameTag: "En espera", cardsThatUseIt: [] },
    { idTag: "11", color: "#FF3333", nameTag: "Urgencia alta", cardsThatUseIt: [] },
    { idTag: "12", color: "#33A8FF", nameTag: "Investigación", cardsThatUseIt: [] },
    { idTag: "13", color: "#A8FF33", nameTag: "Análisis", cardsThatUseIt: [] },
    { idTag: "14", color: "#FF5733", nameTag: "Propuesta", cardsThatUseIt: [] },
    { idTag: "15", color: "#5733FF", nameTag: "Concepto", cardsThatUseIt: [] },
    { idTag: "16", color: "#FF33F5", nameTag: "Feedback", cardsThatUseIt: [] },
    { idTag: "17", color: "#33FFF5", nameTag: "Pendiente de aprobación", cardsThatUseIt: [] },
    { idTag: "18", color: "#F5A833", nameTag: "Soporte", cardsThatUseIt: [] },
    { idTag: "19", color: "#A833F5", nameTag: "Bug", cardsThatUseIt: [] },
    { idTag: "20", color: "#33F5A8", nameTag: "Mejora", cardsThatUseIt: [] }
];

export const Start = () => {
    const { userAuth } = useAuthContext();
    const { loadBoards } = useBoardsStoree();
    const navigate = useNavigate();

    //aqui poner mas condicioes: userAuth || LS

    useEffect(() => {
        const LS = localStorage.getItem('boards-storage');
        console.log('Lo que hay en LS', LS)

        //METER ESTO EN UN TRYCATCH Y AGREGARLE UN LOADER
        if (userAuth) {
            //se redirige a /app y se cargarn los datos de firebase
            //setBoards([...firebase])
        } else if (LS) {  //aqui podrias agregar si existe listas pero creo que con verificar boards es suficiente
            loadBoards(JSON.parse(LS));
            navigate('/kanbaX');
            console.log('hay LS', LS);
            //si se detecta localstorage con localstorage.getItem se redirecciona a la app con los datos del localstorage
        }
        //si ninguna de las dos es true se queda en Home(modal para eleigir si usar la app como reclutador o para usarla realmente)
    }, []);

    const demo = () => {
        localStorage.setItem('boards-storage', JSON.stringify([]));
        localStorage.setItem('lists-storage', JSON.stringify([]));
        localStorage.setItem('cards-storage', JSON.stringify([]));
        localStorage.setItem('tags-storage', JSON.stringify(initialTags));
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