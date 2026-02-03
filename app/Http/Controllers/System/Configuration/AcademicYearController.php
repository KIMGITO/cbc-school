<?php

namespace App\Http\Controllers\System\Configuration;

use Illuminate\Http\Request;
use App\Traits\HandlesResponses;
use App\Models\Cores\AcademicYear;
use App\Http\Controllers\Controller;
use App\Http\Requests\System\Configuration\AcademicYearRequest;

class AcademicYearController extends Controller
{
    use HandlesResponses;

    public function index(Request $request)
    {
        $academicYears = AcademicYear::get();

        return $this->respond($request, $academicYears);
    }

    public function toggleActive(Request $request, AcademicYear $year)
    {
        try {
            $year->is_active = $request->is_active;
            $year->save();

            return $this->respond($request, ['success' => true, 'is_active' => $year->is_active]);
        } catch (\Exception $e) {
            return $this->error($request, $e->getMessage());
        }
    }

    public function store(AcademicYearRequest $request)
    {
        $validated = $request->validated();
        try {
            $academicYear = AcademicYear::create($validated);
            return $this->respond($request, $academicYear);
        } catch (\Exception $e) {
            return $this->error($request, $e->getMessage());
        }
    }

    public function update(AcademicYearRequest $request, AcademicYear $year)
    {
        $validated = $request->validated();
        try {
            $year->update($validated);
            return $this->respond($request, $year);
        } catch (\Exception $e) {
            return $this->error($request, $e->getMessage());
        }
    }
}
