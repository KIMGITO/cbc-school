<?php

namespace App\Models\Functional;

use App\Models\People\Student;
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

    /**
     * One-to-Many relationship.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function streams()
    {
        return $this->hasMany(Stream::class);
    }

    /**
     * Has Many Through relationship.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasManyThrough
     */
    public function students()
    {
        return $this->hasManyThrough(Student::class, Stream::class);
    }
}
