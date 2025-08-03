<?php

namespace App\Repository;

use App\Entity\RoomMessage;
use App\Entity\ChatRoom;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class RoomMessageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RoomMessage::class);
    }

    public function save(RoomMessage $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(RoomMessage $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Trouve les messages d'une room ordonnés par date croissante
     */
    public function findByRoomOrderedAsc(ChatRoom $room): array
    {
        return $this->createQueryBuilder('m')
            ->leftJoin('m.user', 'u')
            ->addSelect('u')
            ->where('m.room = :room')
            ->setParameter('room', $room)
            ->orderBy('m.sentAt', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Trouve les messages d'une room avec pagination
     */
    public function findByRoomPaginated(ChatRoom $room, int $page = 1, int $limit = 50): array
    {
        $offset = ($page - 1) * $limit;

        $qb = $this->createQueryBuilder('rm')
            ->leftJoin('rm.user', 'u')
            ->leftJoin('rm.readBy', 'rb')
            ->addSelect('u', 'rb')
            ->where('rm.room = :room')
            ->setParameter('room', $room)
            ->orderBy('rm.sentAt', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($limit);

        $messages = $qb->getQuery()->getResult();

        // Compter le total
        $countQb = $this->createQueryBuilder('rm')
            ->select('COUNT(rm.id)')
            ->where('rm.room = :room')
            ->setParameter('room', $room);

        $totalItems = $countQb->getQuery()->getSingleScalarResult();
        $totalPages = ceil($totalItems / $limit);

        return [
            'items' => array_reverse($messages), // Inverser pour avoir l'ordre chronologique
            'totalItems' => $totalItems,
            'totalPages' => $totalPages,
            'currentPage' => $page,
            'itemsPerPage' => $limit,
            'hasNextPage' => $page < $totalPages,
            'hasPreviousPage' => $page > 1
        ];
    }

    /**
     * Trouve le dernier message d'une room
     */
    public function findLastMessageByRoom(ChatRoom $room): ?RoomMessage
    {
        return $this->createQueryBuilder('rm')
            ->leftJoin('rm.user', 'u')
            ->addSelect('u')
            ->where('rm.room = :room')
            ->setParameter('room', $room)
            ->orderBy('rm.sentAt', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Compte les messages non lus d'un utilisateur dans une room
     */
    public function countUnreadMessagesForUser(ChatRoom $room, User $user): int
    {
        return $this->createQueryBuilder('rm')
            ->select('COUNT(rm.id)')
            ->leftJoin('rm.readBy', 'rb', 'WITH', 'rb = :user')
            ->where('rm.room = :room')
            ->andWhere('rm.user != :user') // Exclure ses propres messages
            ->andWhere('rb IS NULL') // Messages non marqués comme lus
            ->setParameter('room', $room)
            ->setParameter('user', $user)
            ->getQuery()
            ->getSingleScalarResult();
    }
}