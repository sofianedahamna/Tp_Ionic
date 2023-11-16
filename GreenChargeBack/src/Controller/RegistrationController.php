<?php

namespace App\Controller;

use App\Entity\Users;
use App\Form\RegistrationFormType;
use App\Repository\UsersRepository;
use App\Security\CustomAuthAuthenticator;
use App\Security\EmailVerifier;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mime\Address;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\UserAuthenticatorInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use SymfonyCasts\Bundle\VerifyEmail\Exception\VerifyEmailExceptionInterface;
use App\Classe\Mail;
class RegistrationController extends AbstractController
{
    private EmailVerifier $emailVerifier;

    public function __construct(EmailVerifier $emailVerifier)
    {
        $this->emailVerifier = $emailVerifier;
    }

    #[Route('/register', name: 'app_register', methods: ['POST'])]
    public function register(Request $request, UserPasswordHasherInterface $userPasswordHasher, EntityManagerInterface $entityManager): Response
    {
        $userData = json_decode($request->getContent(), true);
        var_dump($userData);
        $user = new Users();
        // Assumer que $userData contient les champs nécessaires pour créer un utilisateur
        $user->setEmail($userData['email']);
        $user->setPassword(
            $userPasswordHasher->hashPassword(
                $user,
                $userData['password'] // Assumer que le mot de passe est envoyé dans ce champ
            )
        );
        // Définir d'autres propriétés de l'utilisateur si nécessaire...

        $entityManager->persist($user);
        $entityManager->flush();

        $mail = new Mail();
        $content= "Bonjour <br> Bienvenue chez grenncharge nous sommes heureux de vous compter parmie nos client";
        $mail->send($user->getEmail(),"Bienvenue sur la boutique Mey's Ongles",$content);

        //$notification="Votre inscription s'est correctement déroulée. Vous pouvez dés a present vous connecté à votre compte.";
        // Vous pouvez gérer l'envoi d'email ici si nécessaire

        return $this->json(['status' => 'user created'], Response::HTTP_CREATED);
    }
    
    #[Route('/verify/email', name: 'app_verify_email')]
    public function verifyUserEmail(Request $request, TranslatorInterface $translator, UsersRepository $usersRepository): Response
    {
        $id = $request->query->get('id');

        if (null === $id) {
            return $this->redirectToRoute('app_register');
        }

        $user = $usersRepository->find($id);

        if (null === $user) {
            return $this->redirectToRoute('app_register');
        }

        // validate email confirmation link, sets User::isVerified=true and persists
        try {
            $this->emailVerifier->handleEmailConfirmation($request, $user);
        } catch (VerifyEmailExceptionInterface $exception) {
            $this->addFlash('verify_email_error', $translator->trans($exception->getReason(), [], 'VerifyEmailBundle'));

            return $this->redirectToRoute('app_register');
        }

        // @TODO Change the redirect on success and handle or remove the flash message in your templates
        $this->addFlash('success', 'Your email address has been verified.');

        return $this->redirectToRoute('app_register');
    }
}
