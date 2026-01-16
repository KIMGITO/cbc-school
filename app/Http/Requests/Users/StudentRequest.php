<?php

namespace App\Http\Requests\Users;

use Illuminate\Foundation\Http\FormRequest;

class StudentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create students');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'other_names' => ['required', 'string', 'max:255'],
            'sir_name' => ['required', 'string', 'max:255'],
            'date_of_birth' => ['required', 'date', 'before:today'],
            'gender' => ['required', 'in:male,female,other'],
            'profile_photo' => ['nullable', 'image', 'max:2048'],
            'county' => ['required', 'string', 'max:100'],
            'sub_county' => ['required', 'string', 'max:100'],
            'ward' => ['nullable', 'string', 'max:100'],
            'location' => ['nullable', 'string', 'max:100'],
            'sub_location' => ['nullable', 'string', 'max:100'],
            // 'upi_number' => ['nullable', 'string', 'max:50'],

            'blood_group' => ['nullable', 'string', 'max:10'],
            'allergies' => ['nullable', 'string', 'max:255'],
            'special_medical_needs' => ['nullable', 'string', 'max:255'],

            'stream_id' => ['required', 'exists:streams,id'],
            'admission_date' => ['required', 'date'],
            'enrollment_type' => ['required', 'in:new,transferred'],
            'boarding_status' => ['required', 'in:day,boarding'],
            'crated_by' => ['required', 'integer', 'exists:users,id'],
        ];
    }

    public function messages()
    {
        return [
            'first_name.required' => 'The first name is required.',
            'other_names.required' => 'The other names are required.',
            'sir_name.required' => 'The surname is required.',
            'date_of_birth.required' => 'The date of birth is required.',
            'date_of_birth.date' => 'The date of birth must be a valid date.',
            'gender.required' => 'The gender is required.',
            'gender.in' => 'The gender must be one of: male, female, or other.',
            'profile_photo.image' => 'The profile photo must be an image.',
            'profile_photo.max' => 'The profile photo size must not exceed 2MB.',
            'county.required' => 'The county is required.',
            'sub_county.required' => 'The sub-county is required.',
            'ward.string' => 'The ward must be a string.',
            'location.string' => 'The location must be a string.',
            'sub_location.string' => 'The sub location must be a string.',
            'blood_group.string' => 'The blood group must be a string.',
            'allergies.string' => 'The allergies must be a string.',
            'allergies.max' => 'The allergies may not be greater than 255 characters.',
            'special_medical_needs.string' => 'The special medical needs must be a string.',
            'special_medical_needs.max' => 'The special medical needs may not be greater than 255 characters.',
            'stream_id.required' => 'The stream is required.',
            'stream_id.exists' => 'The selected stream is invalid.',
            'admission_date.required' => 'The admission date is required.',
            'admission_date.date' => 'The admission date must be a valid date.',
            'enrollment_type.required' => 'The enrollment type is required.',
            'enrollment_type.in' => 'The enrollment type must be new or transferred.',
            'boarding_status.required' => 'The boarding status is required.',
            'boarding_status.in' => 'The boarding status must be day or boarding.',
            'crated_by.required' => 'Log in first for this action.',
        ];
    }
}
