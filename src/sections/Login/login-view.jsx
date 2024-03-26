import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { bgGradient } from 'src/theme/css';

import Iconify from 'src/components/iconify';
import AuthService from 'src/backend/AuthService';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setToken, signInFailure, signInStart, signInSuccess } from 'src/redux/User/userSlice';
import { useRouter } from 'src/routes/hooks';
import { addCertificates } from 'src/redux/User/certificateSlice';

export default function LoginView() {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const router = useRouter();

  // Handle Login
  const handleLogin = (data) => {
    dispatch(signInStart());
    setLoading(true);
    AuthService.login(data)
      .then((val) => {
        const accessToken = val.data.tokens.accessToken;
        AuthService.getAuthUser(accessToken)
          .then((val) => {
            const refreshToken = val.data.tokens.refreshToken;
            const accessToken = val.data.tokens.accessToken;
            dispatch(setToken({ accessToken, refreshToken }));
            const userData = { ...val.data.user, refreshToken, accessToken };
            const certificates = userData.certificateIssue
            dispatch(addCertificates(certificates))
            dispatch(signInSuccess(userData));
            router.push('/');
          })
          toast.success(val.message);
      }).catch((error) => {
        toast.error(error);
        dispatch(signInFailure());
      }).finally(() => {
        setLoading(false)
      })
  };

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card sx={{ p: 5, width: 1, maxWidth: 420 }}>
          <Typography variant="h4">Sign in </Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Don’t have an account?
            <Link to="/register" variant="subtitle2" sx={{ ml: 0.5 }}>
              Get started
            </Link>
          </Typography>
          <form onSubmit={handleSubmit(handleLogin)} >
            <Stack spacing={3}>
              <TextField
                sx={{ marginBottom: '10px' }}
                name="email"
                label="Email address"
                error={!!errors.email}
                helperText={
                  <motion.div
                    style={{
                      color: 'red',
                      opacity: errors.email ? 1 : 0,
                      transition: "opacity 0.3s ease-in-out",
                      fontWeight: "bold"
                    }}
                  >
                    {errors.email && errors.email.message}
                  </motion.div>
                }
                {...register("email", {
                  required: '*Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@(charusat\.edu\.in|charusat\.ac\.in)$/,
                    message: '*Valid Email. ex. [@charusat.edu.in, @charusat.ac.in]'
                  }
                })}
              />

              <TextField
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                error={!!errors.password}
                helperText={
                  <motion.div
                    style={{
                      color: 'red',
                      opacity: errors.password ? 1 : 0,
                      transition: "opacity 0.3s ease-in-out",
                      fontWeight: "bold"
                    }}
                  >
                    {errors.password && errors.password.message}
                  </motion.div>
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...register("password", {
                  required: '*Password is required',
                  minLength: {
                    value: 6,
                    message: '*Password must be at least 6 characters long'
                  }
                })}
              />
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 2 }}>
            </Stack>

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="inherit"
            >
              {loading ? "loading" : "Login"}

            </LoadingButton>
          </form>
        </Card>
      </Stack>
    </Box>
  )
}
