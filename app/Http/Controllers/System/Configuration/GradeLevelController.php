<?php

namespace App\Http\Controllers\System\Configuration;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Functional\GradeLevel;
use App\Traits\HandlesResponses;

class GradeLevelController extends Controller
{
    use HandlesResponses;
    public function index(Request $request)
    {
        $levels = GradeLevel::get();

        // Using the trait method
        return $this->respond(
            request: $request,
            data: ['levels' => $levels],
            viewPath: 'administration/school/structure'
        );
    }
}
