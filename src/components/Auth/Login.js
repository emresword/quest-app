import React, { useState } from 'react';
import { Button, Message } from 'semantic-ui-react'; // Using Semantic UI components
import { TextField, CircularProgress } from '@mui/material'; // Using Material UI components
import { useNavigate } from 'react-router-dom';
import '../../Css/Login/Login.css'; // Make sure this CSS file exists

const Login = () => {
    const [user, setUser] = useState({ userName: '', password: '' }); // Changed to 'userName'
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true); // Start loading state
    
        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
    
            const result = await response.json();
            console.log("Response:", result); // Log the full response for debugging
    
            if (response.ok) {
                const token = result.data?.accessToken;
                const userId = result.data?.userId;
                const userName = user.userName; // Get userName from state
    
                if (token) {
                    setSuccess("Login successful!");
                    localStorage.setItem('token', token);
                    localStorage.setItem('userId', userId);
                    localStorage.setItem('userName', userName); // Store the username in localStorage
                    navigate('/'); // Redirect to the home page
                } else {
                    setError("Login failed: No token received.");
                }
            } else {
                setError(result.message || "Login failed. Please check your credentials.");
            }
        } catch (err) {
            setError("An error occurred: " + err.message);
        } finally {
            setLoading(false); // End loading state
        }
    };

    return (
        <div className="login-container">
            <div className="login-image"></div> {/* Left-side image */}
            <div className="login-form-container">
                <form onSubmit={handleSubmit} className="login-form">
                    <TextField
                        label="Username"
                        variant="outlined"
                        name="userName" // Updated to 'userName'
                        value={user.userName} // Updated to 'userName'
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        name="password"
                        type="password"
                        value={user.password}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    {error && <Message error>{error}</Message>}
                    {success && <Message success>{success}</Message>}
                    {loading && <CircularProgress />} {/* Show loading spinner */}
                    <Button type="submit" primary disabled={loading}>Login</Button> {/* Disable button while loading */}
                </form>
            </div>
        </div>
    );
};

export default Login;
