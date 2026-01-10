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
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('sir_name')->nullable();
            $table->string('national_id', 12)->unique();
            $table->string('phone_number')->unique();
            $table->string('phone_number_2')->nullable();
            $table->string('email')->unique()->nullable();
            $table->enum('relationship', [
                'father',
                'mother',
                'guardian',
                'stepfather',
                'stepmother',
                'aunt',
                'uncle',
                'grandparent',
                'brother',
                'sister',
                'well_wisher'
            ]);
            $table->string('occupation')->nullable();
            $table->string('address')->nullable();
            $table->string('county')->nullable();
            $table->string('sub_county')->nullable();
            $table->string('ward')->nullable();
            $table->string('location')->nullable();
            $table->string('sub_location')->nullable();
            $table->softDeletes();
            $table->timestamps();
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
