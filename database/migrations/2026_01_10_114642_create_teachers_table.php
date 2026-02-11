<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rules\Unique;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('teachers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->restrictOnDelete();
            $table->foreignUuid('department_id')->nullable()->constrained('departments')->onDelete('set null');
            $table->text('tsc_number')->nullable();
            $table->string('tsc_number_hash')->nullable()->unique();
            $table->text('kra_pin');
            $table->string('kra_pin_hash')->unique();
            $table->date('employment_date')->nullable();
            $table->text('phone_number');
            $table->string('phone_number_hash')->unique();
            $table->text('phone_number_2')->nullable();
            $table->string('phone_number_2_hash')->nullable()->unique();
            $table->text('national_id');
            $table->string('national_id_hash')->unique();
            $table->boolean('is_active')->default(true);
            $table->foreignUuid('home_address_id')->constrained('addresses')->cascadeOnDelete();
            $table->foreignUuid('residential_address_id')->constrained('addresses')->cascadeOnDelete();
            $table->softDeletes();
            $table->timestamps();
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
