import React from 'react';
import { useLocation } from 'react-router-dom';
import AddressSearch from './AdresseSearch';

const CurrentPageIndicator = ({ onSearchSubmit }) => {
  // Utiliser le hook useLocation pour obtenir des informations sur l'URL actuelle
  const location = useLocation();

  // Extraire le chemin de l'objet location
  const currentPath = location.pathname;

  // Condition pour déterminer si la barre de recherche doit être affichée
  const isSearchBarVisible = () => {
    return currentPath !== "/politique_de_confidentialiter" && currentPath !== "/Apropos";
  };

  return (
    <div className='w-100'>
      {/* Condition pour afficher ou non la barre de recherche */}
      {isSearchBarVisible() && <AddressSearch  onSearchSubmit={onSearchSubmit}/>}
    </div>
  );
}

export default CurrentPageIndicator;
