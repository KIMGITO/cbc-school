<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('guardian_student', function (Blueprint $table) {
            $table->uuid()->primary();
            $table->uuid('student_id');
            $table->uuid('guardian_id');
            // $table->primary(['guardian_id', 'student_id']);
            $table->enum('relationship', [
                'father',
                'mother',
                'step_father',
                'step_mother',
                'grand_father',
                'grand_mother',
                'uncle',
                'aunt',
                'brother',
                'sister',
                'legal_guardian',
                'foster_parent',
                'caretaker',
                'sponsor',
                'other',
            ])->default('mother');
            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
            $table->foreign('guardian_id')->references('id')->on('guardians')->onDelete('cascade');
            $table->boolean('is_primary')->default(true);
            $table->boolean('can_pay_fees')->default(true);
            $table->boolean('can_pick_student')->default(true);
            $table->unique(['guardian_id', 'student_id']);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guardian_student');
    }
};
