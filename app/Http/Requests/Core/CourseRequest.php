<?php

namespace App\Http\Requests\Core;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class CourseRequest extends FormRequest
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
        $courseId = $this->route('course');
        return [
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('courses', 'id')->ignore($courseId),
            ],
            'code' => [
                'required',
                'string',
                Rule::unique('courses', 'id')->ignore($courseId),
            ],
            'description' => [
                'nullable',
                'max:255',
            ],
            'department_id' => [
                'required',
                'exists:departments,id'
            ],
            'active' => [
                'required',
                'boolean'
            ]
        ];
    }

public function messages(): array
{
    return [
        'name.required' => 'Course name is required.',
        'name.string' => 'Course name must be a string.',
        'name.max' => 'Course name may not be greater than 100 characters.',
        'name.unique' => 'Course name has already been taken.',
        'code.required' => 'Course code is required.',
        'code.string' => 'Course code must be a string.',
        'code.unique' => 'Course code has already been taken.',
        'description.max' => 'Description may not be greater than 255 characters.',
        'department_id.required' => 'Department is required.',
        'department_id.exists' => 'Selected department does not exist.',
        'active.required' => 'Active status is required.',
        'active.boolean' => 'Active status must be true or false.',
    ];
}
}
