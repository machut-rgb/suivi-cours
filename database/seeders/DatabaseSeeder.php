<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Désactiver les contraintes de clé étrangère pour éviter les conflits
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        }

        // Vider les tables
        DB::table('activites')->truncate();
        DB::table('chapitres')->truncate();
        DB::table('programmes')->truncate();
        DB::table('matieres')->truncate();
        DB::table('classes')->truncate();
        DB::table('parcours')->truncate();
        DB::table('users')->truncate();

        // Réactiver les contraintes de clé étrangère
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        }

        // Création des parcours
        $parcoursIds = [
            'scientifique' => DB::table('parcours')->insertGetId([
                'name' => 'Parcours Scientifique',
                'created_at' => now(),
                'updated_at' => now(),
            ]),
            'litteraire' => DB::table('parcours')->insertGetId([
                'name' => 'Parcours Littéraire',
                'created_at' => now(),
                'updated_at' => now(),
            ]),
        ];

        // Création des classes pour chaque parcours
        $classes = [
            'scientifique' => ['Première S1', 'Première S2', 'Terminale S'],
            'litteraire' => ['Première L', 'Terminale L'],
        ];

        $classIds = []; // Stocker les IDs des classes
        foreach ($classes as $parcours => $classNames) {
            foreach ($classNames as $className) {
                $classId = DB::table('classes')->insertGetId([
                    'name' => $className,
                    'parcours_id' => $parcoursIds[$parcours],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $classIds[] = $classId; // Ajouter l'ID de la classe dans le tableau
            }
        }

        // Création des utilisateurs
        DB::table('users')->insert([
            [
                'name' => 'Admin Responsable',
                'email' => 'responsable@example.com',
                'password' => Hash::make('password'),
                'role' => 'responsable',
                'classe_id' => $classIds[0], // Première classe scientifique
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Jean Dupont',
                'email' => 'delegue@example.com',
                'password' => Hash::make('password'),
                'role' => 'delegue',
                'classe_id' => $classIds[1], // Deuxième classe scientifique
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Marie Martin',
                'email' => 'delegue2@example.com',
                'password' => Hash::make('password'),
                'role' => 'delegue',
                'classe_id' => $classIds[2], // Troisième classe scientifique
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Continuer à insérer les matières, programmes, chapitres et activités
        foreach ($classIds as $index => $classId) {
            $parcoursType = $index < 3 ? 'scientifique' : 'litteraire'; // Basé sur les indices
            $matieres = $parcoursType === 'scientifique' 
                ? ['Mathématiques', 'Physique-Chimie', 'SVT'] 
                : ['Français', 'Philosophie', 'Histoire-Géographie', 'Anglais'];

            foreach ($matieres as $matiere) {
                $matiereId = DB::table('matieres')->insertGetId([
                    'name' => $matiere,
                    'classe_id' => $classId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $programmeId = DB::table('programmes')->insertGetId([
                    'name' => "Programme de $matiere",
                    'matiere_id' => $matiereId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $chapitres = [
                    'Chapitre 1 - Introduction',
                    'Chapitre 2 - Concepts fondamentaux',
                    'Chapitre 3 - Applications pratiques',
                    'Chapitre 4 - Approfondissements',
                ];

                foreach ($chapitres as $index => $chapitre) {
                    $chapitreId = DB::table('chapitres')->insertGetId([
                        'programme_id' => $programmeId,
                        'title' => $chapitre,
                        'isFinished' => $index < 2,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    $activites = [
                        'Cours magistral',
                        'Exercices pratiques',
                        'Évaluation formative',
                        'Travaux dirigés',
                    ];

                    foreach ($activites as $activite) {
                        DB::table('activites')->insert([
                            'chapitre_id' => $chapitreId,
                            'user_id' => rand(1, 3),
                            'note' => "$activite - $chapitre",
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }
        }
    }
}
