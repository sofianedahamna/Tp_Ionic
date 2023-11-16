// eslint-disable-next-line
import React, { useState, useEffect } from 'react';
import { parse } from 'date-fns';
import { Modal, Button } from 'react-bootstrap';


function ReservationList() {
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('http://localhost:3001/reservation')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Pas de réponse');
        }
        return response.json();
      })
      .then((data) => {
        setReservations(data || []);
      })
      .catch((error) => {
        console.error('Erreur de fetch :', error);
      });
  }, []);

  const isReservationInPast = (reservation) => {
    const reservationDate = parse(reservation.beginDate, 'dd/MM/yyyy', new Date());
    const currentDate = new Date();
    return reservationDate < currentDate;
  };

  const isReservationInFuture = (reservation) => {
    const reservationDate = parse(reservation.beginDate, 'dd/MM/yyyy', new Date());
    const currentDate = new Date();
    return reservationDate >= currentDate;
  };

  const handleConsultClick = (reservation) => {
    setSelectedReservation(reservation);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReservation(null);
  };

  const handleNavigationClick = () => {
    const fullAddress = `${selectedReservation?.adress.street}, ${selectedReservation?.adress.postCode}, ${selectedReservation?.adress.city}`;
    const origin = 'Latitude,Longitude';
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${fullAddress}`;
    window.open(googleMapsUrl, '_blank');
  };

  const handleAnnulerReservation = (reservationId) => {
    fetch(`http://localhost:3001/reservation/${reservationId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          setReservations((prevReservations) =>
            prevReservations.filter((reservation) => reservation.id !== reservationId)
          );
          handleCloseModal();
        } else {
          throw new Error('La suppression a échoué');
        }
      })
      .catch((error) => {
        console.error('Erreur lors de la suppression de la réservation :', error);
      });
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="text-center">Liste des Réservations</h2>
          <div className="text-center mb-3">
            <button
              type="button"
              className={`btn btn-primary mx-2 ${filter === 'all' ? 'active' : ''}`}
              onClick={() => {
                setFilter('all');
                handleCloseModal();
              }}
            >
              Toutes les Réservations
            </button>
            <button
              type="button"
              className={`btn btn-primary mx-2 ${filter === 'passées' ? 'active' : ''}`}
              onClick={() => {
                setFilter('passées');
                handleCloseModal();
              }}
            >
              Réservations Passées
            </button>
            <button
              type="button"
              className={`btn btn-primary mx-2 ${filter === 'à venir' ? 'active' : ''}`}
              onClick={() => {
                setFilter('à venir');
                handleCloseModal();
              }}
            >
              Réservations à Venir
            </button>
          </div>
          <ul className="list-group">
            {reservations
              .filter((reservation) => {
                if (filter === 'passées') {
                  return isReservationInPast(reservation);
                } else if (filter === 'à venir') {
                  return isReservationInFuture(reservation);
                }
                return true;
              })
              .map((reservation) => (
                <li key={reservation.id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Réservation n°: {reservation.id}</span>
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={() => handleConsultClick(reservation)}
                    >
                      Consulter
                    </button>

                    {filter === 'à venir' && (
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleAnnulerReservation(reservation.id)}
                      >
                        Annuler
                      </button>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Détails de la réservation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Réservation n° : {selectedReservation?.id}</strong></p>
          <p><strong>Début de charge le :</strong> {selectedReservation?.beginDate} à {selectedReservation?.beginHour} </p>
          <p><strong>Fin de charge le :</strong> {selectedReservation?.endDate} à {selectedReservation?.endHour}</p>
          <p><strong>Borne :</strong> {selectedReservation?.chargingpoint.name}</p>
          <p><strong>Adresse :</strong> {selectedReservation?.adress.street}</p>
          <p><strong>Code postale :</strong> {selectedReservation?.adress.postCode}</p>
          <p><strong>Ville : </strong>{selectedReservation?.adress.city}</p>
        </Modal.Body>
        <Modal.Footer>
          {filter === 'à venir' && (
            <Button variant="secondary" onClick={handleNavigationClick}>
              Naviguer vers la borne
            </Button>
          )}
          <Button variant="primary" onClick={handleCloseModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ReservationList;