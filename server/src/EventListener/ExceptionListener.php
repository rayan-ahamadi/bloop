<?php

namespace App\EventListener;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Validator\Exception\ValidationFailedException;

class ExceptionListener
{
    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();
        $response = new JsonResponse();

        if ($exception instanceof HttpException) {
            $response->setStatusCode($exception->getStatusCode());
            $response->setData([
                'error' => $exception->getMessage(),
                'status' => $exception->getStatusCode()
            ]);
        } elseif ($exception instanceof ValidationFailedException) {
            $response->setStatusCode(JsonResponse::HTTP_BAD_REQUEST);
            $violations = [];
            foreach ($exception->getViolations() as $violation) {
                $violations[$violation->getPropertyPath()] = $violation->getMessage();
            }
            $response->setData([
                'error' => 'Validation failed',
                'violations' => $violations
            ]);
        } else {
            $response->setStatusCode(JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
            $response->setData([
                'error' => 'Une erreur est survenue',
                'exception_class' => get_class($exception),
                'message' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
            ]);
        }

        $event->setResponse($response);
    }
} 