<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activite extends Model
{
    use HasFactory;

    protected $fillable = ['note', 'chapitre_id'];

    public function chapitre()
    {
        return $this->belongsTo(Chapitre::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
