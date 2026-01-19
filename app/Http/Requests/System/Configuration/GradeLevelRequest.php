<?php

namespace App\Http\Requests\System\Configuration;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GradeLevelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Return true if user is authorized, otherwise false
        // Example: return auth()->check();
        return true; // Change based on your auth logic
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        // Get the grade level ID from route parameter for update
        $gradeLevelId = $this->route('level');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('grade_levels', 'name')->ignore($gradeLevelId),
            ],
            'code' => [
                'required',
                'string',
                'max:10',
                Rule::unique('grade_levels', 'code')->ignore($gradeLevelId),
            ],
            'description' => 'nullable|string',
        ];
    }

    /**
     * Custom validation messages
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Name is required.',
            'name.unique' => 'Name already exists.',
            'code.required' => 'Code is required.',
            'code.unique' => 'Code already exists.',
        ];
    }

    /**
     * Custom attribute names
     */
    public function attributes(): array
    {
        return [
            'name' => 'level name',
            'code' => 'level code',
            'description ' => 'Level description',
        ];
    }


}
