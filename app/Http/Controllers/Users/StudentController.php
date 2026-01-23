<?php

namespace App\Http\Controllers\Users;

use Exception;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Users\Student;
use App\Traits\HandlesResponses;
use App\Http\Controllers\Controller;
use App\Http\Requests\Users\StudentRequest;

class StudentController extends Controller
{
    use HandlesResponses;
    // public function __construct()
    // {
    //     $this->authorizeResource(Student::class, 'student');
    // }

    public function search(Request $request)
    {
        $query = $request->input('search', '');

        $studentsQuery = Student::select([
            'id',
            'first_name',
            'other_names',
            'sir_name',
            'adm_no',
            'gender',
            'profile_photo',
            'stream_id',
            'admission_date',
            'academic_status',
        ])
            ->with(['stream:id,name'])->where('academic_status', 'active');

        if ($query) {
            $studentsQuery->where(function ($q) use ($query) {
                $q->where('sir_name', 'like', "%{$query}%")
                    ->orWhere('first_name', 'like', "%{$query}%")
                    ->orWhere('other_names', 'like', "%{$query}%")
                    ->orWhere('adm_no', 'like', "%{$query}%");
            })
                ->orWhereHas('stream', function ($q) use ($query) {
                    $q->where('name', 'like', "%{$query}%");
                });
        }

        // Limit search results for autocomplete (for example, 20 suggests)
        $students = $studentsQuery->orderBy('sir_name')
            ->limit(10)
            ->get();

        // Format for frontend
        $results = $students->map(function ($student) {
            return [
                'id' => $student->id,
                'label' => $student->name, // assuming accessor getNameAttribute
                'value' => $student->id,
                'avatar' => $student->profile_photo,
                'adm_no' => $student->adm_no,
                'name' => $student->name,
                'grade' => $student->stream ? $student->stream->name : null,
            ];
        });

        return response()->json([
            'data' => $results,
        ]);
    }

    public function index(Request $request)
    {
        $students = Student::select([
            'id',
            'first_name',
            'other_names',
            'sir_name',
            'adm_no',
            'gender',
            'profile_photo',
            'stream_id',
            'admission_date',
            'academic_status',
        ])
            ->with(['stream:id,name'])
            ->orderBy('created_at', 'desc')
            ->paginate(50);
        $count = Student::where('academic_status', 'active')->count();

        return $this->respond($request, $students, 'users/students/index', ['students' => $students, 'studentCount' => $count]);
    }
    public function create()
    {

        return Inertia::render('users/students/admission');
    }

    public function store(StudentRequest $request)
    {
        try {
            $validated = $request->validated();

            $student = Student::create($validated);

            return $this->success($request, message: 'User created successfully.');
        } catch (Exception $e) {
            return $this->error($request, $e->getMessage());
        }
    }

    public function update(StudentRequest $request, Student $student)
    {
        try {
            $validated = $request->validated();

            $student->update($validated);
            $student->save();

            return $this->success($request, message: 'Student updated successfully.');
        } catch (Exception $e) {
            return $this->error($request, 'Failed to update student. Try again.');
        }
    }
}
