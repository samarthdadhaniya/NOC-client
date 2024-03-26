import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function AdminProtected({children}) {
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)

    useEffect(() => {
        if (user?.currentUser?.isAdmin == false) {
            navigate('/')
        } 
    }, [user?.currentUser, navigate]);

    return <>{children}</>
}
