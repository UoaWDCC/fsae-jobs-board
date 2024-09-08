import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function Verify() {
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(()=>{
        const params = new URLSearchParams(location.search)
        const token = params.get('token')
        
        if (!token) {

        }
        else {
            console.log({token})
        }

    }, [location, navigate])

    return (<></>)
}