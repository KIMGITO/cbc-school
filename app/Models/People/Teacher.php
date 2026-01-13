<?php

namespace App\Models\People;

use App\Models\Cores\Course;
use App\Models\Cores\Department;
use App\Models\Functional\Stream;
use App\Models\User;
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

    ];

    public $searchable = [];

    protected $casts = [
        'is_active' => 'boolean',
        'hire_date' => 'date',
        'qualifications' => 'array',
        'user_id' => 'integer',
        'department_id' => 'integer',
    ];

    /**
     * Many-to-One (Inverse) relationship.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Many-to-One (Inverse) relationship.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * One-to-One relationship.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function stream()
    {
        return $this->hasOne(Stream::class);
    }

    /**
     * Many-to-Many relationship.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function courses()
    {
        return $this->belongsToMany(Course::class, 'course_teacher')
            ->withPivot(['relationship', 'experience'])->withTimestamps();
    }
}
