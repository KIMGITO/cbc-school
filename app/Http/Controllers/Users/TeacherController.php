<?php

namespace App\Http\Controllers\Users;

use Illuminate\Http\Request;
use App\Models\Users\Teacher;
use App\Traits\HandlesResponses;
use App\Http\Controllers\Controller;
use App\Services\Users\TeacherService;
use App\Http\Requests\Users\TeacherRequest;
use App\Models\User;
use App\Traits\MergesUserAttributes;

class TeacherController extends Controller
{
    use HandlesResponses;

    public function index(Request $request)
    {
        $query = Teacher::with(['user', 'department']);

        // Apply filters
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('tsc_number', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('first_name', 'like', "%{$search}%")
                            ->orWhere('sir_name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->has('status')) {
            $isActive = $request->status === 'active';
            $query->where('is_active', $isActive);
        }

        if ($request->has('department')) {
            $query->where('department_id', $request->department);
        }

        $teachers = $query->paginate(1);

        return $this->respond($request, [], 'users/teachers/index', [
            'teachers' => $teachers,
            'teacherCount' => Teacher::count(),
        ]);
    }

    public function create(Request $request)
    {
        return $this->respond($request, [], 'users/teachers/admission');
    }

    public function store(TeacherRequest $request)
    {

        $validated = $request->validated();

        $teacher = new TeacherService();
        $teacher->createTeacher($validated);
        return $this->respond($request, $teacher);
    }
}
