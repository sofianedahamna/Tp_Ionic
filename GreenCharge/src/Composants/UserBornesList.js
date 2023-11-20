import React, { useEffect, useState } from "react";
import BorneCard from "./BorneCard";
import "../css/UserBornesList.css";
import { useParams } from "react-router-dom";

function UserBornesList() {
  const [bornes, setBornes] = useState([]);
  const [error, setError] = useState(null);
  const { userId } = useParams();
  const [editingBorneId, setEditingBorneId] = useState(null);

  useEffect(() => {
    const fetchUserBornes = async () => {
      if (!userId) {
        setError("L'ID de l'utilisateur n'est pas défini.");
        return;
      }

      try {
        const response = await fetch(
          `https://localhost:8000/api/user/${userId}/charging_points`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // Remplacez yourJWTToken par votre token JWT
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Échec de la récupération des bornes : ${response.statusText}`
          );
        }
        const data = await response.json();
        setBornes(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserBornes();
  }, [userId]);

  const handleDeleteBorne = async (id) => {
    try {
      const response = await fetch(
        `https://localhost:8000/api/charging_points/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // Remplacez yourJWTToken par votre token JWT
          },
        }
      );
      if (!response.ok) {
        throw new Error(
          `Échec de la suppression de la borne : ${response.statusText}`
        );
      }
      // Mise à jour de l'état pour retirer la borne supprimée
      setBornes(bornes.filter((borne) => borne.id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditClick = (borneId) => {
    setEditingBorneId(borneId);
  };

  const handleCancelClick = () => {
    // Nouveau
    setEditingBorneId(null);
  };
  const handleUpdateBorne = async (updatedBorne) => {
    try {
      const response = await fetch(
        `https://localhost:8000/api/charging_points/${updatedBorne.id}`,
        {
          method: "PUT", // ou PATCH
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // Remplacez yourJWTToken par votre token JWT
          },
          body: JSON.stringify(updatedBorne),
        }
      );
      if (!response.ok) {
        throw new Error(
          `Échec de la mise à jour de la borne : ${response.statusText}`
        );
      }
      const data = await response.json();

      // Mise à jour de l'état pour refléter la borne mise à jour
      setBornes(bornes.map((borne) => (borne.id === data.id ? data : borne)));
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="user-bornes-list-container">
      {error && <div className="error">{error}</div>}
      <div className="cards-container">
        {bornes.map((borne) => (
          <BorneCard
            key={borne.id}
            borne={borne}
            onDelete={handleDeleteBorne}
            onEdit={handleEditClick}
            onCancel={handleCancelClick}
            onUpdate={handleUpdateBorne}
          />
        ))}
      </div>
    </div>
  );
}
export default UserBornesList;
