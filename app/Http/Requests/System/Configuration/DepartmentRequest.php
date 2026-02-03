<?php

namespace App\Http\Requests\System\Configuration;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DepartmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // TODO:  rememeber to implement policy in your models.
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {

        $departmentId = $this->route('department');
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('departments', 'name')->ignore($departmentId)],
            'code' => ['required', 'string', 'max:255', Rule::unique('departments', 'code')->ignore($departmentId)],
            'description' => 'nullable|string|max:255',
            'active' => 'required|boolean',
        ];
    }
    public function messages(): array
    {
        return [
            'name.required' => 'department name field is required.',
            'name.string' => 'department name field must be a string.',
            'name.max' => 'department name field must be less than 255 characters.',
            'code.required' => 'department code field is required.',
            'code.string' => 'department code field must be a string.',
            'code.max' => 'department code field must be less than 255 characters.',
            'description.nullable' => 'department description field is nullable.',
            'description.string' => 'department description field must be a string.',
            'description.max' => 'department description field must be less than 255 characters.',
            'active.required' => 'department active field is required.',
            'active.boolean' => 'department active field must be a boolean.',
        ];
    }
    public function attributes(): array
    {
        return [
            'name' => 'Name',
            'code' => 'Code',
            'description' => 'Description',
            'active' => 'Active',
        ];
    }
}
