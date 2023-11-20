// src/Composants/BorneCard.js

import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { animated, useSpring } from "react-spring";

function BorneCard({ borne, onDelete, onEdit, onCancel, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Mise à jour des states pour correspondre à la structure de votre base de données
  const [name, setName] = useState(borne.name);
  const [status, setStatus] = useState(borne.status);
  const [ratePerHour, setRatePerHour] = useState(borne.rate_per_hour);
  const [plugType, setPlugType] = useState(borne.plug_type);
  const [accessInstructions, setAccessInstructions] = useState(
    borne.acessinstruction
  );
  const [powerKw, setPowerKw] = useState(borne.power_kw);

  // Gestion de l'adresse
  const [streetNumber, setStreetNumber] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postCode, setPostCode] = useState("");
  const [country, setCountry] = useState("");
  // Gestion des disponibilités
  const [availabilities, setAvailabilities] = useState([]);
  const [newAvailability, setNewAvailability] = useState({
    startDate: "",
    endDate: "",
    startHour: "",
    endHour: "",
  });
  const props = useSpring({
    to: {
      width: isEditing ? "605px" : "600px",
      height: isEditing ? "500px" : "90px",
      opacity: isDeleting ? 0 : 1,
      transform: isDeleting ? "scale(0)" : "scale(1)",
    },
  });

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Lorsque l'utilisateur clique sur "Enregistrer"
      handleSaveClick();
    } else {
      // Lorsque l'utilisateur clique sur "Modifier"
      onEdit(borne.id);
    }
  };

  const handleSaveClick = async () => {
    // Préparation des données à envoyer
    const updatedData = {
      name,
      status,
      rate_per_hour: ratePerHour,
      plug_type: plugType,
      acessinstruction: accessInstructions,
      power_kw: powerKw,
      adress: {
        street_number: streetNumber,
        street,
        city,
        state,
        post_code: postCode,
        country,
      },
      availabilities,
    };

    try {
      const response = await fetch(
        `https://localhost:8000/api/charging_points/${borne.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update charging point: ${response.statusText}`
        );
      }

      const updatedBorne = await response.json();
      onUpdate(updatedBorne);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating charging point: ", error);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleting(true);
    setTimeout(() => onDelete(borne.id), 500);
  };

  const handleDateChange = (e, index, field) => {
    const updatedAvailabilities = [...availabilities];
    updatedAvailabilities[index][field] = e.target.value;
    setAvailabilities(updatedAvailabilities);
  };

  const handleTimeChange = (e, index, field) => {
    const updatedAvailabilities = [...availabilities];
    updatedAvailabilities[index][field] = e.target.value;
    setAvailabilities(updatedAvailabilities);
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

  const handleCancelClick = () => {
    // Nouveau
    setIsEditing(false);
    onCancel(); // Nouveau
  };

  return (
    <animated.div style={props}>
      <Card variant="outlined">
        <CardContent
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" component="div" style={{ flex: 1 }}>
            {name}
          </Typography>
          <div style={{ marginLeft: "20px", display: "flex", gap: "10px" }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleEditClick}
            >
              {isEditing ? "Enregistrer" : "Modifier"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleDeleteClick}
            >
              Supprimer
            </Button>
          </div>
        </CardContent>

        {isEditing && (
          <CardContent>
            <TextField
              fullWidth
              label="Nom de la borne"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Numéro de rue"
              value={streetNumber}
              onChange={(e) => setStreetNumber(e.target.value)}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Rue"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
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
              label="État/Région"
              value={state}
              onChange={(e) => setState(e.target.value)}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Code Postal"
              value={postCode}
              onChange={(e) => setPostCode(e.target.value)}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Pays"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              margin="normal"
              variant="outlined"
            />
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              variant="outlined"
              fullWidth
              displayEmpty
              inputProps={{ "aria-label": "Statut" }}
            >
              <MenuItem value="" disabled>
                Statut
              </MenuItem>
              <MenuItem value="ouvert">Ouvert</MenuItem>
              <MenuItem value="fermé">Fermé</MenuItem>
            </Select>
            <TextField
              fullWidth
              label="Tarif par heure"
              value={ratePerHour}
              onChange={(e) => setRatePerHour(e.target.value)}
              margin="normal"
              variant="outlined"
              type="number"
            />
            <TextField
              fullWidth
              label="Puissance (kW)"
              value={powerKw}
              onChange={(e) => setPowerKw(e.target.value)}
              margin="normal"
              variant="outlined"
              type="number"
            />
            <Select
              value={plugType}
              onChange={(e) => setPlugType(e.target.value)}
              variant="outlined"
              fullWidth
              displayEmpty
              inputProps={{ "aria-label": "Type de prise" }}
            >
              <MenuItem value="" disabled>
                Type de prise
              </MenuItem>
              <MenuItem value="rapide">Rapide</MenuItem>
              <MenuItem value="lente">Lente</MenuItem>
            </Select>
            <TextField
              fullWidth
              label="Instructions d'accès"
              value={accessInstructions}
              onChange={(e) => setAccessInstructions(e.target.value)}
              margin="normal"
              variant="outlined"
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
                  onChange={(e) => handleDateChange(e, index, "startDate")}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Date de fin"
                  type="date"
                  value={availability.endDate}
                  onChange={(e) => handleDateChange(e, index, "endDate")}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Heure de début"
                  type="time"
                  value={availability.startHour}
                  onChange={(e) => handleTimeChange(e, index, "startHour")}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Heure de fin"
                  type="time"
                  value={availability.endHour}
                  onChange={(e) => handleTimeChange(e, index, "endHour")}
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
            >
              Ajouter une disponibilité
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCancelClick}
            >
              Annuler
            </Button>
          </CardContent>
        )}
      </Card>
    </animated.div>
  );
}
export default BorneCard;
