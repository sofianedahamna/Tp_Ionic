// src/Composants/AddStationPage.js
import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
} from "@mui/material";
import useStyles from "../styles/AddStationStyles";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";

function AddStationPage() {
  const [currency, setCurrency] = useState("€");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [status, setStatus] = useState("ouvert"); // ou 'fermé' selon votre besoin
  const [plugType, setPlugType] = useState("rapide");

  const [availabilities, setAvailabilities] = useState([]);
  const [newAvailability, setNewAvailability] = useState({
    startDate: "",
    endDate: "",
    startHour: "",
    endHour: "",
  });
  const navigate = useNavigate();
  const classes = useStyles();
  const [fields, setFields] = useState({
    name: "",
    status: "",
    ratePerHour: "",
    plugType: "",
    accessInstructions: "",
  });
  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };
  const handleAddAvailability = () => {
    setAvailabilities([...availabilities, newAvailability]);
    setNewAvailability({
      startDate: "",
      endDate: "",
      startHour: "",
      endHour: "",
    });
  };
  const handleRemoveAvailability = (index) => {
    const updatedAvailabilities = [...availabilities];
    updatedAvailabilities.splice(index, 1);
    setAvailabilities(updatedAvailabilities);
  };

  const handleAvailabilityChange = (e, index, field) => {
    const updatedAvailabilities = [...availabilities];
    updatedAvailabilities[index][field] = e.target.value;
    setAvailabilities(updatedAvailabilities);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFields({
      ...fields,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/bornes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fields.name,
          status: status,
          ratePerHour: fields.ratePerHour,
          currency: currency,
          plugType: plugType,
          accessInstructions: fields.accessInstructions,
          address: address,
          city: city,
          postalCode: postalCode,
          availabilities: availabilities,
        }),
      });
      if (!response.ok) {
        throw new Error(`Failed to add borne: ${response.statusText}`);
      }
      const newBorne = await response.json();
      console.log("New borne added:", newBorne);
      // Naviguer vers la page de liste des bornes après l'ajout réussi
      navigate(`/user-bornes/your-user-id`);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Container maxWidth="md">
      <Card variant="outlined" style={{ padding: "20px", marginTop: "20px" }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Ajouter une borne
          </Typography>
          <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
            <TextField
              fullWidth
              label="Nom de la borne"
              name="name"
              value={fields.name}
              onChange={handleInputChange}
              margin="normal"
              variant="outlined"
              required
            />
            <TextField
              fullWidth
              label="Adresse"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Ville"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Code Postal"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              margin="normal"
              variant="outlined"
            />
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel htmlFor="status-select">Statut</InputLabel>
              <Select
                label="Statut"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                inputProps={{
                  name: "status",
                  id: "status-select",
                }}
              >
                <MenuItem value="" disabled>
                  Statut
                </MenuItem>
                <MenuItem value="ouvert">Ouvert</MenuItem>
                <MenuItem value="fermé">Fermé</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Tarif/h"
              name="ratePerHour"
              value={fields.ratePerHour}
              onChange={handleInputChange}
              margin="normal"
              variant="outlined"
              type="number" // Permet de s'assurer que seuls des chiffres peuvent être entrés
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Select
                      variant="standard"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      disableUnderline
                    >
                      <MenuItem value="€">€</MenuItem>
                      <MenuItem value="$">$</MenuItem>
                      <MenuItem value="£">£</MenuItem>
                      {/* ... autres monnaies */}
                    </Select>
                  </InputAdornment>
                ),
              }}
            />

            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel htmlFor="plugtype-select">Type de prise</InputLabel>
              <Select
                label="Type de prise"
                value={plugType}
                onChange={(e) => setPlugType(e.target.value)}
                inputProps={{
                  name: "plugType",
                  id: "plugtype-select",
                }}
              >
                <MenuItem value="" disabled>
                  Type de prise
                </MenuItem>
                <MenuItem value="rapide">Rapide</MenuItem>
                <MenuItem value="lente">Lente</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Instructions d'accès"
              name="accessInstructions"
              value={fields.accessInstructions}
              onChange={handleInputChange}
              multiline
              rows={4}
              margin="normal"
              variant="outlined"
              required
            />
            {availabilities.map((availability, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                  flexWrap: "wrap",
                }}
              >
                <TextField
                  label="Date de début"
                  type="date"
                  value={availability.startDate}
                  onChange={(e) =>
                    handleAvailabilityChange(e, index, "startDate")
                  }
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Date de fin"
                  type="date"
                  value={availability.endDate}
                  onChange={(e) =>
                    handleAvailabilityChange(e, index, "endDate")
                  }
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Heure de début"
                  type="time"
                  value={availability.startHour}
                  onChange={(e) =>
                    handleAvailabilityChange(e, index, "startHour")
                  } // Utilisez handleTimeChange ici
                  style={{ marginRight: "0px", minWidth: "109px" }}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  label="Heure de fin"
                  type="time"
                  value={availability.endHour}
                  onChange={(e) =>
                    handleAvailabilityChange(e, index, "endHour")
                  }
                  InputLabelProps={{ shrink: true }}
                />
                <IconButton
                  color="secondary"
                  aria-label="Supprimer la disponibilité"
                  onClick={() => handleRemoveAvailability(index)}
                >
                  <CloseIcon />
                </IconButton>
              </div>
            ))}
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddAvailability}
              style={{ marginRight: "10px" }}
            >
              Ajouter une disponibilité
            </Button>
            <Button variant="contained" color="secondary" type="submit">
              Ajouter
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}

export default AddStationPage;
