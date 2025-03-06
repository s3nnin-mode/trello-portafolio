import { useEffect } from "react";
import '../../styles/components/routes/start.scss';

import { Link, useNavigate } from "react-router-dom";
import { useBoardsStore } from "../../store/boardsStore";
import { useAuthContext } from "../../customHooks/useAuthContext";
import { getBoardsFirebase } from "../../services/firebase/firebaseFunctions";
import { initialTags } from "../../utils/tagsColors";

export const Start = () => {
  const { userAuth } = useAuthContext();
  const { loadBoards } = useBoardsStore();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('test para ver cuantas veces se renderiza');
    const LS = localStorage.getItem('boards-storage');

    const fetchData = async () => {
      if (userAuth) {
        const boards = await getBoardsFirebase();
        loadBoards(boards);
        navigate('/kanbaX');
        console.log('user auth en start')
      } else if (LS) {  
          loadBoards(JSON.parse(LS));
          navigate('/kanbaX'); 
      } else {
        console.log('no hay LS ni UserAuth');
      }
    }
    fetchData();
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
            <Link to='/auth'>
              Uso profesional
            </Link>
          </button>
        </div>
      </div>
    </div>
  )
}