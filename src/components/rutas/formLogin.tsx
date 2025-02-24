import '../../styles/components/routes/formLogin.scss';
import { FormControl, FormHelperText, Input, InputLabel, TextField } from '@mui/material';
import { useEffect } from 'react';
//importamos lo necesario de RHF
import { useForm } from 'react-hook-form';

export const FormLogin = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = (data: any) => console.log(data, errors);

  useEffect(() => {
    console.log('errors', errors)
  }, [errors]);

  return (
    <div className='container_form_login'>
      <form className='form_login' onSubmit={handleSubmit(onSubmit)}>
        <h1>Inicio de sesión</h1>
          <TextField
            label="Correo"
            type="email"
            variant="outlined"
            error={!!errors.email} // Muestra el error si existe
            helperText={errors.email ? String(errors.email.message) : ''} // Muestra el mensaje de error
            {...register('email', {
              required: {
                value: true,
                message: 'Campo requerido.'
              },
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: 'Correo no válido.'
              }
            })}
          />
          

        <FormControl fullWidth>
          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            error={!!errors.password}
            helperText={errors.password ? String(errors.password.message) : ''}
            {...register('password', { required: 'La contraseña es requerida' })}
          />
        </FormControl>
        
        <input type='password' placeholder='Contraseña' />
        <button type='submit'>Iniciar sesión</button>
      </form>
    </div>
  )
}