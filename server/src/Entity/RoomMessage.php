<?php

namespace App\Entity;

use App\Repository\PostRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity]
#[ORM\Table(name: "rooms_messages")]
class RoomMessage
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    #[Groups(['message:read'])]
    private int $id;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: "CASCADE")]
    #[Groups(['message:read'])]
    private User $user;

    #[ORM\ManyToOne(targetEntity: ChatRoom::class, inversedBy: "messages")]
    #[ORM\JoinColumn(nullable: false, onDelete: "CASCADE")]
    private ChatRoom $room;

    #[ORM\Column(type: "text")]
    #[Groups(['message:read'])]
    private string $content;

    #[ORM\Column(type: "string", nullable: true)]
    #[Groups(['message:read'])]
    private ?string $image = null;

    #[ORM\ManyToMany(targetEntity: User::class)]
    #[ORM\JoinTable(name: 'message_reads')]
    private Collection $readBy;

    #[ORM\Column(type: "datetime_immutable")]
    #[Groups(['message:read'])]
    private \DateTimeImmutable $sentAt;

    #[Groups(['message:read'])]
    private ?bool $read = null;

    public function __construct()
    {
        $this->sentAt = new \DateTimeImmutable();
        $this->readBy = new ArrayCollection();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function setUser(User $user): self
    {
        $this->user = $user;
        return $this;
    }

    public function getRoom(): ChatRoom
    {
        return $this->room;
    }

    public function setRoom(ChatRoom $room): self
    {
        $this->room = $room;
        return $this;
    }

    public function getContent(): string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;
        return $this;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(?string $image): self
    {
        $this->image = $image;
        return $this;
    }

    public function getSentAt(): \DateTimeImmutable
    {
        return $this->sentAt;
    }

    public function setSentAt(\DateTimeImmutable $sentAt): self
    {
        $this->sentAt = $sentAt;
        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getReadBy(): Collection
    {
        return $this->readBy;
    }

    public function addReadBy(User $user): self
    {
        if (!$this->readBy->contains($user)) {
            $this->readBy->add($user);
        }
        return $this;
    }

    public function removeReadBy(User $user): self
    {
        $this->readBy->removeElement($user);
        return $this;
    }

    public function markAsReadBy(User $user): self
    {
        return $this->addReadBy($user);
    }

    public function isReadBy(User $user): bool
    {
        return $this->readBy->contains($user);
    }

    public function setRead(?bool $read): self
    {
        $this->read = $read;
        return $this;
    }

    public function isRead(): ?bool
    {
        return $this->read;
    }
    
}
