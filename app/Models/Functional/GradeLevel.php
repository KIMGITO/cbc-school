<?php

namespace App\Models\Functional;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GradeLevel extends Model
{
    /** @use HasFactory<\Database\Factories\Functional\GradeLevelFactory> */
    use HasFactory, SoftDeletes, HasUuids;
    protected $fillable = [
        'name',
        'code',
        'description',
        'active'
    ];
    protected $casts = [
        'active' => 'boolean',
    ];
}
