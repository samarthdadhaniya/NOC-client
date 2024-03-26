import { createSlice } from '@reduxjs/toolkit';

const certificateSlice = createSlice({
    name: 'certificates',
    initialState: {
        certificateData: [],
        reject: "",
        approve: "",
        statePending: "",
    },
    reducers: {
        addCertificates: (state, action) => {
            action.payload.forEach((certificate, index) => {
                if (!state.certificateData.some(existingCert => existingCert._id === certificate._id)) {
                    state.certificateData.push(certificate);
                    if (index === action.payload.length - 1) {
                        if (certificate.certificate_status == 'pending') {
                            state.statePending = true;
                            state.reject = false;
                            state.approve = false;
                        } else if (certificate.certificate_status == "false") {
                            state.reject = true;
                            state.statePending = false;
                            state.approve = false;
                        } else {
                            state.approve = true;
                            state.statePending = false;
                            state.reject = false;
                        }
                    }
                }
            });
        },
        addCertificate: (state, action) => {
            const newCertificate = action.payload;
            console.log(newCertificate);
            state.certificateData.push(newCertificate);
            state.statePending = true;
            state.reject = false;
            state.approve = false;
        },
        removeCertificate: (state, action) => {
            const certificateIdToRemove = action.payload;
            state.certificateData = state.certificateData.filter(certificate => certificate.id !== certificateIdToRemove);
        },
        updateCertificate: (state, action) => {
            const { item, status,updated_at } = action.payload;

            // Update the status of the certificate
            state.certificateData = state.certificateData.map(certificate => {
                if (certificate._id === item._id) {
                    // If the certificate ID matches the updated certificate ID, update the status

                    return {
                        ...certificate,
                        certificate_status: status,
                        updatedAt:updated_at
                    };
                } else {
                    // Otherwise, return the certificate unchanged
                    return certificate;
                }
            });
        },

        updatePendingState:(state)=>{
            state.approve = "pending"
        },
        updateRejectState:(state)=>{
            state.approve = "false"
        },
        
        updateApproveState:(state)=>{
            state.approve = "true"
        },
        clearCertificate: (state) => {
            state.statePending = "";
            state.reject = "";
            state.approve = "";
            state.certificateData = []
        }
    },
});

export const { addCertificate, removeCertificate, updateCertificate, addCertificates, clearCertificate ,updateApproveState,updateRejectState,updatePendingState} = certificateSlice.actions;
export default certificateSlice.reducer;
