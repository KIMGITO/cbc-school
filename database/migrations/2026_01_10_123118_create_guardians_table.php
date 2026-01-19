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
        Schema::create('guardians', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->restrictOnDelete();
            $table->string('national_id',)->unique();
            $table->text('phone_number');
            $table->text('phone_number_2')->nullable();
            $table->string('email')->unique()->nullable();

            $table->string('occupation')->nullable();
            $table->string('address')->nullable();
            $table->string('county')->nullable();
            $table->string('sub_county')->nullable();
            $table->string('ward')->nullable();
            $table->string('location')->nullable();
            $table->string('sub_location')->nullable();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guardians');
    }
};
