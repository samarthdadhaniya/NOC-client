/* eslint-disable perfectionist/sort-imports */
import { ToastContainer, toast } from 'react-toastify';
import 'src/global.css';


import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';

import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import AuthService from './backend/AuthService';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, signInFailure, signInStart, signInSuccess, signOutUserSuccess } from './redux/User/userSlice';
import { addCertificate, addCertificates } from './redux/User/certificateSlice';
import CertificateService from './backend/CertificateService';
// ----------------------------------------------------------------------

export default function App() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  const token = user?.currentUser?.accessToken;
  const refreshToken = user?.currentUser?.refreshToken;

  // State variable to track if user data has been fetched
  const [userDataFetched, setUserDataFetched] = useState(false);
  const [certificate, setCertificate] = useState([]);

  useEffect(() => {
    if (token && !userDataFetched) {
      AuthService.getAuthUser(token)
        .then((val) => {
          const refreshToken = val.data.tokens.refreshToken;
          const accessToken = val.data.tokens.accessToken;
          dispatch(setToken({ accessToken, refreshToken }));
          const userData = { ...val.data.user, refreshToken, accessToken };
          const certificates = userData.certificateIssue
          if (userData.isAdmin == true) {
            CertificateService.getAllCertificate()
              .then((val) => {
                const certificates = val.data.certificate
                dispatch(addCertificates(certificates));
              }).catch((error) => {
                console.log(error);
              })
          }

          dispatch(signInSuccess(userData));
          setUserDataFetched(true); // Mark user data as fetched
        })
        .catch((error) => {
          if(error.response.data.message == "Invalid Access Token"){
            dispatch(signOutUserSuccess());
          }
          console.log(error);
        });
    } 
  }, [token, userDataFetched]);

  return (
    <ThemeProvider>
      <ToastContainer />
      <Router />
    </ThemeProvider>
  );
}
