// src/Composants/BorneCard.js

import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { animated, useSpring } from "react-spring";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

function BorneCard({ borne, onDelete, onEdit, onCancel, onUpdate }) {
  const [availabilities, setAvailabilities] = useState(
    borne.availabilities || []
  );
  const [currency, setCurrency] = useState("€");
  const [newAvailability, setNewAvailability] = useState({
    startDate: "",
    endDate: "",
    startHour: "",
    endHour: "",
  });
  const [address, setAddress] = useState(borne.address || "");
  const [city, setCity] = useState(borne.city || "");
  const [postalCode, setPostalCode] = useState(borne.postalCode || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [name, setName] = useState(borne.name);
  const [status, setStatus] = useState(borne.status);
  const [ratePerHour, setRatePerHour] = useState(borne.ratePerHour);
  const [plugType, setPlugType] = useState(borne.plugType);
  const [date, setDate] = useState(borne.date);
  const [time, setTime] = useState(borne.time);
  const [accessInstructions, setAccessInstructions] = useState(
    borne.accessInstructions
  );
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
  const props = useSpring({
    to: {
      width: isEditing ? "605px" : "600px",
      height: isEditing ? "500px" : "90px",
      opacity: isDeleting ? 0 : 1,
      transform: isDeleting ? "scale(0)" : "scale(1)",
    },
  });

  const handleEditClick = () => {
    if (isEditing) {
        handleSaveClick();
    } else {
        onEdit(borne.id);  // set to borne.id when clicking "Modifier" initially
    }
    setIsEditing((prev) => !prev);
};


  const handleCancelClick = () => {  // Nouveau
    setIsEditing(false);
    onCancel();  // Nouveau
  };


  const handleDeleteClick = () => {
    setIsDeleting(true);
    setTimeout(() => onDelete(borne.id), 500);
  };
  const handleSaveClick = async () => {
    try {
      const response = await fetch(`http://localhost:5000/bornes/${borne.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          status,
          ratePerHour,
          currency: currency,
          plugType,
          address,
          city,
          postalCode,
          accessInstructions,
          availabilities,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save changes: ${response.statusText}`);
      }

      const updatedBorne = await response.json();
      onUpdate(updatedBorne);
      setIsEditing(false); // fermer le mode d'édition
      onEdit(null);
    } catch (error) {
      console.error(error.message);
      // ... (gestion des erreurs)
    }
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
            {borne.name}
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
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              variant="outlined"
              fullWidth
              displayEmpty // Ceci assure que le placeholder est affiché même quand la valeur est non-nulle
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
              type="number" // Assure que seuls des chiffres peuvent être entrés
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      disableUnderline
                      variant="standard" // Retire les bordures autour du sélecteur de monnaie
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
            <Select
              value={plugType}
              onChange={(e) => setPlugType(e.target.value)}
              variant="outlined"
              fullWidth
              displayEmpty // Ceci assure que le placeholder est affiché même quand la valeur est non-nulle
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
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  label="Date de fin"
                  type="date"
                  value={availability.endDate}
                  onChange={(e) => handleDateChange(e, index, "endDate")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  label="Heure de début"
                  type="time"
                  value={availability.startHour}
                  onChange={(e) => handleTimeChange(e, index, "startHour")} // Utilisez handleTimeChange ici
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
                  onChange={(e) => handleTimeChange(e, index, "endHour")}
                  InputLabelProps={{
                    shrink: true,
                  }}
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
