<?php

namespace App\Repository;

use App\Entity\ChatRoom;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ChatRoomRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ChatRoom::class);
    }

    public function save(ChatRoom $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(ChatRoom $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Trouve toutes les rooms d'un utilisateur
     */
    public function findRoomsForUser(User $user): array
    {
        return $this->createQueryBuilder('cr')
            ->innerJoin('cr.participants', 'p')
            ->leftJoin('cr.messages', 'm')
            ->addSelect('p', 'm')
            ->where('p.user = :user')
            ->setParameter('user', $user)
            ->orderBy('cr.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Trouve une room DM entre deux utilisateurs
     */
    public function findDMBetweenUsers(User $user1, User $user2): ?ChatRoom
    {
        return $this->createQueryBuilder('cr')
            ->innerJoin('cr.participants', 'p1')
            ->innerJoin('cr.participants', 'p2')
            ->where('cr.type = :dm_type')
            ->andWhere('p1.user = :user1')
            ->andWhere('p2.user = :user2')
            ->andWhere('p1.user != p2.user')
            ->setParameter('dm_type', 'DM')
            ->setParameter('user1', $user1)
            ->setParameter('user2', $user2)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Vérifie si un utilisateur est participant d'une room
     */
    public function isUserParticipant(ChatRoom $room, User $user): bool
    {
        $count = $this->createQueryBuilder('cr')
            ->innerJoin('cr.participants', 'p')
            ->select('COUNT(p.user)')
            ->where('cr = :room')
            ->andWhere('p.user = :user')
            ->setParameter('room', $room)
            ->setParameter('user', $user)
            ->getQuery()
            ->getSingleScalarResult();

        return $count > 0;
    }
}