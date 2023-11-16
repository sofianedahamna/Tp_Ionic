import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import JsonServer from '../services/jsonServer';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Hearder from '../Composants/Hearder';
import { Link } from 'react-router-dom';
import ReservationForm from './ReservationForm';


function ChargeMap() {
    const [showReservationForm, setShowReservationForm] = useState(false);
    const [chargePoints, setChargePoints] = useState([]);
    const [error, setError] = useState(null);
    const [userPosition, setUserPosition] = useState({ lat: 48.8566, lng: 2.3522 });
    const [selectedPoint, setSelectedPoint] = useState(null);

    function FlyToUserLocation({ position }) {
        const map = useMap();

        useEffect(() => {
            map.flyTo([position.lat, position.lng], 13);
        }, [position, map]);

        return null;
    }
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            position => setUserPosition({ lat: position.coords.latitude, lng: position.coords.longitude }),
            error => setError('Unable to retrieve your location')
        );
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Charger les bornes depuis OpenChargeMap
                const OCM_API = `https://api.openchargemap.io/v3/poi/?latitude=${userPosition.lat}&longitude=${userPosition.lng}&maxresults=50&compact=true&verbose=false&key=4cfe3b32-7376-4409-baa3-403add68ca30`;

                const response = await fetch(OCM_API);
                const ocmData = await response.json();

                // Ajouter un préfixe aux clés provenant d'OpenChargeMap
                const ocmPoints = ocmData.map(point => ({ ...point, ID: `ocm_${point.ID}` }));
                setChargePoints(ocmPoints);

                // Charger les bornes depuis le serveur local
                const borneData = await JsonServer.loadBorne();
                //console.log(`bornedData`, borneData);
                if (borneData) {
                 
                    // Ajouter un préfixe aux clés provenant du serveur local
                    const localPoints = borneData.map(point => ({ ...point, ID: `local_${point.ID}` }));
                    //console.log("localpoint",localPoints);
                    // Filtrer les bornes pour exclure celles qui sont déjà dans la liste
                    const uniqueBorneData = localPoints.filter(
                        localBorne => !chargePoints.some(point => point.ID === localBorne.ID)
                    );
                    //console.log("uniquebornedata",uniqueBorneData);

                    // Ajouter les bornes du serveur local à la liste des points de charge
                    setChargePoints(prevPoints => [...prevPoints, ...uniqueBorneData]);
                }
            } catch (error) {
                console.error("Erreur dans fetchData :", error);
                setError(error.toString());
            }
        };

        fetchData();
    }, [userPosition]);

    const handleNavigate = (lat, lng) => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    };

    const handleReservation = (point) => {
        setSelectedPoint(point);
        setShowReservationForm(true);
    };
    

    const customIcon = new L.Icon({

        iconUrl: "https://img.icons8.com/external-those-icons-flat-those-icons/24/external-Gas-Station-nature-and-ecology-those-icons-flat-those-icons.png"
    });

    // Fonction de rappel pour gérer la recherche d'adresse
    const handleSearchSubmit = async (address) => {
        try {

            const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${address}`);
            const addrrep = await response.json();
            const firstResult = addrrep.features[0];
            const newLat = firstResult.geometry.coordinates[1];
            const newLng = firstResult.geometry.coordinates[0];
            const OCM_API = `https://api.openchargemap.io/v3/poi/?latitude=${newLat}&longitude=${newLng}&maxresults=50&compact=true&verbose=false&key=4cfe3b32-7376-4409-baa3-403add68ca30`;
            const responseOcm = await fetch(OCM_API);
            const ocmData = await responseOcm.json();
            const ocmPoints = ocmData.map(point => ({ ...point, ID: `ocm_${point.ID}` }));
            setChargePoints(ocmPoints);
            console.log(`Adresse soumise:`, OCM_API);
        } catch (error) {
            console.error("Erreur dans handleSearchSubmit :", error);
            setError(error.toString());
        }
    };

    return (
        <div>
            <Hearder onSearchSubmit={handleSearchSubmit} />
            <div className='container '>
                <MapContainer
                    center={[userPosition.lat, userPosition.lng]}
                    zoom={13}
                    style={{ height: '600px', width: '100%', borderRadius: '15px', zIndex: 0, marginBottom: '20%' }}
                >
                    <FlyToUserLocation position={userPosition} />
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
    {chargePoints.map(point => {
    let latitude,
     longitude,
     title,
     isPrivate = false,
     acessInstruction,
     power,
     plugType,
     rate,
     startDate,
     status,
     endDate,
     beginHour,
     endHour
     ;

    // Vérifiez si les données proviennent d'OpenChargeMap ou du serveur local
    if (point.AddressInfo) {
        // Format OpenChargeMap
        latitude = point.AddressInfo.Latitude;
        longitude = point.AddressInfo.Longitude;
        title = point.AddressInfo.Title;
        // OpenChargeMap points are not private
    } else {
        // Format données locales Symfony
        latitude = point.latitude;
        longitude = point.longitude;
        title = point.name;
        acessInstruction = point.acessInstruction;
        power = point.powerKw;
        plugType = point.plugType;
        rate = point.ratePerHour;
        startDate = point.startDate;
        endDate = point.endDate;
        status = point.status;
        beginHour = point.startHour;
        endHour = point.endHour;
        isPrivate = true;
    }

    // Assurez-vous que les coordonnées sont définies
    if (latitude !== undefined && longitude !== undefined) {
        return (
            <Marker
                key={point.ID}
                icon={customIcon}
                position={[latitude, longitude]}
                onClick={() => setSelectedPoint(point)}
            >
                <Popup
                    position={[latitude, longitude]}
                    onClose={() => setSelectedPoint(null)}
                >
                    <div>
                        <h3>{title}</h3>
                        <p>Instruction d'accée : {acessInstruction}</p>
                        <p>Type de prise : {plugType}</p>
                        <p>Puissance : {power}KW</p>
                        <p>Prix par heure:{rate}</p>
                        <p>Date de disponibiliter : {startDate}</p>
                        <p>Fin de disponibiliter : {endDate}</p>
                        <p>Statut : {status}</p>
                        <p>Horaires : de {beginHour} a {endHour}</p>
                        {point.Connections && point.Connections[0] && (
                            <p>{`Power: ${point.Connections[0].PowerKW} kW`}</p>
                        )}
                        {isPrivate ? (
                            <button
                                className='btn btn-primary'
                                onClick={() => {
                                    console.log("Reservation button clicked:", point);
                                    handleReservation(point);
                                }}>
                                Réserver
                            </button>
                        ) : (
                            <button
                                className='btn btn-primary'
                                onClick={() => {
                                    console.log("Navigate button clicked:", point);
                                    handleNavigate(latitude, longitude);
                                }}
                            >
                                Navigate
                            </button>
                        )}
                    </div>
                </Popup>
            </Marker>
        );
    }
    return null;
})}

                </MapContainer>

            </div>
            {showReservationForm && (
            <ReservationForm
                selectedBorne={selectedPoint}
                onReserve={(newReservation) => {
                    // Gérer la nouvelle réservation
                    setShowReservationForm(false);
                }}
                onCancel={() => {
                    setShowReservationForm(false);
                }}
            />
        )}

        </div>
    );
};

const Accueil = () => {
    return <ChargeMap />;
}

export default Accueil;
