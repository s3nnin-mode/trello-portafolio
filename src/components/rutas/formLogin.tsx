import '../../styles/components/routes/formLogin.scss';
import { Button, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { userLogin } from '../../services/firebase/firebaseFunctions';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthContext } from '../../customHooks/useAuthContext';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { Loader } from '../reusables/loader';

export const FormLogin = () => {
  const { setUserAuth } = useAuthContext();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, steGeneralError] = useState<string | null>(null);
  const [loader, setLoader] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError
  } = useForm({ mode: 'onChange' });

  const onSubmit = handleSubmit( async (data) => {
    setLoader(true);
    try {
      const loginState =await userLogin({
        email: data.email,
        password: data.password
      });

      if (loginState) {
        setUserAuth(true);
        navigate('/Kanbax');
      }
    } catch(error: any) {
      if (error.field) {
        setError(error.field, {
          message: error.messsage
        });
      } else {
        steGeneralError(error.message);
      }
    }
    setLoader(false);
  });

  return (
    <Paper 
      elevation={3} 
      sx={{
        padding: 4, 
        borderRadius: '4px',
        margin: 'auto',
        backgroundColor: '#161b22'
      }}
    >
      <Loader open={loader} />

      <form onSubmit={onSubmit}>
        <Stack spacing={2}>
          <Typography sx={{color: '#ccc'}} variant="h5" component="h1" align="center">
            Iniciar sesión
          </Typography>

          <TextField 
            id='login_input'
            label="Correo"
            type="email"
            variant="outlined"
            defaultValue=''
            {...register('email', { required: 'Coloca tu correo, porfavor.'})}
            error={!!errors.email} // Muestra el error si existe
            helperText={errors.email ? String(errors.email.message) : '' } // Muestra el mensaje de error
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#ccc',
                '& fieldset': {
                  border: '2px solid #0d1117', //borde cuando NO está enfocado
                },
                '&:hover fieldset': {
                  border: '1px solid #1976d2'
                },
                'input:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 1000px transparent inset', // 🔹 fuerza fondo transparente
                  WebkitTextFillColor: '#ccc', //color del texto
                  transition: 'background-color 5000s ease-in-out 0s', // evita parpadeo
                }
              },
              '& .MuiInputLabel-root': {
                  color: '#ccc',
                  '& .MuiInputLabel-shrink': {
                    color: '#121212'
                  }
                },
            }}
          />

          <TextField
            id='password'
            label='Contraseña'
            type={showPassword ? 'text' : 'password'}
            variant='outlined'
            {...register('password', { required: { value: true, message: 'La contraseña es obligatoria'} })}
            error={!!errors.password}
            helperText={errors.password ? String(errors.password?.message) : ''}
            slotProps={{
              input: {
                endAdornment: (
                <InputAdornment position="end">
                  <IconButton sx={{color: '#ccc'}} onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  </IconButton>
                </InputAdornment>
                )
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#ccc',
                '& fieldset': {
                  bgcolor: 'transparent',
                  border: '2px solid #0d1117', 
                },
                '&:hover fieldset': {
                  border: '1px solid #1976d2'
                },
                '&.Mui-focused fieldset': {
                },
                
              },
              '& .MuiInputLabel-root': {
                color: '#ccc',
                '& .MuiInputLabel-shrink': {
                  color: '#121212'
                }
              },
            }}
          />

          {
            generalError && (
              <Typography variant='body2' color='error' align="center">
                {generalError}
              </Typography>
            )
          }

          <Button 
            sx={{
              backgroundColor: '#1976d2',
              color: '#fff'
            }}
            variant='contained' 
            type='submit'
          >
            Iniciar sesión
          </Button>

          <Typography sx={{color: '#ccc'}} variant="body2" align="center">
            ¿No tienes una cuenta?{" "}
            <Link 
              to='/auth/register'
              style={{ 
                textDecoration: "none", 
                color: 'orange',
                fontWeight: 'bold'
              }}
            >
              Regístrate
            </Link>
          </Typography>
          
        </Stack>
      </form>
    </Paper>
  )
};