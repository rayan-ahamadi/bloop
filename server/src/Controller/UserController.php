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
            $username = $request->request->get('username');
            $email = $request->request->get('email');
            $password = $request->request->get('password');
    
            // Fichiers image
            /** @var UploadedFile|null $avatarFile */
            $avatarFile = $request->files->get('avatar');
    
            /** @var UploadedFile|null $bannerFile */
            $bannerFile = $request->files->get('banner');
    
            // Créer utilisateur
            $user = new User();
            $user->setUsername($username);
            $user->setEmail($email);
    
            // Hash du mot de passe
            $hashedPassword = $this->passwordHasher->hashPassword($user, $password);
            $user->setPassword($hashedPassword);
    
            // Avatar
            if ($avatarFile) {
                $avatarFilename = uniqid('avatar_') . '.' . $avatarFile->guessExtension();
                $avatarFile->move($this->getParameter('avatar_directory'), $avatarFilename);
                $user->setAvatarUrl('/uploads/avatars/' . $avatarFilename);
            }
    
            // Bannière
            if ($bannerFile) {
                $bannerFilename = uniqid('banner_') . '.' . $bannerFile->guessExtension();
                $bannerFile->move($this->getParameter('banner_directory'), $bannerFilename);
                $user->setBannerUrl('/uploads/banners/' . $bannerFilename);
            }
    
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

    #[Route('/{id}', name: 'user_update', methods: ['POST'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $this->logger->debug("Début de la mise à jour de l'utilisateur $id");

        $user = $this->userRepository->find($id);
        if (!$user) {
            return $this->json(['error' => 'Utilisateur non trouvé'], Response::HTTP_NOT_FOUND);
        }

        // Récupération des données du formulaire
        $username = $request->request->get('username');
        $email = $request->request->get('email');
        $bio = $request->request->get('bio');
        $location = $request->request->get('location');

        /** @var UploadedFile|null $avatarFile */
        $avatarFile = $request->files->get('avatar');

        /** @var UploadedFile|null $bannerFile */
        $bannerFile = $request->files->get('banner');

        // Mise à jour des données de l'utilisateur
        if ($username) $user->setUsername($username);
        if ($email) $user->setEmail($email);
        if ($bio) $user->setBio($bio);
        if ($location) $user->setLocation($location);

        // Gestion des fichiers
        if ($avatarFile) {
            $avatarFilename = uniqid('avatar_') . '.' . $avatarFile->guessExtension();
            $avatarFile->move($this->getParameter('avatar_directory'), $avatarFilename);
            $user->setAvatarUrl('/uploads/avatars/' . $avatarFilename);
        }

        if ($bannerFile) {
            $bannerFilename = uniqid('banner_') . '.' . $bannerFile->guessExtension();
            $bannerFile->move($this->getParameter('banner_directory'), $bannerFilename);
            $user->setBannerUrl('/uploads/banners/' . $bannerFilename);
        }

        $this->entityManager->flush();

        $this->logger->debug('Utilisateur mis à jour avec succès');
        return $this->json($user, Response::HTTP_OK, [], ['groups' => ['user:read']]);
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

        if($dto->getName() !== null) {
            $user->setName($dto->getName());
        }

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

        if ($dto->getThemes() !== null) {
            $user->setThemes($dto->getThemes());
        }
        
        if ($dto->getAvatarUrl() !== null) {
            $user->setAvatarUrl($dto->getAvatarUrl());
        }
        
        if ($dto->getBannerUrl() !== null) {
            $user->setBannerUrl($dto->getBannerUrl());
        }
    
        
        if ($dto->getBirthDate() !== null) {
            $user->setBirthDate($dto->getBirthDate());
        }
        
    }

    private function createUserFromDto(User $user, CreateUserDto $dto): void
    {
        $user->setName($dto->getName());
        $user->setUsername($dto->getUsername());
        $user->setEmail($dto->getEmail());
        $user->setBio($dto->getBio());
        $user->setThemes($dto->getThemes());
        $user->setAvatarUrl($dto->getAvatarUrl());
        $user->setBannerUrl($dto->getBannerUrl());
        $user->setBirthDate($dto->getBirthDate());
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