<?php

namespace App\Http\Controllers\Core;

use App\Models\Cores\Course;
use App\Traits\HandlesResponses;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Core\CourseRequest;

class CourseController extends Controller
{
    use HandlesResponses;
    public function index(Request $request)
    {
        $courses = Course::get();

        return $this->respond($request, $courses);
    }

    public function toggleActive(Request $request, Course $course)
    {
        $course->active = $request->active;
        $course->save();

        return $this->respond($request, ['success' => true, 'active' => $course->active]);
    }

    public function store(CourseRequest $request)
    {
        $validated = $request->validated();
        try {
            $course = Course::create($validated);
            return $this->respond($request, $course);
        } catch (\Exception $e) {
            return $this->error($request, $e->getMessage());
        }
    }

    public function update(CourseRequest $request, Course $course)
    {
        $validated = $request->validated();
        try {
            $course->update($validated);
            return $this->respond($request, $course);
        } catch (\Exception $e) {
            return $this->error($request, $e->getMessage());
        }
    }
}
