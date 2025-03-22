import '../../styles/components/routes/formLogin.scss';
import { Button, Paper, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { userLogin } from '../../services/firebase/firebaseFunctions';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthContext } from '../../customHooks/useAuthContext';

export const FormLogin = () => {
  const { userAuth } = useAuthContext();
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: 'onChange' });

  const onSubmit = handleSubmit((data) => {
    console.log('data login', data);
    const loginState = userLogin({
      email: data.email,
      password: data.password
    });

    console.log('estado de login', loginState)
  });

  useEffect(() => {
    if (userAuth) {
      navigate('/kanbaX');
    }
  })

  return (
    <Paper elevation={3} sx={{padding: 3, margin: 'auto'}}>
      <form className='form_login' onSubmit={onSubmit}>
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
          type='password'
          variant='outlined'
          {...register('password', { required: { value: true, message: 'La contraseña es obligatoria'} })}
          error={!!errors.password}
          helperText={errors.password ? String(errors.password?.message) : ''}
        />

        <Button variant='contained' type='submit'>
          Iniciar sesión
        </Button>

        <Typography variant="body2" align="center">
          ¿No tienes una cuenta?{" "}
          <Link to="/auth/register">
            Regístrate
          </Link>
        </Typography>
      </form>
    </Paper>
  )
}