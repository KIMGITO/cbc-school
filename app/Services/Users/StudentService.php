<?php

namespace App\Services\Users;

use App\Models\Users\Student;

class StudentService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
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
