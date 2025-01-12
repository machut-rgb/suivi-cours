<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Parcours extends Model
{
    protected $fillable = ['name'];

    public function classes()
    {
        return $this->hasMany(Classe::class);
    }
}
