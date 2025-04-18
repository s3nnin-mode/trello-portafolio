import '../../styles/components/routes/formRegister.scss';
import { Button, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { userRegister } from '../../services/firebase/firebaseFunctions';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../customHooks/useAuthContext';
import { useState } from 'react';
import { Loader } from '../reusables/loader';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

export const FormRegister = () => {
  const { setUserAuth } = useAuthContext();
  const [loader, setLoader] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors },
    setError
  } = useForm({
    mode: "onChange" // o "onChange" para validación en cada pulsación
  });

  const password = watch('password');

  const onSubmit = async (data: any) => {
    setLoader(true);

    try {
      const res = await userRegister({
        email: data.email,
        password: data.password
      });

      console.log('estado de registro: ', res)

      if (res) {
        navigate('/kanbaX')
        setUserAuth(true);
      }

    } catch(error: any) {
      console.log(error.message);
      if (error.field) {
        setError(error.field, {
          message: error.message
        });
      } else {
        setGeneralError(error.message);
      }
    }

    setLoader(false);
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
              },
            })}
            error={!!errors.email}
            helperText={errors.email ? String(errors.email.message) : ''}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#6200ee', // color del borde cuando está enfocado
                },
              },
            }}
          />

          <TextField
            id="password"
            label="Contraseña"
            type={showPassword ? 'text' :'password'}
            variant="outlined"
            {...register("password", { 
              required: "La contraseña es obligatoria"
            })}
            error={!!errors.password}
            helperText={errors.password ? String(errors.password?.message) : ''}
            fullWidth
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
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#6200ee', // color del borde cuando está enfocado
                },
              },
            }}
          />

          <TextField
            id="confirmPassword"
            label="Confirmar contraseña"
            type={showConfirmPassword ? 'text' : 'password'}
            variant="outlined"
            {...register("confirmPassword", { 
              required: "Debes confirmar tu contraseña",
              validate: (value) => value === password || 'las contraseñas no coinciden'
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword ? String(errors.confirmPassword?.message) : ''}
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                    {showConfirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  </IconButton>
                </InputAdornment>
                )
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  color: '#6200ee',
                  borderColor: '#6200ee', // color del borde cuando está enfocado
                  '&.Mui-focused': {
                    color: '#6200ee'  // Color del label cuando está enfocado
                  },         
                },
              },
            }}
          />

          {
            generalError && (
              <Typography color='error' align="center">
                {generalError}
              </Typography>
            )
          }

          <Button sx={{
              backgroundColor: '#6200ee'
            }} 
            type="submit" 
            variant="contained" 
            size="large" 
          >
            Registrarme
          </Button>

          <Typography variant="body2" textAlign="center">
            ¿Ya tienes una cuenta?{" "}
            <Link 
              to="/auth/login" 
              style={{ 
                textDecoration: "none", 
                color: "#6200ee",
                fontWeight: 'bold'
              }}
            >
              Inicia sesión
            </Link>
          </Typography>
        </Stack>
      </form>
    </Paper>
  )
}