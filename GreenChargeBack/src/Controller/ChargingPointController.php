<?php

namespace App\Controller;

use App\Entity\ChargingPoint;
use App\Entity\Adress;
use App\Entity\Availabilities;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class ChargingPointController extends AbstractController
{

    #[Route('/api/charging_points', name: 'add_charging_point', methods: ['POST'])]
    public function addChargingPoint(Request $request, EntityManagerInterface $entityManager): Response
    {
        // Vérifier si l'utilisateur est connecté
    $user = $this->getUser();
    if (!$user) {
        throw new AccessDeniedException('Vous devez être connecté pour créer une borne.');
    }
        $data = json_decode($request->getContent(), true);

        if (empty($data['name']) || empty($data['rate_per_hour'])) {
            return $this->json(['error' => 'Données invalides'], Response::HTTP_BAD_REQUEST);
        }

        $adress = $entityManager->getRepository(Adress::class)->find($data['adress_id_id']);
        if (!$adress) {
            return $this->json(['error' => 'Adresse non trouvée'], Response::HTTP_BAD_REQUEST);
        }

        $chargingPoint = new ChargingPoint();
        $chargingPoint->setName($data['name']);
        $chargingPoint->setStatus($data['status']);
        $chargingPoint->setRatePerHour($data['rate_per_hour']);
        $chargingPoint->setPlugType($data['plug_type']);
        $chargingPoint->setAcessinstruction($data['acessinstruction']);
        $chargingPoint->setPowerKw($data['power_kw']);
        $chargingPoint->setAdressId($adress);
        // Ajoutez le champ users_id_id si nécessaire

        // Gestion des disponibilités
        foreach ($data['availabilities'] as $availabilityData) {
            $availability = new Availabilities();
            $availability->setStartDate(new \DateTime($availabilityData['startDate']));
            $availability->setEndDate(new \DateTime($availabilityData['endDate']));
            $availability->setStartHour(new \DateTime($availabilityData['startHour']));
            $availability->setEndHour(new \DateTime($availabilityData['endHour']));
            $availability->setChargingpoint($chargingPoint);

            $entityManager->persist($availability);
        }
        $chargingPoint->setUsersId($user); // Associer l'utilisateur connecté à la borne

        $entityManager->persist($chargingPoint);
        $entityManager->flush();

        return $this->json(['id' => $chargingPoint->getId()]);
    }
}
