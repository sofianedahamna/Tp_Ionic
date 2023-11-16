import React, { useEffect, useState } from "react";
import BorneCard from "./BorneCard"; // Importez le composant BorneCard
import "../css/UserBornesList.css";
function UserBornesList({ userId }) {
  const [bornes, setBornes] = useState([]);
  const [error, setError] = useState(null);
  const [editingBorneId, setEditingBorneId] = useState(null);

  useEffect(() => {
    const fetchUserBornes = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/bornes?userId=${userId}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch bornes: ${response.statusText}`);
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
      const response = await fetch(`http://localhost:5000/bornes/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete borne: ${response.statusText}`);
      }
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
  const handleUpdateBorne = (updatedBorne) => {
    setBornes((prevBornes) =>
      prevBornes.map((borne) =>
        borne.id === updatedBorne.id ? updatedBorne : borne
      )
    );
  };
  return (
    <div className="user-bornes-list-container">
      {error && <div className="error">{error}</div>}
      <div className="cards-container">
      {bornes.map(borne => (
  (!editingBorneId || editingBorneId === borne.id) && 
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
