<?php

namespace App\Entity;

use App\Repository\FollowRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\DBAL\Types\Types;

#[ORM\Entity(repositoryClass: FollowRepository::class)]
class Follow
{
    // #[ORM\Id]
    // #[ORM\GeneratedValue]
    // #[ORM\Column]
    // private ?int $id = null;

    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'following')]
    #[ORM\JoinColumn(nullable: false)]
    private User $follower;

    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'followers')]
    #[ORM\JoinColumn(nullable: false)]
    private User $followed;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTime $followed_at;

    public function __construct()
    {
        $this->followed_at = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFollower(): ?User
    {
        return $this->follower;
    }

    public function setFollower(int $follower): static
    {
        $this->follower = $follower;

        return $this;
    }

    public function getFollowed(): ?User
    {
        return $this->followed;
    }

    public function setFollowed(int $followed): static
    {
        $this->followed = $followed;

        return $this;
    }

    public function getFollowedAt(): ?\DateTime
    {
        return $this->followed_at;
    }

    public function setFollowedAt(\DateTime $followed_at): static
    {
        $this->followed_at = $followed_at;

        return $this;
    }
}
