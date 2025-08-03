<?php

namespace App\Repository;

use App\Entity\RoomParticipant;
use App\Entity\ChatRoom;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class RoomParticipantRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RoomParticipant::class);
    }

    public function save(RoomParticipant $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(RoomParticipant $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Trouve tous les participants d'une room
     */
    public function findByRoom(ChatRoom $room): array
    {
        return $this->createQueryBuilder('rp')
            ->leftJoin('rp.user', 'u')
            ->addSelect('u')
            ->where('rp.room = :room')
            ->setParameter('room', $room)
            ->orderBy('rp.joinedAt', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Trouve un participant spécifique dans une room
     */
    public function findByRoomAndUser(ChatRoom $room, User $user): ?RoomParticipant
    {
        return $this->createQueryBuilder('rp')
            ->where('rp.room = :room')
            ->andWhere('rp.user = :user')
            ->setParameter('room', $room)
            ->setParameter('user', $user)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Vérifie si un utilisateur est participant d'une room
     */
    public function isUserParticipant(ChatRoom $room, User $user): bool
    {
        $count = $this->createQueryBuilder('rp')
            ->select('COUNT(rp.user)')
            ->where('rp.room = :room')
            ->andWhere('rp.user = :user')
            ->setParameter('room', $room)
            ->setParameter('user', $user)
            ->getQuery()
            ->getSingleScalarResult();

        return $count > 0;
    }

    /**
     * Compte le nombre de participants dans une room
     */
    public function countByRoom(ChatRoom $room): int
    {
        return $this->createQueryBuilder('rp')
            ->select('COUNT(rp.user)')
            ->where('rp.room = :room')
            ->setParameter('room', $room)
            ->getQuery()
            ->getSingleScalarResult();
    }
}