<?php

namespace App\Controller;

use App\Entity\Adress;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AdressController extends AbstractController
{
    #[Route('/api/addresses', name: 'add_adress', methods: ['POST'])]
    public function addAdress(Request $request, EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);

        $adress = new Adress();
        $adress->setStreetNumber($data['street_number']);
        $adress->setStreet($data['street']);
        $adress->setCity($data['city']);
        $adress->setState($data['state']);
        $adress->setPostCode($data['post_code']);
        $adress->setCountry($data['country']);
        // Si vous gérez latitude et longitude, ajoutez-les ici
        // $adress->setLatitude($data['latitude']);
        // $adress->setLongitude($data['longitude']);

        $entityManager->persist($adress);
        $entityManager->flush();

        return $this->json(['id' => $adress->getId()]);
    }
}
