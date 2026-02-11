<?php

namespace App\Services\Users;

use App\Models\Users\Student;
use App\Models\Support\Address;
use Illuminate\Support\Facades\DB;

class StudentService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function storeStudent(array $payload)
    {

        DB::transaction(function () use ($payload) {

            $addressPayload = [
                'ward_id' => $payload['ward_id'],
                'location' => $payload['location'],
                'sub_location' => $payload['sub_location'],
            ];
            $addressId = $this->createStudentAddress($addressPayload);
            unset($payload['ward_id'], $payload['location'], $payload['sub_location']);

            dd($payload);
            $student = $this->createStudent($addressId, $payload);
            return $student;
        }, 2);
    }

    protected function createStudentAddress(array $payload)
    {
        $address = Address::create($payload);
        return $address->id;
    }
    protected function  createStudent($address_id, $payload)
    {
        $payload['address_id'] = $address_id;
        $student = Student::create($payload);

        return $student;
    }

    public static function generateAdmissionNumber(Student $student)
    {

        if (empty($student->adm_no)) {
            $latestStudent = Student::whereNotNull('adm_no')
                ->orderByDesc('created_at')
                ->first();

            if ($latestStudent && preg_match('/\d+$/', $latestStudent->adm_no, $matches)) {
                $nextSeq = intval($matches[0]) + 1;
            } else {
                $nextSeq = 1;
            }
            $student->adm_no = 'ADM' . str_pad($nextSeq, 4, '0', STR_PAD_LEFT);
        }
    }
}
