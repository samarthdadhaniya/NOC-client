import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';

import { bgGradient } from 'src/theme/css';

// ----------------------------------------------------------------------

export default function ForgetForm() {
    const theme = useTheme();
    // const router = useRouter();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

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
                    <Typography variant="h4" sx={{ mb: "20px" }}>Forget Password</Typography>

                    <form onSubmit={handleSubmit(handleForgetPass)}>
                        <Stack spacing={3} >

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
