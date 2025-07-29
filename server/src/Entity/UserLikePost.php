<?php

namespace App\Entity;

use App\Repository\UserLikePostRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\DBAL\Types\Types;

#[ORM\Entity(repositoryClass: UserLikePostRepository::class)]
class UserLikePost
{
    // #[ORM\Id]
    // #[ORM\GeneratedValue]
    // #[ORM\Column]
    // private ?int $id = null;

    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'likes')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['like:read'])]
    private User $user_id;

    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: Post::class, inversedBy: 'likes')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['like:read', 'post:read'])]
    private Post $post;

    #[ORM\Column]
    private ?\DateTimeImmutable $liked_at;

    public function __construct()
    {
        $this->liked_at = new \DateTimeImmutable();
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

    public function getLikedAt(): ?\DateTimeImmutable
    {
        return $this->liked_at;
    }

    public function setLikedAt(\DateTimeImmutable $liked_at): static
    {
        $this->liked_at = $liked_at;

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
