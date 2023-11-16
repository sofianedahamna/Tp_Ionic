<?php

namespace App\DTO;

use App\Entity\ChargingPoint;

class  BorneDto
{
    public function  __construct(
        public string $name,
        public string $status,
        public string $ratePerHour,
        public string $plugType,
        public string $acessInstruction,
        public float $powerKw,
        public string $streetNumber,
        public string $street,
        public string $city,
        public string $postCode,
        public string $country,
        public float $latitude,
        public float $longitude,
        public string $startDate,
        public string $endDate,
        public string $startHour,
        public string $endHour,
    ) {
    }

    public static function createFromChargingPoint(ChargingPoint $chargingPoint): self
    {


        //extraction de données de l'entité Adress
        $adress = $chargingPoint->getAdressId();
        $streetNumber = $adress ? $adress->getStreetNumber() : null;
        $street = $adress ? $adress->getStreet() : null;
        $city = $adress ? $adress->getCity() : null;
        $postCode = $adress ? $adress->getPostcode() : null;
        $country = $adress ? $adress->getCountry() : null;
        $latitude = $adress ? $adress->getLatitude() : null;
        $longitude = $adress ? $adress->getLongitude() : null;

        //extraction de données des disponibilités (Availabilities)
        $availabilities = $chargingPoint->getAvailabilities();
        $availability = $availabilities->first();
        $startDate = $availability ? $availability->getStartDate() : null;
        $endDate = $availability ? $availability->getEndDate() : null;
        $startHour = $availability ? $availability->getStartHour() : null;
        $endHour = $availability ? $availability->getEndHour() : null;

        // Formatage des dates et heure
        $formattedStartDate = $startDate ? $startDate->format("d/m/Y") : null;
        $formattedEndDate = $endDate ? $endDate->format("d/m/Y") : null;
        $formattedStartHour = $startHour ? $startHour->format("H:i:s") : null;
        $formattedEndHour = $endHour ? $endHour->format("H:i:s") : null;

        return new self(
            $chargingPoint->getName(),
            $chargingPoint->getStatus(),
            $chargingPoint->getRatePerHour(),
            $chargingPoint->getPlugType(),
            $chargingPoint->getAcessinstruction(),
            $chargingPoint->getPowerKw(),
            $streetNumber,
            $street,
            $city,
            $postCode,
            $country,
            $latitude,
            $longitude,
            $formattedStartDate,
            $formattedEndDate,
            $formattedStartHour,
            $formattedEndHour
        );
    }
}
