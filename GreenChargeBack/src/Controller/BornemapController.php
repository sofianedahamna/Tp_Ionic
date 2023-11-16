<?php

namespace App\Controller;

use App\Repository\ChargingPointRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
 use Symfony\Component\Serializer\SerializerInterface;
 use App\DTO\BorneDto;
class BornemapController extends AbstractController
{
    #[Route('/bornemap', name: 'app_bornemap')]
    public function index(): Response
    {
        return $this->render('bornemap/index.html.twig', [
            'controller_name' => 'BornemapController',
        ]);
    }

   

    #[Route('/bornemap', name: 'app_bornemap')]
    public function getBorne(ChargingPointRepository $chargingPointRepository, SerializerInterface $serializer): JsonResponse {
        $borneList = $chargingPointRepository->findAll();

        $dtoCollection = [];
        foreach ($borneList as $borne) {
            $dto = BorneDto::createFromChargingPoint($borne);
            $dtoCollection[] = $dto;
        }

        // Utilisez le Serializer pour convertir les DTO en JSON
        $jsonContent = $serializer->serialize($dtoCollection, 'json');

        return new JsonResponse($jsonContent, Response::HTTP_OK, [], true);
    }
}

