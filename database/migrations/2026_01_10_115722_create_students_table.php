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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('first_name');
            $table->string('other_names');
            $table->string('sir_name');
            $table->string('adm_no')->unique();
            $table->date('date_of_birth');
            $table->enum('gender', ['male', 'female']);
            $table->string('profile_photo')->nullable();

            // residential address
            $table->string('county')->nullable();
            $table->string('sub_county')->nullable();
            $table->string('ward')->nullable();
            $table->string('location')->nullable();
            $table->string('sub_location')->nullable();
            $table->string('upi_number')->unique()->nullable();

            // medical safety
            $table->string('blood_group', 3)->nullable();
            $table->json('allergies')->nullable();
            $table->json('special_medical_needs')->nullable();

            // school and admission
            $table->unsignedTinyInteger('grade_level')->nullable();
            $table->foreignId('stream_id')->nullable()->constrained('streams')->onDelete('set null');
            $table->date('admission_date')->nullable();
            $table->enum('enrollment_type', ['new', 'transfer'])->nullable();
            $table->enum('boarding_status', ['day', 'boarding'])->nullable();

            // cbc
            $table->json('talent_areas')->nullable();
            $table->boolean('learning_support')->default(false);
            $table->enum('assessment_rating', ['EE', 'ME', 'AE', 'BE'])->nullable();

            // academic related
            $table->enum('academic_status', ['active', 'inactive', 'transferred', 'graduated'])->default('active');
            $table->date('exit_date')->nullable();
            $table->string('exit_reason')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('archived_at')->nullable();
            $table->index(['adm_no', 'upi_number', 'stream_id', 'grade_level', 'crated_by', 'talent_areas', 'assessment_rating', '']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
