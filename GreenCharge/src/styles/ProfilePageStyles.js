// src/styles/ProfilePageStyles.js
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  outerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',  // Modifié pour descendre le contenu
    height: '100vh',
    padding: '5rem 2rem',  // Padding augmenté en haut pour descendre le titre
  },
  form: {
    width: '70%',  // Largeur augmentée à 70%
    margin: 'auto',
  },
  textField: {
    marginBottom: '0.5rem',  // Espacement augmenté entre les champs
    width: '100%',
  },
  submitButton: {
    marginTop: '1rem',
  },
});

export default useStyles;
