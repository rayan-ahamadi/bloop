<?php

namespace App\Tests\Controller;

use App\Entity\User;
use App\Enum\UserStatus;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class UserControllerTest extends WebTestCase
{
    private $client;
    private $userRepository;
    private $passwordHasher;
    private $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->client = static::createClient();
        $this->userRepository = static::getContainer()->get(UserRepository::class);
        $this->passwordHasher = static::getContainer()->get(\App\Service\PasswordHasher::class);

        // Vider la table user avant chaque test
        $entityManager = static::getContainer()->get('doctrine')->getManager();
        $connection = $entityManager->getConnection();
        $platform = $connection->getDatabasePlatform();
        $connection->executeStatement($platform->getTruncateTableSQL('user', true));

        // Créer un utilisateur admin pour les tests
        $admin = new User();
        $admin->setUsername('admin');
        $admin->setEmail('admin@example.com');
        $hashedPassword = $this->passwordHasher->hashPassword($admin, 'password123');
        $admin->setPassword($hashedPassword);
        $admin->setStatus(UserStatus::ACTIVE);
        $this->userRepository->save($admin, true);

        // Obtenir le token JWT
        $this->client->request(
            'POST',
            '/api/login_check',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'username' => 'admin@example.com',
                'password' => 'password123'
            ])
        );

        $response = json_decode($this->client->getResponse()->getContent(), true);
        if (!isset($response['token'])) {
            throw new \Exception('Token JWT non généré. Réponse : ' . json_encode($response));
        }
        $this->token = $response['token'];
    }

    protected function authenticatedRequest(string $method, string $uri, array $data = []): void
    {
        $this->client->request(
            $method,
            $uri,
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_Authorization' => 'Bearer ' . $this->token
            ],
            $data ? json_encode($data) : null
        );
    }

    public function testRegisterUser(): void
    {
        $payload = [
            'username' => 'newuser',
            'email' => 'newuser@example.com',
            'password' => 'Password123!',
            'bio' => 'Bio de test',
            'avatarUrl' => 'https://example.com/avatar.jpg'
        ];

        $this->client->request(
            'POST',
            '/api/users/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($payload)
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $responseData = json_decode($this->client->getResponse()->getContent(), true);

        $this->assertArrayHasKey('user', $responseData);
        $this->assertEquals('newuser', $responseData['user']['username']);
        $this->assertEquals('newuser@example.com', $responseData['user']['email']);
        $this->assertArrayNotHasKey('password', $responseData['user']);
    }

    public function testListUsers(): void
    {
        // Créer plusieurs utilisateurs de test
        for ($i = 1; $i <= 3; $i++) {
            $user = new User();
            $user->setUsername('user' . $i);
            $user->setEmail('user' . $i . '@example.com');
            $hashedPassword = $this->passwordHasher->hashPassword($user, 'password123');
            $user->setPassword($hashedPassword);
            $user->setStatus(UserStatus::ACTIVE);
            $this->userRepository->save($user, true);
        }

        $this->authenticatedRequest('GET', '/api/users');

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $responseData = json_decode($this->client->getResponse()->getContent(), true);

        $this->assertArrayHasKey('users', $responseData);
        $this->assertArrayHasKey('pagination', $responseData);
        // On s'attend à 4 utilisateurs : l'admin + les 3 utilisateurs de test
        $this->assertCount(4, $responseData['users']);
    }

    public function testReadUser(): void
    {
        // Créer un utilisateur de test
        $user = new User();
        $user->setUsername('testuser');
        $user->setEmail('testuser@example.com');
        $hashedPassword = $this->passwordHasher->hashPassword($user, 'password123');
        $user->setPassword($hashedPassword);
        $user->setStatus(UserStatus::ACTIVE);
        $this->userRepository->save($user, true);

        $this->authenticatedRequest('GET', '/api/users/' . $user->getId());

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $responseData = json_decode($this->client->getResponse()->getContent(), true);

        $this->assertEquals('testuser', $responseData['username']);
        $this->assertEquals('testuser@example.com', $responseData['email']);
        $this->assertArrayNotHasKey('password', $responseData);
    }

    public function testUpdateUser(): void
    {
        // Créer un utilisateur de test
        $user = new User();
        $user->setUsername('testuser');
        $user->setEmail('testuser@example.com');
        $hashedPassword = $this->passwordHasher->hashPassword($user, 'password123');
        $user->setPassword($hashedPassword);
        $user->setStatus(UserStatus::ACTIVE);
        $this->userRepository->save($user, true);

        $payload = [
            'username' => 'updateduser',
            'email' => 'updated@example.com',
            'bio' => 'Nouvelle bio',
            'avatarUrl' => 'https://example.com/new-avatar.jpg'
        ];

        $this->authenticatedRequest('PUT', '/api/users/' . $user->getId(), $payload);

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $responseData = json_decode($this->client->getResponse()->getContent(), true);

        $this->assertEquals('updateduser', $responseData['username']);
        $this->assertEquals('updated@example.com', $responseData['email']);
        $this->assertEquals('Nouvelle bio', $responseData['bio']);
        $this->assertEquals('https://example.com/new-avatar.jpg', $responseData['avatarUrl']);
    }

    public function testDeleteUser(): void
    {
        // Créer un utilisateur de test
        $user = new User();
        $user->setUsername('testuser');
        $user->setEmail('testuser@example.com');
        $hashedPassword = $this->passwordHasher->hashPassword($user, 'password123');
        $user->setPassword($hashedPassword);
        $user->setStatus(UserStatus::ACTIVE);
        $this->userRepository->save($user, true);

        $userId = $user->getId();
        $this->authenticatedRequest('DELETE', '/api/users/' . $userId);

        $this->assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);

        // Vérifier que l'utilisateur est marqué comme supprimé
        $entityManager = static::getContainer()->get('doctrine')->getManager();
        $qb = $entityManager->createQueryBuilder();
        $qb->select('u')
           ->from(User::class, 'u')
           ->where('u.id = :id')
           ->setParameter('id', $userId);
        
        $deletedUser = $qb->getQuery()->getOneOrNullResult();
        $this->assertNotNull($deletedUser, "L'utilisateur devrait toujours exister mais être marqué comme supprimé");
        $this->assertNotNull($deletedUser->getDeletedAt(), "L'utilisateur devrait avoir une date de suppression");
    }

    protected function tearDown(): void
    {
        parent::tearDown();
        // Nettoyer la base de données après chaque test
        $users = $this->userRepository->findAll();
        foreach ($users as $user) {
            $this->userRepository->remove($user, true);
        }
    }
} 