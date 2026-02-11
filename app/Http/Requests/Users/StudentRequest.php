<?php

namespace App\Http\Requests\Users;

use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
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

        $studentId = $this->route('student');
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'other_names' => ['required', 'string', 'max:255'],
            'sir_name' => ['required', 'string', 'max:255'],
            'date_of_birth' => ['required', 'date', 'before:today'],
            'gender' => ['required', 'in:male,female,other'],
            'profile_photo' => ['nullable', 'image', 'max:2048'],
            'county_id' => ['required', 'string', 'exists:counties,id'],
            'county_name' => ['required', 'string', 'exists:counties,county_name'],
            'sub_county_name' => ['required', 'string', 'exists:sub_counties,constituency_name'],
            'ward_name' => ['required', 'string', 'exists:sub_counties,ward'],
            'ward_id' => ['required', 'string', 'exists:sub_counties,id'],
            'location' => ['required', 'string', 'max:100'],
            'sub_location' => ['required', 'string', 'max:100'],
            'upi_number' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('students')->ignore($studentId)
            ],

            'blood_group' => ['nullable', 'string', 'max:10'],
            'allergies' => ['required', 'string', 'max:255'],
            'special_medical_needs' => ['required', 'string', 'max:255'],

            'stream_id' => ['required', 'exists:streams,id'],
            'admission_date' => ['required', 'date', 'before_or_equal:today'],
            'enrollment_type' => ['required', 'in:new,transferred'],
            'boarding_status' => ['required', 'in:day,boarding'],
            'created_by' => ['required', 'string', 'exists:users,id'],
        ];
    }

    public function messages()
    {
        return [
            'first_name.required' => ' First name is required.',
            'other_names.required' => ' Other names are required.',
            'sir_name.required' => ' Surname is required.',
            'date_of_birth.required' => ' Date of birth is required.',
            'date_of_birth.date' => ' Date of birth must be a valid date.',
            'gender.required' => ' Gender is required.',
            'gender.in' => ' Gender must be one of: male, female, or other.',
            'profile_photo.image' => ' Profile photo must be an image.',
            'profile_photo.max' => ' Profile photo size must not exceed 2MB.',
            'county.required' => ' County is required.',
            'sub_county.required' => ' Sub-county is required.',
            'location.string' => ' Location must be a string.',
            'sub_location.string' => ' Sub location must be a string.',
            'blood_group.string' => ' Blood group must be a string.',
            'allergies.string' => ' Allergies must be a string.',
            'allergies.max' => ' Allergies may not be greater than 255 characters.',
            'special_medical_needs.string' => ' Special medical needs must be a string.',
            'special_medical_needs.max' => ' Special medical needs may not be greater than 255 characters.',
            'stream_id.required' => ' Stream is required.',
            'stream_id.exists' => ' Selected stream is invalid.',
            'admission_date.required' => ' Admission date is required.',
            'admission_date.date' => ' Admission date must be a valid date.',
            'enrollment_type.required' => ' Enrollment type is required.',
            'enrollment_type.in' => ' Enrollment type must be new or transferred.',
            'boarding_status.required' => ' Boarding status is required.',
            'boarding_status.in' => ' Boarding status must be day or boarding.',
            'crated_by.required' => 'Log in first for this action.',
        ];
    }

    public function prepareForValidation()
    {
        if (Auth::check()) {
            $this->merge([
                'created_by' => Auth::id(),
            ]);
        }

        try {
            $birthDate = new \DateTime($this->input('date_of_birth'));
            $this->merge([
                'date_of_birth' => $birthDate->format('Y-m-d'),
            ]);
        } catch (\Exception $e) {
        }
        try {
            $employmentDate = new \DateTime($this->input('admission_date'));
            $this->merge([
                'admission_date' => $employmentDate->format('Y-m-d'),
            ]);
        } catch (\Exception $e) {
        }
    }
}
