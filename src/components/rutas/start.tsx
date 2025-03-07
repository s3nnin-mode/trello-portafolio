import { useEffect, useState } from "react";
import '../../styles/components/routes/start.scss';

import { Link, useNavigate } from "react-router-dom";
import { useBoardsStore } from "../../store/boardsStore";
import { useAuthContext } from "../../customHooks/useAuthContext";
import { getBoardsFirebase } from "../../services/firebase/firebaseFunctions";
import { initialTags } from "../../utils/tagsColors";
import { Box, Button, Fade } from "@mui/material";

export const Start = () => {
  const { userAuth } = useAuthContext();
  const { loadBoards } = useBoardsStore();
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const [animation, setAnimation] = useState(false);

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

  const handleClick = () => {
    setAnimation(true);
    setTimeout(() => {
      setShowOptions(true)
    }, 600);
  }

  return(
    <div className='container_home'>
        <Box className='box'>
          <div className="card_left">
            {
              !showOptions ? 
              <Fade in={!animation} timeout={500}>
              <div className='card_presentation'>
                <h2 className='inter_title'>
                  Organiza tus tareas y proyectos de manera fácil y rápida.
                </h2>
                <p className='inter'>
                  Simplifica tu día a día con una interfaz intuitiva y funcionalidades clave.
                </p>
                <Button
                  color="inherit"
                  variant="contained"
                  size="medium"
                  fullWidth={false}
                  onClick={handleClick}
                >
                  Comenzar
                </Button>
              </div>
            </Fade> 
            :
            <Fade in={animation} timeout={500}>
              <div className='intro'>
                <p>
                  Bienvenido a nuestra plataforma. Puedes elegir entre registrarte para una experiencia personalizada o probar la funcionalidad de la aplicación mediante una cuenta demo. 
                  Si decides usar la demo, los datos se guardarán temporalmente en tu navegador mediante localStorage, 
                  lo que te permitirá explorar las características de la aplicación sin necesidad de crear una cuenta. 
                  ¡Elige tu opción y empieza a explorar!
                </p>
                <button onClick={demo}>
                  Solo estoy viendo, gracias
                </button>
                <button>
                  <Link to='/auth'>
                    Uso profesional
                  </Link>
                </button>
              </div>
            </Fade>
            }
            
          </div>
        </Box>
    </div>
  )
}