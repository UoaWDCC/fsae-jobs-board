import React, { useState } from 'react';
import classes from './Login.module.css';
import { TextInput, PasswordInput, Checkbox, Button } from '@mantine/core';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toTitleCase } from '../../utils/helpers';
import {UserType} from '../../features/user/userSlice';
import { setUserType } from '../../features/user/userSlice';

function LoginForm({tryLoginAs}: {tryLoginAs: UserType}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const [existingToasts, setExistingToasts] = useState({});

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.currentTarget;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: newValue,
        }));

        if (existingToasts[name]) {
            toast.dismiss(existingToasts[name]);
            setExistingToasts((prevToasts) => ({
                ...prevToasts,
                [name]: undefined,
            }));
        }
    };

    const handleInvalid = (e : React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();
        
        const { name, validationMessage } = e.currentTarget;

        if (existingToasts[name]) {
            toast.dismiss(existingToasts[name]);
        }
        
        const toastId = toast.error(
            (
                <div>
                <strong>{toTitleCase(name)} Input:</strong>
                <br/>
                {validationMessage.split('.')[0]} 
                </div>
            )
        );

        setExistingToasts((prevToasts) => ({
            ...prevToasts,
            [name]: toastId,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleLoginAs(tryLoginAs);
    };

    const handleLoginAs = (userType: 'student' | 'sponsor' | 'alumni' | 'admin') => {
        console.log('Logging in as ' + userType);
        // // Simulate successful login (to be replaced with the actual authentication logic)
        const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
        localStorage.setItem('accessToken', mockToken);
        // // If authentication is successful: Update Redux store with userType
        dispatch(setUserType(userType));
        // // Redirect to the appropriate profile page based on userType
        const profilePath = {
          student: '/profile/student',
          sponsor: '/profile/sponsor',
          alumni: '/profile/alumni',
          admin: '/profile/admin',
        }[userType];
        toast.success('Logged in as ' + userType);
        navigate(profilePath, { replace: true });
      };

    return (
        <form className={classes.loginForm} onSubmit={(handleSubmit)}>
            <TextInput
                id="email"
                name="email"
                type="email"
                size="md"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                onInvalid={handleInvalid}
                required
                autoComplete="current-email"
            />
            <br/>
            <PasswordInput
                id="password"
                name="password"
                size="md"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                onInvalid={handleInvalid}
                required
                autoComplete="current-password"
            />
            <br/>
            <div>
                <Checkbox
                    id="rememberMe"
                    name="rememberMe"
                    size='l'
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    label="Remember Me"
                />
            </div>
            <br/>
            <Button type="submit" color="blue" fullWidth>
                Log In
            </Button>
        </form>
    );
}

export default LoginForm;