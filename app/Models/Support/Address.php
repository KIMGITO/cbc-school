<?php

namespace App\Models\Support;

use App\Models\Users\Guardian;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Address extends Model
{
    use HasUuids, SoftDeletes, Searchable, HasFactory;

    protected $fillable = [
        'ward_id',
        'location',
        'sub_location',
    ];

    /**
     * Many-to-One (Inverse) relationship.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function guardian()
    {
        return $this->belongsTo(Guardian::class);
    }
}
