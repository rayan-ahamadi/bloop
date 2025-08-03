<?php 

// src/DTO/CreateMessageDTO.php
namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class CreateMessageDTO
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
