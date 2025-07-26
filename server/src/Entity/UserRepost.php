<?php

namespace App\Entity;

use App\Repository\UserRepostRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\DBAL\Types\Types;

#[ORM\Entity(repositoryClass: UserRepostRepository::class)]
class UserRepost
{
    // #[ORM\Id]
    // #[ORM\GeneratedValue]
    // #[ORM\Column]
    // private ?int $id = null;

    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'reposts')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['repost:read'])]
    private User $user_id;

    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: Post::class, inversedBy: 'reposts')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['repost:read'])]
    private Post $post;

    #[ORM\Column]
    private ?\DateTimeImmutable $reposted_at;

    public function __construct()
    {
        $this->reposted_at = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUserId(): ?int
    {
        return $this->user_id;
    }

    public function setUserId(int $user_id): static
    {
        $this->user_id = $user_id;

        return $this;
    }

    public function getPost(): ?Post
    {
        return $this->post;
    }

    public function setPost(Post $post): static
    {
        $this->post = $post;

        return $this;
    }

    public function getRepostedAt(): ?\DateTimeImmutable
    {
        return $this->reposted_at;
    }

    public function setRepostedAt(\DateTimeImmutable $reposted_at): static
    {
        $this->reposted_at = $reposted_at;

        return $this;
    }

    public function getUser(): User
    {
        return $this->user_id;
    }

    public function setUser(User $user): static
    {
        $this->user_id = $user;

        return $this;
    }
}
