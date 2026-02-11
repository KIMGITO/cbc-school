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
            $table->uuid('id')->primary();
            $table->string('first_name');
            $table->string('other_names');
            $table->string('sir_name');
            $table->string('adm_no')->unique();
            $table->text('date_of_birth');
            $table->enum('gender', ['male', 'female']);
            $table->string('profile_photo')->nullable();
            $table->foreignUuid('address_id')->constrained('addresses')->restrictOnDelete();
            $table->text('upi_number')->nullable();

            // medical safety
            $table->text('blood_group')->nullable();
            $table->text('allergies')->nullable();
            $table->text('special_medical_needs')->nullable();

            // school and admission
            $table->foreignUuid('stream_id')->nullable()->constrained('streams')->nullOnDelete();
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
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
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
