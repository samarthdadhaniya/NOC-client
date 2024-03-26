import React, { useEffect } from 'react'
import { useSelector, } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Protected({ children, authentication = true }) {

    const navigate = useNavigate()
    const user = useSelector((state) => state.user)

    useEffect(() => {
        if (authentication && user?.status !== authentication ) {
            navigate('/login')
        } else if (!authentication && user?.status !== authentication) {
            navigate('/')
        }

    }, [user?.status,navigate]);

    return <>{children}</>
}

