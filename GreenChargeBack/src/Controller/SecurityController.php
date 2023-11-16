<?php
 /*
namespace App\Controller;
 
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
 
class SecurityController extends AbstractController
{
    #[Route('/api/login', name: 'app_login', methods: ['POST'])]
    public function login(Request $request): Response
    {
    $content = $request->getContent();
    error_log('Login request content: ' . $content);
        // La logique d'authentification est gérée par Symfony.
        // Vous pouvez ajouter une logique personnalisée ici si nécessaire.
 
        // Si l'authentification échoue, Symfony enverra automatiquement une réponse d'erreur.
        // Si l'authentification réussit, vous pouvez envoyer une réponse personnalisée.
        return $this->json(['message' => 'Login successful']);
    }
 
    #[Route('/api/logout', name: 'app_logout', methods: ['GET'])]
    public function logout()
    {
        // Le contrôleur peut être vide, car Symfony gérera la déconnexion.
    }
}
*/