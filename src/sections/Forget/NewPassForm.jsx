import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Iconify from 'src/components/iconify';
import { bgGradient } from 'src/theme/css';

// ----------------------------------------------------------------------

export default function NewPassForm() {
    const theme = useTheme();
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        watch
    } = useForm();

    const newPassword = watch('newPassword');
    const handleForgetPass = (data) => {
        console.log(data);
    };

    return (
        <Box
            sx={{
                ...bgGradient({
                    color: alpha(theme.palette.background.default, 0.9),
                }),
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                height: 1,
            }}
        >
            <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
                <Card
                    sx={{
                        p: 5,
                        width: 1,
                        maxWidth: 500,
                        minWidth: 450
                    }}
                >
                    <Typography variant="h4" sx={{ mb: "20px" }}>Enter New Pass</Typography>

                    <form onSubmit={handleSubmit(handleForgetPass)}>
                        <Stack spacing={3}>
                            <TextField
                                name="newPassword"
                                label="New Password"
                                type={showPassword ? 'text' : 'password'}
                                error={!!errors.newPassword}
                                helperText={
                                    <motion.div
                                        style={{
                                            color: 'red',
                                            opacity: errors.newPassword ? 1 : 0,
                                            transition: "opacity 0.3s ease-in-out",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {errors.newPassword && errors.newPassword.message}
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
                                {...register("newPassword", {
                                    required: '*Password is required',
                                    minLength: {
                                        value: 6,
                                        message: '*Password must be at least 6 characters long'
                                    }
                                })}
                            />
                            <TextField
                                name="confirmPassword"
                                label="Confirm Password"
                                type={showPassword ? 'text' : 'password'}
                                error={!!errors.confirmPassword}
                                helperText={
                                    <motion.div
                                        style={{
                                            color: 'red',
                                            opacity: errors.confirmPassword ? 1 : 0,
                                            transition: "opacity 0.3s ease-in-out",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {errors.confirmPassword && errors.confirmPassword.message}
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
                                {...register("confirmPassword", {
                                    required: '*Confirm Password is required',
                                    validate: value =>
                                        value === newPassword || "The passwords do not match"
                                })}
                            />
                        </Stack>
                        <LoadingButton
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                            color="inherit"
                            sx={{ marginTop: "20px" }}
                        >
                            Submit
                        </LoadingButton>
                    </form>
                </Card>
            </Stack>
        </Box>
    );
}
