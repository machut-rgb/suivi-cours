<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chapitre extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'isFinished', 'finished_at', 'programme_id'];

    protected function casts(): array
    {
        return [
            'isFinished' => 'boolean',
            'finished_at' => 'datetime',
        ];
    }

    /**
     * Keep finished_at in sync with isFinished so progression can be charted over time.
     */
    protected static function booted(): void
    {
        static::saving(function (Chapitre $chapitre) {
            if ($chapitre->isDirty('isFinished')) {
                $chapitre->finished_at = $chapitre->isFinished ? ($chapitre->finished_at ?? now()) : null;
            }
        });
    }

    public function programme()
    {
        return $this->belongsTo(Programme::class);
    }

    public function activites()
    {
        return $this->hasMany(Activite::class);
    }
}
