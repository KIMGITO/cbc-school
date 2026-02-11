<?php

namespace App\Services\Users;

use App\Models\User;
use App\Models\Users\Teacher;
use App\Models\Support\Address;
use Illuminate\Support\Facades\DB;
use App\Models\Support\Qualification;
use Illuminate\Testing\Fluent\Concerns\Has;
use Illuminate\Validation\ValidationException;
use Throwable;

class TeacherService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Service to create a teacher, their user, addresses and qualifications.
     */
    public  function createTeacher(array $payload)
    {
        // We'll use DB transactions to ensure atomicity.
        return DB::transaction(function () use ($payload) {
            // 1. Create or fetch User
            $user = $this->createUser($payload);
            // 2. Create Home Address
            $homeAddress = $this->createHomeAddress($payload);
            // 3. Create Residential Address
            $residentialAddress = $this->createResidentialAddress($payload);
            // 4. Create Teacher
            $teacher = Teacher::create([
                'user_id' => $user->id,
                'phone_number' => $payload['phone_number'],
                'phone_number_2' => $payload['phone_number_2'] ?? null,
                'national_id' => $payload['national_id'],
                'kra_pin' => $payload['kra_pin'],
                'tsc_number' => $payload['tsc_number'] ?? null,
                'phone_number_hash' =>
                isset($payload['phone_number_hash']) ?
                    $payload['phone_number_hash'] :
                    hash('sha256', $payload['phone_number']),
                'phone_number_2_hash' =>
                isset($payload['phone_number_2_hash']) ?
                    $payload['phone_number_2_hash'] : (isset($payload['phone_number_2']) && $payload['phone_number_2'] ? hash('sha256', $payload['phone_number_2']) : null),
                'national_id_hash' =>
                isset($payload['national_id_hash']) ?
                    $payload['national_id_hash'] :
                    hash('sha256', $payload['national_id']),
                'kra_pin_hash' =>
                isset($payload['kra_pin_hash']) ?
                    $payload['kra_pin_hash'] :
                    hash('sha256', $payload['kra_pin']),
                'tsc_number_hash' =>
                isset($payload['tsc_number_hash']) ?
                    $payload['tsc_number_hash'] : (isset($payload['tsc_number']) && $payload['tsc_number'] ?
                        hash('sha256', $payload['tsc_number']) : null),
                'home_address_id' => $homeAddress->id,
                'residential_address_id' => $residentialAddress->id,
                'department_id' => isset($payload['department_id']) ? $payload['department_id'] : null,
                'employment_date' => $payload['employment_date'] || today(),
            ]);

            // 5. Create Qualifications (supporting many)
            $this->createQualifications($teacher->id, $payload);

            return $teacher;
        });
    }

    protected function createUser($payload)
    {

        if (User::whereEmail($payload['email'])->exists()) {
            throw ValidationException::withMessages([
                '_general' => 'A user  with this email already exist.'
            ]);
        }
        return User::Create(
            [
                'email' => $payload['email'],
                'first_name' => $payload['first_name'],
                'other_names' => $payload['other_names'],
                'sir_name' => $payload['sir_name'],
                'gender' => $payload['gender'],
                'password' => bcrypt('password123'),
            ]
        );
    }

    protected function createHomeAddress($payload)
    {
        $address =  Address::create([
            'county_id' => $payload['home_county'],
            'sub_county' => $payload['home_sub_county'],
            'ward_id' => $payload['home_ward'],
            'location' => $payload['home_location'],
            'sub_location' => $payload['home_sub_location'],
        ]);

        return $address;
    }

    protected function createResidentialAddress($payload)
    {
        return Address::create([
            'county_id' => $payload['residential_county'],
            'sub_county' => $payload['residential_sub_county'],
            'ward_id' => $payload['residential_ward'],
            'location' => $payload['residential_location'],
            'sub_location' => $payload['residential_sub_location'],
        ]);
    }

    protected function createQualifications($teacherId, $payload)
    {
        $qualifications = $payload['qualifications'];
        if (is_array($qualifications)) {
            foreach ($qualifications as $qualification) {
                Qualification::create([
                    'teacher_id' => $teacherId,
                    'name' => $qualification['name'] ?? '',
                    'institution' => $qualification['institution'] ?? '',
                    'year_completed' => $qualification['year_completed'] ?? '',
                    'tsc_registered' => $qualification['tsc_registered'] ?? false,
                ]);
            }
        }
    }
}
