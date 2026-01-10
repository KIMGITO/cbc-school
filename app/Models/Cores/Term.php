<?php

namespace App\Models\Cores;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Term extends Model
{
    /** @use HasFactory<\Database\Factories\Core\TermFactory> */
    use HasFactory, HasUuids, SoftDeletes;
    protected $fillable = [
        'academic_year',
        "name",
        'number',
        'start_date',
        'end_date',
        'is_active',
    ];
    protected $casts = [
        'academic_year' => 'integer',
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];
}
