<?php

namespace Database\Seeders;

use App\Models\Activite;
use App\Models\Chapitre;
use App\Models\Classe;
use App\Models\Matiere;
use App\Models\Parcours;
use App\Models\Programme;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Demo data: 2 parcours, 5 classes, one programme per subject, 4 chapters each.
     * Run with `php artisan migrate:fresh --seed`.
     */
    public function run(): void
    {
        $structure = [
            'Parcours Scientifique' => [
                'classes' => ['Première S1', 'Première S2', 'Terminale S'],
                'matieres' => ['Mathématiques', 'Physique-Chimie', 'SVT'],
            ],
            'Parcours Littéraire' => [
                'classes' => ['Première L', 'Terminale L'],
                'matieres' => ['Français', 'Philosophie', 'Histoire-Géographie', 'Anglais'],
            ],
        ];

        $chapterTitles = [
            'Chapitre 1 - Introduction',
            'Chapitre 2 - Concepts fondamentaux',
            'Chapitre 3 - Applications pratiques',
            'Chapitre 4 - Approfondissements',
        ];

        $activityTypes = ['Cours magistral', 'Exercices pratiques', 'Travaux dirigés', 'Évaluation formative'];

        $password = Hash::make('password');

        User::create([
            'name' => 'Admin Responsable',
            'email' => 'responsable@example.com',
            'password' => $password,
            'role' => 'responsable',
            'email_verified_at' => now(),
        ]);

        // Timeline starts four months ago so the monthly charts have something to show.
        $start = Carbon::now()->subMonths(4)->startOfMonth();

        $delegueSeeds = [
            'Première S1' => ['Jean Dupont', 'delegue@example.com', true],
            'Première S2' => ['Marie Martin', 'delegue2@example.com', true],
            'Terminale L' => ['Paul Bernard', 'delegue3@example.com', false],
        ];

        $classIndex = 0;
        foreach ($structure as $parcoursName => $config) {
            $parcours = Parcours::create(['name' => $parcoursName]);

            foreach ($config['classes'] as $className) {
                $classe = Classe::create(['name' => $className, 'parcours_id' => $parcours->id]);

                $delegue = null;
                if (isset($delegueSeeds[$className])) {
                    [$name, $email, $approved] = $delegueSeeds[$className];
                    $delegue = User::create([
                        'name' => $name,
                        'email' => $email,
                        'password' => $password,
                        'role' => 'delegue',
                        'classe_id' => $classe->id,
                        'email_verified_at' => now(),
                        'approved_at' => $approved ? now() : null,
                    ]);
                }

                foreach ($config['matieres'] as $matiereIndex => $matiereName) {
                    $matiere = Matiere::create(['name' => $matiereName, 'classe_id' => $classe->id]);
                    $programme = Programme::create([
                        'name' => "Programme de $matiereName",
                        'matiere_id' => $matiere->id,
                    ]);

                    // Vary progress per class/subject: 0 to 4 finished chapters.
                    $finishedCount = ($classIndex + $matiereIndex) % 5;

                    foreach ($chapterTitles as $chapterIndex => $title) {
                        $chapterStart = $start->copy()->addWeeks($chapterIndex * 4 + $matiereIndex);
                        $finished = $chapterIndex < $finishedCount;

                        $chapitre = new Chapitre([
                            'title' => $title,
                            'programme_id' => $programme->id,
                            'isFinished' => $finished,
                        ]);
                        $chapitre->finished_at = $finished ? $chapterStart->copy()->addWeeks(3) : null;
                        $chapitre->save();

                        // Only delegues log activities, and only for chapters already started.
                        if ($delegue && $delegue->approved_at && $chapterIndex <= $finishedCount) {
                            foreach ($activityTypes as $i => $type) {
                                $date = $chapterStart->copy()->addDays($i * 5);
                                if ($date->isFuture()) {
                                    continue;
                                }
                                Activite::create([
                                    'chapitre_id' => $chapitre->id,
                                    'user_id' => $delegue->id,
                                    'note' => "$type - $title",
                                    'date' => $date->toDateString(),
                                ]);
                            }
                        }
                    }
                }
                $classIndex++;
            }
        }
    }
}
