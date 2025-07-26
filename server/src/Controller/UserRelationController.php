<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use App\Entity\User;
use App\Entity\Follow;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;    

final class UserRelationController extends AbstractController
{   
    // Permettre aux utilisateurs de suivre ou de ne plus suivre un autre utilisateur
    #[Route('/api/users/{id}/follow', name: 'user_follow', methods: ['POST'])]
    public function followUser(User $targetUser, UserRepository $userRepo, EntityManagerInterface $em, TokenStorageInterface $tokenStorage): JsonResponse
    {
        /** @var User $currentUser */
        $currentUser = $tokenStorage->getToken()->getUser();

        if ($currentUser === $targetUser) {
            return new JsonResponse(['error' => 'You cannot follow yourself.'], Response::HTTP_BAD_REQUEST);
        }

        if ($currentUser->getFollowing()->contains($targetUser)) {
            // Unfollow
            $currentUser->removeFollowing($targetUser);
            $targetUser->removeFollower($currentUser);
            $currentUser->setFollowingNb($currentUser->getFollowingNb() - 1);
            $targetUser->setFollowersNb($targetUser->getFollowersNb() - 1);
            $message = 'Unfollowed user.';
        } else {
            // Follow
            $currentUser->addFollowing($targetUser);
            $targetUser->addFollower($currentUser);
            $currentUser->setFollowingNb($currentUser->getFollowingNb() + 1);
            $targetUser->setFollowersNb($targetUser->getFollowersNb() + 1);
            $message = 'Followed user.';
        }

        $em->flush();

        return new JsonResponse(['message' => $message], Response::HTTP_OK);
    }

    // Avoir la liste des followers d'un utilisateur
    #[Route('/api/users/{id}/followers', name: 'user_followers_list', methods: ['GET'])]
    public function getFollowers(User $user): JsonResponse
    {
        $followers = $user->getFollowers(); // Renvoie une collection de Follow

        // On extrait les utilisateurs qui sont les "follower"
        $followerUsers = array_map(
            fn(Follow $follow) => $follow->getFollower(),
            $followers->toArray()
        );

        return $this->json($followerUsers, 200, [], ['groups' => 'user:read']);
    }

    // Avoir la liste des utilisateurs suivis par un utilisateur
    #[Route('/api/users/{id}/following', name: 'user_following_list', methods: ['GET'])]
    public function getFollowing(User $user): JsonResponse
    {
        $following = $user->getFollowing(); // Renvoie une collection de Follow

        // On extrait les utilisateurs suivis ("followed")
        $followedUsers = array_map(
            fn(Follow $follow) => $follow->getFollowed(),
            $following->toArray()
        );

        return $this->json($followedUsers, 200, [], ['groups' => 'user:read']);
    }


}
