<?php

namespace App\Validation\Post;

use Symfony\Component\Serializer\Annotation\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;

#[PostConstraint]
class CreatePostDto
{
    #[Assert\NotBlank(message: 'Le contenu ne peut pas être vide')]
    #[Assert\Length(
        min: 1,
        max: 1000,
        minMessage: 'Le contenu doit contenir au moins {{ limit }} caractère',
        maxMessage: 'Le contenu ne peut pas dépasser {{ limit }} caractères'
    )]
    #[SerializedName('content')]
    private ?string $content = null;

    #[Assert\Choice(choices: ['original', 'retweet', 'reply'], message: 'Le type doit être original, retweet ou reply')]
    #[SerializedName('type')]
    private string $type = 'original';

    #[Assert\Type(type: 'integer', message: 'L\'ID du post parent doit être un nombre entier')]
    #[SerializedName('parent_post_id')]
    private ?int $parentPostId = null;

    #[Assert\Choice(choices: ['fr', 'en', 'es', 'de', 'it'], message: 'La langue doit être fr, en, es, de ou it')]
    #[SerializedName('language')]
    private string $language = 'fr';

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(?string $content): self
    {
        $this->content = $content;
        return $this;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;
        return $this;
    }

    public function getParentPostId(): ?int
    {
        return $this->parentPostId;
    }

    public function setParentPostId(?int $parentPostId): self
    {
        $this->parentPostId = $parentPostId;
        return $this;
    }

    public function getLanguage(): string
    {
        return $this->language;
    }

    public function setLanguage(string $language): self
    {
        $this->language = $language;
        return $this;
    }
} 