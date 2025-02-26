import { useEffect } from "react";
import '../../styles/components/routes/start.scss';

import { Link, useNavigate } from "react-router-dom";
import { useBoardsStore } from "../../store/boardsStore";
import { useAuthContext } from "../../customHooks/useAuthContext";
import { TagsProps } from "../../types/boardProps";
import { getBoardsFirebase, getListsFirebase } from "../../services/firebase/firebaseFunctions";
import { useListsStore } from "../../store/listsStore";

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
    const { loadBoards } = useBoardsStore();
    const { loadLists } = useListsStore();
    const navigate = useNavigate();

    useEffect(() => {
      console.log('test para ver cuantas veces se renderiza');

      const LS = localStorage.getItem('boards-storage');

      const fetchData = async () => {
        if (userAuth) {
          const boards = await getBoardsFirebase();
          console.log('usuario auth en start');
          loadBoards(boards);
          navigate('/kanbaX');
        } else if (LS) {  
            loadBoards(JSON.parse(LS));
            navigate('/kanbaX'); 
            console.log('hay LS', LS);
        }
      }
      fetchData();
      console.log('no hay LS ni UserAuth');
      //si ninguna de las dos es true se queda en Home(modal para eleigir si usar la app como reclutador o para usarla realmente)
    }, [userAuth]);

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
            <Link to='/login'>
              Uso profesional
            </Link>
          </button>
        </div>
      </div>
    </div>
  )
}