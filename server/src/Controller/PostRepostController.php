<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use App\Entity\Post;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\UserRepost;
use App\Repository\UserRepostRepository;
use App\Entity\User;

final class PostRepostController extends AbstractController
{
    #[Route('/api/posts/{id}/repost', name: 'post_repost', methods: ['POST'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function repost(Post $post, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();

        // Vérifier si déjà reposté
        $existingRepost = $em->getRepository(UserRepost::class)->findOneBy([
            'user_id' => $user,
            'post' => $post,
        ]);

        if ($existingRepost) {
            return $this->json(['message' => 'Already reposted'], 400);
        }

        $repost = new UserRepost();
        $repost->setUser($user);
        $repost->setPost($post);
        $repost->setRepostedAt(new \DateTimeImmutable());

        $em->persist($repost);
        $em->flush();

        // Incrémenter le compteur de reposts du post
        $post->incrementRetweetsCount();

        return $this->json(['message' => 'Post reposted successfully'], 201);
    }

    #[Route('/api/posts/{id}/reposts', name: 'post_reposts_list', methods: ['GET'])]
    public function getReposts(Post $post): JsonResponse
    {
        $reposts = $post->getReposts(); 

        $users = $reposts->map(fn(UserRepost $repost) => $repost->getUser());

        return $this->json($users, 200, [], ['groups' => 'user:read']);
    }

    #[Route('/api/posts/{id}/repost', name: 'post_repost_delete', methods: ['DELETE'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function unRepost(Post $post, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();

        $repost = $em->getRepository(UserRepost::class)->findOneBy([
            'user_id' => $user,
            'post' => $post,
        ]);

        if (!$repost) {
            return $this->json(['message' => 'Repost not found'], 404);
        }

        $em->remove($repost);
        $em->flush();

        // Décrémenter le compteur de reposts du post
        $post->decrementRetweetsCount();

        return $this->json(['message' => 'Repost removed'], 200);
    }

}
