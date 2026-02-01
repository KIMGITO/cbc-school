<?php

namespace App\Users;

use Throwable;
use App\Models\User;
use App\Models\Users\Guardian;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class GuardianService
{
    /**
     * Create a new class instance.
     */
    public function __construct() {}

    public  function  create($validated)
    {
        $this->userExists($validated['email']);


        DB::transaction(function() use ($validated) {
            // see if user exists already  by looking at names and email 

            // Create a user.
            $userData = [
                'first_name' => $validated['first_name'],
                'other_names' => $validated['other_names'],
                'sir_name' => $validated['sir_name'],
                'gender' => $validated['gender'],
                'email' => $validated['email'],
                'password' => bcrypt($validated['password'] ?? 'password123'),
            ];
            $user = User::create($userData);

            // Create guardian.

            $guardianData = [
                'user_id' => $user->id,
                'relationship_type' => $validated['relationship_type'],
                'national_id' => $validated['national_id'],
                'phone_number' => $validated['phone_number'],
                'phone_number_2' => $validated['phone_number_2'] ?? null,
                'occupation' => $validated['occupation'],
                'address' => $validated['address'],
                'county' => $validated['county'],
                'sub_county' => $validated['sub_county'],
                'ward' => $validated['ward'],
                'location' => $validated['location'],
                'sub_location' => $validated['sub_location'],
            ];

            $guardian = Guardian::create($guardianData);

            $relationData = [
                'relationship' => $validated['relationship_type'],
                'is_primary' => $validated['is_primary'],
                'can_pick_student' => $validated['can_pick_student'],
                'can_pay_fees' => $validated['can_pay_fees'],
            ];

            $relationshipExists = $guardian->students()->where('student_id', $validated['student_id'])->exists();
            if ($relationshipExists) {
                throw ValidationException::withMessages([
                    'student_id' => 'This This Student to Parent/Guardian relationship exists. No need to admit again.'
                ]);
            }
            // Create guardian - student relationship.
            $guardian->students()->attach($validated['student_id'], $relationData);
        }, 2);
    }

    protected  function userExists($email)
    {
        $userExists =  User::whereEmail($email)->exists();

        if ($userExists) {
            throw ValidationException::withMessages([
                'email' => ['This user already exists. Please search for guardian to update.']
            ]);
        }
    }
}
