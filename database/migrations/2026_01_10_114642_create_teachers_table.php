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
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained('users')->nullOnDelete();
            $table->foreignId('department_id')->nullable()->constrained('departments')->onDelete('set null');
            $table->string('tsc_number')->unique();
            $table->date('hire_date');
            $table->json('qualifications')->nullable();
            $table->string('phone_number')->unique();
            $table->string('phone_number_2')->nullable();
            $table->boolean('is_active')->default(true);
            $table->softDeletes();
            $table->timestamps();
            $table->index(['tsc_number', 'phone_number', 'phone_number_2']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teachers');
    }
};
