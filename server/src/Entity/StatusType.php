<?php

namespace App\Entity;

enum StatusType: string
{
    case ACTIVE = 'active';
    case SUSPENDED = 'suspended';
    case BANNED = 'banned';
} 