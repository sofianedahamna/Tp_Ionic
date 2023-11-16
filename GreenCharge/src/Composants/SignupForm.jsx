import React, { useState } from 'react';
import { TextField, Button, Typography, Paper } from '@mui/material';
import '../css/SignupForm.css'; // Assurez-vous que le chemin est correct
/* global grecaptcha */
function SignupForm({ onSignup }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Utilisation de reCAPTCHA Enterprise
        grecaptcha.enterprise.ready(async () => {
            try {
                const response = await fetch('https://localhost:8000/register', {
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Sec-Fetch-Mode':'navigate',
                        'Sec-Fetch-Site':'cross-site'
                    },
                    method: 'POST',
                    body: JSON.stringify({ email, password })
                });
                console.log('Connexion réussie:', response.data);
                const token = await grecaptcha.enterprise.execute('6LdiZwopAAAAAER7woHz-f7NzCz06x6aRUHDnV1Q', {action: 'signup'});
                // Ici, vous pouvez envoyer le token au serveur pour validation
                onSignup(email, password, token);
            } catch (error) {
                console.error('Erreur lors de l\'exécution de reCAPTCHA', error);
                // Gérer l'erreur (par exemple, afficher un message à l'utilisateur)
            }
        });
    };
   
    return (
        <Paper className="signup-form-container" elevation={3}>
            <form onSubmit={handleSubmit} className="signup-form">
                <Typography variant="h5">Inscription</Typography>
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
                {/* Le composant ReCAPTCHA a été retiré ici */}
                <Button type="submit" variant="contained" color="primary">
                    S'inscrire
                </Button>
            </form>
            <Typography className="signup-link">
                Déjà inscrit ? <a href="/login">Connectez-vous ici</a>.
            </Typography>
        </Paper>
    );
}

export default SignupForm;
