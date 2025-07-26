<?php

namespace App\Entity;

use App\Repository\UserSavePostRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\DBAL\Types\Types;

#[ORM\Entity(repositoryClass: UserSavePostRepository::class)]
class UserSavePost
{
    // #[ORM\Id]
    // #[ORM\GeneratedValue]
    // #[ORM\Column]
    // private ?int $id = null;

    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'savedPosts')]
    #[ORM\JoinColumn(nullable: false)]
    private User $user_id;

    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: Post::class, inversedBy: 'savedPosts')]
    #[ORM\JoinColumn(nullable: false)]
    private Post $post;

    #[ORM\Column]
    private ?\DateTimeImmutable $saved_at;

    public function __construct()
    {
        $this->saved_at = new \DateTimeImmutable();
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

    public function getSavedAt(): ?\DateTimeImmutable
    {
        return $this->saved_at;
    }

    public function setSavedAt(\DateTimeImmutable $saved_at): static
    {
        $this->saved_at = $saved_at;

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
