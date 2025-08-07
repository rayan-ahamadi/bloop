<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

use App\Repository\ChatRoomRepository;
use App\Repository\RoomMessageRepository;
use App\Repository\RoomParticipantRepository;
use App\Repository\UserRepository;

use App\Validation\Chat\CreateRoomDto;
use App\Validation\Chat\CreateMessageDto;

use App\Entity\ChatRoom;
use App\Entity\RoomParticipant;
use App\Entity\RoomMessage;
use App\Entity\User;
use App\Enum\ChatRoomType;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Psr\Log\LoggerInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;

#[Route('/api/message')]
final class MessageController extends AbstractController
{
    public function __construct(
        private readonly ChatRoomRepository $chatRoomRepository,
        private readonly RoomMessageRepository $roomMessageRepository,
        private readonly RoomParticipantRepository $roomParticipantRepository,
        private readonly UserRepository $userRepository,
        private readonly SerializerInterface $serializer,
        private readonly ValidatorInterface $validator,
        private readonly LoggerInterface $logger,
        private readonly EntityManagerInterface $entityManager
    ) {
    }

    #[Route('/rooms', name: 'get_user_rooms', methods: ['GET'])]
    public function getUserRooms(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        $rooms = $this->chatRoomRepository->findRoomsForUser($user);
        
        // Enrichir les données avec le dernier message et les messages non lus
        $roomsData = [];
        foreach ($rooms as $room) {
            $lastMessage = $this->roomMessageRepository->findLastMessageByRoom($room);
            $unreadCount = $this->roomMessageRepository->countUnreadMessagesForUser($room, $user);
            
            $roomsData[] = [
                'room' => $room,
                'last_message' => $lastMessage,
                'unread_count' => $unreadCount
            ];
        }

        return $this->json(
            $roomsData,
            Response::HTTP_OK,
            [],
            ['groups' => ['room:read', 'message:read', 'user:read', 'participant:read']]
        );
    }

    #[Route('/rooms/{id}/messages', name: 'get_room_messages', methods: ['GET'])]
    public function getRoomMessages(int $id, Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        $room = $this->chatRoomRepository->find($id);
        if (!$room) {
            return $this->json(['error' => 'Room non trouvée'], Response::HTTP_NOT_FOUND);
        }

        // Vérifier si l'utilisateur est participant
        if (!$this->roomParticipantRepository->isUserParticipant($room, $user)) {
            return $this->json(['error' => 'Accès non autorisé à cette room'], Response::HTTP_FORBIDDEN);
        }

        $page = max(1, $request->query->getInt('page', 1));
        $limit = max(1, min(100, $request->query->getInt('limit', 50)));

        $result = $this->roomMessageRepository->findByRoomPaginated($room, $user ,$page, $limit);

        return $this->json(
            [
                'messages' => $result['items'],
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
            ['groups' => ['message:read', 'user:read']]
        );
    }

    #[Route('/rooms', name: 'create_room', methods: ['POST'])]
    public function createRoom(Request $request): JsonResponse
    {
        try {
            /** @var User $user */
            $user = $this->getUser();
            if (!$user) {
                return $this->json(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
            }

            $content = $request->getContent();
            $createRoomDto = $this->serializer->deserialize($content, CreateRoomDto::class, 'json');

            // Validation du DTO
            $errors = $this->validator->validate($createRoomDto);
            if (count($errors) > 0) {
                return $this->json(
                    ['errors' => $this->formatValidationErrors($errors)],
                    Response::HTTP_BAD_REQUEST
                );
            }

            // Vérifier que l'utilisateur courant est inclus dans les participants
            $participantIds = $createRoomDto->getParticipantIds();
            if (!in_array($user->getId(), $participantIds)) {
                $participantIds[] = $user->getId();
            }

            // Pour les DM, vérifier qu'il y a exactement 2 participants
            if ($createRoomDto->getType() === 'DM' && count($participantIds) !== 2) {
                return $this->json(
                    ['error' => 'Un DM doit avoir exactement 2 participants'],
                    Response::HTTP_BAD_REQUEST
                );
            }

            // Vérifier si une room DM existe déjà entre ces utilisateurs
            if ($createRoomDto->getType() === 'DM') {
                $otherUserId = array_diff($participantIds, [$user->getId()])[0];
                $otherUser = $this->userRepository->find($otherUserId);
                if ($otherUser) {
                    $existingRoom = $this->chatRoomRepository->findDMBetweenUsers($user, $otherUser);
                    if ($existingRoom) {
                        return $this->json(
                            ['message' => 'Room DM existe déjà', 'room' => $existingRoom],
                            Response::HTTP_OK,
                            [],
                            ['groups' => ['room:read']]
                        );
                    }
                }
            }

            // Créer la room
            $room = new ChatRoom();
            $room->setType(ChatRoomType::from($createRoomDto->getType()));
            $room->setIdentifier(uniqid('room_'));
            if ($createRoomDto->getName()) {
                $room->setName($createRoomDto->getName());
            }

            $this->chatRoomRepository->save($room, true);

            // Ajouter les participants
            foreach ($participantIds as $participantId) {
                $participant = $this->userRepository->find($participantId);
                if ($participant) {
                    $roomParticipant = new RoomParticipant();
                    $roomParticipant->setRoom($room);
                    $roomParticipant->setUser($participant);
                    $this->roomParticipantRepository->save($roomParticipant);
                }
            }

            $this->entityManager->flush();

            return $this->json(
                ['message' => 'Room créée avec succès', 'room' => $room],
                Response::HTTP_CREATED,
                [],
                ['groups' => ['room:read']]
            );

        } catch (\Exception $e) {
            $this->logger->error('Erreur lors de la création de la room', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return $this->json(
                ['error' => 'Erreur lors de la création de la room'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route('/rooms/{id}/messages', name: 'create_message', methods: ['POST'])]
    public function createMessage(int $id, Request $request): JsonResponse
    {
        try {
            /** @var User $user */
            $user = $this->getUser();
            if (!$user) {
            return $this->json(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
            }

            $room = $this->chatRoomRepository->find($id);
            if (!$room) {
            return $this->json(['error' => 'Room non trouvée'], Response::HTTP_NOT_FOUND);
            }

            // Vérifier si l'utilisateur est participant
            if (!$this->roomParticipantRepository->isUserParticipant($room, $user)) {
            return $this->json(['error' => 'Accès non autorisé à cette room'], Response::HTTP_FORBIDDEN);
            }

            $content = $request->getContent();
            $createMessageDto = $this->serializer->deserialize($content, CreateMessageDto::class, 'json');

            // Validation du DTO
            $errors = $this->validator->validate($createMessageDto);
            if (count($errors) > 0) {
            return $this->json(
                ['errors' => $this->formatValidationErrors($errors)],
                Response::HTTP_BAD_REQUEST
            );
            }

            // Créer le message
            $message = new RoomMessage();
            $message->setUser($user);
            $message->setRoom($room);
            $message->setContent($createMessageDto->getContent());
            
            // Si une image est présente, elle doit être une URL (string)
            if ($createMessageDto->getImage()) {
                $message->setImage($createMessageDto->getImage());
            }

            $this->roomMessageRepository->save($message, true);

            return $this->json(
                ['message' => 'Message créé avec succès', 'data' => $message],
                Response::HTTP_CREATED,
                [],
                ['groups' => ['message:read', 'user:read']]
            );

        } catch (\Exception $e) {
            $this->logger->error('Erreur lors de la création du message', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return $this->json(
                ['error' => 'Erreur lors de la création du message'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route('/rooms/{id}/participants', name: 'add_participants', methods: ['POST'])]
    public function addParticipants(int $id, Request $request): JsonResponse
    {
        try {
            /** @var User $user */
            $user = $this->getUser();
            if (!$user) {
                return $this->json(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
            }

            $room = $this->chatRoomRepository->find($id);
            if (!$room) {
                return $this->json(['error' => 'Room non trouvée'], Response::HTTP_NOT_FOUND);
            }

            // Vérifier que c'est une room de groupe
            if ($room->getType() !== ChatRoomType::GROUP) {
                return $this->json(
                    ['error' => 'Impossible d\'ajouter des participants à un DM'],
                    Response::HTTP_BAD_REQUEST
                );
            }

            // Vérifier si l'utilisateur est participant
            if (!$this->roomParticipantRepository->isUserParticipant($room, $user)) {
                return $this->json(['error' => 'Accès non autorisé à cette room'], Response::HTTP_FORBIDDEN);
            }

            $data = json_decode($request->getContent(), true);
            $userIds = $data['user_ids'] ?? [];

            if (empty($userIds)) {
                return $this->json(
                    ['error' => 'Aucun utilisateur spécifié'],
                    Response::HTTP_BAD_REQUEST
                );
            }

            $addedParticipants = [];
            foreach ($userIds as $userId) {
                $participantUser = $this->userRepository->find($userId);
                if (!$participantUser) {
                    continue;
                }

                // Vérifier si l'utilisateur n'est pas déjà participant
                if ($this->roomParticipantRepository->isUserParticipant($room, $participantUser)) {
                    continue;
                }

                $roomParticipant = new RoomParticipant();
                $roomParticipant->setRoom($room);
                $roomParticipant->setUser($participantUser);
                $this->roomParticipantRepository->save($roomParticipant);
                
                $addedParticipants[] = $participantUser;
            }

            $this->entityManager->flush();

            return $this->json(
                [
                    'message' => 'Participants ajoutés avec succès',
                    'added_participants' => $addedParticipants
                ],
                Response::HTTP_OK,
                [],
                ['groups' => ['user:read']]
            );

        } catch (\Exception $e) {
            $this->logger->error('Erreur lors de l\'ajout des participants', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return $this->json(
                ['error' => 'Erreur lors de l\'ajout des participants'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route('/messages/{id}/read', name: 'mark_message_read', methods: ['POST'])]
    public function markMessageAsRead(int $id): JsonResponse
    {
        try {
            /** @var User $user */
            $user = $this->getUser();
            if (!$user) {
                return $this->json(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
            }

            $message = $this->roomMessageRepository->find($id);
            if (!$message) {
                return $this->json(['error' => 'Message non trouvé'], Response::HTTP_NOT_FOUND);
            }

            // Vérifier si l'utilisateur est participant de la room
            if (!$this->roomParticipantRepository->isUserParticipant($message->getRoom(), $user)) {
                return $this->json(['error' => 'Accès non autorisé'], Response::HTTP_FORBIDDEN);
            }

            $message->markAsReadBy($user);
            $this->roomMessageRepository->save($message, true);

            return $this->json(['message' => 'Message marqué comme lu'], Response::HTTP_OK);

        } catch (\Exception $e) {
            $this->logger->error('Erreur lors du marquage du message comme lu', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return $this->json(
                ['error' => 'Erreur lors du marquage du message'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route('/upload-image', name: 'upload_message_image', methods: ['POST'])]
    public function uploadMessageImage(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        /** @var UploadedFile|null $file */
        $file = $request->files->get('image');
        if (!$file) {
            return $this->json(['error' => 'Aucun fichier envoyé'], Response::HTTP_BAD_REQUEST);
        }

        $uploadDir = $this->getParameter('message_image_directory'); // Configure dans services.yaml ou parameters.yaml
        $publicPath = '/uploads/messages/';

        $filename = uniqid('message_image_') . '.' . $file->guessExtension();

        try {
            $file->move($uploadDir, $filename);
        } catch (FileException $e) {
            return $this->json(['error' => 'Erreur lors de l\'upload'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $imageUrl = $publicPath . $filename;

        return $this->json(['url' => $imageUrl], Response::HTTP_OK);
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
