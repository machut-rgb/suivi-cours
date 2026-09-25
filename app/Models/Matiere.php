<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Matiere extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'classe_id'];

    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }

    public function programme()
    {
        return $this->hasOne(Programme::class);
    }
}
