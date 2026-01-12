<?php

namespace App\Models\People;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;
use Spatie\Permission\Traits\HasRoles;

class Guardian extends Model
{
    /** @use HasFactory<\Database\Factories\People\GuardianFactory> */
    use HasFactory, HasUuids, SoftDeletes, HasRoles, Searchable;
    protected $fillable = [
        'user_id',
        'national_id',
        'phone_number',
        'phone_number_2',
        'email',
        'relationship',
        'occupation',
        'address',
        'county',
        'sub_county',
        'ward',
        'location',
        'sub_location',
    ];

    // Casts
    protected $casts = [
        'user_id' => 'integer',
    ];
}
