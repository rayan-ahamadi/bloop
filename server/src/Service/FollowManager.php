<?php

class FollowManager
{
    public function follow(User $follower, User $followed): void
    {
        $follower->addFollowing($followed);
        $followed->addFollower($follower);

        $follower->incrementFollowingNb();
        $followed->incrementFollowersNb();
    }

    public function unfollow(User $follower, User $followed): void
    {
        $follower->removeFollowing($followed);
        $followed->removeFollower($follower);

        $follower->decrementFollowingNb();
        $followed->decrementFollowersNb();
    }
}
