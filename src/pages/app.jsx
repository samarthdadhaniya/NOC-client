
import { Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppFormView, Resubmit } from 'src/sections/app';

import { useEffect, useState } from 'react';
import { updateApproveState, updatePendingState, updateRejectState } from 'src/redux/User/certificateSlice';
import CertificateService from 'src/backend/CertificateService';


export default function AppPage() {
  const dispatch = useDispatch();
  // const { certificateData } = useSelector((state) => state.certificate);
  const [certificateData,setCertificateData] = useState([]);
  const { currentUser } = useSelector(state => state.user);
  const [lastCertificateData, setLastCertificateData] = useState(null);

  // States for filtering based on certificate status
  const [statePending, setStatePending] = useState(false);
  const [reject, setReject] = useState(false);
  const [approve, setApprove] = useState(false);


  useEffect(() => {
    const token = currentUser?.accessToken
    CertificateService.getUserCertificate(token).then((val)=>{
      const certificateData = val.data.certificate
      setCertificateData(certificateData)
    }).catch((error)=>{
    })    
  }, [currentUser]);


  useEffect(() => {
    if (certificateData && certificateData.length > 0) {
      // Get the last item of the array
      const lastItem = certificateData[certificateData.length - 1];
      setLastCertificateData(lastItem);
      // Set states based on the status of the last item
      if (lastItem.certificate_status == 'false') {
        setReject(true);
        setStatePending(false);
        setApprove(false);
        dispatch(updateRejectState())
      } else if (lastItem.certificate_status == 'true') {
        setApprove(true);
        setStatePending(false);
        setReject(false);
        dispatch(updateApproveState())
      } else {
        setStatePending(true);
        setReject(false);
        setApprove(false);
        updatePendingState();
      }
    }
  }, [certificateData]);
  return (

    <>
      {reject && (<><Typography>You can resubmit your form due to rejection.</Typography> <AppFormView /></>)}
      {reject == "true" && <AppFormView reject={reject} />}

      {approve && <Resubmit textMessage={"Your application has been approved."} data={lastCertificateData} approve="true" link="true" />}
      
      {statePending && <Resubmit textMessage={"Your application all ready submit."} />}
      {!reject && !statePending && !approve && <AppFormView />}
    </>
  );
}
