<?php

namespace App\Models\Functional;

use App\Models\Users\Student;
use App\Models\Functional\Stream;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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

    protected static function booted(){

        static::retrieved(fn ($level)=> $level->name = strtoupper($level->name));
    }
}
