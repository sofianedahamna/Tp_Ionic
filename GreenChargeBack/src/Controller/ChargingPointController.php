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
use Symfony\Component\Serializer\SerializerInterface;
use App\Repository\ChargingPointRepository;

class ChargingPointController extends AbstractController
{

    #[Route('/api/charging_points', name: 'add_charging_point', methods: ['POST'])]
    public function addChargingPoint(Request $request, EntityManagerInterface $entityManager, SerializerInterface $serializer): Response
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
        $power_kw = $data['power_kw'];
        intval($power_kw);

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

        $chargingPointJson = $serializer->serialize($chargingPoint, 'json', ['groups' => 'chargingPoint_simple']);
        $responseData = [
            'chargingPoint' => json_decode($chargingPointJson), // Convertissez en array ou objet
            'userId' => $chargingPoint->getUserIdValue()
        ];

        return $this->json($responseData);
    }
    #[Route('/api/charging_points/{id}', name: 'delete_charging_point', methods: ['DELETE'])]
    public function deleteChargingPoint(int $id, EntityManagerInterface $entityManager): Response
{
    $chargingPoint = $entityManager->getRepository(ChargingPoint::class)->find($id);

    if (!$chargingPoint) {
        throw $this->createNotFoundException('Aucune borne trouvée pour l\'id ' . $id);
    }

    // Vérifiez si l'utilisateur connecté est autorisé à supprimer cette borne
    $user = $this->getUser();
    if (!$user || $user->getId() !== $chargingPoint->getUsersId()->getId()) {
        throw new AccessDeniedException('Vous n\'êtes pas autorisé à supprimer cette borne.');
    }

    // Gérer la suppression de l'adresse si nécessaire
    $adress = $chargingPoint->getAdressId();
    // Vérifier si l'adresse est référencée par d'autres bornes
    $otherChargingPoints = $entityManager->getRepository(ChargingPoint::class)->findBy(['AdressId' => $adress->getId()]);
    if ($adress && count($otherChargingPoints) <= 1) { // Compte uniquement la borne actuelle
        $entityManager->remove($adress);
    }

    $entityManager->remove($chargingPoint);
    $entityManager->flush();

    return $this->json(['message' => 'Borne supprimée avec succès'], Response::HTTP_OK);
}

    #[Route('/api/charging_points/{id}', name: 'update_charging_point', methods: ['PUT'])]
    public function updateChargingPoint(int $id, Request $request, EntityManagerInterface $entityManager, SerializerInterface $serializer): Response
    {
        $chargingPoint = $entityManager->getRepository(ChargingPoint::class)->find($id);

        if (!$chargingPoint) {
            throw $this->createNotFoundException('Aucune borne trouvée pour l\'id ' . $id);
        }

        $user = $this->getUser();
        if (!$user || $user->getId() !== $chargingPoint->getUsersId()) {
            throw new AccessDeniedException('Vous n\'êtes pas autorisé à modifier cette borne.');
        }

        $data = json_decode($request->getContent(), true);

        // Mise à jour des propriétés de la borne
        $chargingPoint->setName($data['name']);
        $chargingPoint->setStatus($data['status']);
        $chargingPoint->setRatePerHour($data['rate_per_hour']);
        $chargingPoint->setPlugType($data['plug_type']);
        $chargingPoint->setAcessinstruction($data['acessinstruction']);
        $chargingPoint->setPowerKw($data['power_kw']);

        // Mise à jour de l'adresse
        $adress = $chargingPoint->getAdressId();
        $adress->setStreetNumber($data['street_number']);
        $adress->setStreet($data['street']);
        $adress->setCity($data['city']);
        $adress->setState($data['state']);
        $adress->setPostCode($data['post_code']);
        $adress->setCountry($data['country']);
        $adress->setTitle($data['title']);

        foreach ($chargingPoint->getAvailabilities() as $availability) {
            $entityManager->remove($availability);
        }

        // Ajout des nouvelles disponibilités
        if (isset($data['availabilities']) && is_array($data['availabilities'])) {
            foreach ($data['availabilities'] as $availabilityData) {
                $availability = new Availabilities();
                $availability->setStartDate(new \DateTime($availabilityData['startDate']));
                $availability->setEndDate(new \DateTime($availabilityData['endDate']));
                $availability->setStartHour(new \DateTime($availabilityData['startHour']));
                $availability->setEndHour(new \DateTime($availabilityData['endHour']));
                $availability->setChargingPoint($chargingPoint);
                $entityManager->persist($availability);
            }
        }

        $entityManager->flush();

        $chargingPointJson = $serializer->serialize($chargingPoint, 'json', ['groups' => 'chargingPoint_simple']);
        return new Response($chargingPointJson, Response::HTTP_OK, ['Content-Type' => 'application/json']);
    }
}
