import React, { useState } from 'react';
import classes from './Login.module.css';

function LoginForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const handleChange = (e: React.ChangeEvent<any>) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prevData => ({
            ...prevData,
            [name]: newValue
        }));
    };

    const handleInvalid = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(e);
    }

    const handleLogin = (e: React.FormEvent) => {
        // e.preventDefault();
        
        console.log(formData);
    };

    return (
        <form onSubmit={handleLogin}>
            <input type="email" id="email" name="email" placeholder='Enter your email address' value={formData.email} onChange={handleChange} onInvalid={handleInvalid} required/>
            <input type="password" id="password" name="password" placeholder='Enter your password' value={formData.password} onChange={handleChange} required/>
            <br/>
            <div className={classes.checkboxes}>
                <input type="checkbox" id="rememberMe" name="rememberMe" checked={formData.rememberMe} onChange={handleChange}/> Remember Me
            </div>
            <br/>
            <button type="submit">Log In</button>
        </form>
    );
}

export default LoginForm;