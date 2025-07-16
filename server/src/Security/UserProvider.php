<?php

namespace App\Security;

use App\Entity\User;
use App\Enum\UserStatus;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Doctrine\ORM\EntityManagerInterface;

class UserProvider implements UserProviderInterface
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function loadUserByIdentifier(string $identifier): UserInterface
    {
        // Essayer de trouver par email d'abord
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $identifier]);
        
        // Si pas trouvé par email, essayer par username
        if (!$user) {
            $user = $this->entityManager->getRepository(User::class)->findOneBy(['username' => $identifier]);
        }

        if (!$user) {
            throw new CustomUserMessageAuthenticationException('Nom d\'utilisateur/email ou mot de passe incorrect.');
        }

        if ($user->getStatus() !== UserStatus::ACTIVE) {
            throw new CustomUserMessageAuthenticationException('Ce compte est inactif.');
        }

        return $user;
    }

    public function refreshUser(UserInterface $user): UserInterface
    {
        return $this->loadUserByIdentifier($user->getUserIdentifier());
    }

    public function supportsClass(string $class): bool
    {
        return User::class === $class || is_subclass_of($class, User::class);
    }
} 