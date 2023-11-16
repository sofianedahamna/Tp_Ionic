<?php

namespace App\Repository;

use App\Entity\ChargingPoint;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ChargingPoint>
 *
 * @method ChargingPoint|null find($id, $lockMode = null, $lockVersion = null)
 * @method ChargingPoint|null findOneBy(array $criteria, array $orderBy = null)
 * @method ChargingPoint[]    findAll()
 * @method ChargingPoint[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ChargingPointRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ChargingPoint::class);
    }

//    /**
//     * @return ChargingPoint[] Returns an array of ChargingPoint objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('c.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?ChargingPoint
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
