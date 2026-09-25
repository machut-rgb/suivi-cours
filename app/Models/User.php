<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'role',
        'password',
        'classe_id',
        'approved_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }

    public function activites()
    {
        return $this->hasMany(Activite::class);
    }

    public function isResponsable(): bool
    {
        return $this->role === 'responsable';
    }

    public function isDelegue(): bool
    {
        return $this->role === 'delegue';
    }

    /**
     * Responsables are trusted by default; délégués need a responsable's approval.
     */
    public function isApproved(): bool
    {
        return $this->isResponsable() || $this->approved_at !== null;
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'approved_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
