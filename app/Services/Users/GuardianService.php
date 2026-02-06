<?php

namespace App\Services\Users;

use App\Models\Support\Address;
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
        // see if user exists already  by looking at names and email 


        DB::transaction(function () use ($validated) {
            // Create a user if doesn't exist.
            $user = $this->userExists($validated['email']);
            if (!$user) {
                $user = $this->createUser($validated);
            }
            //create address
            $address = $this->createAddress($validated);
            //create guardian
            $guardian = $this->createGuardian($validated, $user, $address->id);
            //create guardian student relationship.
            $this->createGuardianStudentRelationship($validated, $guardian);
        }, 2);
    }

    protected  function userExists($email)
    {
        if (User::whereEmail($email)->exists()) {
            return User::whereEmail($email);
        }
        return false;
    }

    protected function createUser($validated)
    {
        $userData = [
            'first_name' => $validated['first_name'],
            'other_names' => $validated['other_names'],
            'sir_name' => $validated['sir_name'],
            'gender' => $validated['gender'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password'] ?? 'password123'),
        ];
        return User::firstOrCreate($userData);
    }
    protected function createAddress($validated)
    {
        $data = [
            'ward_id' => $validated['ward'],
            'location' => $validated['location'],
            'sub_location' => $validated['sub_location'],
        ];
        return  Address::create($data);
    }

    protected function createGuardian($validated, $user, $addressId)
    {
        if ($user->guardian) {
            throw  ValidationException::withMessages([
                'email' => 'This guardian already exists.'
            ]);
        }
        $data = [
            'user_id' => $user->id,
            'relationship_type' => $validated['relationship_type'],
            'national_id' => $validated['national_id'],
            'phone_number' => $validated['phone_number'],
            'phone_number_2' => $validated['phone_number_2'] ?? null,
            'occupation' => $validated['occupation'],
            'address_id' => $addressId,
        ];

        return Guardian::create($data);
    }

    protected function createGuardianStudentRelationship($validated, $guardian)
    {
        $relationData = [
            'relationship' => $validated['relationship_type'],
            'is_primary' => $validated['is_primary'],
            'can_pick_student' => $validated['can_pick_student'],
            'can_pay_fees' => $validated['can_pay_fees'],
        ];

        $relationshipExists = $guardian->students()->where('student_id', $validated['student_id'])->exists();
        if ($relationshipExists) {
            throw ValidationException::withMessages([
                'student_id' => 'This Student Parent/Guardian relationship exists. Just update.'
            ]);
        }
        // Create guardian - student relationship.
        $guardian->students()->synchWithoutDetaching([$validated['student_id'] => $relationData]);
    }
}
