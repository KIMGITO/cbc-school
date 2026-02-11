<?php

namespace App\Http\Requests\Users;

use App\Models\Users\Teacher;
use Illuminate\Support\Carbon;
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
        $teacher_id = $this->route('teacher');

        return [
            'department_id' => ['nullable', 'string', 'uuid', 'exists:departments,id'],
            'email' => [
                'required',
                'string',
                'max:255',
                'email',
                Rule::unique('users', 'email')->ignore($teacher_id),
            ],
            'employment_date' => ['required', 'date', 'before_or_equal:today'],
            'first_name' => ['required', 'string', 'max:255'],
            'sir_name' => ['required', 'string', 'max:255'],
            'other_names' => ['required', 'string', 'max:255'],
            'gender' => ['required', 'in:male,female,other'],
            'home_county' => ['required', 'string', 'exists:counties,id'],
            'home_county_name' => ['required', 'string', 'exists:counties,county_name'],
            'home_location' => ['required', 'string', 'max:255'],
            'home_sub_county' => ['required', 'string', 'exists:sub_counties,constituency_name'],
            'home_sub_county_name' => ['required', 'string', 'exists:sub_counties,constituency_name'],
            'home_sub_location' => ['required', 'string', 'max:255'],
            'home_ward' => ['required', 'string', 'exists:sub_counties,id'],
            'home_ward_name' => ['required', 'string', 'exists:sub_counties,ward'],

            // Validate plain text fields for format
            'kra_pin' => [
                'required',
                'string',
                'max:20',
                // 'regex:/^[A-Z]{1}\d{9}[A-Z]{1}$/', // Validate KRA PIN format
                // Custom rule to check hashed uniqueness
                function ($attribute, $value, $fail) use ($teacher_id) {
                    $hashedValue = hash('sha256', $value);
                    $exists = Teacher::where('kra_pin_hash', $hashedValue)
                        ->when($teacher_id, function ($query) use ($teacher_id) {
                            $query->where('id', '!=', $teacher_id);
                        })
                        ->exists();

                    if ($exists) {
                        $fail('This KRA PIN is already registered.');
                    }
                },
            ],

            'national_id' => [
                'required',
                'string',
                'max:50',
                'regex:/^\d{8}$/', // Validate 8-digit National ID
                function ($attribute, $value, $fail) use ($teacher_id) {
                    $hashedValue = hash('sha256', $value);
                    $exists = Teacher::where('national_id_hash', $hashedValue)
                        ->when($teacher_id, function ($query) use ($teacher_id) {
                            $query->where('id', '!=', $teacher_id);
                        })
                        ->exists();

                    if ($exists) {
                        $fail('This national ID is already registered.');
                    }
                },
            ],

            'phone_number' => [
                'required',
                'string',
                'max:20',
                'regex:/^07\d{8}$/', // Validate Kenyan phone format
                function ($attribute, $value, $fail) use ($teacher_id) {
                    $hashedValue = hash('sha256', $value);
                    $exists = Teacher::where('phone_number_hash', $hashedValue)
                        ->when($teacher_id, function ($query) use ($teacher_id) {
                            $query->where('id', '!=', $teacher_id);
                        })
                        ->exists();

                    if ($exists) {
                        $fail('This phone number is already registered.');
                    }
                },
            ],

            'phone_number_2' => [
                'nullable',
                'string',
                'max:20',
                'regex:/^07\d{8}$/',
                function ($attribute, $value, $fail) use ($teacher_id) {
                    $hashedValue = hash('sha256', $value);
                    $exists = Teacher::where('phone_number_2_hash', $hashedValue)
                        ->when($teacher_id, function ($query) use ($teacher_id) {
                            $query->where('id', '!=', $teacher_id);
                        })
                        ->exists();

                    if ($exists) {
                        $fail('This alternative phone number is already registered.');
                    }
                },
            ],

            'qualifications' => ['required', 'array'],
            'qualifications.*.name' => ['required', 'string'],
            'qualifications.*.institution' => ['required', 'string'],
            'qualifications.*.year_completed' => ['required', 'string'],
            'qualifications.*.tsc_registered' => ['required', 'boolean'],
            'residential_county' => ['required', 'string', 'exists:counties,id'],
            'residential_county_name' => ['required', 'string', 'exists:counties,county_name'],
            'residential_location' => ['required', 'string', 'max:255'],
            'residential_sub_county' => ['required', 'string', 'exists:sub_counties,constituency_name'],
            'residential_sub_county_name' => ['required', 'string', 'exists:sub_counties,constituency_name'],
            'residential_sub_location' => ['required', 'string', 'max:255'],
            'residential_ward' => ['required', 'string', 'exists:sub_counties,id'],
            'residential_ward_name' => ['required', 'string', 'exists:sub_counties,ward'],

            'tsc_number' => [
                'nullable',
                'string',
                'max:50',
                function ($attribute, $value, $fail) use ($teacher_id) {
                    $hashedValue = hash('sha256', $value);
                    $exists = Teacher::where('tsc_number_hash', $hashedValue)
                        ->when($teacher_id, function ($query) use ($teacher_id) {
                            $query->where('id', '!=', $teacher_id);
                        })
                        ->exists();

                    if ($exists) {
                        $fail('This TSC number is already registered.');
                    }
                },
            ],
        ];
    }

    public function messages()
    {
        return [
            'qualifications.*.name.required' => 'The qualification name is required.',
            'qualifications.*.institution.required' => 'The institution is required.',
            'qualifications.*.year_completed.string' => 'The qualification year completed must be a string.',
            'qualifications.*.year_completed.required' => 'The qualification year completed is required.',
            'qualifications.*.tsc_registered.required' => 'Please indicate if qualified for TSC registration.',
            'qualifications.*.tsc_registered.boolean' => 'The qualification TSC registration must be true or false.',
            'phone_number.regex' => 'Phone number must start with 07 and have 10 digits.',
            'phone_number_2.regex' => 'Alternative phone number must start with 07 and have 10 digits.',
            'national_id.regex' => 'National ID must be 8 digits.',
            'kra_pin.regex' => 'KRA PIN must be correct format',
        ];
    }

    public function prepareForValidation()
    {
        $data = $this->all();

        // Handle qualifications JSON
        if (isset($data['qualifications']) && is_string($data['qualifications'])) {
            $this->merge([
                'qualifications' => json_decode($data['qualifications'], true)
            ]);
        }

        // Normalize employment_date
        try {
            $dt = new \DateTime($data['employment_date']);
            $this->merge([
                'employment_date' => $dt->format('Y-m-d')
            ]);
        } catch (\Exception $e) {
            // Keep original value
        }
    }

    public function passedValidation()
    {
        // Hash sensitive data AFTER validation passes
        $hashFields = [
            'phone_number',
            'national_id',
            'kra_pin',
            'tsc_number',
            'phone_number_2',
        ];

        foreach ($hashFields as $field) {
            if ($this->has($field) && !empty($this->$field)) {
                $this->merge([
                    $field . '_hash' => hash('sha256', $this->$field)
                ]);
            }
        }
    }
}
