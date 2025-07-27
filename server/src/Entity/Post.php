<?php

namespace App\Entity;

use App\Repository\PostRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity(repositoryClass: PostRepository::class)]
#[ORM\Table(name: 'posts')]
#[ORM\HasLifecycleCallbacks]
class Post
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['post:read', 'post:list'])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'posts')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['post:read', 'post:list', 'user:read', 'user:list'])]
    private ?User $user = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Assert\NotBlank(message: 'Le contenu ne peut pas être vide')]
    #[Assert\Length(
        min: 1,
        max: 1000,
        minMessage: 'Le contenu doit contenir au moins {{ limit }} caractère',
        maxMessage: 'Le contenu ne peut pas dépasser {{ limit }} caractères'
    )]
    #[Groups(['post:read', 'post:list', 'post:create', 'post:update'])]
    private ?string $content = null;

    #[ORM\Column(length: 20)]
    #[Assert\Choice(choices: ['original', 'retweet', 'reply'], message: 'Le type doit être original, retweet ou reply')]
    #[Groups(['post:read', 'post:list'])]
    private string $type = 'original';

    #[ORM\ManyToOne(targetEntity: Post::class)]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['post:read'])]
    private ?Post $parentPost = null;

    #[ORM\Column(length: 10, options: ['default' => 'fr'])]
    #[Groups(['post:read', 'post:create', 'post:update'])]
    private string $language = 'fr';
    
    #[ORM\Column(options: ['default' => 0])]
    #[Groups(['post:read', 'post:list'])]
    private int $repliesCount = 0;

    #[ORM\Column(options: ['default' => 0])]
    #[Groups(['post:read', 'post:list'])]
    private int $likesCount = 0;

    #[ORM\Column(options: ['default' => 0])]
    #[Groups(['post:read', 'post:list'])]
    private int $retweetsCount = 0;

    #[ORM\Column(options: ['default' => 0])]
    #[Groups(['post:read', 'post:list'])]
    private int $savedCount = 0;

    #[ORM\Column(options: ['default' => 0])]
    #[Groups(['post:read', 'post:list'])]
    private int $viewsCount = 0;

    #[ORM\Column(options: ['default' => 0])]
    #[Groups(['post:read'])]
    private int $impressionsCount = 0;

    #[ORM\Column(options: ['default' => 0])]
    #[Groups(['post:read'])]
    private int $clicksCount = 0;

    #[ORM\Column(type: Types::FLOAT, options: ['default' => 0])]
    #[Groups(['post:read'])]
    private float $engagementScore = 0.0;

    #[ORM\Column(options: ['default' => false])]
    #[Groups(['post:read'])]
    private bool $isPinned = false;

    #[ORM\Column(length: 20)]
    #[Assert\Choice(choices: ['active', 'hidden', 'deleted'], message: 'Le statut doit être active, hidden ou deleted')]
    #[Groups(['post:read'])]
    private string $status = 'active';

    #[ORM\Column(type: Types::STRING, length: 255, nullable: true)]
    #[Groups(['post:read', 'post:create', 'post:update'])]
    private string $imageUrl = '';

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['post:read', 'post:list'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['post:read'])]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['post:read'])]
    private ?\DateTimeInterface $deletedAt = null;
    
    #[ORM\OneToMany(mappedBy: 'post', targetEntity: UserLikePost::class)]
    #[Groups(['post:read'])]
    private Collection $likes;

    #[ORM\OneToMany(mappedBy: 'post', targetEntity: UserRepost::class)]
    #[Groups(['post:read'])]
    private Collection $reposts;

    #[ORM\OneToMany(mappedBy: 'post', targetEntity: UserSavePost::class)]
    #[Groups(['post:read'])]
    private Collection $savedPosts;

    public function __construct()
    {
        $this->likes = new ArrayCollection();
        $this->reposts = new ArrayCollection();
        $this->savedPosts = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
        $this->deletedAt = null;
    }
       
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;
        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): static
    {
        $this->content = $content;
        return $this;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;
        return $this;
    }

    public function getParentPost(): ?Post
    {
        return $this->parentPost;
    }

    public function setParentPost(?Post $parentPost): static
    {
        $this->parentPost = $parentPost;
        return $this;
    }

    public function getLanguage(): string
    {
        return $this->language;
    }

    public function setLanguage(string $language): static
    {
        $this->language = $language;
        return $this;
    }

    public function getLikesCount(): int
    {
        return $this->likesCount;
    }

    public function setLikesCount(int $likesCount): static
    {
        $this->likesCount = $likesCount;
        return $this;
    }

    public function incrementLikesCount(): static
    {
        $this->likesCount++;
        return $this;
    }

    public function decrementLikesCount(): static
    {
        $this->likesCount = max(0, $this->likesCount - 1);
        return $this;
    }

    public function getRetweetsCount(): int
    {
        return $this->retweetsCount;
    }

    public function setRetweetsCount(int $retweetsCount): static
    {
        $this->retweetsCount = $retweetsCount;
        return $this;
    }

    public function incrementRetweetsCount(): static
    {
        $this->retweetsCount++;
        return $this;
    }

    public function decrementRetweetsCount(): static
    {
        $this->retweetsCount = max(0, $this->retweetsCount - 1);
        return $this;
    }

    public function getSavedCount(): int
    {
        return $this->savedCount;
    }

    public function setSavedCount(int $savedCount): static
    {
        $this->savedCount = $savedCount;
        return $this;
    }

    public function incrementSavedCount(): static
    {
        $this->savedCount++;
        return $this;
    }

    public function decrementSavedCount(): static
    {
        $this->savedCount = max(0, $this->savedCount - 1);
        return $this;
    }

    public function getRepliesCount(): int
    {
        return $this->repliesCount;
    }

    public function setRepliesCount(int $repliesCount): static
    {
        $this->repliesCount = $repliesCount;
        return $this;
    }

    public function incrementRepliesCount(): static
    {
        $this->repliesCount++;
        return $this;
    }

    public function decrementRepliesCount(): static
    {
        $this->repliesCount = max(0, $this->repliesCount - 1);
        return $this;
    }

    public function getViewsCount(): int
    {
        return $this->viewsCount;
    }

    public function setViewsCount(int $viewsCount): static
    {
        $this->viewsCount = $viewsCount;
        return $this;
    }

    public function incrementViewsCount(): static
    {
        $this->viewsCount++;
        return $this;
    }

    public function getImpressionsCount(): int
    {
        return $this->impressionsCount;
    }

    public function setImpressionsCount(int $impressionsCount): static
    {
        $this->impressionsCount = $impressionsCount;
        return $this;
    }

    public function getClicksCount(): int
    {
        return $this->clicksCount;
    }

    public function setClicksCount(int $clicksCount): static
    {
        $this->clicksCount = $clicksCount;
        return $this;
    }

    public function getEngagementScore(): float
    {
        return $this->engagementScore;
    }

    public function setEngagementScore(float $engagementScore): static
    {
        $this->engagementScore = $engagementScore;
        return $this;
    }

    public function calculateEngagementScore(): static
    {
        $totalInteractions = $this->likesCount + $this->retweetsCount + $this->viewsCount;
        $this->engagementScore = $totalInteractions > 0 ? $totalInteractions / max(1, $this->viewsCount) : 0.0;
        return $this;
    }

    public function isPinned(): bool
    {
        return $this->isPinned;
    }

    public function setIsPinned(bool $isPinned): static
    {
        $this->isPinned = $isPinned;
        return $this;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;
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

    public function setUpdatedAt(\DateTimeInterface $updatedAt): static
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

    public function isDeleted(): bool
    {
        return $this->deletedAt !== null;
    }

    public function softDelete(): static
    {
        $this->deletedAt = new \DateTimeImmutable();
        $this->status = 'deleted';
        return $this;
    }

    public function restore(): static
    {
        $this->deletedAt = null;
        $this->status = 'active';
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

    public function getLikes(): Collection
    {
        return $this->likes;
    }

    public function getReposts(): Collection
    {
        return $this->reposts;
    }

    public function getSavedPosts(): Collection
    {
        return $this->savedPosts;
    }

    public function getImageUrl(): ?string
    {
        return $this->imageUrl;
    }

    public function setImageUrl(?string $imageUrl): static
    {
        $this->imageUrl = $imageUrl;
        return $this;
    }
} 