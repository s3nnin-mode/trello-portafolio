import '../../styles/components/routes/formRegister.scss';
import { Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { userRegister } from '../../services/firebase/firebaseFunctions';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../customHooks/useAuthContext';
import { useState } from 'react';
import { Loader } from '../reusables/loader';


export const FormRegister = () => {
  const { setUserAuth, fetchData } = useAuthContext();
  const [loader, setLoader] = useState(false);

  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm({
    mode: "onChange" // o "onChange" para validación en cada pulsación
  });

  const password = watch('password');

  const onSubmit = async (data: any) => {
    setLoader(true);

    const res = await userRegister({
      email: data.email,
      password: data.password
    });

    setLoader(false);

    if (res) {
      fetchData();
      console.log('estado de registro: ', res)
      setUserAuth(true);
      // fetchAndActivate()
      // navigate('/kanbaX');
    }
  };

  // useEffect(() => {
  //   if (userAuth) {
  //     navigate('/kanbaX');
  //   }
  // }, [userAuth]);

  return (
    <Paper elevation={3} sx={{ padding: 4, margin: "auto" }}>
      <Loader open={loader} />
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

          <TextField
            id="confirmPassword"
            label="Confirmar contraseña"
            type="password"
            variant="outlined"
            {...register("confirmPassword", { 
              required: "Debes confirmar tu contraseña",
              validate: (value) => value === password || 'las contraseñas no coinciden'
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword ? String(errors.confirmPassword?.message) : ''}
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