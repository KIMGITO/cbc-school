<?php

namespace App\Users;

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


    public static function generateAdmissionNumber(Student $student) {

        if (empty($student->adm_no)) {
            $year = date('Y');
            $latestStudent = Student::whereYear('created_at', $year)
                ->orderByDesc('created_at') 
                ->first();

            if ($latestStudent && preg_match('/^ADM' . $year . '(\d{4})$/', $latestStudent->adm_no, $matches)) {
                $nextSeq = (int)$matches[1] + 1;
            } else {
                $nextSeq = 1;
            }
            $student->adm_no = 'ADM' . $year . str_pad($nextSeq, 4, '0', STR_PAD_LEFT);
        }
    }
}
