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
    return $this->belongsTo(Classe::class, 'classe_id'); // Vérifiez le nom de la colonne
}

    public function programmes()
    {
        return $this->hasOne(Programme::class);
    }
}
