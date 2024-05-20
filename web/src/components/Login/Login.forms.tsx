import React, { useState } from 'react';
import classes from './Login.module.css';
import { TextInput, PasswordInput, Checkbox, Button } from '@mantine/core';

function LoginForm() {
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
    };

    const handleInvalid = (e : React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();
        console.log(e);
        // handle invalid input logic here
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(e);
        // handle login logic here
    };

    return (
        <form className={classes.loginForm} onSubmit={handleSubmit}>
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