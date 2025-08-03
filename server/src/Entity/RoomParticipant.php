<?php

namespace App\Entity;

use App\Repository\PostRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use App\Id\RoomParticipantId;


#[ORM\Entity]
#[ORM\Table(name: "rooms_participants")]
#[ORM\IdClass(RoomParticipantId::class)]
class RoomParticipant
{
    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: ChatRoom::class, inversedBy: "participants")]
    #[ORM\JoinColumn(nullable: false, onDelete: "CASCADE")]
    private ChatRoom $room;

    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: "CASCADE")]
    #[Groups(['room:read', 'user:read'])]
    private User $user;

    #[ORM\Column(type: "datetime_immutable")]
    #[Groups(['room:read'])]
    private \DateTimeImmutable $joinedAt;

    public function __construct()
    {
        $this->joinedAt = new \DateTimeImmutable();
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

    public function getUser(): User
    {
        return $this->user;
    }

    public function setUser(User $user): self
    {
        $this->user = $user;
        return $this;
    }

    public function getJoinedAt(): \DateTimeImmutable
    {
        return $this->joinedAt;
    }

    public function setJoinedAt(\DateTimeImmutable $joinedAt): self
    {
        $this->joinedAt = $joinedAt;
        return $this;
    }
}
