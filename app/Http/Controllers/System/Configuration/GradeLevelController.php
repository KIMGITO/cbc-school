<?php

namespace App\Http\Controllers\System\Configuration;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\System\Configuration\GradeLevelRequest;
use App\Models\Functional\GradeLevel;
use App\Traits\HandlesResponses;
use Exception;

class GradeLevelController extends Controller
{
    use HandlesResponses;
    public function index(Request $request)
    {
        $levels = GradeLevel::get();

        return $this->respond(
            request: $request,
            data: null,
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
        } catch (\Exception $e) {
            return $this->error($request,    $e->getMessage());
        }
    }

    public function toggleActive(Request $request, GradeLevel $level)
    {

        try{
        $validated = $request->validate([
            'active' => ['required', 'boolean']
        ]);

        $level->active = $validated['active'];
        $level->save();

        return $this->respond($request, ['success' => true, 'active' => $level->active ]);

    }catch(Exception $e){
            return $this->respond($request, ['success' => false, 'active' => $level->active]);
        }

    }
    public function update(GradeLevelRequest $request, GradeLevel $level)
    {
        $data = $request->validated();
        $level->update($data);
        $levels = GradeLevel::get();

        return $this->respond(
            $request,
            $level,
            viewData: ['initialData' => ['levels' => $levels]]
        );
    }
}
