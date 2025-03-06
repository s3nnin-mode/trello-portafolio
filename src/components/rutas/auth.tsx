import '../../styles/components/routes/auth.scss';
import { Box, Button, Slide } from "@mui/material"
import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export const Auth = () => {
  const location = useLocation()
  
  return (
    // <Box className='section_auth'>
    //   <h2 className="yesy">Autneticaion</h2>
    //   <Box className='btns_navigation'>
    //     <Button>
    //       <Link to='login'>
    //         login
    //       </Link>
    //     </Button>
    //     <Button>
    //       <Link to='register'>
    //         register
    //       </Link>
    //     </Button>
    //   </Box>
    //   <Box className='container_forms'>
    //     <Outlet />
    //   </Box>
    // </Box>
    <Box className='section_auth'>
      <h2 className="yesy">Authentication</h2>
      <Box className='btns_navigation'>
        <Button>
          <Link to='login'>Login</Link>
        </Button>
        <Button>
          <Link to='register'>Register</Link>
        </Button>
      </Box>

      <Box className='container_forms'>
        <Slide
          direction="left"
          in={location.pathname === '/login'}
          mountOnEnter
          unmountOnExit
          timeout={500}
        >
          <div
            style={{
              transition: 'transform 0.5s ease, opacity 0.5s ease',
              transform: location.pathname === '/login' ? 'translateX(0)' : 'translateX(20%)', // Ajusta el valor a tu preferencia
              opacity: location.pathname === '/login' ? '1' : '0.5', // Desvanece el formulario
            }}
          >
            <Outlet />
          </div>
        </Slide>

        <Slide
          direction="right"
          in={location.pathname === '/register'}
          mountOnEnter
          unmountOnExit
          timeout={500}
        >
          <div
            style={{
              transition: 'transform 0.5s ease, opacity 0.5s ease',
              transform: location.pathname === '/register' ? 'translateX(0)' : 'translateX(-20%)', // Ajusta el valor a tu preferencia
              opacity: location.pathname === '/register' ? '1' : '0.5', // Desvanece el formulario
            }}
          >
            <Outlet />
          </div>
        </Slide>
      </Box>
    </Box>
  )
};
