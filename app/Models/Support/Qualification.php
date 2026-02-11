<?php

namespace App\Models\Support;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Qualification extends Model
{
    use HasUuids, SoftDeletes;
    protected $fillable = [
        'teacher_id',
        'name',
        'institution',
        'year_completed',
        'tsc_registered',
    ];
}
