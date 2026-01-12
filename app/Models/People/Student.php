<?php

namespace App\Models\People;

use App\Enum\AssessmentRating;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;
use Spatie\Permission\Traits\HasRoles;

class Student extends Model
{
    use HasFactory, HasUuids, Searchable, HasRoles, SoftDeletes;

    protected $fillable = [
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
        'grade_level',
        'stream_id',
        'admission_date',
        'enrollment_type',
        'boarding_status',
        // cbc 
        'talent_areas',
        'learning_support',
        'assessment_rating',
        // academic related
        'academic_status',
        'exit_date',
        'exit_reason',
        'archived_at',
        'crated_by',

    ];

    // Casts.
    protected $casts = [
        'date_of_birth' => 'date',
        'admission_date' => 'date',
        'exit_date' => 'date',
        'stream_id' => 'integer',
        'talent_areas' => 'array',
        'special_medical_needs' => 'array',
        'allergies' => 'array',
        'learning_support' => 'boolean',
        'assessment_rating' => AssessmentRating::class,
        'archived_at' => 'date',
        'crated_by' => 'integer',
    ];
}
