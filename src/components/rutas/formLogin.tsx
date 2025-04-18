import '../../styles/components/routes/formLogin.scss';
import { Button, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { userLogin } from '../../services/firebase/firebaseFunctions';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../../customHooks/useAuthContext';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { Loader } from '../reusables/loader';

export const FormLogin = () => {
  const { userAuth, setUserAuth } = useAuthContext();
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
        // setLoader(false);
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
    <Paper elevation={3} sx={{padding: 3, margin: 'auto'}}>
      <Loader open={loader} />
      <form onSubmit={onSubmit}>
        <Stack spacing={2}>
          <Typography variant="h5" component="h1" align="center">
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
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  </IconButton>
                </InputAdornment>
                )
              }
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
              backgroundColor: '#6200ee'
            }}
            variant='contained' 
            type='submit'
          >
            Iniciar sesión
          </Button>

          <Typography variant="body2" align="center">
            ¿No tienes una cuenta?{" "}
            <Link 
              to="/auth/register"
              style={{
                color: "#6200ee",
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