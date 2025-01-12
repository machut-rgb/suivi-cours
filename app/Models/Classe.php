<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classe extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'parcours_id'];

    public function parcours()
    {
        return $this->belongsTo(Parcours::class);
    }

    public function matieres()
    {
        return $this->hasMany(Matiere::class);
    }
}