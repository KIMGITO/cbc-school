<?php

namespace App\Http\Requests\System\Configuration;

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
}
