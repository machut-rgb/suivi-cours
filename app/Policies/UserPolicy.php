<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }

    public function responsable(User $user)
    {
        return $user->role === 'responsable';
    }

    public function delegue(User $user)
    {
        return $user->role === 'delegue';
    }
}
