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
}
