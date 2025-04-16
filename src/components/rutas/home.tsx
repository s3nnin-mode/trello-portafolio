import { useEffect, useState } from "react";
import '../../styles/components/routes/home.scss';

import { useNavigate } from "react-router-dom";
import { Box, Button, Fade } from "@mui/material";
import { useAuthContext } from "../../customHooks/useAuthContext";

export const Home = () => {
  const { userAuth } = useAuthContext();
  const navigate = useNavigate();
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    if (userAuth) {
      navigate('/kanbaX');
    }
  });

  const handleClick = () => {
    setAnimation(true);
    navigate('/auth/register');

    setTimeout(() => {
    //   navigate('/auth');
    }, 600);
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