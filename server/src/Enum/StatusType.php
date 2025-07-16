<?php

namespace App\Enum;

enum StatusType: string
{
    case ACTIVE = 'active';
    case SUSPENDED = 'suspended';
    case BANNED = 'banned';

    public function getLabel(): string
    {
        return match($this) {
            self::ACTIVE => 'Actif',
            self::SUSPENDED => 'Suspendu',
            self::BANNED => 'Banni',
        };
    }
} 