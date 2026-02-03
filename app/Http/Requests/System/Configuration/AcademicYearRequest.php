<?php

namespace App\Http\Requests\System\Configuration;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class AcademicYearRequest extends FormRequest
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

        $academicYear = $this->route('year');
        $startDate = $this->input('start_date', today());
        return [
            'name' => [
                'required',
                'string',
                'max:50',
                'regex:/^\d{4}\/\d{2,4}$/',
                Rule::unique('academic_years', 'name')->ignore($academicYear),
            ],
            'start_date' => [
                'required',
                'date',
                'before:end_date'
            ],
            'end_date' => [
                'required',
                'date',
                'after:start_date',
            ],
            'is_active' => [
                'boolean',
            ],
            'description' => [
                'nullable',
                'string',
                'max:500',
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Academic Year name is required.',
            'name.string' => 'Academic Year name must be a string.',
            'name.max' => 'Academic Year name must not exceed 50 characters.',
            'name.unique' => 'Academic Year name has already been taken.',
            'name.regex' => 'Use correct naming format. e.g 2025/26 ',
            'start_date.required' => 'Date is required.',
            'start_date.date' => 'Date must be a valid date.',
            'start_date.date_format' => 'Date must be in Y-m-d format.',
            'start_date.before' => 'Date must be before End Date.',
            'end_date.required' => 'Date is required.',
            'end_date.date' => 'Date must be a valid date.',
            'end_date.date_format' => 'Date must be in Y-m-d format.',
            'end_date.after' => 'Date must be after Start Date.',
            'is_active.required' => 'Active status is required.',
            'is_active.boolean' => 'Active status must be true or false.',
            'description.string' => 'Description must be a string.',
            'description.max' => 'Description must not exceed 500 characters.',
        ];
    }

    public function prepareForValidation()
    {
        $name = $this->input('name');
        $this->merge([
            'name' => standardize_academic_year($name),
        ]);
    }
}
