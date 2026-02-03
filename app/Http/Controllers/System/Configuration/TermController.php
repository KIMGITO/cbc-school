<?php

namespace App\Http\Controllers\System\Configuration;

use App\Models\Cores\Term;
use Illuminate\Http\Request;
use App\Traits\HandlesResponses;
use App\Http\Controllers\Controller;
use App\Http\Requests\System\Configuration\TermRequest;

class TermController extends Controller
{
    use HandlesResponses;
    public function index(Request $request)
    {
        $terms = Term::get();

        return $this->respond($request, $terms);
    }

    public function toggleActive(Request $request, Term $term)
    {
        try {
            $term->is_active = $request->is_active;
            $term->save();
            return $this->respond($request, ['success' => true, 'is_active' => $term->is_active]);
        } catch (\Exception $e) {
            return $this->error($request, $e->getMessage());
        }
    }

    public function store(TermRequest $request)
    {
        $validated = $request->validated();
        try {
            $term = Term::create($validated);
            return $this->respond($request, $term);
        } catch (\Exception $e) {
            return $this->error($request, $e->getMessage());
        }
    }

    public function update(TermRequest $request, Term $term)
    {
        $validated = $request->validated();
        try {
            $term->update($validated);
            return $this->respond($request, $term);
        } catch (\Exception $e) {
            return $this->error($request, $e->getMessage());
        }
    }
}
