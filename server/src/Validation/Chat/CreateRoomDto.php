<?php

namespace App\Validation\Chat;

use Symfony\Component\Serializer\Annotation\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;

class CreateRoomDto
{
    #[Assert\Choice(choices: ['DM', 'GROUP'], message: 'Le type doit être DM ou GROUP')]
    #[SerializedName('type')]
    private string $type = 'DM';

    #[Assert\Length(
        min: 1,
        max: 100,
        minMessage: 'Le nom doit contenir au moins {{ limit }} caractère',
        maxMessage: 'Le nom ne peut pas dépasser {{ limit }} caractères'
    )]
    #[SerializedName('name')]
    private ?string $name = null;

    #[Assert\NotBlank(message: 'Les participants sont requis')]
    #[Assert\Type(type: 'array', message: 'Les participants doivent être un tableau')]
    #[SerializedName('participant_ids')]
    private array $participantIds = [];

    public function getType(): string
    {
        return $this->type;
    }

    public function setType(string $type): self
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

    public function getParticipantIds(): array
    {
        return $this->participantIds;
    }

    public function setParticipantIds(array $participantIds): self
    {
        $this->participantIds = $participantIds;
        return $this;
    }
}
