<?php 

// src/Validation/RoomMessage/CreateMessageDto.php
namespace App\Validation\RoomMessage;

use Symfony\Component\Validator\Constraints as Assert;

class CreateMessageDto
{
    #[Assert\NotBlank]
    public int $roomId;

    #[Assert\NotBlank]
    public int $userId;

    #[Assert\Length(max: 1000)]
    public ?string $content = null;

    // Pour l'image, tu peux adapter en fonction du format reçu
    public ?string $image = null;
}
