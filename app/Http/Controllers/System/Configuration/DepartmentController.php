<?php

namespace App\Http\Controllers\System\Configuration;

use Illuminate\Http\Request;
use App\Models\Cores\Department;
use App\Traits\HandlesResponses;
use App\Http\Controllers\Controller;
use App\Http\Requests\System\Configuration\DepartmentRequest;

class DepartmentController extends Controller
{
    use HandlesResponses;
    public function index(Request $request)
    {
        $departments = Department::get();

        return $this->respond($request, $departments);
    }

    public function toggleActive(Request $request, Department $department)
    {
        $department->active = $request->active;
        $department->save();

        return $this->respond($request, ['success' => true, 'active' => $department->active]);
    }
    public function store(Request $request)
    {
        $validated = $request->validated();
        try {
            $department = Department::create($validated);
            return $this->respond($request, $department);
        } catch (\Exception $e) {
            return $this->error($request, $e->getMessage());
        }
    }
    public function update(DepartmentRequest $request, Department $department)
    {
        $validated = $request->validated();
        try {
            $department->update($validated);
            return $this->respond($request, $department);
        } catch (\Exception $e) {
            return $this->error($request, $e->getMessage());
        }
    }
}
