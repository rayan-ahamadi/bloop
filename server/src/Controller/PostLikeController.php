<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Post;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use App\Entity\UserLikePost;
use App\Repository\UserLikePostRepository;
use App\Entity\User;

final class PostLikeController extends AbstractController
{
    #[Route('/api/posts/{id}/like', name: 'post_like', methods: ['POST'])]
    public function likePost(Post $post, EntityManagerInterface $em, TokenStorageInterface $tokenStorage, UserLikePostRepository $likeRepo): JsonResponse
    {
        /** @var User $currentUser */
        $currentUser = $tokenStorage->getToken()->getUser();

        $existingLike = $likeRepo->findOneBy([
            'user_id' => $currentUser,
            'post' => $post
        ]);

        if ($existingLike) {
            // Unlike
            $em->remove($existingLike);
            $message = 'Post unliked.';
            $post->decrementLikesCount();
        } else {
            // Like
            $like = new UserLikePost();
            $like->setUser($currentUser);
            $like->setPost($post);
            $like->setLikedAt(new \DateTimeImmutable());
            $post->incrementLikesCount();
            $em->persist($like);
            $message = 'Post liked.';
        }

        $em->flush();

        return new JsonResponse(['message' => $message], Response::HTTP_OK);
    }

    #[Route('/api/posts/{id}/like', name: 'post_likes_list', methods: ['GET'])]
    public function getLikes(Post $post, UserLikePostRepository $likeRepo): JsonResponse
    {
        $likes = $post->getLikes(); 

         // On récupère les utilisateurs à partir des UserLikePost
        $users = $likes->map(fn(UserLikePost $like) => $like->getUser());

        return $this->json($users, 200, [], ['groups' => 'user:read']);
    }

}
