// src/Composants/ProfilePage.js
import React, { useState } from 'react';
import { Button, TextField, Typography, Container } from '@mui/material';
import useStyles from '../styles/ProfilePageStyles';

function ProfilePage() {
    const classes = useStyles();
    const [fields, setFields] = useState({
        legalName: '',
        email: '',
        phoneNumber: '',
        address: '',
        emergencyContact: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFields({
            ...fields,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form data submitted:', fields);
    };
    return (
        <Container maxWidth="sm">
            <div className={classes.container}>
                <Typography variant="h4" gutterBottom>
                    Modifier vos informations
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <TextField
                        className={classes.textField} 
                        variant="outlined"
                        fullWidth
                        label="Prénom"
                        name="firstName"
                        value={fields.firstName}
                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        className={classes.textField}
                        variant="outlined"
                        fullWidth
                        label="Nom"
                        name="lastName"
                        value={fields.lastName}
                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        className={classes.textField}
                        variant="outlined"
                        fullWidth
                        type="password"
                        label="Mot de passe"
                        name="password"
                        value={fields.password}
                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        className={classes.textField}
                        variant="outlined"
                        fullWidth
                        label="Email"
                        name="email"
                        value={fields.email}
                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        className={classes.textField}
                        variant="outlined"
                        fullWidth
                        label="Adresse"
                        name="address"
                        value={fields.address}
                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        className={classes.textField}
                        variant="outlined"
                        fullWidth
                        label="Ville"
                        name="ville"
                        value={fields.address}
                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        className={classes.textField}
                        variant="outlined"
                        fullWidth
                        label="Code Postale"
                        name="CP"
                        value={fields.address}
                        onChange={handleInputChange}
                        required
                    />
                    <Button
                        className={classes.submitButton}
                        variant="contained"
                        color="primary"
                        type="submit"
                    >
                        Soumettre
                    </Button>
                </form>
            </div>
            </Container>
    );
}

export default ProfilePage;
