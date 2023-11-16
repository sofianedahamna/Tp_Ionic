import React, { useState } from 'react';
import { TextField, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../css/LoginForm.css';

function LoginForm() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://localhost:8000/api/login_check', {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('jwtToken', data.token);
                navigate('/');
            } else {
                setError(data.message || 'Erreur de connexion');
            }
        } catch (error) {
            console.error('Erreur de connexion:', error);
            setError('Une erreur est survenue lors de la connexion.');
        }
    };

    return (
        <Paper className="login-form-container" elevation={3}>
            <form onSubmit={handleSubmit} className="login-form">
                <Typography variant="h5">Connexion</Typography>
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <TextField
                    label="Mot de passe"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button type="submit" variant="contained" color="primary">
                    Se connecter
                </Button>
                {error && <Typography color="error">{error}</Typography>}
            </form>
            <Typography className="login-link">
                Pas encore inscrit ? <a href="/signup">Inscrivez-vous ici</a>.
            </Typography>
        </Paper>
    );
}

export default LoginForm;
