import '../../styles/components/routes/formRegister.scss';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Stack, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { userRegister } from '../../services/firebase/firebaseFunctions';
import { Link, useNavigate } from 'react-router-dom';
import React from 'react';

interface Props {
  fade: boolean
}

export const FormRegister = () => {
  const navigate = useNavigate();

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    mode: "onChange" // o "onChange" para validación en cada pulsación
  });

  const onSubmit = (data: any) => {
    console.log('btn submit clicked', data)
    userRegister({
      email: data.email,
      password: data.password
    });
    console.log('se envío los datos para crear user');
    navigate('/');
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    // <form className='form_register' onSubmit={handleSubmit(onSubmit)}>
    //   <h1>Registro</h1>
    //   <TextField
    //     id='email'
    //     label="Correo"
    //     type="email"
    //     variant="outlined"
    //     defaultValue=''
    //     {...register('email', { 
    //       required: { value: true, message: 'El correo es obligatorio'}, 
    //       pattern: { 
    //         value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
    //         message: 'Correo inválido'
    //       } 
    //     })}
    //     error={!!errors.email} // Muestra el error si existe
    //     helperText={errors.email ? String(errors.email.message) : '' } // Muestra el mensaje de error
    //   />
      
    //   <TextField
    //     id='password'
    //     label='Contraseña'
    //     type='password'
    //     variant='outlined'
    //     {...register('password', { required: { value: true, message: 'La contraseña es obligatoria'} })}
    //     error={!!errors.password}
    //     helperText={errors.password ? String(errors.password?.message) : ''}
    //   />

    //   <button type='submit'>Registrarme</button>
    //   <div className=''>
    //     <p>¿Ya tienes una cuenta? <Link to='/login'>Inicia sesión</Link></p>
    //   </div>
    // </form>

    <Paper elevation={3} sx={{ padding: 4, margin: "auto" }}>
      <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
        Registro
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <TextField
            id="email"
            label="Correo"
            type="email"
            variant="outlined"
            {...register("email", { 
              required: "El correo es obligatorio",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
                message: "Correo inválido"
              } 
            })}
            error={!!errors.email}
            helperText={errors.email ? String(errors.email.message) : ''}
            fullWidth
          />

          <TextField
            id="password"
            label="Contraseña"
            type="password"
            variant="outlined"
            {...register("password", { 
              required: "La contraseña es obligatoria"
            })}
            error={!!errors.password}
            helperText={errors.password ? String(errors.password?.message) : ''}
            fullWidth
          />

          <Button type="submit" variant="contained" size="large">
            Registrarme
          </Button>

          <Typography variant="body2" textAlign="center">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/auth/login" style={{ textDecoration: "none", color: "#1976d2" }}>
              Inicia sesión
            </Link>
          </Typography>
        </Stack>
      </form>
    </Paper>
  )
}