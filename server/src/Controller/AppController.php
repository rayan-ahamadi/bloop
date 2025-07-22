<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class AppController extends AbstractController
{
    // // src/Controller/AppController.php
    // #[Route('/{reactRouting}', name: 'app', requirements: ['reactRouting' => '^(?!api).+'], defaults: ['reactRouting' => null])]
    // public function index(): Response
    // {
    //     return $this->file($this->getParameter('kernel.project_dir').'/public/next/index.html');
    // }
}
