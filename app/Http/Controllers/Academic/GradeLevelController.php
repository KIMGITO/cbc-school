<?php

namespace App\Http\Controllers\Academic;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Academic\GradeLevelRequest;
use App\Models\Academics\GradeLevel;
use App\Traits\HandlesResponses;
use Exception;

class GradeLevelController extends Controller
{
    use HandlesResponses;
    public function index(Request $request)
    {
        $levels = GradeLevel::with('streams')->get();
        return $this->respond(
            request: $request,
            data: $levels,
            viewPath: 'administration/school/structure',
            viewData: ['initialData' => ['levels' => $levels]]
        );
    }

    public function store(GradeLevelRequest $request)
    {

        $validated = $request->validated();
        try {
            $level = GradeLevel::create($validated);
            $level['active'] = true;
            $levels = GradeLevel::get();

            return $this->respond($request, $level,  viewData: ['initialData' => ['levels' => $levels]]);
        } catch (Exception $e) {
            return $this->error($request,    $e->getMessage());
        }
    }

    public function toggleActive(Request $request, GradeLevel $level)
    {

        try {
            $validated = $request->validate([
                'active' => ['required', 'boolean']
            ]);

            $level->active = $validated['active'];
            $level->save();

            return $this->respond(
                $request,
                ['success' => true, 'active' => $level->active]
            );
        } catch (Exception $e) {
            return $this->respond($request, ['success' => false, 'active' => $level->active]);
        }
    }
    public function update(GradeLevelRequest $request, GradeLevel $level)
    {
        try {
            $data = $request->validated();
            $level->update($data);

            return $this->success(
                $request,
                $level,
            );
        } catch (Exception $e) {
            return $this->error($request);
        }
    }
}
