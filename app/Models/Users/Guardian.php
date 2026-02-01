<?php

namespace App\Models\Users;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;
use Spatie\Permission\Traits\HasRoles;

class Guardian extends Model
{
    /** @use HasFactory<\Database\Factories\People\GuardianFactory> */
    use HasFactory, HasUuids, SoftDeletes, Searchable;
    protected $fillable = [
        'user_id',
        'national_id',
        'phone_number',
        'phone_number_2',
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
        'national_id' => 'encrypted',
        'phone_number' => 'encrypted',
        'phone_number_2' => 'encrypted',

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
     * Many-to-Many relationship.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function students()
    {
        return $this->belongsToMany(Student::class)->withPivot([
            'relationship',
            'can_pick_student',
            'can_pay_fees',
            'is_primary'
        ])->withTimestamps();
    }
}
 