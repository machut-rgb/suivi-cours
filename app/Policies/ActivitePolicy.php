<?php

namespace App\Policies;

use App\Models\Activite;
use App\Models\Chapitre;
use App\Models\User;

class ActivitePolicy
{
    /**
     * A délégué can only report on chapters of their own class.
     */
    public function create(User $user, Chapitre $chapitre): bool
    {
        return $user->isDelegue() && $this->chapitreInUserClasse($user, $chapitre);
    }

    /**
     * Only the author can edit a report, and it must stay within their class.
     */
    public function update(User $user, Activite $activite, ?Chapitre $chapitre = null): bool
    {
        return $user->isDelegue()
            && $activite->user_id === $user->id
            && ($chapitre === null || $this->chapitreInUserClasse($user, $chapitre));
    }

    public function delete(User $user, Activite $activite): bool
    {
        return $user->isDelegue() && $activite->user_id === $user->id;
    }

    private function chapitreInUserClasse(User $user, Chapitre $chapitre): bool
    {
        return $user->classe_id !== null
            && $chapitre->programme->matiere->classe_id === $user->classe_id;
    }
}
