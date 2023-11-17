import React, { useState, useEffect } from 'react';
import { UserContext } from './UserContext';
import Accueil from "./Composants/Accueil";
import Footer from './Composants/Footer';
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch('https://localhost:8000'); // Remplacez par l'URL de votre API
        if (response.ok) {
          const data = await response.json();
          setUserId(data.userId); // Assurez-vous que l'API renvoie un champ userId
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'ID de l\'utilisateur:', error);
      }
    };

    fetchUserId();
  }, []);

  return (
    <UserContext.Provider value={userId}>
      <div>
        <Accueil/>
        <Footer/>
      </div>
    </UserContext.Provider>
  );
}

export default App;
