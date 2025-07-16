<?php

namespace App\Entity;

use App\Enum\UserStatus;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: 'users')]
#[ORM\HasLifecycleCallbacks]
class User implements PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user:read', 'user:list'])]
    private ?int $id = null;


    #[ORM\Column(length: 180)]
    #[Groups(['user:read', 'user:list', 'user:create', 'user:update'])]
    private string $name = '';

    #[ORM\Column(length: 180, unique: true, nullable: true)]
    #[Assert\NotBlank]
    #[Assert\Length(min: 3, max: 180)]
    #[Groups(['user:read', 'user:list', 'user:create', 'user:update'])]
    private string $username = '';

    #[ORM\Column(length: 180, unique: true)]
    #[Assert\NotBlank]
    #[Assert\Email]
    #[Groups(['user:read', 'user:list', 'user:create', 'user:update'])]
    private ?string $email = null;

    #[ORM\Column]
    #[Groups(['user:create', 'user:update'])]
    private ?string $password = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['user:read', 'user:list', 'user:create', 'user:update'])]
    private ?string $bio = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['user:read', 'user:list', 'user:create', 'user:update'])]
    private ?string $avatarUrl = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['user:read', 'user:list', 'user:create', 'user:update'])]
    private ?string $bannerUrl = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    #[Groups(['user:read', 'user:create', 'user:update'])]
    private ?\DateTimeInterface $birthDate = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    #[Groups(['user:read', 'user:create', 'user:update'])]
    private array $themes = [];

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['user:read'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['user:read'])]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['user:read'])]
    private ?\DateTimeInterface $deletedAt = null;

    #[ORM\Column(type: Types::INTEGER, options: ['default' => 0])]
    #[Groups(['user:read', 'user:update'])]
    private $followers_nb = 0;

    #[ORM\Column(type: Types::INTEGER, options: ['default' => 0])]
    #[Groups(['user:read', 'user:update'])]
    private $following_nb = 0;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Post::class, cascade: ['persist', 'remove'])]
    #[Groups(['user:read'])]
    private Collection $posts;

    #[ORM\OneToMany(mappedBy: 'follower', targetEntity: Follow::class)]
    #[Groups(['user:read'])]
    private Collection $following;

    #[ORM\OneToMany(mappedBy: 'followed', targetEntity: Follow::class)]
    #[Groups(['user:read'])]
    private Collection $followers;

    #[ORM\OneToMany(mappedBy: 'user_id', targetEntity: UserLikePost::class)]
    #[Groups(['user:read'])]
    private Collection $likes;

    #[ORM\OneToMany(mappedBy: 'user_id', targetEntity: UserRepost::class)]
    #[Groups(['user:read'])]
    private Collection $reposts;

    #[ORM\OneToMany(mappedBy: 'user_id', targetEntity: UserSavePost::class)]
    #[Groups(['user:read'])]
    private Collection $savedPosts;


    // #[Assert\Choice(callback: [UserStatus::class, 'getValidStatuses'])]
    // #[ORM\Column(type: Types::STRING, length: 20)]
    // #[Groups(['user:read'])]
    // private string $status = UserStatus::ACTIVE;

    // #[ORM\Column(type: 'boolean', options: ['default' => false])]
    // #[Groups(['user:read'])]
    // private bool $isVerified = false;

    // #[ORM\Column(type: 'datetime', nullable: true)]
    // #[Groups(['user:read'])]
    // private ?\DateTimeInterface $emailVerifiedAt = null;

    // #[ORM\Column(type: 'datetime', nullable: true)]
    // #[Groups(['user:read'])]
    // private ?\DateTimeInterface $lastLoginAt = null;

    // #[ORM\Column(type: 'string', length: 10, options: ['default' => 'fr'])]
    // #[Groups(['user:read', 'user:create', 'user:update'])]
    // private string $language = 'fr';

    // #[ORM\Column(type: 'string', length: 50, options: ['default' => 'Europe/Paris'])]
    // #[Groups(['user:read', 'user:create', 'user:update'])]
    // private string $timezone = 'Europe/Paris';

    

    public function __construct()
    {
        $this->status = UserStatus::ACTIVE;
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
        $this->posts = new ArrayCollection();
        $this->following = new ArrayCollection();
        $this->followers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;
        return $this;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;
        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;
        return $this;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;
        return $this;
    }

    public function getBio(): ?string
    {
        return $this->bio;
    }

    public function setBio(?string $bio): static
    {
        $this->bio = $bio;
        return $this;
    }

    public function getAvatarUrl(): ?string
    {
        return $this->avatarUrl;
    }

    public function setAvatarUrl(?string $avatarUrl): static
    {
        $this->avatarUrl = $avatarUrl;
        return $this;
    }

    public function getBannerUrl(): ?string
    {
        return $this->bannerUrl;
    }

    public function setBannerUrl(?string $bannerUrl): static
    {
        $this->bannerUrl = $bannerUrl;
        return $this;
    }


    public function getBirthDate(): ?\DateTimeInterface
    {
        return $this->birthDate;
    }

    public function setBirthDate(?\DateTimeInterface $birthDate): static
    {
        $this->birthDate = $birthDate;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): static
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeInterface $updatedAt): static
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }

    public function getDeletedAt(): ?\DateTimeInterface
    {
        return $this->deletedAt;
    }

    public function setDeletedAt(?\DateTimeInterface $deletedAt): static
    {
        $this->deletedAt = $deletedAt;
        return $this;
    }

    public function getThemes(): array
    {
        return $this->themes;
    }

    public function setThemes(array $themes): static
    {
        $this->themes = $themes;
        return $this;
    }

    public function getFollowersNb(): int
    {
        return $this->followers_nb;
    }

    public function setFollowersNb(int $followers_nb): static
    {
        $this->followers_nb = $followers_nb;
        return $this;
    }

    public function getFollowingNb(): int
    {
        return $this->following_nb;
    }

    public function setFollowingNb(int $following_nb): static
    {
        $this->following_nb = $following_nb;
        return $this;
    }

    public function addFollowing(User $user): static
    {
        if (!$this->following->contains($user)) {
            $this->following->add($user);
        }
        return $this;
    }

    public function removeFollowing(User $user): static
    {
        $this->following->removeElement($user);
        return $this;
    }

    public function addFollower(User $user): static
    {
        if (!$this->followers->contains($user)) {
            $this->followers->add($user);
        }
        return $this;
    }

    public function removeFollower(User $user): static
    {
        $this->followers->removeElement($user);
        return $this;
    }

    public function getFollowers(): Collection
    {
        return $this->followers;
    }

    public function getFollowing(): Collection
    {
        return $this->following;
    }


    /**
     * @return Collection<int, UserLikePost>
     */
    public function getLikes(): Collection
    {
        return $this->likes;
    }

    /**
     * @return Collection<int, UserRepost>
     */
    public function getReposts(): Collection
    {
        return $this->reposts;
    }

    /**
     * @return Collection<int, UserSavePost>
     */
    public function getSavedPosts(): Collection
    {
        return $this->savedPosts;
    }


    /**
     * @return Collection<int, Post>
     */
    public function getPosts(): Collection
    {
        return $this->posts;
    }

    public function addPost(Post $post): static
    {
        if (!$this->posts->contains($post)) {
            $this->posts->add($post);
            $post->setUser($this);
        }

        return $this;
    }

    public function removePost(Post $post): static
    {
        if ($this->posts->removeElement($post)) {
            // set the owning side to null (unless already changed)
            if ($post->getUser() === $this) {
                $post->setUser(null);
            }
        }

        return $this;
    }

    #[ORM\PreUpdate]
    public function setUpdatedAtValue(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
    }

    #[ORM\PrePersist]
    public function setCreatedAtValue(): void
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }
}
