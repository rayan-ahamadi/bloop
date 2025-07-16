<?php

namespace App\Repository;

use App\Entity\Post;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Post>
 *
 * @method Post|null find($id, $lockMode = null, $lockVersion = null)
 * @method Post|null findOneBy(array $criteria, array $orderBy = null)
 * @method Post[]    findAll()
 * @method Post[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PostRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Post::class);
    }

    public function save(Post $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Post $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Trouve les posts paginés avec filtres
     */
    public function findPaginated(int $page = 1, int $limit = 10, array $filters = []): array
    {
        $qb = $this->createQueryBuilder('p')
            ->leftJoin('p.user', 'u')
            ->addSelect('u')
            ->where('p.deletedAt IS NULL')
            ->andWhere('p.status = :status')
            ->setParameter('status', 'active');

        // Filtres
        if (!empty($filters['user_id'])) {
            $qb->andWhere('p.user = :user_id')
               ->setParameter('user_id', $filters['user_id']);
        }

        if (!empty($filters['type'])) {
            $qb->andWhere('p.type = :type')
               ->setParameter('type', $filters['type']);
        }

        if (!empty($filters['language'])) {
            $qb->andWhere('p.language = :language')
               ->setParameter('language', $filters['language']);
        }

        if (!empty($filters['search'])) {
            $qb->andWhere('p.content LIKE :search')
               ->setParameter('search', '%' . $filters['search'] . '%');
        }

        // Tri par date de création décroissante
        $qb->orderBy('p.createdAt', 'DESC');

        // Pagination
        $offset = ($page - 1) * $limit;
        $qb->setFirstResult($offset)
           ->setMaxResults($limit);

        $posts = $qb->getQuery()->getResult();

        // Compter le total
        $countQb = $this->createQueryBuilder('p')
            ->select('COUNT(p.id)')
            ->where('p.deletedAt IS NULL')
            ->andWhere('p.status = :status')
            ->setParameter('status', 'active');

        // Appliquer les mêmes filtres pour le comptage
        if (!empty($filters['user_id'])) {
            $countQb->andWhere('p.user = :user_id')
                    ->setParameter('user_id', $filters['user_id']);
        }

        if (!empty($filters['type'])) {
            $countQb->andWhere('p.type = :type')
                    ->setParameter('type', $filters['type']);
        }

        if (!empty($filters['language'])) {
            $countQb->andWhere('p.language = :language')
                    ->setParameter('language', $filters['language']);
        }

        if (!empty($filters['search'])) {
            $countQb->andWhere('p.content LIKE :search')
                    ->setParameter('search', '%' . $filters['search'] . '%');
        }

        $totalItems = $countQb->getQuery()->getSingleScalarResult();
        $totalPages = ceil($totalItems / $limit);

        return [
            'items' => $posts,
            'totalItems' => $totalItems,
            'totalPages' => $totalPages,
            'currentPage' => $page,
            'itemsPerPage' => $limit,
            'hasNextPage' => $page < $totalPages,
            'hasPreviousPage' => $page > 1
        ];
    }

    /**
     * Trouve les posts d'un utilisateur spécifique
     */
    public function findByUser(User $user, int $page = 1, int $limit = 10): array
    {
        return $this->findPaginated($page, $limit, ['user_id' => $user->getId()]);
    }

    /**
     * Trouve les posts originaux (pas les retweets ni les réponses)
     */
    public function findOriginalPosts(int $page = 1, int $limit = 10): array
    {
        return $this->findPaginated($page, $limit, ['type' => 'original']);
    }

    /**
     * Trouve les posts populaires (triés par engagement)
     */
    public function findPopularPosts(int $page = 1, int $limit = 10): array
    {
        $qb = $this->createQueryBuilder('p')
            ->leftJoin('p.user', 'u')
            ->addSelect('u')
            ->where('p.deletedAt IS NULL')
            ->andWhere('p.status = :status')
            ->setParameter('status', 'active')
            ->orderBy('p.engagementScore', 'DESC')
            ->addOrderBy('p.createdAt', 'DESC');

        $offset = ($page - 1) * $limit;
        $qb->setFirstResult($offset)
           ->setMaxResults($limit);

        $posts = $qb->getQuery()->getResult();

        // Compter le total
        $countQb = $this->createQueryBuilder('p')
            ->select('COUNT(p.id)')
            ->where('p.deletedAt IS NULL')
            ->andWhere('p.status = :status')
            ->setParameter('status', 'active');

        $totalItems = $countQb->getQuery()->getSingleScalarResult();
        $totalPages = ceil($totalItems / $limit);

        return [
            'items' => $posts,
            'totalItems' => $totalItems,
            'totalPages' => $totalPages,
            'currentPage' => $page,
            'itemsPerPage' => $limit,
            'hasNextPage' => $page < $totalPages,
            'hasPreviousPage' => $page > 1
        ];
    }

    /**
     * Trouve les réponses à un post spécifique
     */
    public function findRepliesToPost(Post $post, int $page = 1, int $limit = 10): array
    {
        $qb = $this->createQueryBuilder('p')
            ->leftJoin('p.user', 'u')
            ->addSelect('u')
            ->where('p.deletedAt IS NULL')
            ->andWhere('p.status = :status')
            ->andWhere('p.parentPost = :parentPost')
            ->setParameter('status', 'active')
            ->setParameter('parentPost', $post)
            ->orderBy('p.createdAt', 'ASC');

        $offset = ($page - 1) * $limit;
        $qb->setFirstResult($offset)
           ->setMaxResults($limit);

        $posts = $qb->getQuery()->getResult();

        // Compter le total
        $countQb = $this->createQueryBuilder('p')
            ->select('COUNT(p.id)')
            ->where('p.deletedAt IS NULL')
            ->andWhere('p.status = :status')
            ->andWhere('p.parentPost = :parentPost')
            ->setParameter('status', 'active')
            ->setParameter('parentPost', $post);

        $totalItems = $countQb->getQuery()->getSingleScalarResult();
        $totalPages = ceil($totalItems / $limit);

        return [
            'items' => $posts,
            'totalItems' => $totalItems,
            'totalPages' => $totalPages,
            'currentPage' => $page,
            'itemsPerPage' => $limit,
            'hasNextPage' => $page < $totalPages,
            'hasPreviousPage' => $page > 1
        ];
    }

    /**
     * Recherche de posts par contenu
     */
    public function searchPosts(string $search, int $page = 1, int $limit = 10): array
    {
        return $this->findPaginated($page, $limit, ['search' => $search]);
    }

    /**
     * Trouve les posts épinglés d'un utilisateur
     */
    public function findPinnedPostsByUser(User $user): array
    {
        return $this->createQueryBuilder('p')
            ->leftJoin('p.user', 'u')
            ->addSelect('u')
            ->where('p.deletedAt IS NULL')
            ->andWhere('p.status = :status')
            ->andWhere('p.user = :user')
            ->andWhere('p.isPinned = :isPinned')
            ->setParameter('status', 'active')
            ->setParameter('user', $user)
            ->setParameter('isPinned', true)
            ->orderBy('p.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }
} 