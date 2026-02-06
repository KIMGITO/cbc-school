<?php

namespace App\Models\Users;

// use App\Users\StudentService;
use Laravel\Scout\Searchable;
use App\Enum\AssessmentRating;
use App\Models\Users\Guardian;
use Illuminate\Support\Carbon;
use App\Models\Academics\Stream;
use Illuminate\Support\Facades\Crypt;
use App\Services\Users\StudentService;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Student extends Model
{
    use HasFactory, HasUuids, Searchable, HasRoles, SoftDeletes;

    protected $fillable = [
        //Profile Information
        'first_name',
        'other_names',
        'sir_name',
        'adm_no',
        'date_of_birth',
        'gender',
        'profile_photo',
        // residential address
        'county',
        'sub_county',
        'ward',
        'location',
        'sub_location',
        'upi_number',
        // medical safety
        'blood_group',
        'allergies',
        'special_medical_needs',
        // school and admission
        'stream_id',
        'admission_date',
        'enrollment_type',
        'boarding_status',
        // cbc 
        'talent_areas',
        'learning_support',
        // academic related
        'academic_status',
        'exit_date',
        'exit_reason',
        'crated_by',

    ];

    // Casts.
    protected $casts = [
        'date_of_birth' => 'encrypted',
        'upi_number' => 'encrypted',
        'blood_group' => 'encrypted',
        'admission_date' => 'date',
        'exit_date' => 'date',
        'stream_id' => 'string',
        'talent_areas' => 'array',
        'special_medical_needs' => 'encrypted:array',
        'allergies' => 'encrypted:array',
        'learning_support' => 'boolean',
        'crated_by' => 'integer',
    ];

    protected $appends = [
        'age',
        'address',
        'name'
    ];



    /**
     * Student - Stream relationship
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<Stream, Student>
     */
    public function  stream()
    {
        return $this->belongsTo(Stream::class, 'stream_id', 'id');
    }

    public function guardians()
    {
        return $this->belongsToMany(Guardian::class)->withPivot([
            'relationship',
            'is_primary',
            'can_pick_student',
            'can_pay_fees'
        ])->withTimestamps();
    }


    // Appended attributes
    public function age(): Attribute
    {
        return Attribute::make(
            get: fn() => Carbon::parse(
                $this->date_of_birth
            )->age
        );
    }

    public function address(): Attribute
    {
        return Attribute::make(
            get: function () {
                $address = $this->county . ' County,  ' .
                    $this->sub_county . ' SubCounty, ' .
                    $this->location . ' Location, ' .
                    $this->sub_location . ' Sub Location';

                return ucwords($address);
            }
        );
    }

    public function name(): Attribute
    {
        return Attribute::make(
            get: function () {
                $s = strtoupper($this->sir_name);
                $f = ucfirst($this->first_name);
                $l = ucwords($this->other_names);
                return "$s $f $l";
            }
        );
    }

    /**
     * The "booted" method of the model.
     *
     */

    protected function firstName(): Attribute
    {
        return Attribute::make(
            get: fn($value) => ucfirst($value),
            set: fn($value) => strtolower($value),
        );
    }
    protected function otherNames(): Attribute
    {
        return Attribute::make(
            get: fn($value) => ucwords($value),
            set: fn($value) => strtolower($value),
        );
    }
    protected function sirName(): Attribute
    {
        return Attribute::make(
            get: fn($value) => ucfirst($value),
            set: fn($value) => strtolower($value),
        );
    }
    protected function admNo(): Attribute
    {
        return Attribute::make(
            get: fn($value) => strtoupper($value),
            set: fn($value) => strtolower($value),
        );
    }
    protected function dateOfBirth(): Attribute
    {
        return Attribute::make(
            get: fn($value) => Carbon::parse($value)->format('d/m/Y'),
            set: fn($value) => Carbon::parse($value)->format('Y-m-d'),
        );
    }
    protected function gender(): Attribute
    {
        return Attribute::make(
            get: fn($value) => ucfirst($value),
            set: fn($value) => strtolower($value),
        );
    }
    protected function county(): Attribute
    {
        return Attribute::make(
            get: fn($value) => ucfirst($value),
            set: fn($value) => strtolower($value),
        );
    }
    protected function subCounty(): Attribute
    {
        return Attribute::make(
            get: fn($value) => ucfirst($value),
            set: fn($value) => strtolower($value),
        );
    }
    protected function ward(): Attribute
    {
        return Attribute::make(
            get: fn($value) => ucfirst($value),
            set: fn($value) => strtolower($value),
        );
    }
    protected function admissionDate(): Attribute
    {
        return Attribute::make(
            get: fn($value) => Carbon::parse($value)->format('d/m/Y'),
            set: fn($value) => Carbon::parse($value)->format('Y-m-d'),
        );
    }
    // boot functions to generate admission number.
    protected static function booted()
    {
        static::creating(function ($student) {
            StudentService::generateAdmissionNumber($student);
        });
    }
}
