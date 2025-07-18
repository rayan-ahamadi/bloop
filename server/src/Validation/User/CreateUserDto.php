<?php

namespace App\Validation\User;

use Symfony\Component\Serializer\Annotation\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;

class CreateUserDto
{



    #[Assert\NotBlank(message: 'Le nom est obligatoire', groups: ['user:create'])]
    #[Assert\Length(
        min: 2,
        max: 50,
        minMessage: 'Le nom doit faire au moins {{ limit }} caractères',
        maxMessage: 'Le nom ne peut pas faire plus de {{ limit }} caractères',
        groups: ['user:create', 'user:update']
    )]
    #[Assert\Regex(
        pattern: '/^[a-zA-ZÀ-ÿ\s\-]+$/',
        message: 'Le nom ne peut contenir que des lettres, des espaces et des tirets',
        groups: ['user:create', 'user:update']
    )]
    #[SerializedName('name')]
    private string $name = '';


    #[Assert\NotBlank(message: 'Le nom d\'utilisateur est obligatoire', groups: ['user:create'])]
    #[Assert\Length(
        min: 3,
        max: 50,
        minMessage: 'Le nom d\'utilisateur doit faire au moins {{ limit }} caractères',
        maxMessage: 'Le nom d\'utilisateur ne peut pas faire plus de {{ limit }} caractères',
        groups: ['user:create', 'user:update']
    )]
    #[Assert\Regex(
        pattern: '/^[a-zA-Z0-9_]+$/',
        message: 'Le nom d\'utilisateur ne peut contenir que des lettres, des chiffres et des underscores',
        groups: ['user:create', 'user:update']
    )]
    #[SerializedName('username')]
    private string $username = '';


    #[Assert\NotBlank(message: 'L\'email est obligatoire', groups: ['user:create'])]
    #[Assert\Email(message: 'L\'email {{ value }} n\'est pas valide', groups: ['user:create', 'user:update'])]
    #[Assert\Length(
        max: 100,
        maxMessage: 'L\'email ne peut pas faire plus de {{ limit }} caractères',
        groups: ['user:create', 'user:update']
    )]
    #[SerializedName('email')]
    private string $email = '';

    #[Assert\NotBlank(message: 'Le mot de passe est obligatoire', groups: ['user:create'])]
    #[Assert\Length(
        min: 8,
        minMessage: 'Le mot de passe doit faire au moins {{ limit }} caractères',
        groups: ['user:create', 'user:update']
    )]
    #[Assert\Regex(
        pattern: '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]{8,}$/',
        message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial',
        groups: ['user:create', 'user:update']
    )]
    #[SerializedName('password')]
    private string $password = '';

    #[Assert\Length(
        max: 500,
        maxMessage: 'La bio ne peut pas faire plus de {{ limit }} caractères',
        groups: ['user:create', 'user:update']
    )]
    #[SerializedName('bio')]
    private ?string $bio = null;

    #[Assert\Url(requireTld: true, message: 'L\'URL de l\'avatar n\'est pas valide', groups: ['user:create', 'user:update'])]
    #[SerializedName('avatarUrl')]
    private ?string $avatarUrl = null;

    #[Assert\Url(requireTld: true, message: 'L\'URL de la bannière n\'est pas valide', groups: ['user:create', 'user:update'])]
    #[SerializedName('bannerUrl')]
    private ?string $bannerUrl = null;

    #[Assert\Length(
        max: 100,
        maxMessage: 'La localisation ne peut pas faire plus de {{ limit }} caractères',
        groups: ['user:create', 'user:update']
    )]
    #[SerializedName('location')]
    private ?string $location = null;

    #[Assert\Url(requireTld: true, message: 'L\'URL du site web n\'est pas valide', groups: ['user:create', 'user:update'])]
    #[SerializedName('website')]
    private ?string $website = null;

    #[Assert\LessThan(
        'today',
        message: 'La date de naissance doit être antérieure à aujourd\'hui',
        groups: ['user:create', 'user:update']
    )]
    #[SerializedName('birthDate')]
    private ?\DateTimeInterface $birthDate = null;

    #[Assert\Timezone(message: 'Le fuseau horaire {{ value }} n\'est pas valide', groups: ['user:create', 'user:update'])]
    #[SerializedName('timezone')]
    private string $timezone = 'Europe/Paris';



    #[Assert\NotBlank(message: 'Les thèmes sont obligatoires', groups: ['user:create'])]
    #[Assert\Type(type: 'array', message: 'Les thèmes doivent être un tableau', groups: ['user:create'])]
    #[Assert\Count(
        min: 1,
        minMessage: 'Vous devez sélectionner au moins un thème',
        groups: ['user:create']
    )]
    #[Assert\All(
        constraints: [
            new Assert\NotBlank(message: 'Chaque thème ne peut pas être vide', groups: ['user:create']),
            new Assert\Length(
                max: 50,
                maxMessage: 'Chaque thème ne peut pas faire plus de {{ limit }} caractères',
                groups: ['user:create']
            ),
            new Assert\Regex(
                pattern: '/^[a-zA-Z0-9_]+$/',
                message: 'Chaque thème ne peut contenir que des lettres, des chiffres et des underscores',
                groups: ['user:create']
            )
        ],
    )]
    private array $themes = [];

    // Getters and Setters

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }




    /**
     * @return array
     */
    public function getThemes(): array
    {
        return $this->themes;
    }

    /**
     * @param array $themes
     * @return self
     */
    public function setThemes(array $themes): self
    {
        $this->themes = $themes;
        return $this;
    }

    
    public function getUsername(): string
    {
        return $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;
        return $this;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;
        return $this;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;
        return $this;
    }

    public function getBio(): ?string
    {
        return $this->bio;
    }

    public function setBio(?string $bio): self
    {
        $this->bio = $bio;
        return $this;
    }

    public function getAvatarUrl(): ?string
    {
        return $this->avatarUrl;
    }

    public function setAvatarUrl(?string $avatarUrl): self
    {
        $this->avatarUrl = $avatarUrl;
        return $this;
    }

    public function getBannerUrl(): ?string
    {
        return $this->bannerUrl;
    }

    public function setBannerUrl(?string $bannerUrl): self
    {
        $this->bannerUrl = $bannerUrl;
        return $this;
    }

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(?string $location): self
    {
        $this->location = $location;
        return $this;
    }

    public function getWebsite(): ?string
    {
        return $this->website;
    }

    public function setWebsite(?string $website): self
    {
        $this->website = $website;
        return $this;
    }

    public function getBirthDate(): ?\DateTimeInterface
    {
        return $this->birthDate;
    }

    public function setBirthDate(?\DateTimeInterface $birthDate): self
    {
        $this->birthDate = $birthDate;
        return $this;
    }

    public function getTimezone(): string
    {
        return $this->timezone;
    }

    public function setTimezone(string $timezone): self
    {
        $this->timezone = $timezone;
        return $this;
    }
} 