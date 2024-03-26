import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Avatar } from '@mui/material';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { bgGradient } from 'src/theme/css';

import Iconify from 'src/components/iconify';
import { useDispatch, useSelector } from 'react-redux';
import AuthService from 'src/backend/AuthService';
import { toast } from 'react-toastify';
import { signInSuccess, updateUserSuccess } from 'src/redux/User/userSlice';
import { Link } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function UpdateProfile() {
    const theme = useTheme();
    // const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [avatarSrc, setAvatarSrc] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isFormModified, setIsFormModified] = useState(false);
    const [avatarChanged, setAvatarChanged] = useState(false);
    const [loading, setLoading] = useState(false);


    const { currentUser, token } = useSelector((state) => state.user)
    const dispatch = useDispatch();
    const { register, handleSubmit, setValue, formState: { errors, isDirty } } = useForm({
        defaultValues: {
            firstName: currentUser?.firstName || "",
            lastName: currentUser?.lastName,
            password: "",
        }
    });
    // handle error
    const handleUpdate = (data) => {
        setLoading(true)
        AuthService.updateAccount(data, token?.accessToken).then((value) => {
            console.log(value);
            const userData = { ...value.data.updatedUser };
            dispatch(updateUserSuccess(userData));
            toast.success(value.message)
        }).catch((error) => {
            toast.error(error);
        }).finally(() => {
            setLoading(false)
        })
    }

    // imageChange
    const imageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) {
                setErrorMessage('File size exceeds 5MB.');
                return;
            }
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validImageTypes.includes(selectedFile.type)) {
                setErrorMessage('Please select a JPEG, PNG, or GIF image.');
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                setAvatarSrc(reader.result);
                setValue('profileImage', selectedFile);
                setAvatarChanged(true)
                setErrorMessage('');
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    useEffect(() => {

        setAvatarSrc(currentUser?.profileImage?.imgUrl);
    }, [])
    useEffect(() => {
        setIsFormModified(isDirty || avatarChanged);

    }, [isDirty, avatarChanged]); // Update isFormModified when isDirty changes

    const handleFormChange = () => {
        setIsFormModified(isDirty);
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
                    <Typography variant="h4">Update Profile</Typography>

                    <form onSubmit={handleSubmit(handleUpdate)} onChange={handleFormChange}>
                        <Stack spacing={3} >
                            <Stack alignItems="center" >
                                <label htmlFor="fileInput">
                                    <Avatar
                                        src={avatarSrc}
                                        sx={{ margin: "auto", width: 70, height: 70, cursor: "pointer" }}
                                    />
                                </label>

                                {errorMessage && <p style={{ color: 'red', textAlign: "center" }}>{errorMessage}</p>}
                                <input type='file' id='fileInput' hidden
                                    onChange={imageChange}
                                />
                            </Stack>

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

                            {/* lastName */}
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

                        <LoadingButton
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                            color="inherit"
                            sx={{ marginTop: "20px" }}
                            disabled={!isFormModified || loading}
                        >
                            {loading ? "Loading" : "Update Profile"}
                        </LoadingButton>

                        <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ mt: 2}}>
                            <Link to={'/changepassword'} variant="subtitle2"  underline="hover" style={{color:"#212b36"}}>
                                Change password?
                            </Link>
                        </Stack>
                    </form>
                </Card>
            </Stack>
        </Box>
    );
}
