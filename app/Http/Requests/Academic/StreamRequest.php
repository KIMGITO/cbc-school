<?php

namespace App\Http\Requests\Academic;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class StreamRequest extends FormRequest
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

        $streamId = $this->route('stream');
        return [
            'name' => ['required', 'string', 'max:50', Rule::unique('streams', 'name')->ignore($streamId)],
            'code' => ['required', 'string', 'max:50', Rule::unique('streams', 'code')->ignore($streamId)],
            'capacity' => ['required', 'numeric'],
            'level_id' => ['required', 'exists:grade_levels,id'],
            'teacher_id' => ['nullable', 'exists:teachers,id'],
        ];
    }

    public function attributes()
    {
        return  [
            'name' => 'Stream name',
            'code' => 'Stream code',
            'capacity' => 'Stream capacity',
            'level_id' => 'Stream level',
            'teacher_id' => 'Class Teacher'
        ];
    }
}
