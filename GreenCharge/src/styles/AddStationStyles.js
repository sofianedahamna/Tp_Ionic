// src/styles/AddStationStyles.js
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  outerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',  // Couleur de fond légère pour un look propre
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#ffffff',  // Couleur de fond blanc pour le conteneur du formulaire
    borderRadius: '8px',  // Coins arrondis pour un look doux
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',  // Ombre subtile pour la profondeur
    padding: '5rem 2rem',
    width: '40%',  // Largeur du conteneur
  },
  form: {
    width: '100%',
    margin: 'auto',
  },
  textField: {
    marginBottom: '2rem',
    width: '100%',
  },
  submitButton: {
    marginTop: '1rem',
    backgroundColor: '#FF5A5F',  // Couleur de fond rouge Airbnb pour le bouton
    color: '#ffffff',  // Texte blanc sur le bouton
    '&:hover': {
      backgroundColor: '#FF2B36',  // Couleur de fond légèrement plus foncée au survol
    },
  },
});

export default useStyles;
