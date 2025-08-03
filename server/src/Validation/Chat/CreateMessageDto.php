<?php

namespace App\Validation\Chat;

use Symfony\Component\Serializer\Annotation\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;

class CreateMessageDto
{
    #[Assert\NotBlank(message: 'Le contenu ne peut pas être vide')]
    #[Assert\Length(
        min: 1,
        max: 2000,
        minMessage: 'Le contenu doit contenir au moins {{ limit }} caractère',
        maxMessage: 'Le contenu ne peut pas dépasser {{ limit }} caractères'
    )]
    #[SerializedName('content')]
    private ?string $content = null;

    #[SerializedName('image')]
    private ?string $image = null;

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(?string $content): self
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
}
