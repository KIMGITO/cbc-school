<?php

namespace App\Http\Requests\Core;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class TermRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
        //TODO:  remember to implement the policy on request authorization.
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $term = $this->route('term');
        return [
            'academic_year' => [
                'required',
                'exists:academic_years,id',
            ],
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('terms')->where(function ($query) {
                    return $query->where('academic_year', $this->input('academic_year'));
                })->ignore($term),
            ],
            'number' => [
                'required',
                'numeric',
                'in:1,2,3',
                Rule::unique('terms')->where(function ($query) {
                    return $query->where('number', $this->input('number'));
                })->ignore($term)
            ],
            'start_date' => [
                'required',
                'date',
                'before:end_date',
            ],
            'end_date' => [
                'required',
                'date',
                'after:start_date',
            ],
            'is_active' => [
                'required',
                'boolean',
            ]
            // further validation on term service.
        ];
    }

    public function message()
    {
        return [
            'academic_year.required' => 'Please select academic year.',
            'academic_year.exists' => 'Selected academic year is invalid.',
            'name.required' => 'Please enter a term name.',
            'name.string' => 'Term name must be valid text.',
            'name.max' => 'Term name may not be greater than 255 characters.',
            'name.unique' => 'The term name already exists for this academic year.',
            'number.required' => 'Please enter the term number.',
            'number.numeric' => 'Term number must be a valid number.',
            'number.in' => 'Term number must be 1, 2, or 3.',
            'number.unique' => 'Term number already exists.',
            'start_date.required' => 'Please enter the start date.',
            'start_date.date' => 'Start date must be a valid date.',
            'start_date.before' => 'Start date must be before the end date.',
            'end_date.required' => 'Please enter the end date.',
            'end_date.date' => 'End date must be a valid date.',
            'end_date.after' => 'End date must be after the start date.',
            'is_active.required' => 'Please specify if the term is active.',
            'is_active.boolean' => 'Active status must be true or false.'
        ];
    }
}
