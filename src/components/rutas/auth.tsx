import '../../styles/components/routes/auth.scss';
import { Box, Button, Fade, FormControlLabel, Slide, Switch } from "@mui/material";
import { useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FormLogin } from './formLogin';
import { FormRegister } from './formRegister';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export const Auth = () => {
  const location = useLocation();
  const nodeRef = useRef(null);
  const navigate = useNavigate();
  // const isRegister = location.pathname === '/auth/register';
  const [isRegister, setIsRegister] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  
  const handleNavigation = () => {
    setIsRegister(true);
    setIsLogin(false);
    setTimeout(() => {
      navigate(`/auth/register`)
    }, 300);
  }

  const handleNavigationLogin = () => {
    setIsRegister(false);
    setIsLogin(true);
    setTimeout(() => {
      navigate(`/auth/login`)
    }, 300);
  }

  return (
    <Box 
      className='section_auth'
    >
      <h2 className="yesy">Authentication</h2>
      <Box className='btns_navigation'>
        <Button onClick={handleNavigation}>
          register
        </Button>
        <Button onClick={handleNavigationLogin}>
          login
        </Button>
      </Box>

      <Box className="container_forms">
        {
          // location.pathname === '/auth/register' ?
          <FormRegister /> 
          // null
        }
        
      </Box>
    </Box>
  )
};
