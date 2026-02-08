<?php

namespace App\Models\Users;

use App\Models\Cores\Course;
use App\Models\Cores\Department;
use App\Models\Academics\Stream;
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
        'national_id',
        'home_address_id',
        'residential_address_id',
        'kra_pin',
        'tsc_number',
        'employment_date',
        'qualifications',
        'phone_number',
        'phone_number_2',
        'is_active',
        ''

    ];

    protected $casts = [
        'is_active' => 'boolean',
        'employment_date' => 'date',
        'qualifications' => 'array',
        'user_id' => 'integer',
        'department_id' => 'integer',
        'tsc_number' => 'encrypted',
        'tsc_number_hash' => 'hash',
        'phone_number' => 'encrypted',
        'phone_number_hash' => 'hash',
        'phone_number_2' => 'encrypted',
        'phone_number_2_hash' => 'hash',
        'kra_pin' => 'encrypted',
        'kra_pin_hash' => 'hash',
        'national_id' => 'encrypted',
        'national_id_hash' => 'hash',
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
