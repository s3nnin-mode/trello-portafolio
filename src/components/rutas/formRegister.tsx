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
  // #161b22
  return (
    <>
    <Typography sx={{color: '#ccc'}} variant="h5" fontWeight="bold" textAlign="center" mb={2}>
      ¡Organiza tu mundo con kanbaX!
    </Typography>    
    <Paper 
      elevation={3} 
      sx={{ 
        borderRadius: '4px', 
        padding: 4, 
        margin: "auto", 
        backgroundColor: '#161b22',
      }}
    >
      <Loader open={loader} />

      <Typography sx={{color: '#ccc'}} variant="h5" fontWeight="bold" textAlign="center" mb={2}>
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
                  <IconButton sx={{color: '#ccc'}} onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                    {showConfirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  </IconButton>
                </InputAdornment>
                )
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#ccc',
                '& fieldset': {
                  border: '2px solid #0d1117', // 🔹 borde cuando NO está enfocado
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
              <Typography color='error' align="center">
                {generalError}
              </Typography>
            )
          }

          <Button sx={{
              backgroundColor: '#1976d2',
              color: '#fff'
            }} 
            type='submit' 
            variant='contained'
            size='large'
          >
            Registrarme
          </Button>

          <Typography sx={{color: '#ccc'}} variant="body2" textAlign="center">
            ¿Ya tienes una cuenta?{" "}
            <Link 
              to='/auth/login'
              style={{ 
                textDecoration: "none", 
                color: 'orange',
                fontWeight: 'bold'
              }}
            >
              Inicia sesión
            </Link>
          </Typography>
        </Stack>
      </form>
    </Paper>
    </>
  )
}