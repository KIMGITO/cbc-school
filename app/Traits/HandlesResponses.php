<?php
// app/Traits/HandlesResponses.php

namespace App\Traits;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

trait HandlesResponses
{
    /**
     * Handle API and web responses
     *
     * @param Request $request
     * @param mixed $data
     * @param string $viewPath
     * @param array $viewData
     * @return JsonResponse|\Inertia\Response
     */
    protected function respond(
        Request $request,
        $data,
        string $viewPath,
        array $viewData = []
    ) {
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        }

        return Inertia::render($viewPath, array_merge($viewData, [
            'initialData' => $data,
        ]));
    }

    /**
     * Respond with success
     *
     * @param Request $request
     * @param mixed $data
     * @param string $viewPath
     * @param string $dataKey
     * @return JsonResponse|\Inertia\Response
     */
    protected function respondWithData(
        Request $request,
        $data,
        string $viewPath,
        string $dataKey = 'data'
    ) {
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        }

        return Inertia::render($viewPath, [
            'initialData' => [$dataKey => $data],
        ]);
    }

    /**
     * Respond with error
     *
     * @param Request $request
     * @param string $message
     * @param int $status
     * @param mixed $errors
     * @return JsonResponse|\Illuminate\Http\RedirectResponse
     */
    protected function respondWithError(
        Request $request,
        string $message,
        int $status = 400,
        $errors = null
    ) {
        if ($request->wantsJson() || $request->is('api/*')) {
            $response = [
                'success' => false,
                'message' => $message,
            ];

            if ($errors) {
                $response['errors'] = $errors;
            }

            return response()->json($response, $status);
        }

        return redirect()->back()
            ->withErrors($errors ?? [])
            ->with('error', $message);
    }
}
