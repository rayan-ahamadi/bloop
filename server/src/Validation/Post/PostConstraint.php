<?php

namespace App\Validation\Post;

use Symfony\Component\Validator\Constraint;

#[\Attribute(\Attribute::TARGET_CLASS)]
class PostConstraint extends Constraint
{
    public string $emptyContentMessage = 'Le contenu du post ne peut pas être vide.';
    public string $contentTooLongMessage = 'Le contenu ne peut pas dépasser {{ limit }} caractères.';
    public string $invalidTypeMessage = 'Le type de post doit être original, retweet ou reply.';
    public string $parentPostNotFoundMessage = 'Le post parent spécifié n\'existe pas.';
    public string $parentPostInactiveMessage = 'Le post parent n\'est pas actif.';
    public string $invalidLanguageMessage = 'La langue spécifiée n\'est pas supportée.';

    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }

    public function validatedBy(): string
    {
        return PostValidator::class;
    }
} 