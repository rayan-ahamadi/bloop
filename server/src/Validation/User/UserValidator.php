<?php

namespace App\Validation\User;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Validator\ConstraintViolationListInterface;
use Symfony\Component\Validator\ConstraintViolation;
use App\Validation\User\UpdateUserDto;

class UserValidator
{
    public function __construct(
        private readonly ValidatorInterface $validator,
        private readonly UserRepository $userRepository
    ) {
    }

    public function validateCreateUser(CreateUserDto $dto): ConstraintViolationListInterface
    {
        // Validation des contraintes de base
        $violations = $this->validator->validate($dto);

        // Vérification de l'unicité de l'email
        if ($this->userRepository->findByEmail($dto->getEmail())) {
            $violations->add(new ConstraintViolation(
                'Cet email est déjà utilisé',
                null,
                [],
                $dto,
                'email',
                $dto->getEmail()
            ));
        }

        // Vérification de l'unicité du username
        if ($this->userRepository->findByUsername($dto->getUsername())) {
            $violations->add(new ConstraintViolation(
                'Ce nom d\'utilisateur est déjà utilisé',
                null,
                [],
                $dto,
                'username',
                $dto->getUsername()
            ));
        }

        // Validation de la date de naissance
        if ($dto->getBirthDate()) {
            $age = $dto->getBirthDate()->diff(new \DateTime())->y;
            if ($age < 13) {
                $violations->add(new ConstraintViolation(
                    'L\'utilisateur doit avoir au moins 13 ans',
                    null,
                    [],
                    $dto,
                    'birthDate',
                    $dto->getBirthDate()
                ));
            }
        }

        return $violations;
    }

    public function validateUpdateUser(UpdateUserDto $dto, ?User $existingUser = null): array
    {
        $violations = [];

        // Validation des contraintes de base
        $violations = array_merge($violations, $this->validateBasicConstraints($dto));

        // Si c'est une mise à jour, on vérifie l'unicité uniquement si les valeurs ont changé
        if ($existingUser) {
            if ($dto->getEmail() !== null && $dto->getEmail() !== $existingUser->getEmail()) {
                $violations = array_merge($violations, $this->validateEmailUniqueness($dto, $existingUser));
            }
            if ($dto->getUsername() !== null && $dto->getUsername() !== $existingUser->getUsername()) {
                $violations = array_merge($violations, $this->validateUsernameUniqueness($dto, $existingUser));
            }
        }

        // Validation de la date de naissance
        if ($dto->getBirthDate()) {
            $violations = array_merge($violations, $this->validateBirthDate($dto));
        }

        return $violations;
    }

    private function validateBasicConstraints(UpdateUserDto $dto): array
    {
        $violations = [];
        
        // Validation de l'email
        if ($dto->getEmail() !== null && !filter_var($dto->getEmail(), FILTER_VALIDATE_EMAIL)) {
            $violations[] = new ConstraintViolation(
                'L\'email n\'est pas valide',
                null,
                [],
                $dto,
                'email',
                $dto->getEmail()
            );
        }

        // Validation du username
        if ($dto->getUsername() !== null && strlen($dto->getUsername()) < 3) {
            $violations[] = new ConstraintViolation(
                'Le nom d\'utilisateur doit contenir au moins 3 caractères',
                null,
                [],
                $dto,
                'username',
                $dto->getUsername()
            );
        }

        // Validation du mot de passe (uniquement si fourni)
        if ($dto->getPassword() !== '') {
            if (strlen($dto->getPassword()) < 8) {
                $violations[] = new ConstraintViolation(
                    'Le mot de passe doit contenir au moins 8 caractères',
                    null,
                    [],
                    $dto,
                    'password',
                    $dto->getPassword()
                );
            }
        }

        return $violations;
    }

    private function validateEmailUniqueness(UpdateUserDto $dto, ?User $currentUser = null): array
    {
        $violations = [];
        if ($dto->getEmail() === null) {
            return $violations;
        }
        
        $existingUser = $this->userRepository->findByEmail($dto->getEmail());
        
        // Si l'email existe et appartient à un autre utilisateur
        if ($existingUser && (!$currentUser || $existingUser->getId() !== $currentUser->getId())) {
            $violations[] = new ConstraintViolation(
                'Cet email est déjà utilisé',
                null,
                [],
                $dto,
                'email',
                $dto->getEmail()
            );
        }
        return $violations;
    }

    private function validateUsernameUniqueness(UpdateUserDto $dto, ?User $currentUser = null): array
    {
        $violations = [];
        if ($dto->getUsername() === null) {
            return $violations;
        }
        
        $existingUser = $this->userRepository->findByUsername($dto->getUsername());
        
        // Si le username existe et appartient à un autre utilisateur
        if ($existingUser && (!$currentUser || $existingUser->getId() !== $currentUser->getId())) {
            $violations[] = new ConstraintViolation(
                'Ce nom d\'utilisateur est déjà utilisé',
                null,
                [],
                $dto,
                'username',
                $dto->getUsername()
            );
        }
        return $violations;
    }

    private function validateBirthDate(UpdateUserDto $dto): array
    {
        $violations = [];
        if ($dto->getBirthDate() === null) {
            return $violations;
        }
        
        $age = $dto->getBirthDate()->diff(new \DateTime())->y;
        if ($age < 13) {
            $violations[] = new ConstraintViolation(
                'L\'utilisateur doit avoir au moins 13 ans',
                null,
                [],
                $dto,
                'birthDate',
                $dto->getBirthDate()
            );
        }
        return $violations;
    }
} 