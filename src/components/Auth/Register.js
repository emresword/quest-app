import React, { useState } from 'react';
import { TextField, Button, Snackbar, Alert } from '@mui/material'; // Material-UI components
import { useNavigate } from 'react-router-dom';
import '../../Css/Register/Register.css'; // Your CSS file

const Register = () => {
    const [user, setUser] = useState({ userName: '', password: '', confirmPassword: '', email: '' }); // Changed to 'userName'
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (user.password !== user.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user), // Send the entire user object
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setSuccess("Registration successful!");
                setUser({ userName: '', password: '', confirmPassword: '', email: '' }); // Updated to 'userName'
                navigate('/login');
            } else {
                setError(result.message || "An error occurred.");
            }
        } catch (err) {
            setError("An error occurred.");
        }
    };

    return (
        <div className="register-container">
            <div className="register-image"></div>
            <div className="register-form-container">
                <form onSubmit={handleSubmit} className="register-form">
                    <TextField
                        label="Username"
                        name="userName" // Updated to 'userName'
                        value={user.userName} // Updated to 'userName'
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        type="email"
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Password"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        type="password"
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Confirm Password"
                        name="confirmPassword"
                        value={user.confirmPassword}
                        onChange={handleChange}
                        type="password"
                        fullWidth
                        margin="normal"
                        required
                    />
                    {error && (
                        <Snackbar open={true} autoHideDuration={6000}>
                            <Alert severity="error">{error}</Alert>
                        </Snackbar>
                    )}
                    {success && (
                        <Snackbar open={true} autoHideDuration={6000}>
                            <Alert severity="success">{success}</Alert>
                        </Snackbar>
                    )}
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Register
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Register;
