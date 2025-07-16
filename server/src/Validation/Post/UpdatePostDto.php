<?php

namespace App\Validation\Post;

use Symfony\Component\Serializer\Annotation\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;

#[PostConstraint]
class UpdatePostDto
{
    #[Assert\Length(
        min: 1,
        max: 1000,
        minMessage: 'Le contenu doit contenir au moins {{ limit }} caractère',
        maxMessage: 'Le contenu ne peut pas dépasser {{ limit }} caractères'
    )]
    #[SerializedName('content')]
    private ?string $content = null;

    #[Assert\Choice(choices: ['fr', 'en', 'es', 'de', 'it'], message: 'La langue doit être fr, en, es, de ou it')]
    #[SerializedName('language')]
    private ?string $language = null;

    #[Assert\Type(type: 'boolean', message: 'La valeur is_pinned doit être un booléen')]
    #[SerializedName('is_pinned')]
    private ?bool $isPinned = null;

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(?string $content): self
    {
        $this->content = $content;
        return $this;
    }

    public function getLanguage(): ?string
    {
        return $this->language;
    }

    public function setLanguage(?string $language): self
    {
        $this->language = $language;
        return $this;
    }

    public function getIsPinned(): ?bool
    {
        return $this->isPinned;
    }

    public function setIsPinned(?bool $isPinned): self
    {
        $this->isPinned = $isPinned;
        return $this;
    }
} 