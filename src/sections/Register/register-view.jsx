import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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
import { useDispatch } from 'react-redux';

import Iconify from 'src/components/iconify';
import AuthService from 'src/backend/AuthService';
import { toast } from 'react-toastify';
import { useRouter } from 'src/routes/hooks';
import { addCertificates } from 'src/redux/User/certificateSlice';
import { setToken, signInSuccess } from 'src/redux/User/userSlice';

export default function RegisterView() {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();


  const router = useRouter();

  // Handler Register
  const handleRegister = (data) => {
    AuthService.createAccount(data)
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
            toast.success(val.message);
          })
      }).catch((error) => {
        toast.error(error);
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
          <Typography variant="h4">Sign up</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Already have an account?
            <Link to="/login" variant="subtitle2" sx={{ ml: 0.5 }}>
              Login
            </Link>
          </Typography>
          <form onSubmit={handleSubmit(handleRegister)}>
            <Stack spacing={3}>
              <Stack sx={{ gap: "10px" }} direction={{ sm: "row", xs: "column", lg: "row" }}>
                <TextField
                  type='text'
                  name="firstName"
                  fullWidth
                  label="First Name"
                  error={errors.firstName}
                  helperText={
                    <motion.div
                      style={{
                        color: 'red',
                        opacity: errors.firstName ? 1 : 0,
                        transition: "opacity 0.3s ease-in-out",
                        fontWeight: "bold"
                      }}
                    >
                      {errors.firstName && errors.firstName.message}
                    </motion.div>
                  }
                  {...register("firstName", {
                    required: "First name is required",
                    pattern: {
                      value: /^[a-zA-Z\s]*$/,
                      message: "Enter a valid first name"
                    }
                  })}
                />
                <TextField
                  type='text'
                  name="lastName"
                  fullWidth
                  label="Last Name"
                  error={errors.lastName}
                  helperText={
                    <motion.div
                      style={{
                        color: 'red',
                        opacity: errors.lastName ? 1 : 0,
                        transition: "opacity 0.3s ease-in-out",
                        fontWeight: "bold"
                      }}
                    >
                      {errors.lastName && errors.lastName.message}
                    </motion.div>
                  }
                  {...register("lastName", {
                    required: "Last name is required",
                    pattern: {
                      value: /^[a-zA-Z\s]*$/,
                      message: "Enter a valid last name"
                    }
                  })}
                />
              </Stack>

              <TextField
                name="email"
                label="Email address"
                error={errors.email}
                helperText={
                  <motion.div
                    style={{
                      color: 'red',
                      opacity: errors.email ? 1 : 0,
                      transition: "opacity 0.3s ease-in-out",
                      fontWeight: "bold"
                    }}
                  >
                    {errors.email ? errors.email.message : ''}
                  </motion.div>
                }
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@(charusat\.edu\.in|charusat\.ac\.in)$/,
                    message: "(e.g. id@charusat.edu.in, id@charusat.ac.in)"
                  }
                })}
              />

              <TextField
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                error={errors.password}
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
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long"
                  }
                })}
              />
            </Stack>

            <LoadingButton
              sx={{ mt: 3 }}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="inherit"
            >
              Register
            </LoadingButton>
          </form>
        </Card>
      </Stack>
    </Box>
  );
}
