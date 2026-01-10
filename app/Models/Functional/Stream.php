<?php

namespace App\Models\Functional;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Stream extends Model
{
    /** @use HasFactory<\Database\Factories\Functional\StreamFactory> */
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'is_active',
        'grade_level_id',
        'teacher_id',
        // add other fields as necessary
    ];

}
