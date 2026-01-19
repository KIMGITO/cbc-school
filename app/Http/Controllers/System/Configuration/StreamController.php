<?php

namespace App\Http\Controllers\System\Configuration;

use App\Http\Controllers\Controller;
use App\Http\Requests\System\Configuration\StreamRequest;
use App\Models\Functional\Stream;
use App\Traits\HandlesResponses;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\ResponseTrait;

class StreamController extends Controller
{
    use HandlesResponses;
    public function index(Request $request)
    {
        $streams = Stream::get();

        return $this->respond($request, $streams);
    }

    public function store(StreamRequest $request)
    {
        $validated = $request->validated();
        try {
            $stream = Stream::create($validated);
            return $this->success($request, $stream);
        } catch (Exception $e) {
            return $this->error($request, $e->getMessage());
        }
    }

    public function toggleActive(Request $request, Stream $stream)
    {
        try {
            $validated = $request->validate([
                'active' => ['required', 'boolean',]
            ]);

            $stream->active = $validated['active'];
            $stream->save();

            return $this->respond($request, ['success' => true, 'active' => $stream->active]);
        } catch (Exception $e) {
            return $this->respond($request, ['success' => false,  'active' => $stream->active]);
        }
    }
    public function update(StreamRequest $request, Stream $stream)
    {
        $validated = $request->validated();

        try {
            $stream->update($validated);
            $stream->save();

            return $this->success($request, $stream);
        } catch (Exception $e) {
            return $this->error($request);
        }
    }
}
