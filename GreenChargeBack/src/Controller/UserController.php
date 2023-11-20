<?php

namespace App\Controller;

use App\Entity\ChargingPoint;
use App\Repository\ChargingPointRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Serializer\SerializerInterface;

class UserController extends AbstractController
{
    #[Route('/api/user_id', name: 'get_user_id', methods: ['GET'])]
    public function getUserId(): Response {
        $user = $this->getUser();

        if (!$user) {
            throw new AccessDeniedException('Utilisateur non connecté');
        }

        return $this->json(['userId' => $user->getId()]);
    }

    #[Route('/api/user/{userId}/charging_points', name: 'user_charging_points', methods: ['GET'])]
    public function getUserChargingPoints(int $userId, ChargingPointRepository $chargingPointRepository, SerializerInterface $serializer): Response {
        // Assurez-vous que l'utilisateur est authentifié et autorisé à voir ces informations.
        $this->denyAccessUnlessGranted('ROLE_USER');

        // Vérifiez si l'utilisateur actuellement connecté correspond à l'userId demandé
        $currentUser = $this->getUser();
        if ($currentUser->getId() !== $userId) {
            throw new AccessDeniedException('Accès refusé à ces informations');
        }

        $chargingPoints = $chargingPointRepository->findBy(['UsersId' => $userId]);
        $jsonContent = $serializer->serialize($chargingPoints, 'json', ['groups' => 'chargingPoint_simple']);

        return new Response($jsonContent, Response::HTTP_OK, ['Content-Type' => 'application/json']);
    }

    // D'autres méthodes liées aux utilisateurs peuvent être ajoutées ici
}
