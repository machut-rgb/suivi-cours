<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Programme extends Model
{
    use HasFactory;

    protected $fillable = ['matiere_id', 'name'];

    public function matiere()
    {
        return $this->belongsTo(Matiere::class);
    }

    public function chapitres()
    {
        return $this->hasMany(Chapitre::class);
    }

}
