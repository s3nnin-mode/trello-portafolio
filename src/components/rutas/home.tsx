import { useEffect, useState } from "react";
import '../../styles/components/routes/home.scss';

import { useNavigate } from "react-router-dom";
import { Backdrop, Box, Button, CircularProgress, Fade } from "@mui/material";
import { useAuthContext } from "../../customHooks/useAuthContext";

export const Home = () => {
  const { getUserAuthState } = useAuthContext();
  const navigate = useNavigate();
  const [animation, setAnimation] = useState(false);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const fetchAuth = async () => {
      const user_auth = await getUserAuthState();

      if (user_auth) { 
        navigate('/kanbaX');
        return
      }

      const boardsLS = localStorage.getItem('boards-storage');
      const listsLS = localStorage.getItem('lists-storage');
      const cardsLS = localStorage.getItem('cards-storage');
      const tagsLS = localStorage.getItem('tags-storage');

      if (boardsLS || listsLS || cardsLS || tagsLS) {
        setLoader(false);
        // navigate('/kanbaX');
        return;
      }
      setLoader(false);
    }
    
    fetchAuth();
  }, []);

  const handleClick = () => {
    setAnimation(true);
    navigate('/auth/register');
  }

   if (loader) {
    return (
      // <div>
        <Backdrop
          sx={(theme) => ({ bgcolor: 'black', color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      // </div>
    )
   }

  return(
    <div className='container_home'>
      <div className='mensaje_proyecto_en_construccion'>
        <p>
          Este proyecto está aún en desarrollo, aun asi, ya puedes usar todas las funcionalidades existentes.
          <br />
          Se trata de un proyecto para gestionar tus tareas basado en el método kanban.
          <br />
          En general me falta por agregar un par de cosas como mostrar mensajes claros cuando un registro o inicio de sesión falla, ser responsive y una manita de gato al diseño. Pero en general estoy cerca de terminar este proyecto.
          <br />
          Cualquier mejora o sugerencia es bienvenida.
          <br />
          Mi correo: leyderlevel1@gmail.com
        </p>
      </div>
      <Box className='box'>
        <div className="card_left">
            <Fade in={!animation} timeout={500} >
            <div className='card_presentation'>
              <h2 className='inter_title'>
                Organiza tus tareas y proyectos de manera fácil y rápida.
              </h2>
              <p className='work_sans'>
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
          
        </div>
      </Box>
    </div>
  )
}