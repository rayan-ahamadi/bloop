<?php

namespace App\Controller;

use App\Validation\User\CreateUserDto;
use App\Entity\User;
use App\Event\UserCreatedEvent;
use App\Repository\UserRepository;
use App\Service\PasswordHasher;
use App\Validation\User\UserValidator;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use App\Validation\User\UpdateUserDto;

#[Route('/api/users')]
class UserController extends AbstractController
{
    public function __construct(
        private readonly SerializerInterface $serializer,
        private readonly ValidatorInterface $validator,
        private readonly UserRepository $userRepository,
        private readonly PasswordHasher $passwordHasher,
        private readonly EventDispatcherInterface $eventDispatcher,
        private readonly LoggerInterface $logger,
        private readonly UserValidator $userValidator,
        private readonly EntityManagerInterface $entityManager
    ) {
    }

    #[Route('/register', name: 'user_register', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        try {
            $content = $request->getContent();
            $this->logger->debug('Contenu de la requête reçu', ['content' => $content]);

            // Désérialisation des données JSON vers le DTO
            $createUserDto = $this->serializer->deserialize(
                $content,
                CreateUserDto::class,
                'json'
            );

            $this->logger->debug('DTO après désérialisation', [
                'username' => $createUserDto->getUsername(),
                'email' => $createUserDto->getEmail(),
                'password' => '***'
            ]);

            // Validation du DTO
            $errors = $this->validator->validate($createUserDto);
            if (count($errors) > 0) {
                $this->logger->debug('Erreurs de validation', [
                    'errors' => $this->formatValidationErrors($errors)
                ]);
                return $this->json(
                    ['errors' => $this->formatValidationErrors($errors)],
                    Response::HTTP_BAD_REQUEST
                );
            }

            // Vérification de l'unicité
            if ($this->userRepository->findByEmail($createUserDto->getEmail())) {
                return $this->json(
                    ['error' => 'Cet email est déjà utilisé'],
                    Response::HTTP_CONFLICT
                );
            }

            if ($this->userRepository->findByUsername($createUserDto->getUsername())) {
                return $this->json(
                    ['error' => 'Ce nom d\'utilisateur est déjà utilisé'],
                    Response::HTTP_CONFLICT
                );
            }

            // Création de l'entité User
            $user = new User();
            $this->createUserFromDto($user, $createUserDto);

            // Hachage du mot de passe
            $hashedPassword = $this->passwordHasher->hashPassword($user, $createUserDto->getPassword());
            $user->setPassword($hashedPassword);

            // Persistance en base de données
            $this->userRepository->save($user, true);

            // Dispatch de l'événement
            $this->eventDispatcher->dispatch(
                new UserCreatedEvent($user),
                UserCreatedEvent::NAME
            );

            // Logging
            $this->logger->info('Nouvel utilisateur créé', [
                'user_id' => $user->getId(),
                'email' => $user->getEmail()
            ]);

            // Retour de la réponse
            return $this->json(
                [
                    'message' => 'Utilisateur créé avec succès',
                    'user' => $user,
                    'links' => [
                        'self' => $this->generateUrl('user_read', ['id' => $user->getId()]),
                        'update' => $this->generateUrl('user_update', ['id' => $user->getId()])
                    ]
                ],
                Response::HTTP_CREATED,
                [],
                ['groups' => ['user:read']]
            );

        } catch (NotEncodableValueException $e) {
            $this->logger->error('Erreur de désérialisation JSON', [
                'error' => $e->getMessage(),
                'content' => $request->getContent()
            ]);
            return $this->json(
                ['error' => 'Format JSON invalide'],
                Response::HTTP_BAD_REQUEST
            );
        } catch (UniqueConstraintViolationException $e) {
            $this->logger->error('Violation de contrainte d\'unicité', [
                'error' => $e->getMessage()
            ]);
            return $this->json(
                ['error' => 'Cet email ou nom d\'utilisateur est déjà utilisé'],
                Response::HTTP_CONFLICT
            );
        } catch (\Exception $e) {
            $this->logger->error('Erreur inattendue', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return $this->json(
                ['error' => 'Une erreur est survenue lors de la création de l\'utilisateur'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route('', name: 'user_list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        $page = max(1, $request->query->getInt('page', 1));
        $limit = max(1, min(50, $request->query->getInt('limit', 10))); // Limite entre 1 et 50
        $filters = [
            'username' => $request->query->get('username'),
            'status' => $request->query->get('status')
        ];

        $result = $this->userRepository->findPaginated($page, $limit, $filters);

        return $this->json(
            [
                'users' => $result['items'],
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
            ['groups' => ['user:list']]
        );
    }

    #[Route('/{id}', name: 'user_read', methods: ['GET'])]
    public function read(int $id): JsonResponse
    {
        $user = $this->userRepository->find($id);
        if (!$user) {
            return $this->json(
                ['error' => 'Utilisateur non trouvé'],
                Response::HTTP_NOT_FOUND
            );
        }

        // Récupérer les posts, reposts et likes de l'utilisateur
        $usersPosts = $user->getPosts();      // Supposé: relation User->posts
        $usersReposts = $user->getReposts();  // Supposé: relation User->reposts
        $usersLikes = $user->getLikes(); // Supposé: relation User->likedPosts

        // Préparer les données à envoyer
        $userData = [
            'user' => $user,
            'posts' => $usersPosts,
            'reposts' => $usersReposts,
            'likes' => $usersLikes
        ];

        return $this->json(
            $userData,
            Response::HTTP_OK,
            [],
            ['groups' => ['user:read']]
        );
    }

    #[Route('/{id}', name: 'user_update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $this->logger->debug('Début de la mise à jour de l\'utilisateur');
        $this->logger->debug('ID de l\'utilisateur à mettre à jour: ' . $id);

        $user = $this->userRepository->find($id);
        if (!$user) {
            $this->logger->debug('Utilisateur non trouvé');
            return $this->json(['error' => 'Utilisateur non trouvé'], Response::HTTP_NOT_FOUND);
        }

        $this->logger->debug('Contenu de la requête reçu');
        $content = $request->getContent();
        $this->logger->debug($content);

        if (empty($content)) {
            $this->logger->debug('Contenu de la requête vide');
            return $this->json(['error' => 'Le contenu de la requête ne peut pas être vide'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $this->logger->debug('Données JSON décodées');
            $data = json_decode($content, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                $this->logger->error('Erreur de décodage JSON: ' . json_last_error_msg());
                return $this->json(['error' => 'Format JSON invalide'], Response::HTTP_BAD_REQUEST);
            }

            // Désérialiser les nouvelles valeurs
            $dto = $this->serializer->deserialize(
                $content,
                UpdateUserDto::class,
                'json'
            );

            $this->logger->debug('DTO après désérialisation');
            $this->logger->debug('Username: ' . ($dto->getUsername() ?? 'null'));
            $this->logger->debug('Email: ' . ($dto->getEmail() ?? 'null'));
            $this->logger->debug('Bio: ' . ($dto->getBio() ?? 'null'));
            $this->logger->debug('Location: ' . ($dto->getLocation() ?? 'null'));

            $violations = $this->userValidator->validateUpdateUser($dto, $user);
            $this->logger->debug('Violations de validation');
            $this->logger->debug(json_encode($violations));

            if (!empty($violations)) {
                $errors = [];
                foreach ($violations as $violation) {
                    $errors[$violation->getPropertyPath()] = $violation->getMessage();
                }
                return $this->json(['errors' => $errors], Response::HTTP_BAD_REQUEST);
            }

            $this->updateUserFromDto($user, $dto);
            $this->entityManager->flush();

            $this->logger->debug('Utilisateur mis à jour avec succès');
            return $this->json(
                $user,
                Response::HTTP_OK,
                [],
                ['groups' => ['user:read']]
            );
        } catch (\Exception $e) {
            $this->logger->error('Erreur lors de la mise à jour: ' . $e->getMessage());
            $this->logger->error('Stack trace: ' . $e->getTraceAsString());
            return $this->json(['error' => 'Une erreur est survenue'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/{id}', name: 'user_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $user = $this->userRepository->find($id);
        if (!$user) {
            return $this->json(
                ['error' => 'Utilisateur non trouvé'],
                Response::HTTP_NOT_FOUND
            );
        }

        $user->setDeletedAt(new \DateTime());
        $this->entityManager->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    private function updateUserFromDto(User $user, UpdateUserDto $dto): void
    {
        if ($dto->getUsername() !== null) {
            $user->setUsername($dto->getUsername());
        }
        
        if ($dto->getEmail() !== null) {
            $user->setEmail($dto->getEmail());
        }
        
        if ($dto->getPassword() !== '') {
            $hashedPassword = $this->passwordHasher->hashPassword($user, $dto->getPassword());
            $user->setPassword($hashedPassword);
        }
        
        if ($dto->getBio() !== null) {
            $user->setBio($dto->getBio());
        }
        
        if ($dto->getAvatarUrl() !== null) {
            $user->setAvatarUrl($dto->getAvatarUrl());
        }
        
        if ($dto->getBannerUrl() !== null) {
            $user->setBannerUrl($dto->getBannerUrl());
        }
        
        if ($dto->getLocation() !== null) {
            $user->setLocation($dto->getLocation());
        }
        
        if ($dto->getWebsite() !== null) {
            $user->setWebsite($dto->getWebsite());
        }
        
        if ($dto->getBirthDate() !== null) {
            $user->setBirthDate($dto->getBirthDate());
        }
        
        if ($dto->getTimezone() !== null) {
            $user->setTimezone($dto->getTimezone());
        }
    }

    private function createUserFromDto(User $user, CreateUserDto $dto): void
    {
        $user->setUsername($dto->getUsername());
        $user->setEmail($dto->getEmail());
        $user->setBio($dto->getBio());
        $user->setAvatarUrl($dto->getAvatarUrl());
        $user->setBannerUrl($dto->getBannerUrl());
        $user->setLocation($dto->getLocation());
        $user->setWebsite($dto->getWebsite());
        $user->setBirthDate($dto->getBirthDate());
        $user->setTimezone($dto->getTimezone());
    }

    private function formatValidationErrors($errors): array
    {
        $formattedErrors = [];
        foreach ($errors as $error) {
            $formattedErrors[$error->getPropertyPath()] = $error->getMessage();
        }
        return $formattedErrors;
    }

    private function formatViolations($violations): array
    {
        $errors = [];
        foreach ($violations as $violation) {
            $errors[$violation->getPropertyPath()] = $violation->getMessage();
        }
        return $errors;
    }
} 