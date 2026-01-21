<?php

namespace App\Observers\Users;

use App\Models\Users\Student;


class StudentObserver
{

    /**
     * Handle the student "creating" event.
     */

     
    /**
     * Handle the Student "created" event.
     */
    public function created(Student $student): void
    {
    }

    /**
     * Handle the Student "updated" event.
     */
    public function updated(Student $student): void
    {
        //
    }

    /**
     * Handle the Student "deleted" event.
     */
    public function deleted(Student $student): void
    {
        //
    }

    /**
     * Handle the Student "restored" event.
     */
    public function restored(Student $student): void
    {
        //
    }

    /**
     * Handle the Student "force deleted" event.
     */
    public function forceDeleted(Student $student): void
    {
        //
    }
}
