<?php

namespace App\Validation\Post;

use App\Entity\Post;
use App\Repository\PostRepository;
use App\Repository\UserRepository;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

class PostValidator extends ConstraintValidator
{
    public function __construct(
        private readonly PostRepository $postRepository,
        private readonly UserRepository $userRepository
    ) {
    }

    public function validate(mixed $value, Constraint $constraint): void
    {
        if (!$constraint instanceof PostConstraint) {
            throw new UnexpectedTypeException($constraint, PostConstraint::class);
        }

        if (null === $value || '' === $value) {
            return;
        }

        if (!$value instanceof CreatePostDto && !$value instanceof UpdatePostDto) {
            throw new UnexpectedValueException($value, 'CreatePostDto|UpdatePostDto');
        }

        $this->validatePostData($value, $constraint);
    }

    private function validatePostData(CreatePostDto|UpdatePostDto $dto, PostConstraint $constraint): void
    {
        // Validation spécifique pour CreatePostDto
        if ($dto instanceof CreatePostDto) {
            $this->validateCreatePostDto($dto, $constraint);
        }

        // Validation spécifique pour UpdatePostDto
        if ($dto instanceof UpdatePostDto) {
            $this->validateUpdatePostDto($dto, $constraint);
        }
    }

    private function validateCreatePostDto(CreatePostDto $dto, PostConstraint $constraint): void
    {
        // Vérifier que le contenu n'est pas vide
        if (empty(trim($dto->getContent() ?? ''))) {
            $this->context->buildViolation($constraint->emptyContentMessage)
                ->atPath('content')
                ->addViolation();
            return;
        }

        // Vérifier la longueur du contenu
        $contentLength = mb_strlen(trim($dto->getContent() ?? ''));
        if ($contentLength > 1000) {
            $this->context->buildViolation($constraint->contentTooLongMessage)
                ->atPath('content')
                ->setParameter('{{ limit }}', 1000)
                ->addViolation();
        }

        // Vérifier le type de post
        if (!in_array($dto->getType(), ['original', 'retweet', 'reply'])) {
            $this->context->buildViolation($constraint->invalidTypeMessage)
                ->atPath('type')
                ->addViolation();
        }

        // Si c'est une réponse, vérifier que le post parent existe
        if ($dto->getType() === 'reply' && $dto->getParentPostId()) {
            $parentPost = $this->postRepository->find($dto->getParentPostId());
            if (!$parentPost) {
                $this->context->buildViolation($constraint->parentPostNotFoundMessage)
                    ->atPath('parent_post_id')
                    ->addViolation();
            } elseif ($parentPost->getStatus() !== 'active') {
                $this->context->buildViolation($constraint->parentPostInactiveMessage)
                    ->atPath('parent_post_id')
                    ->addViolation();
            }
        }

        // Vérifier la langue
        $validLanguages = ['fr', 'en', 'es', 'de', 'it'];
        if (!in_array($dto->getLanguage(), $validLanguages)) {
            $this->context->buildViolation($constraint->invalidLanguageMessage)
                ->atPath('language')
                ->addViolation();
        }
    }

    private function validateUpdatePostDto(UpdatePostDto $dto, PostConstraint $constraint): void
    {
        // Si le contenu est fourni, vérifier qu'il n'est pas vide
        if ($dto->getContent() !== null && empty(trim($dto->getContent()))) {
            $this->context->buildViolation($constraint->emptyContentMessage)
                ->atPath('content')
                ->addViolation();
            return;
        }

        // Si le contenu est fourni, vérifier sa longueur
        if ($dto->getContent() !== null) {
            $contentLength = mb_strlen(trim($dto->getContent()));
            if ($contentLength > 1000) {
                $this->context->buildViolation($constraint->contentTooLongMessage)
                    ->atPath('content')
                    ->setParameter('{{ limit }}', 1000)
                    ->addViolation();
            }
        }

        // Si la langue est fournie, vérifier qu'elle est valide
        if ($dto->getLanguage() !== null) {
            $validLanguages = ['fr', 'en', 'es', 'de', 'it'];
            if (!in_array($dto->getLanguage(), $validLanguages)) {
                $this->context->buildViolation($constraint->invalidLanguageMessage)
                    ->atPath('language')
                    ->addViolation();
            }
        }
    }
} 