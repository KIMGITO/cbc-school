<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Traits\HandlesResponses;
use Illuminate\Http\Request;

class TeacherController extends Controller
{
    use HandlesResponses;

    public function create(Request $request)
    {
        return $this->respond($request, null, 'users/teachers/admission');
    }
}
