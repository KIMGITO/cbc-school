<?php

namespace App\Http\Controllers\Support;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Traits\HandlesResponses;

class AddressController extends Controller
{

    use HandlesResponses;
    public function search(Request $request)
    {
        // Helper function for case-insensitive LIKE search
        $searchLike = function ($query, $column, $value) {
            if ($value) {
                $query->whereRaw('LOWER(' . $column . ') LIKE ?', ['%' . strtolower($value) . '%']);
            }
        };

        // Helper function for case-insensitive exact match
        $searchExact = function ($query, $column, $value) {
            if ($value) {
                $query->whereRaw('LOWER(' . $column . ') = ?', [strtolower($value)]);
            }
        };

        // 1. Search counties (no county_id, no constituency)
        if (!$request->has('county_id') && !$request->has('constituency')) {
            $query = DB::table('counties');
            $searchLike($query, 'county_name', $request->search);

            $response = $query->get(['id', 'county_name'])->map(
                fn($county) => [
                    'id' => $county->id,
                    'name' => $county->county_name
                ]
            );
        }
        // 2. Search wards (requires both county_id AND constituency)
        elseif ($request->has('county_id') && $request->has('constituency')) {
            $query = DB::table('sub_counties')
                ->where('county_id', $request->county_id)->where(
                    'constituency_name', $request->constituency
                )->where('ward', 'LIKE', "%{$request->search}%");

            // $searchExact($query, 'constituency_name', $request->constituency);
            // $searchLike($query, 'ward', $request->search);

            $response = $query->get(['id', 'ward'])->map(fn($ward) => [
                'id' => $ward->id,
                'name' => $ward->ward
            ]);
        }
        // 3. Search constituencies (requires county_id)
        else {
            if (!$request->has('county_id')) {
                return response()->json([
                    'error' => 'county_id parameter is required for constituency search'
                ], 400);
            }

            $query = DB::table('sub_counties')
                ->where('county_id', $request->county_id);

            $searchLike($query, 'constituency_name', $request->search);

            // Get unique constituencies
            $response = $query->distinct()
                ->get(['constituency_name'])
                ->map(fn($constituency) => [
                    'id' => strtolower($constituency->constituency_name),
                    'name' => ucfirst($constituency->constituency_name),
                ]);
        }

        return $this->respond($request, $response);
    }
}
