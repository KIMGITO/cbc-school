<?php

namespace App\Models\Academics;

use App\Models\Users\Student;
use App\Models\Users\Teacher;
use App\Models\Academics\GradeLevel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Attributes\Boot;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Stream extends Model
{
    /** @use HasFactory<\Database\Factories\Functional\StreamFactory> */
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'name',
        'active',
        'capacity',
        'code',
        'level_id',
        'teacher_id',
    ];

    protected $cast = [
        'id' => 'string',
    ];


    /**
     * Many-to-One (Inverse) relationship.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function gradeLevel()
    {
        return $this->belongsTo(GradeLevel::class);
    }

    /**
     * One-to-Many relationship.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function students()
    {
        return $this->hasMany(Student::class, 'stream_id', 'id');
    }

    /**
     * Many-to-One (Inverse) relationship.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }


    protected static function booted(){
        static::retrieved(function ($stream) {
            return $stream->name = strtoupper($stream->name);
        });
    }
}
