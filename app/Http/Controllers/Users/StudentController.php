<?php

namespace App\Http\Controllers\Users;

use App\Traits\HandlesResponses;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Users\StudentRequest;
use App\Models\People\Student;
use Exception;

class StudentController extends Controller
{
    use HandlesResponses;
    // public function __construct()
    // {
    //     $this->authorizeResource(Student::class, 'student');
    // }

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
