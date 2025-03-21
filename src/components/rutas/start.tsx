import { useEffect } from "react";
import '../../../src/styles/components/routes/start.scss';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useBoardsStore } from "../../store/boardsStore";
import { useAuthContext } from "../../customHooks/useAuthContext";
import { getBoardsFirebase } from "../../services/firebase/firebaseFunctions";
import { initialTags } from "../../utils/tagsColors";
import { Button, Fade } from "@mui/material";

export const Start = () => {
  const { userAuth } = useAuthContext();
  const { loadBoards } = useBoardsStore();
  const navigate = useNavigate();
  const location = useLocation();

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
          console.log('hay LS en start')
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

  const isStart = location.pathname.includes('/auth');

  return (
    <div className='container_route_auth'>
      <Fade in={isStart} timeout={600} >
        <div className='intro'>
          <h4 className='inter_title'>
            Elige entre registrarte para una experiencia personalizada o probar la funcionalidad de la aplicación mediante una cuenta demo.                  
          </h4>
          <p className='montserrat'>
            Si decides usar la demo, los datos se guardarán temporalmente en tu navegador mediante localStorage, 
            lo que te permitirá explorar las características de la aplicación sin necesidad de crear una cuenta. 
            ¡Elige tu opción y empieza a explorar!
          </p>
          <Button sx={{backgroundColor: 'orange'}} onClick={demo} variant="contained">
            Usar modo Demo
          </Button>
        </div>
      </Fade>
      <div className='container_forms'> 
        <Outlet />
      </div>
    </div>
  )
}