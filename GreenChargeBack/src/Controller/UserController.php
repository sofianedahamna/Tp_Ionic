<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

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

    // D'autres méthodes liées aux utilisateurs peuvent être ajoutées ici
}
