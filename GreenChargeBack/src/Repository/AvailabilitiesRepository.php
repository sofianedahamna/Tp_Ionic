<?php

namespace App\Repository;

use App\Entity\Availabilities;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Availabilities>
 *
 * @method Availabilities|null find($id, $lockMode = null, $lockVersion = null)
 * @method Availabilities|null findOneBy(array $criteria, array $orderBy = null)
 * @method Availabilities[]    findAll()
 * @method Availabilities[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AvailabilitiesRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Availabilities::class);
    }

//    /**
//     * @return Availabilities[] Returns an array of Availabilities objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('a.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Availabilities
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
