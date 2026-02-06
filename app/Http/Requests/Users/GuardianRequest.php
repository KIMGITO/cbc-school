<?php

namespace App\Http\Requests\Users;

use Illuminate\Foundation\Http\FormRequest;

class GuardianRequest extends FormRequest
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
        $guardian_id = $this->route('guardian');

        return [
            'first_name' => ['required', 'string', 'max:255'],
            'other_names' => ['required', 'string', 'max:255'],
            'sir_name' => ['required', 'string', 'max:255'],
            'gender' => ['required', 'in:male,female,other'],
            'email' => ['required', 'email'],
            'relationship_type' => ['required', 'string', 'max:100'],
            'national_id' => ['required', 'digits:8', 'unique:guardians,national_id' . ($guardian_id ?? '')],
            'phone_number' => ['required', 'string', 'max:15'],
            'phone_number_2' => ['nullable', 'string', 'max:15'],
            'occupation' => ['required', 'string', 'max:255'],

            'county' => ['required', 'string', 'exists:counties,id'],
            'sub_county' => ['required', 'string', 'exists:sub_counties,constituency_name'],
            'ward' => ['required', 'string', 'exists:sub_counties,id'],
            'location' => ['required', 'string', 'max:255'],
            'sub_location' => ['required', 'string', 'max:255'],
            'student_id' => ['required', 'exists:students,id'],
            'is_primary' => ['required', 'boolean'],
            'can_pick_student' => ['required', 'boolean'],
            'can_pay_fees' => ['required', 'boolean'],
        ];
    }

    public function prepareForValidation()
    {
        $this->merge([
            'is_primary' => filter_var($this->input('is_primary'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false,
            'can_pick_student' => filter_var($this->input('can_pick_student'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false,
            'can_pay_fees' => filter_var($this->input('can_pay_fees'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false,
        ]);
    }
}
