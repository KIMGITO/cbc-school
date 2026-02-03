<?php

use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;



if (!function_exists('encrypt_attribute')) {
    function  encrypt_attribute($value)
    {
        function ($value) {
            if (is_null($value)) {
                return null;
            }

            try {
                return Crypt::decrypt($value);
            } catch (DecryptException $e) {
                return null;
            }
        };
    }
}

if (!function_exists('decrypt_attribute')) {
    function  decrypt_attribute($value)
    {
        function ($value) {
            if (is_null($value)) {
                return null;
            }

            return Crypt::encrypt($value);
        };
    }

    if (! function_exists('standardize_academic_year')) {
        function standardize_academic_year(string $year)
        {
            if (!is_null($year) && preg_match('/^\d{4}\/(\d{2}|\d{4})$/', $year)) {
                if (preg_match('/^(\d{4})\/(\d{4})$/', $year, $matches)) {
                    $shortYear = substr($matches[2], -2);
                    return "$matches[1]/$shortYear";
                }
                return $year;
            }
            return $year;
        }
    }
}
