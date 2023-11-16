import React, { useEffect, useState } from 'react';

function Menu() {
  const [bornes, setBornes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBornes = async () => {
      try {
        const response = await fetch('http://localhost:5000/bornes');
        if (!response.ok) {
          throw new Error(`Failed to fetch bornes: ${response.statusText}`);
        }
        const data = await response.json();
        setBornes(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchBornes();
  }, []);

  const handleDeleteBorne = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/bornes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Failed to delete borne: ${response.statusText}`);
      }
      setBornes(bornes.filter(borne => borne.id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditBorne = (id) => {
    // Vous pouvez rediriger vers une page d'édition ou ouvrir une modale
    // Pour l'instant, cela affichera simplement une alerte.
    alert(`Modifier la borne ${id}`);
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <ul>
        {bornes.map(borne => (
          <li key={borne.id}>
            {borne.name} ({borne.location})
            <button onClick={() => handleEditBorne(borne.id)}>Modifier</button>
            <button onClick={() => handleDeleteBorne(borne.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Menu;
