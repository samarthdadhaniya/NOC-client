import React from 'react'
import { useSelector } from 'react-redux'
import AdminForm from 'src/sections/Admin/AdminTable'

export default function ApproveCertificatesPage() {
    return (
        <AdminForm approve="true"></AdminForm>
    )
}
