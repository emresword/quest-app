import React, { useState } from 'react';
import { Form, Input, Button, Message } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [user, setUser] = useState({ username: '', password: '' });
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

        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            const result = await response.json();

            if (response.ok) {
                // Assuming the token is returned in result.data
                const token = result.data;
                if (token) {
                    setSuccess("Login successful!");
                    localStorage.setItem('token', token); // Store the JWT token
                    navigate('/');
                } else {
                    setError("Login failed: No token received.");
                }
            } else {
                setError(result.message || "An error occurred.");
            }
        } catch (err) {
            setError("An error occurred: " + err.message);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Field>
                <label>Username</label>
                <Input
                    type="text"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                    placeholder="Username"
                    required
                />
            </Form.Field>
            <Form.Field>
                <label>Password</label>
                <Input
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                />
            </Form.Field>
            {error && <Message negative>{error}</Message>}
            {success && <Message positive>{success}</Message>}
            <Button type="submit" primary>Login</Button>
        </Form>
    );
};

export default Login;
