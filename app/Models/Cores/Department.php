<?php

namespace App\Models\Cores;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
    /** @use HasFactory<\Database\Factories\Cores\DepartmentFactory> */
    use HasFactory, HasUuids, SoftDeletes;
    protected $fillable = [
        "name",
        'code',
        'description',
        'active'
    ];

    protected $casts = [
        'active' => 'boolean',
    ];
    // add other casts as necessary
}
