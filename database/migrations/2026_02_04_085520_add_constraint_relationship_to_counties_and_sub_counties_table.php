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
        if (Schema::hasColumn('sub_counties', 'county_id')) {
            Schema::table('sub_counties', function (Blueprint $table) {
                $table->foreign('county_id')->references('id')->on('counties')->restrictOnDelete();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sub_counties', function (Blueprint $table) {
            //
        });
    }
};
