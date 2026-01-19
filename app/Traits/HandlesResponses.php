<?php
// app/Traits/HandlesResponses.php

namespace App\Traits;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

trait HandlesResponses
{
    /**
     * Handle API and web responses with multiple options
     *
     * @param Request $request
     * @param mixed $data
     * @param string|null $viewPath
     * @param array $viewData
     * @param string|null $redirectTo
     * @param array $sessionData
     * @param bool $withInput
     * @return JsonResponse|InertiaResponse|RedirectResponse
     */
    protected function respond(
        Request $request,
        $data,
        ?string $viewPath = null,
        array $viewData = [],
        ?string $redirectTo = null,
        array $sessionData = [],
        bool $withInput = false
    ) {
        if ($request->wantsJson() || $request->is('api/*')) {
            return $this->jsonResponse($data);
        }

        // Handle redirect with session data
        if ($redirectTo) {
            $redirect = $redirectTo === 'back'
                ? redirect()->back()
                : redirect()->to($redirectTo);

            if ($withInput) {
                $redirect = $redirect->withInput();
            }

            foreach ($sessionData as $key => $value) {
                $redirect = $redirect->with($key, $value);
            }

            return $redirect;
        }

        // Handle Inertia response
        if ($viewPath) {
            $props = array_merge($viewData, ['data' => $data]);

            // Add session data to props if it's a flash message
            if (isset($sessionData['success'])) {
                $props['flash'] = ['success' => $sessionData['success']];
            }
            if (isset($sessionData['error'])) {
                $props['flash'] = ['error' => $sessionData['error']];
            }

            return Inertia::render($viewPath, $props);
        }

        // Default: redirect back with data
        return redirect()->back()->with($sessionData);
    }

    /**
     * Success response with automatic session handling
     *
     * @param Request $request
     * @param mixed $data
     * @param string $message
     * @param string|null $viewPath
     * @param string|null $redirectTo
     * @return JsonResponse|InertiaResponse|RedirectResponse
     */
    protected function success(
        Request $request,
        $data = null,
        string $message = 'Operation successful',
        ?string $viewPath = null,
        ?string $redirectTo = null
    ) {
        if ($request->wantsJson() || $request->is('api/*')) {
            return $this->jsonResponse($data, 200, $message);
        }

        $sessionData = ['success' => $message];

        return $this->respond(
            request: $request,
            data: $data,
            viewPath: $viewPath,
            redirectTo: $redirectTo,
            sessionData: $sessionData
        );
    }

    /**
     * Error response with validation/error handling
     *
     * @param Request $request
     * @param string $message
     * @param int $status
     * @param array|null $errors
     * @param string|null $redirectTo
     * @param bool $withInput
     * @return JsonResponse|RedirectResponse
     */
    protected function error(
        Request $request,
        string $message = 'An error occurred',
        int $status = 400,
        ?array $errors = null,
        ?string $redirectTo = null,
        bool $withInput = false
    ) {
        if ($request->wantsJson() || $request->is('api/*')) {
            return $this->jsonError($message, $status, $errors);
        }

        $redirect = $redirectTo === 'back' || $redirectTo === null
            ? redirect()->back()
            : redirect()->to($redirectTo);

        if ($withInput) {
            $redirect = $redirect->withInput();
        }

        if ($errors) {
            $redirect = $redirect->withErrors($errors);
        }

        return $redirect->with('error', $message);
    }

    /**
     * Create JSON response
     *
     * @param mixed $data
     * @param int $statusCode
     * @param string|null $message
     * @param bool $success
     * @return JsonResponse
     */
    protected function jsonResponse(
        $data = null,
        int $statusCode = 200,
        ?string $message = null,
        bool $success = true
    ): JsonResponse {
        $response = [
            'success' => $success,
            'data' => $data,
        ];

        if ($message !== null) {
            $response['message'] = $message;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Create error JSON response
     *
     * @param string $message
     * @param int $statusCode
     * @param array|null $errors
     * @param mixed $data
     * @return JsonResponse
     */
    protected function jsonError(
        string $message,
        int $statusCode = 400,
        ?array $errors = null,
        $data = null
    ): JsonResponse {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        if ($data) {
            $response['data'] = $data;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Resource response (for CRUD operations)
     *
     * @param Request $request
     * @param mixed $data
     * @param string $resourceName
     * @param string|null $viewPath
     * @param string|null $redirectTo
     * @param string $message
     * @return JsonResponse|InertiaResponse|RedirectResponse
     */
    protected function resourceResponse(
        Request $request,
        $data,
        string $resourceName,
        ?string $viewPath = null,
        ?string $redirectTo = null,
        string $message = 'Operation successful'
    ) {
        $wrappedData = [$resourceName => $data];

        if ($request->wantsJson() || $request->is('api/*')) {
            return $this->jsonResponse($wrappedData, 200, $message);
        }

        if ($redirectTo) {
            return redirect()->to($redirectTo)
                ->with('success', $message)
                ->with($resourceName, $data);
        }

        if ($viewPath) {
            return Inertia::render($viewPath, [
                $resourceName => $data,
                'flash' => ['success' => $message]
            ]);
        }

        return redirect()->back()
            ->with('success', $message)
            ->with($resourceName, $data);
    }

    /**
     * Validation error response
     *
     * @param Request $request
     * @param array $errors
     * @param string $message
     * @param bool $withInput
     * @return JsonResponse|RedirectResponse
     */
    protected function validationError(
        Request $request,
        array $errors,
        string $message = 'Validation failed',
        bool $withInput = true
    ) {
        return $this->error(
            request: $request,
            message: $message,
            status: 422,
            errors: $errors,
            redirectTo: 'back',
            withInput: $withInput
        );
    }

    /**
     * Redirect with session data
     *
     * @param string $to
     * @param array $sessionData
     * @param bool $withInput
     * @return RedirectResponse
     */
    protected function redirectWith(
        string $to = 'back',
        array $sessionData = [],
        bool $withInput = false
    ): RedirectResponse {
        $redirect = $to === 'back'
            ? redirect()->back()
            : redirect()->to($to);

        if ($withInput) {
            $redirect = $redirect->withInput();
        }

        foreach ($sessionData as $key => $value) {
            $redirect = $redirect->with($key, $value);
        }

        return $redirect;
    }

    /**
     * Handle form submissions (create/update)
     *
     * @param Request $request
     * @param string $action (created|updated|deleted)
     * @param mixed $data
     * @param string|null $viewPath
     * @param string|null $redirectTo
     * @param string $resourceName
     * @return JsonResponse|InertiaResponse|RedirectResponse
     */
    protected function handleFormResponse(
        Request $request,
        string $action = 'created',
        $data = null,
        ?string $viewPath = null,
        ?string $redirectTo = null,
        string $resourceName = 'data'
    ) {
        $messages = [
            'created' => 'Successfully created.',
            'updated' => 'Successfully updated.',
            'deleted' => 'Successfully deleted.',
        ];

        $message = $messages[$action] ?? 'Operation successful';

        return $this->success(
            request: $request,
            data: $data,
            message: $message,
            viewPath: $viewPath,
            redirectTo: $redirectTo
        );
    }
}
