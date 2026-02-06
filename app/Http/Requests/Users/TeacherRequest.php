<?php

namespace App\Http\Requests\Users;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class TeacherRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {

        $teacher = $this->route('teacher');
        return [
            //user data
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'other_names' => ['nullable', 'string', 'max:255'],
            'phone_number' => [
                'required',
                'string',
                'max:10',
                Rule::unique('teachers', 'phone_number_hash')->ignore($teacher->id)
            ],
            'phone_number_2' => [
                'nullable',
                'string',
                'max:10',
                Rule::unique('teachers', 'phone_number_2_hash')->ignore($teacher->id)
            ],
            'email' => [
                'nullable',
                'string',
                'max:255',
                'email',
                Rule::unique('users', 'email')->ignore($teacher->id),
            ],
            'gender' => ['required', 'in:male,female,other'],
            'date_of_birth' => ['required', 'date', 'before:today'],
            'national_id' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('teachers', 'national_id_hash')->ignore($teacher->id),
            ],
            'tsc_number' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('teachers', 'tsc_number_hash')->ignore($teacher->id)
            ],
            'kra_pin' => [
                'nullable',
                'string',
                'max:20',
                Rule::unique('teachers', 'kra_pin_hash')->ignore($teacher->id)

            ],
            'employment_date' => ['nullable', 'date'],
            'qualification' => ['nullable', 'string', 'max:255'],
            'department_id' => ['required', 'uuid', 'exists:departments,id'],
            'home_address_id' => ['nullable', 'uuid', 'exists:addresses,id'],
            'residential_address_id' => ['nullable', 'uuid', 'exists:addresses,id'],
            'county' => ['required', 'string', 'exists:counties,id'],
            'sub_county' => ['required', 'string', 'exists:sub_counties,constituency_name'],
            'ward' => ['required', 'string', 'exists:sub_counties,id'],
            'location' => ['required', 'string', 'max:255'],
            'sub_location' => ['required', 'string', 'max:255'],
            'home_county' => ['required', 'string', 'exists:counties,id'],
            'home_sub_county' => ['required', 'string', 'exists:sub_counties,constituency_name'],
            'home_ward' => ['required', 'string', 'exists:sub_counties,id'],
            'home_location' => ['required', 'string', 'max:255'],
            'home_sub_location' => ['required', 'string', 'max:255'],
            'active' => ['sometimes', 'boolean'],
        ];
    }
}
