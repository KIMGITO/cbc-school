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
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('guardian_id')->nullable()->constrained()->nullOnDelete();
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
            $table->boolean('is_primary')->default(true);
            $table->boolean('can_pay_fees')->default(true);
            $table->boolean('can_pick_student')->default(true);
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
