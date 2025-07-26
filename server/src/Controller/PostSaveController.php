<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use App\Entity\Post;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\UserSavePost;
use App\Entity\User;
use App\Repository\UserSavePostRepository;

final class PostSaveController extends AbstractController
{
    #[Route('/api/posts/{id}/save', name: 'post_save', methods: ['POST'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function savePost(Post $post, EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        // Vérifie si le post est déjà sauvegardé
        $existingSave = $em->getRepository(UserSavePost::class)->findOneBy([
            'user_id' => $user,
            'post' => $post,
        ]);

        if ($existingSave) {
            // Déjà sauvegardé => on retire
            $em->remove($existingSave);
            $em->flush();

            $post->decrementSavedCount();

            return $this->json(['message' => 'Post unsaved.'], 200);
        }

        // Sinon, on sauvegarde
        $save = new UserSavePost();
        $save->setUser($user);
        $save->setPost($post);
        $save->setSavedAt(new \DateTimeImmutable());

        $em->persist($save);
        $em->flush();

        $post->incrementSavedCount();

        return $this->json(['message' => 'Post saved.'], 201);
    }
}
