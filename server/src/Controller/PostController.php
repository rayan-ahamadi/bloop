<?php

namespace App\Controller;

use App\Entity\Post;
use App\Entity\User;
use App\Repository\PostRepository;
use App\Repository\UserRepository;
use App\Validation\Post\CreatePostDto;
use App\Validation\Post\PostValidator;
use App\Validation\Post\UpdatePostDto;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/posts')]
class PostController extends AbstractController
{
    public function __construct(
        private readonly SerializerInterface $serializer,
        private readonly ValidatorInterface $validator,
        private readonly PostRepository $postRepository,
        private readonly UserRepository $userRepository,
        private readonly LoggerInterface $logger,
        private readonly PostValidator $postValidator,
        private readonly EntityManagerInterface $entityManager
    ) {
    }

    // #[Route('', name: 'post_create', methods: ['POST'])]
    // public function create(Request $request): JsonResponse
    // {
    //     try {
    //         $content = $request->getContent();
    //         $this->logger->debug('Contenu de la requête reçue', ['content' => $content]);

    //         // Désérialisation des données JSON vers le DTO
    //         $createPostDto = $this->serializer->deserialize(
    //             $content,
    //             CreatePostDto::class,
    //             'json'
    //         );

    //         $this->logger->debug('DTO après désérialisation', [
    //             'content' => $createPostDto->getContent(),
    //             'type' => $createPostDto->getType(),
    //             'parent_post_id' => $createPostDto->getParentPostId()
    //         ]);

    //         // Validation du DTO
    //         $errors = $this->validator->validate($createPostDto);
    //         if (count($errors) > 0) {
    //             $this->logger->debug('Erreurs de validation', [
    //                 'errors' => $this->formatValidationErrors($errors)
    //             ]);
    //             return $this->json(
    //                 ['errors' => $this->formatValidationErrors($errors)],
    //                 Response::HTTP_BAD_REQUEST
    //             );
    //         }

    //         // Récupérer l'utilisateur connecté
    //         /** @var User $user */
    //         $user = $this->getUser();
    //         if (!$user) {
    //             return $this->json(
    //                 ['error' => 'Utilisateur non authentifié'],
    //                 Response::HTTP_UNAUTHORIZED
    //             );
    //         }

    //         // Création de l'entité Post
    //         $post = new Post();
    //         $this->createPostFromDto($post, $createPostDto, $user);

    //         // Persistance en base de données
    //         $this->postRepository->save($post, true);

    //         // Logging
    //         $this->logger->info('Nouveau post créé', [
    //             'post_id' => $post->getId(),
    //             'user_id' => $user->getId(),
    //             'type' => $post->getType()
    //         ]);

    //         // Retour de la réponse
    //         return $this->json(
    //             [
    //                 'message' => 'Post créé avec succès',
    //                 'post' => $post,
    //                 'links' => [
    //                     'self' => $this->generateUrl('post_read', ['id' => $post->getId()]),
    //                     'update' => $this->generateUrl('post_update', ['id' => $post->getId()]),
    //                     'delete' => $this->generateUrl('post_delete', ['id' => $post->getId()])
    //                 ]
    //             ],
    //             Response::HTTP_CREATED,
    //             [],
    //             ['groups' => ['post:read']]
    //         );

    //     } catch (NotEncodableValueException $e) {
    //         $this->logger->error('Erreur de désérialisation JSON', [
    //             'error' => $e->getMessage(),
    //             'content' => $request->getContent()
    //         ]);
    //         return $this->json(
    //             ['error' => 'Format JSON invalide'],
    //             Response::HTTP_BAD_REQUEST
    //         );
    //     } catch (\Exception $e) {
    //         $this->logger->error('Erreur inattendue', [
    //             'error' => $e->getMessage(),
    //             'trace' => $e->getTraceAsString()
    //         ]);
    //         return $this->json(
    //             ['error' => 'Une erreur est survenue lors de la création du post'],
    //             Response::HTTP_INTERNAL_SERVER_ERROR
    //         );
    //     }
    // }

    #[Route('', name: 'post_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        try {
            // Récupération des champs depuis FormData (multipart/form-data)
            $content = $request->request->get('content');
            $type = $request->request->get('type');
            $parentPostId = $request->request->get('parent_post_id');
            $language = $request->request->get('language', 'fr');
            $imageFile = $request->files->get('image');

            $this->logger->info('Données reçues depuis FormData', [
                'content' => $content,
                'type' => $type,
                'parent_post_id' => $parentPostId,
                'language' => $language,
                'image_file' => $imageFile ? $imageFile->getClientOriginalName() : null
            ]);

            // Construction manuelle du DTO
            $createPostDto = new CreatePostDto();
            $createPostDto->setContent($content);
            $createPostDto->setType($type);
            $createPostDto->setParentPostId($parentPostId);
            $createPostDto->setLanguage($language);

            // Validation
            $errors = $this->validator->validate($createPostDto);
            if (count($errors) > 0) {
                return $this->json(
                    ['errors' => $this->formatValidationErrors($errors)],
                    Response::HTTP_BAD_REQUEST
                );
            }

            // Récupération de l'utilisateur
            /** @var User $user */
            $user = $this->getUser();
            if (!$user) {
                return $this->json(
                    ['error' => 'Utilisateur non authentifié'],
                    Response::HTTP_UNAUTHORIZED
                );
            }

            // Création du Post
            $post = new Post();
            $this->createPostFromDto($post, $createPostDto, $user);

            // Gestion de l'image (si présente)
            if ($imageFile) {
                $extension = $imageFile->getClientOriginalExtension(); // ou guessExtension(), si vraiment tu veux
                $filename = uniqid() . '.' . $extension;
                $uploadsDir = $this->getParameter('post_image_directory');

                $imageFile->move($uploadsDir, $filename);
                $imageTempPath = $uploadsDir . '/' . $filename;

                $post->setImageUrl('/uploads/posts_images/' . $filename);
            }

            // Sauvegarde
            $this->postRepository->save($post, true);

            return $this->json(
                [
                    'message' => 'Post créé avec succès',
                    'post' => $post,
                    'links' => [
                        'self' => $this->generateUrl('post_read', ['id' => $post->getId()]),
                        'update' => $this->generateUrl('post_update', ['id' => $post->getId()]),
                        'delete' => $this->generateUrl('post_delete', ['id' => $post->getId()])
                    ]
                ],
                Response::HTTP_CREATED,
                [],
                ['groups' => ['post:read']]
            );

        } catch (\Exception $e) {
            $this->logger->error('Erreur lors de la création du post', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Si on a enregistré le chemin, on peut supprimer en toute sécurité
            if ($imageTempPath && file_exists($imageTempPath)) {
                unlink($imageTempPath);
            }

            return $this->json(
                ['error' => 'Une erreur est survenue lors de la création du post', 
                'details' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                ],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }


    #[Route('', name: 'post_list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {


        $user = $this->getUser();


        $page = max(1, $request->query->getInt('page', 1));
        $limit = max(1, min(50, $request->query->getInt('limit', 10))); // Limite entre 1 et 50
        $filters = [
            'user_id' => $request->query->get('user_id'),
            'type' => $request->query->get('type'),
            'language' => $request->query->get('language'),
            'search' => $request->query->get('search'),
            'user' => $user ? $user : null
        ];

        $result = $this->postRepository->findPaginated($page, $limit, $filters);

        // Pour retourner l'info de l'auteur, il faut que la sérialisation du Post inclue l'utilisateur
        // Ajoutez le groupe "user:public" (ou similaire) sur les propriétés User à exposer dans l'entité User
        // Puis ajoutez ce groupe ici dans les options de sérialisation

        return $this->json(
            [
                'posts' => $result['items'],
                'pagination' => [
                    'totalItems' => $result['totalItems'],
                    'totalPages' => $result['totalPages'],
                    'currentPage' => $result['currentPage'],
                    'itemsPerPage' => $result['itemsPerPage'],
                    'hasNextPage' => $result['hasNextPage'],
                    'hasPreviousPage' => $result['hasPreviousPage']
                ]
            ],
            Response::HTTP_OK,
            [],
            ['groups' => ['post:list', 'user:read', 'user:list', 'post:read']]
        );
    }

    #[Route('/popular', name: 'post_popular', methods: ['GET'])]
    public function popular(Request $request): JsonResponse
    {
        $page = max(1, $request->query->getInt('page', 1));
        $limit = max(1, min(50, $request->query->getInt('limit', 10)));

        $result = $this->postRepository->findPopularPosts($page, $limit);

        return $this->json(
            [
                'posts' => $result['items'],
                'pagination' => [
                    'totalItems' => $result['totalItems'],
                    'totalPages' => $result['totalPages'],
                    'currentPage' => $result['currentPage'],
                    'itemsPerPage' => $result['itemsPerPage'],
                    'hasNextPage' => $result['hasNextPage'],
                    'hasPreviousPage' => $result['hasPreviousPage']
                ]
            ],
            Response::HTTP_OK,
            [],
            ['groups' => ['post:list']]
        );
    }

    #[Route('/search', name: 'post_search', methods: ['GET'])]
    public function search(Request $request): JsonResponse
    {
        $search = $request->query->get('q');
        if (empty($search)) {
            return $this->json(
                ['error' => 'Le paramètre de recherche "q" est requis'],
                Response::HTTP_BAD_REQUEST
            );
        }

        $page = max(1, $request->query->getInt('page', 1));
        $limit = max(1, min(50, $request->query->getInt('limit', 10)));

        $result = $this->postRepository->searchPosts($search, $page, $limit);

        return $this->json(
            [
                'posts' => $result['items'],
                'search' => $search,
                'pagination' => [
                    'totalItems' => $result['totalItems'],
                    'totalPages' => $result['totalPages'],
                    'currentPage' => $result['currentPage'],
                    'itemsPerPage' => $result['itemsPerPage'],
                    'hasNextPage' => $result['hasNextPage'],
                    'hasPreviousPage' => $result['hasPreviousPage']
                ]
            ],
            Response::HTTP_OK,
            [],
            ['groups' => ['post:list']]
        );
    }

    #[Route('/{id}', name: 'post_read', methods: ['GET'])]
    public function read(int $id, Request $request): JsonResponse
    {   


        // Récupération des paramètres de pagination depuis l'URL
        $page = max(1, $request->query->getInt('page', 1));
        $limit = max(1, min(50, $request->query->getInt('limit', 10)));

        // Cet route va permettre de lire un post, il faudrait retourner le fil précédent (réponses d'avant le post si existant) et le fil suivant (réponses après le post)
        $this->logger->info("Lecture du post", ['post_id' => $id]);

        $user = $this->getUser();
        if ($user) {
            $this->logger->info('Utilisateur connecté', ['user_id' => $user->getId()]);
        } else {
            $this->logger->info('Aucun utilisateur connecté');
        }

        $postEntity = $this->postRepository->find($id);

        $post = $this->postRepository->findPostWithUserDetails($postEntity, null, null, $user ? $user : null);
        if (!$post) {
            return $this->json(
                ['error' => 'Post non trouvé'],
                Response::HTTP_NOT_FOUND
            );
        }
        // Récupère le fil de discussion précédent
        $previousPost = $this->postRepository->findPreviousToPost($postEntity, $user ? $user : null);

        // Récupère les commentaires (réponses) du post
        $postReplies = $this->postRepository->findRepliesToPost($postEntity, $page, 10,$user ? $user : null);

        // Incrémenter le compteur de vues
        $postEntity->incrementViewsCount();
        $this->postRepository->save($postEntity, true);

        return $this->json(
            [   
                'ancestorThread' => $previousPost,
                "post" => $post,
                "replies" => $postReplies['items'],
                'repliesPagination' => [
                    'totalItems' => $postReplies['totalItems'],
                    'totalPages' => $postReplies['totalPages'],
                    'currentPage' => $postReplies['currentPage'],
                    'itemsPerPage' => $postReplies['itemsPerPage'],
                    'hasNextPage' => $postReplies['hasNextPage'],
                    'hasPreviousPage' => $postReplies['hasPreviousPage']
                ]
            ],
            Response::HTTP_OK,
            [],
            ['groups' => ['post:read', 'post:list', 'user:read', 'user:list']]
        );
    }
    
    #[Route('/{id}/replies', name: 'post_replies', methods: ['GET'])]
    public function replies(int $id, Request $request): JsonResponse
    {
        $post = $this->postRepository->find($id);
        if (!$post) {
            return $this->json(
                ['error' => 'Post non trouvé'],
                Response::HTTP_NOT_FOUND
            );
        }

        $page = max(1, $request->query->getInt('page', 1));
        $limit = max(1, min(50, $request->query->getInt('limit', 10)));

        $result = $this->postRepository->findRepliesToPost($post, $page, $limit);

        return $this->json(
            [
                'replies' => $result['items'],
                'pagination' => [
                    'totalItems' => $result['totalItems'],
                    'totalPages' => $result['totalPages'],
                    'currentPage' => $result['currentPage'],
                    'itemsPerPage' => $result['itemsPerPage'],
                    'hasNextPage' => $result['hasNextPage'],
                    'hasPreviousPage' => $result['hasPreviousPage']
                ]
            ],
            Response::HTTP_OK,
            [],
            ['groups' => ['post:list']]
        );
    }

    // #[Route('/{id}', name: 'post_update', methods: ['POST'])]
    // public function update(int $id, Request $request): JsonResponse
    // {
    //     try {
    //         $post = $this->postRepository->find($id);
    //         if (!$post) {
    //             return $this->json(
    //                 ['error' => 'Post non trouvé'],
    //                 Response::HTTP_NOT_FOUND
    //             );
    //         }

    //         // Vérifier que l'utilisateur est le propriétaire du post
    //         /** @var User $user */
    //         $user = $this->getUser();
    //         if ($post->getUser()->getId() !== $user->getId()) {
    //             throw new AccessDeniedException('Vous n\'êtes pas autorisé à modifier ce post');
    //         }

    //         $content = $request->getContent();
    //         $this->logger->debug('Contenu de la requête de mise à jour', ['content' => $content]);

    //         // Désérialisation des données JSON vers le DTO
    //         $updatePostDto = $this->serializer->deserialize(
    //             $content,
    //             UpdatePostDto::class,
    //             'json'
    //         );

    //         // Validation du DTO
    //         $errors = $this->validator->validate($updatePostDto);
    //         if (count($errors) > 0) {
    //             return $this->json(
    //                 ['errors' => $this->formatValidationErrors($errors)],
    //                 Response::HTTP_BAD_REQUEST
    //             );
    //         }

    //         // Mise à jour du post
    //         $this->updatePostFromDto($post, $updatePostDto);

    //         // Persistance en base de données
    //         $this->postRepository->save($post, true);

    //         // Logging
    //         $this->logger->info('Post mis à jour', [
    //             'post_id' => $post->getId(),
    //             'user_id' => $user->getId()
    //         ]);

    //         return $this->json(
    //             [
    //                 'message' => 'Post mis à jour avec succès',
    //                 'post' => $post
    //             ],
    //             Response::HTTP_OK,
    //             [],
    //             ['groups' => ['post:read']]
    //         );

    //     } catch (AccessDeniedException $e) {
    //         return $this->json(
    //             ['error' => $e->getMessage()],
    //             Response::HTTP_FORBIDDEN
    //         );
    //     } catch (NotEncodableValueException $e) {
    //         $this->logger->error('Erreur de désérialisation JSON', [
    //             'error' => $e->getMessage(),
    //             'content' => $request->getContent()
    //         ]);
    //         return $this->json(
    //             ['error' => 'Format JSON invalide'],
    //             Response::HTTP_BAD_REQUEST
    //         );
    //     } catch (\Exception $e) {
    //         $this->logger->error('Erreur inattendue', [
    //             'error' => $e->getMessage(),
    //             'trace' => $e->getTraceAsString()
    //         ]);
    //         return $this->json(
    //             ['error' => 'Une erreur est survenue lors de la mise à jour du post'],
    //             Response::HTTP_INTERNAL_SERVER_ERROR
    //         );
    //     }
    // }

    #[Route('/{id}', name: 'post_update', methods: ['POST'])]
    public function update(int $id, Request $request): JsonResponse
    {
        try {
            $post = $this->postRepository->find($id);
            if (!$post) {
                return $this->json(
                    ['error' => 'Post non trouvé'],
                    Response::HTTP_NOT_FOUND
                );
            }

            /** @var User $user */
            $user = $this->getUser();
            if ($post->getUser()->getId() !== $user->getId()) {
                throw new AccessDeniedException('Vous n\'êtes pas autorisé à modifier ce post');
            }

            // Lecture des champs depuis FormData
            $content = $request->request->get('content');
            $language = $request->request->get('language', 'fr');
            $imageFile = $request->files->get('image');

            // Construction manuelle du DTO
            $updatePostDto = new UpdatePostDto();
            $updatePostDto->setContent($content);
            $updatePostDto->setLanguage($language);

            // Validation du DTO
            $errors = $this->validator->validate($updatePostDto);
            if (count($errors) > 0) {
                return $this->json(
                    ['errors' => $this->formatValidationErrors($errors)],
                    Response::HTTP_BAD_REQUEST
                );
            }

            // Mise à jour via le DTO
            $this->updatePostFromDto($post, $updatePostDto);

            // Gestion de l'image
            if ($imageFile) {
                $uploadsDir = $this->getParameter('uploads_directory');
                $filename = uniqid() . '.' . $imageFile->guessExtension();
                $imageFile->move($uploadsDir, $filename);

                // Optionnel : suppression de l'ancienne image
                if ($post->getImageUrl()) {
                    $oldPath = $uploadsDir . '/' . basename($post->getImageUrl());
                    if (file_exists($oldPath)) {
                        unlink($oldPath);
                    }
                }

                $post->setImageUrl('/uploads/' . $filename);
            }

            $this->postRepository->save($post, true);

            $this->logger->info('Post mis à jour', [
                'post_id' => $post->getId(),
                'user_id' => $user->getId()
            ]);

            return $this->json(
                [
                    'message' => 'Post mis à jour avec succès',
                    'post' => $post
                ],
                Response::HTTP_OK,
                [],
                ['groups' => ['post:read']]
            );

        } catch (AccessDeniedException $e) {
            return $this->json(
                ['error' => $e->getMessage()],
                Response::HTTP_FORBIDDEN
            );
        } catch (\Exception $e) {
            $this->logger->error('Erreur inattendue', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return $this->json(
                ['error' => 'Une erreur est survenue lors de la mise à jour du post'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }


    #[Route('/{id}', name: 'post_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        try {
            $post = $this->postRepository->find($id);
            if (!$post) {
                return $this->json(
                    ['error' => 'Post non trouvé'],
                    Response::HTTP_NOT_FOUND
                );
            }

            // Vérifier que l'utilisateur est le propriétaire du post
            /** @var User $user */
            $user = $this->getUser();
            if ($post->getUser()->getId() !== $user->getId()) {
                throw new AccessDeniedException('Vous n\'êtes pas autorisé à supprimer ce post');
            }

            // Soft delete
            $post->softDelete();
            $this->postRepository->save($post, true);

            // Logging
            $this->logger->info('Post supprimé', [
                'post_id' => $post->getId(),
                'user_id' => $user->getId()
            ]);

            return $this->json(
                ['message' => 'Post supprimé avec succès'],
                Response::HTTP_OK
            );

        } catch (AccessDeniedException $e) {
            return $this->json(
                ['error' => $e->getMessage()],
                Response::HTTP_FORBIDDEN
            );
        } catch (\Exception $e) {
            $this->logger->error('Erreur inattendue', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return $this->json(
                ['error' => 'Une erreur est survenue lors de la suppression du post'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    

    private function createPostFromDto(Post $post, CreatePostDto $dto, User $user): void
    {
        $post->setContent(trim($dto->getContent()));
        $post->setType($dto->getType());
        $post->setLanguage($dto->getLanguage());
        $post->setUser($user);

        // Si c'est une réponse, définir le post parent
        if ($dto->getType() === 'reply' && $dto->getParentPostId()) {
            $parentPost = $this->postRepository->find($dto->getParentPostId());
            if ($parentPost) {
                $post->setParentPost($parentPost);
            }
        }
    }

    private function updatePostFromDto(Post $post, UpdatePostDto $dto): void
    {
        if ($dto->getContent() !== null) {
            $post->setContent(trim($dto->getContent()));
        }

        if ($dto->getLanguage() !== null) {
            $post->setLanguage($dto->getLanguage());
        }

        if ($dto->getIsPinned() !== null) {
            $post->setIsPinned($dto->getIsPinned());
        }
    }

    private function formatValidationErrors($errors): array
    {
        $formattedErrors = [];
        foreach ($errors as $error) {
            $formattedErrors[$error->getPropertyPath()] = $error->getMessage();
        }
        return $formattedErrors;
    }
} 