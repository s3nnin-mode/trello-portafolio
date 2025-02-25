import '../../styles/components/routes/formLogin.scss';
import { TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { userLogin } from '../../services/firebase/firebaseFunctions';
import { Link } from 'react-router-dom';

export const FormLogin = () => {
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

  return (
    <div className='container_form_login'>

      <form className='form_login' onSubmit={onSubmit}>
        <h1>Iniciar sesión</h1>
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
        <button type='submit'>Iniciar sesión</button>
        <footer>
          <p>¿No tienes una cuenta? <Link to='/register'>Registrate</Link></p>
        </footer>
      </form>
    </div>
  )
}