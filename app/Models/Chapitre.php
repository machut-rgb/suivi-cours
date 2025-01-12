<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chapitre extends Model
{
    protected $fillable = ['title', 'isFinished', 'programme_id'];

    public function programme()
    {
        return $this->belongsTo(Programme::class);
    }

    public function activites()
    {
        return $this->hasMany(Activite::class);
    }
}
