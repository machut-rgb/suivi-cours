<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProgrammeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isResponsable() ?? false;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'chapters' => ['present', 'array'],
            'chapters.*.id' => ['nullable', 'integer'],
            'chapters.*.title' => ['required', 'string', 'max:255'],
            'chapters.*.isFinished' => ['required', 'boolean'],
            'removed_chapter_ids' => ['sometimes', 'array'],
            'removed_chapter_ids.*' => ['integer'],
        ];
    }

    public function messages(): array
    {
        return [
            'chapters.*.title.required' => 'Chaque chapitre doit avoir un titre.',
        ];
    }
}
