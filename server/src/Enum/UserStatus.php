<?php

namespace App\Enum;

class UserStatus
{
    public const ACTIVE = 'active';
    public const INACTIVE = 'inactive';
    public const BANNED = 'banned';
    public const PENDING = 'pending';

    public static function getValidStatuses(): array
    {
        return [
            self::ACTIVE,
            self::INACTIVE,
            self::BANNED,
            self::PENDING
        ];
    }

    public static function isValid(string $status): bool
    {
        return in_array($status, self::getValidStatuses(), true);
    }
} 