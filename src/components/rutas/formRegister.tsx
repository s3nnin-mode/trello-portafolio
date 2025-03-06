import '../../styles/components/routes/formRegister.scss';
import { TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { userRegister } from '../../services/firebase/firebaseFunctions';
import { Link, useNavigate } from 'react-router-dom';

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

  return (
    // <div className='container_form_register'>

      <form className='form_register' onSubmit={handleSubmit(onSubmit)}>
        <h1>Registro</h1>
        <TextField
          id='email'
          label="Correo"
          type="email"
          variant="outlined"
          defaultValue=''
          {...register('email', { 
            required: { value: true, message: 'El correo es obligatorio'}, 
            pattern: { 
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
              message: 'Correo inválido'
            } 
          })}
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

        <button type='submit'>Registrarme</button>
        <div className=''>
          <p>¿Ya tienes una cuenta? <Link to='/login'>Inicia sesión</Link></p>
        </div>
      </form>
    // </div>
  )
}