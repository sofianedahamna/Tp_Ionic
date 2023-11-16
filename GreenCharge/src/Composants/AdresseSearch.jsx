import React, { useState, useEffect } from 'react';
import Autosuggest from 'react-autosuggest';

const AddressSearch = ({ onSearchSubmit, onLocationUpdate }) => {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Fonction pour récupérer les adresses depuis l'API
  const fetchAddresses = async (inputValue) => {
    const apiUrl = `https://wxs.ign.fr/essentiels/geoportail/geocodage/rest/0.1/completion?text=${inputValue}`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching addresses:', error);
      return [];
    }
  };

  // Fonction pour obtenir les suggestions d'adresses
  const getSuggestions = async (inputValue) => {
    const addresses = await fetchAddresses(inputValue);
    const limitedSuggestions = addresses.slice(0, 3).map(address => address.fulltext); 
    return limitedSuggestions;
  };

  // Fonction appelée lorsque l'utilisateur sélectionne une suggestion
  const onSuggestionSelected = async (_, { suggestion }) => {
    // Faites quelque chose avec l'adresse sélectionnée
    onSearchSubmit(suggestion);

    try {
      // Supposons que vous ayez une variable d'état `address` dans votre composant
      // que vous mettez à jour avec la valeur du champ de recherche.
      const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${suggestion}`);
      const addrrep = await response.json();

    

      console.log(`Adresse soumise:`, addrrep);
    } catch (error) {
      console.error("Erreur dans handleSearchSubmit :", error);
    }
  };

  // Fonction appelée lorsqu'une suggestion est demandée
  const onSuggestionsFetchRequested = async ({ value }) => {
    const suggestions = await getSuggestions(value);
    setSuggestions(suggestions);
  };

  // Fonction appelée lorsqu'une suggestion est effacée
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  return (
    <div className='popo' style={{ position: 'relative', width: '100%' }}>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={suggestion => suggestion}
        renderSuggestion={suggestion => <div>{suggestions.length > 0 && (
          <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', background: '#fff', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', zIndex: 1 }}>
            {suggestions.map((suggestion, index) => (
              <div key={index} onClick={() => onSuggestionSelected(null, { suggestion })}>
                {suggestion}
              </div>
            ))}
          </div>
        )}</div>}
        onSuggestionSelected={onSuggestionSelected}
        inputProps={{
          placeholder: 'Rechercher une adresse...',
          value,
          onChange: (_, { newValue }) => setValue(newValue),
          className: 'form-control mr-sm-2 rounded-2 w-100',
        }}
      />
    </div>
    
  );
};

export default AddressSearch;
