<?php

namespace App\Entity;

use App\Repository\PostRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use App\Enum\ChatRoomType;

#[ORM\Entity]
#[ORM\Table(name: "chat_rooms")]
class ChatRoom
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    #[Groups(['room:read'])]
    private int $id;

    #[ORM\Column(type: 'string', length: 100, nullable: true, unique: true)]
    #[Groups(['room:read'])]
    private ?string $identifier = null; 

    #[ORM\Column(type: "string", enumType: ChatRoomType::class)]
    #[Groups(['room:read'])]
    private ChatRoomType $type; // Enum: DM, Group

    #[ORM\Column(type: "string", nullable: true)]
    #[Groups(['room:read'])]
    private ?string $name = null;

    #[ORM\Column(type: "datetime_immutable")]
    #[Groups(['room:read'])]
    private \DateTimeImmutable $createdAt;

    #[ORM\OneToMany(mappedBy: "room", targetEntity: RoomParticipant::class, orphanRemoval: true)]
    #[Groups(['room:read'])]
    private Collection $participants;

    #[ORM\OneToMany(mappedBy: "room", targetEntity: RoomMessage::class, orphanRemoval: true)]
    private Collection $messages;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->participants = new ArrayCollection();
        $this->messages = new ArrayCollection();
    }

    // Getters/Setters...
    public function getId(): int
    {
        return $this->id;
    }

    public function getIdentifier(): string
    {
        return $this->identifier;
    }

    public function setIdentifier(string $identifier): self
    {
        $this->identifier = $identifier;
        return $this;
    }

    #[ORM\PrePersist]
    public function generateIdentifier(): void
    {
        if (!$this->identifier) {
            if ($this->type === ChatRoomType::DM) {
                // Pour DM : "dm_{user1_id}_{user2_id}" (toujours dans l'ordre croissant)
                $participants = $this->getParticipants()->toArray();
                if (count($participants) === 2) {
                    $ids = array_map(fn($p) => $p->getUser()->getId(), $participants);
                    sort($ids); // Ordre croissant pour cohérence
                    $this->identifier = "dm_" . implode('_', $ids);
                } else {
                    $this->identifier = "dm_" . uniqid();
                }
            } else {
                // Pour groupes : "group_{nom_sanitize}" ou "group_{unique_id}"
                if ($this->name) {
                    $sanitized = preg_replace('/[^a-zA-Z0-9_]/', '_', strtolower($this->name));
                    $this->identifier = "group_" . $sanitized . "_" . substr(uniqid(), -6);
                } else {
                    $this->identifier = "group_" . uniqid();
                }
            }
        }
    }

    public function getType(): ChatRoomType
    {
        return $this->type;
    }

    public function setType(ChatRoomType $type): self
    {
        $this->type = $type;
        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    /**
     * @return Collection<int, RoomParticipant>
     */
    public function getParticipants(): Collection
    {
        return $this->participants;
    }

    public function addParticipant(RoomParticipant $participant): self
    {
        if (!$this->participants->contains($participant)) {
            $this->participants->add($participant);
            $participant->setRoom($this);
        }
        return $this;
    }

    public function removeParticipant(RoomParticipant $participant): self
    {
        if ($this->participants->removeElement($participant)) {
            if ($participant->getRoom() === $this) {
                $participant->setRoom(null);
            }
        }
        return $this;
    }

    /**
     * @return Collection<int, RoomMessage>
     */
    public function getMessages(): Collection
    {
        return $this->messages;
    }

    public function addMessage(RoomMessage $message): self
    {
        if (!$this->messages->contains($message)) {
            $this->messages->add($message);
            $message->setRoom($this);
        }
        return $this;
    }

    public function removeMessage(RoomMessage $message): self
    {
        if ($this->messages->removeElement($message)) {
            if ($message->getRoom() === $this) {
                $message->setRoom(null);
            }
        }
        return $this;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->getId(),
            'identifier' => $this->getIdentifier(),
            'type' => $this->getType()->value,
            'name' => $this->getName(),
            'createdAt' => $this->getCreatedAt()->format('Y-m-d H:i:s'),
            'participants' => array_map(fn(RoomParticipant $p) => $p->toArray(), $this->getParticipants()->toArray()),
            'messages' => array_map(fn(RoomMessage $m) => $m->toArray(), $this->getMessages()->toArray()),
        ];
    }
}
