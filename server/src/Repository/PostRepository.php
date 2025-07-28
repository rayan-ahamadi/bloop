<?php

namespace App\Repository;

use App\Entity\Post;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\Query;

/**
 * @extends ServiceEntityRepository<Post>
 *
 * @method array find($id, $lockMode = null, $lockVersion = null, ?User $user = null)
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
     * Trouve un post par son ID, avec les données de l'utilisateur si fourni
     */
    public function findPostWithUserDetails($id, $lockMode = null, $lockVersion = null, ?User $user = null): array
    {
        $qb = $this->createQueryBuilder('p')
            ->leftJoin('p.user', 'u')
            ->addSelect('u')
            ->where('p.id = :id')
            ->andWhere('p.deletedAt IS NULL')
            ->setParameter('id', $id); 
        if ($user) {
            $qb->addSelect(
                '(CASE WHEN EXISTS (SELECT 1 FROM App\Entity\UserLikePost ulp WHERE ulp.post = p AND ulp.user_id = :user_id) THEN true ELSE false END) AS hasLiked',
                '(CASE WHEN EXISTS (SELECT 1 FROM App\Entity\UserRepost ur WHERE ur.post = p AND ur.user_id = :user_id) THEN true ELSE false END) AS hasReposted',
                '(CASE WHEN EXISTS (SELECT 1 FROM App\Entity\UserSavePost usp WHERE usp.post = p AND usp.user_id = :user_id) THEN true ELSE false END) AS hasSaved'
            )
            ->setParameter('user_id', $user->getId());
        } 


        $post = $qb->getQuery()->getOneOrNullResult(Query::HYDRATE_ARRAY);

        
        if ($post) {
            // Si on a des colonnes calculées, on restructure le résultat
            if ($user) {
                return [
                    'post' => $post[0],
                    'hasLiked' => $post['hasLiked'] ?? false,
                    'hasReposted' => $post['hasReposted'] ?? false,
                    'hasSaved' => $post['hasSaved'] ?? false
                ];
            }
            return $post;
        }
        return null; // Aucun post trouvé
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

        // Récupération de l'utilisateur
        if (!empty($filters['user'])) {
            /** @var User $user */
            $user = $filters['user'];
            $qb->addSelect(
            '(CASE WHEN EXISTS (SELECT 1 FROM App\Entity\UserLikePost ulp WHERE ulp.post = p AND ulp.user_id = :user_id) THEN true ELSE false END) AS hasLiked',
            '(CASE WHEN EXISTS (SELECT 1 FROM App\Entity\UserRepost ur WHERE ur.post = p AND ur.user_id = :user_id) THEN true ELSE false END) AS hasReposted',
            '(CASE WHEN EXISTS (SELECT 1 FROM App\Entity\UserSavePost usp WHERE usp.post = p AND usp.user_id = :user_id) THEN true ELSE false END) AS hasSaved'
            )
            ->setParameter('user_id', $user->getId());
        }

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

        // Restructurer les résultats pour intégrer les colonnes calculées
        if (isset($filters['user'])) {
            $posts = array_map(function ($post) {
                if (is_array($post)) {
                    // Si c'est un tableau (avec colonnes calculées)
                    $postData = $post[0]; // L'objet principal
                    // On ne peut pas assigner directement à un objet Post, 
                    // donc on retourne un tableau avec les données
                    $postArray = [
                        'post' => $postData,
                        'hasLiked' => $post['hasLiked'],
                        'hasReposted' => $post['hasReposted'],
                        'hasSaved' => $post['hasSaved']
                    ];
                    return $postArray;
                } else {
                    // Si c'est directement un objet Post
                    return [
                        'post' => $post,
                        'hasLiked' => false,
                        'hasReposted' => false,
                        'hasSaved' => false
                    ];
                }
            }, $posts);
        }
        

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
    public function findRepliesToPost(Post $post, int $page = 1, int $limit = 10, User $user): array
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

        if ($user) {
            $qb->addSelect(
            '(CASE WHEN EXISTS (SELECT 1 FROM App\Entity\UserLikePost ulp WHERE ulp.post = p AND ulp.user_id = :user_id) THEN true ELSE false END) AS hasLiked',
            '(CASE WHEN EXISTS (SELECT 1 FROM App\Entity\UserRepost ur WHERE ur.post = p AND ur.user_id = :user_id) THEN true ELSE false END) AS hasReposted',
            '(CASE WHEN EXISTS (SELECT 1 FROM App\Entity\UserSavePost usp WHERE usp.post = p AND usp.user_id = :user_id) THEN true ELSE false END) AS hasSaved'
            )
            ->setParameter('user_id', $user->getId());
        }

        $offset = ($page - 1) * $limit;
        $qb->setFirstResult($offset)
           ->setMaxResults($limit);

        $posts = $qb->getQuery()->getResult();

        // Restructurer les résultats pour intégrer les colonnes calculées
        if ($user) {
            $posts = array_map(function ($post) {
            if (is_array($post)) {
                $postData = $post[0];
                return [
                'post' => $postData,
                'hasLiked' => $post['hasLiked'] ?? false,
                'hasReposted' => $post['hasReposted'] ?? false,
                'hasSaved' => $post['hasSaved'] ?? false
                ];
            } else {
                return [
                'post' => $post,
                'hasLiked' => false,
                'hasReposted' => false,
                'hasSaved' => false
                ];
            }
            }, $posts);
        }

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


    public function findPreviousToPost(Post $post, User $user): array
    {
        $previousPosts = [];

        $current = $post->getParentPost(); // On part du parent immédiat

        while ($current !== null) {
            $hasLiked = $this->getEntityManager()->getRepository('App\Entity\UserLikePost')
            ->findOneBy(['post' => $current, 'user_id' => $user]) !== null;

            $hasReposted = $this->getEntityManager()->getRepository('App\Entity\UserRepost')
            ->findOneBy(['post' => $current, 'user_id' => $user]) !== null;

            $hasSaved = $this->getEntityManager()->getRepository('App\Entity\UserSavePost')
            ->findOneBy(['post' => $current, 'user_id' => $user]) !== null;

            $previousPosts[] = [
            'post' => $current,
            'hasLiked' => $hasLiked,
            'hasReposted' => $hasReposted,
            'hasSaved' => $hasSaved
            ];

            $current = $current->getParentPost();
        }

        // On inverse pour avoir l’ordre du plus ancien au plus récent
        $previousPosts = array_reverse($previousPosts);

        return $previousPosts; // On retourne tous les posts précédents
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