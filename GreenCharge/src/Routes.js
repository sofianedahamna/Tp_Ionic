// src/Routes.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProfilePage from './Composants/ProfilePage';
import AddStationPage from './Composants/AddStationPage';
import UserBornesList from './Composants/UserBornesList';
import LoginForm from './Composants/LoginForm';
import SignupForm from './Composants/SignupForm';
import BurgerMenu from './Composants/BurgerMenu';
import Footer from './Composants/Footer';
import Confidentialiter from './Composants/Confidentialiter';
import Apropos from './Composants/Apropos';
import ReservationForm from './Composants/ReservationForm';
import ErrorPage from './Composants/ErrorPage';
import Hearder from './Composants/Hearder';
import App from './App';
import ReservationList from "./Composants/ReservationList";
function RoutesComponent() {
  return (
    <Router>
      <Routes>
        <Route path="/reservation-list" element={<ReservationList />} />
        <Route path="/" element={<App />} />
        <Route path="/reserve" element={<><App /><ReservationForm /></>} />
        <Route path="/erreur" element={<><Hearder/><ErrorPage /><Footer/></>} />
        <Route path="/politique_de_confidentialiter" element={<><Hearder/><Confidentialiter /><Footer/></>} />
        <Route path="/Apropos" element={<><Hearder/><Apropos /><Footer/></>} />
        <Route path="/" element={<><BurgerMenu /></>} />
        <Route path="/profile" element={<><BurgerMenu /><ProfilePage /></>} />
        <Route path="/add-station" element={<><BurgerMenu /><AddStationPage /></>} />
        <Route path="/user-bornes/:userId" element={<><BurgerMenu /><UserBornesList /></>} />
        <Route path="/login" element={<><BurgerMenu /><LoginForm /></>} />
        <Route path="/signup" element={<><BurgerMenu /><SignupForm /></>} />
      </Routes>
    </Router>
  );
}

export default RoutesComponent;
