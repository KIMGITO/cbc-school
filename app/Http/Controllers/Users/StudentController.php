<?php

namespace App\Http\Controllers\Users;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Users\StudentRequest;
use App\Models\People\Student;

class StudentController extends Controller
{

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
        dd();
    }
}
