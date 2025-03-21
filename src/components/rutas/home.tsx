import { useState } from "react";
import '../../styles/components/routes/home.scss';

import { useNavigate } from "react-router-dom";
import { Box, Button, Fade } from "@mui/material";

export const Home = () => {
  const navigate = useNavigate();
  const [animation, setAnimation] = useState(false);

  const handleClick = () => {
    setAnimation(true);
    navigate('/auth/register');

    setTimeout(() => {
    //   navigate('/auth');
    }, 600);
  }

  return(
    <div className='container_home'>
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