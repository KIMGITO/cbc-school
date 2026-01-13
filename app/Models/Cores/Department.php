<?php

namespace App\Models\Cores;

use App\Models\People\Teacher;
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

    /**
     * One-to-Many relationship.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function teachers()
    {
        return $this->hasMany(Teacher::class);
    }

    /**
     * One-to-Many relationship.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function courses()
    {
        return $this->hasMany(Course::class);
    }
}
