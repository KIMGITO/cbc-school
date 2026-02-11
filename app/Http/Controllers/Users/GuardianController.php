<?php

namespace App\Http\Controllers\Users;

use App\Traits\HandlesResponses;
use Illuminate\Http\Request;
use App\Models\Users\Guardian;
use App\Http\Controllers\Controller;
use App\Http\Requests\Users\GuardianRequest;
use App\Services\Users\GuardianService;
use App\Traits\MergesUserAttributes;

class GuardianController extends Controller
{
    use HandlesResponses;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Guardian::with(['user', 'students', 'address'])
            ->withCount('students');

        // Apply filters
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('national_id', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('first_name', 'like', "%{$search}%")
                            ->orWhere('sir_name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->has('relationship') && $request->relationship !== 'all') {
            $query->where('relationship', $request->relationship);
        }

        if ($request->has('status')) {
            $isActive = $request->status === 'active';
            $query->where('is_active', $isActive);
        }

        $guardians = $query->paginate(15);

        return $this->respond($request, [],'users/guardians/index', [
            'guardians' => $guardians,
            'guardianCount' => Guardian::count(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        return $this->respond($request, null, 'users/guardians/admission');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(GuardianRequest $request)
    {
        $validated = $request->validated();

        $guardian = new GuardianService();
        $guardian->create($validated);

        return $this->success($request,  $validated);
    }

    /**
     * Display the specified resource.
     */
    public function show(Guardian $guardian)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Guardian $guardian)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Guardian $guardian)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Guardian $guardian)
    {
        //
    }
}
