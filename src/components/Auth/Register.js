import React, { useState } from 'react';
import { Form, Input, Button, Message } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [user, setUser] = useState({ username: '', password: '', email: '' });
    const [confirmPassword, setConfirmPassword] = useState('');
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

        if (user.password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName: user.username,
                    password: user.password,
                    confirmPassword,
                    email: user.email
                }), // Ensure this matches backend expectations
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setSuccess("Registration successful!");
                setUser({ username: '', password: '', email: '' });
                setConfirmPassword('');
                navigate('/login');
            } else {
                setError(result.message || "An error occurred.");
            }
        } catch (err) {
            setError("An error occurred.");
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
                <label>Email</label>
                <Input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    placeholder="Email"
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
            <Form.Field>
                <label>Confirm Password</label>
                <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    required
                />
            </Form.Field>
            {error && <Message negative>{error}</Message>}
            {success && <Message positive>{success}</Message>}
            <Button type="submit" primary>Register</Button>
        </Form>
    );
};

export default Register;
