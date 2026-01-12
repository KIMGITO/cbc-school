<?php

namespace App\Models\People;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Teacher extends Model
{
    /** @use HasFactory<\Database\Factories\People\TeacherFactory> */
    use HasFactory, HasUuids, SoftDeletes, Searchable;


    protected $fillable = [
        'user_id',
        'department_id',
        'tsc_number',
        'hire_date',
        'qualifications',
        'phone_number',
        'phone_number_2',
        'is_active',
        'archived_at'

    ];

    public $searchable = [];

    protected $casts = [
        'is_active' => 'boolean',
        'hire_date' => 'date',
        'qualifications' => 'array',
        'user_id' => 'integer',
        'department_id' => 'integer',
        'archived_at' => 'date',
    ];
}
