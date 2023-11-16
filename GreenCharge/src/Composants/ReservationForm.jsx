import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router-dom';

function ReservationForm({ onReserve, onCancel, selectedBorne }) {
  const [reservationData, setReservationData] = useState({
    id: selectedBorne ? selectedBorne.id : '',
    reservations: [
      {
        beginDate: null,
        beginHour: '09:00',
        endDate: null,
        endHour: '09:00',
      },
    ],
    Borne: selectedBorne ? selectedBorne.nom : '',
    Adresse: selectedBorne ? selectedBorne.adresse : '',
    CP: selectedBorne ? selectedBorne.code_postal : '',
    Ville: selectedBorne ? selectedBorne.ville : '',
  });

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedReservations = [...reservationData.reservations];
    updatedReservations[index] = {
      ...updatedReservations[index],
      [name]: value,
    };
    setReservationData((prevData) => ({
      ...prevData,
      reservations: updatedReservations,
    }));
  };

  const handleDateChange = (date, name, index) => {
    const updatedReservations = [...reservationData.reservations];
    updatedReservations[index] = {
      ...updatedReservations[index],
      [name]: date,
    };
    setReservationData((prevData) => ({
      ...prevData,
      reservations: updatedReservations,
    }));
  };

  const generateTimeOptions = () => {
    const timeOptions = [];
    for (let hours = 0; hours < 24; hours++) {
      for (let minutes = 0; minutes < 60; minutes += 5) {
        const formattedHour = String(hours).padStart(2, '0');
        const formattedMinute = String(minutes).padStart(2, '0');
        timeOptions.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return timeOptions.map((time) => (
      <option key={time} value={time}>
        {time}
      </option>
    ));
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = () => {
    const formattedStartDate = formatDate(reservationData.reservations[0].beginDate);
    const formattedEndDate = formatDate(reservationData.reservations[0].endDate);

    const formattedData = {
      id: selectedBorne ? selectedBorne.id : '',
      beginDate: formattedStartDate,
      beginHour: reservationData.reservations[0].beginHour,
      endDate: formattedEndDate,
      endHour: reservationData.reservations[0].endHour,
      Borne: reservationData.Borne,
      Adresse: reservationData.Adresse,
      CP: reservationData.CP,
      Ville: reservationData.Ville,
    };

    fetch('http://localhost:3001/reservation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    })
      .then((response) => response.json())
      .then((newReservation) => {
        onReserve(newReservation);
        setReservationData({
          id: selectedBorne ? selectedBorne.id : '',
          reservations: [
            {
              beginDate: null,
              beginHour: '09:00',
              endDate: null,
              endHour: '09:00',
            },
          ],
          Borne: selectedBorne ? selectedBorne.nom : '',
          Adresse: selectedBorne ? selectedBorne.adresse : '',
          CP: selectedBorne ? selectedBorne.code_postal : '',
          Ville: selectedBorne ? selectedBorne.ville : '',
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleCloseModal = () => {
    if (typeof onCancel === 'function') {
      onCancel();
    } else {
      console.error('onCancel is not a function');
    }
    window.location.href = '/';
  };

  return (
    <Modal show={true} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Réserver une Borne</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Informations de la borne sélectionnée */}
          <Form.Group controlId="Borne">
            <Form.Label>Borne</Form.Label>
            <Form.Control
              type="text"
              name="Borne"
              value={reservationData.Borne}
              onChange={(e) => handleInputChange(e, 0)}
            />
          </Form.Group>
          <Form.Group controlId="Adresse">
            <Form.Label>Adresse</Form.Label>
            <Form.Control
              type="text"
              name="Adresse"
              value={reservationData.Adresse}
              onChange={(e) => handleInputChange(e, 0)}
            />
          </Form.Group>
          <Form.Group controlId="CP">
            <Form.Label>Code Postal</Form.Label>
            <Form.Control
              type="text"
              name="CP"
              value={reservationData.CP}
              onChange={(e) => handleInputChange(e, 0)}
            />
          </Form.Group>
          <Form.Group controlId="Ville">
            <Form.Label>Ville</Form.Label>
            <Form.Control
              type="text"
              name="Ville"
              value={reservationData.Ville}
              onChange={(e) => handleInputChange(e, 0)}
            />
          </Form.Group>
          {/* Champs de date et d'heure de début et de fin alignés horizontalement */}
          {reservationData.reservations.map((reservation, index) => (
            <div key={index} className="row">
              <div className="col">
                <Form.Group controlId={`beginDate-${index}`}>
                  <Form.Label>Début de charge</Form.Label>
                  <DatePicker
                    selected={reservation.beginDate}
                    onChange={(date) => handleDateChange(date, 'beginDate', index)}
                    dateFormat="dd/MM/yyyy"
                  />
                </Form.Group>
              </div>
              <div className="col">
                <Form.Group controlId={`beginHour-${index}`}>
                  <Form.Label>Heure de début</Form.Label>
                  <Form.Control
                    as="select"
                    name="beginHour"
                    value={reservation.beginHour}
                    onChange={(e) => handleInputChange(e, index)}
                  >
                    {generateTimeOptions()}
                  </Form.Control>
                </Form.Group>
              </div>
              <div className="col">
                <Form.Group controlId={`endDate-${index}`}>
                  <Form.Label>Date de fin</Form.Label>
                  <DatePicker
                    selected={reservation.endDate}
                    onChange={(date) => handleDateChange(date, 'endDate', index)}
                    dateFormat="dd/MM/yyyy"
                  />
                </Form.Group>
              </div>
              <div className="col">
                <Form.Group controlId={`endHour-${index}`}>
                  <Form.Label>Heure de fin</Form.Label>
                  <Form.Control
                    as="select"
                    name="endHour"
                    value={reservation.endHour}
                    onChange={(e) => handleInputChange(e, index)}
                  >
                    {generateTimeOptions()}
                  </Form.Control>
                </Form.Group>
              </div>
            </div>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleCloseModal}>
          Fermer
        </Button>
        <Link to="/">
          <Button variant="primary" onClick={handleSubmit}>
            Réserver
          </Button>
        </Link>
      </Modal.Footer>
    </Modal>
  );
}

export default ReservationForm;