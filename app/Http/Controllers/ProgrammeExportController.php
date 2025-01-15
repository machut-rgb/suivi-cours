<?php

namespace App\Http\Controllers;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use App\Models\Programme;

class ProgrammeExportController extends Controller
{
    public function exportPdf(Programme $programme)
    {
        $data = [
            'programme' => $programme->load([
                'matiere.classe.parcours',
                'chapitres.activites'
            ]),
            'progression' => $this->calculateProgression($programme),
            'monthlyData' => $this->getMonthlyProgression($programme),
            'exportDate' => now()->format('d/m/Y')
        ];

        $pdf = PDF::loadView('exports.programme-bilan', $data);
        
        return $pdf->download("bilan-{$programme->matiere->name}-{$programme->matiere->classe->name}.pdf");
    }

    private function calculateProgression($programme)
    {
        $totalChapters = $programme->chapitres->count();
        if (!$totalChapters) return 0;
        
        $completedChapters = $programme->chapitres->where('isFinished', true)->count();
        return ($completedChapters / $totalChapters) * 100;
    }

    private function getMonthlyProgression($programme)
    {
        $monthlyProgress = [];
        
        foreach ($programme->chapitres as $chapitre) {
            foreach ($chapitre->activites as $activity) {
                $month = $activity->created_at->format('Y-m');
                
                if (!isset($monthlyProgress[$month])) {
                    $monthlyProgress[$month] = ['total' => 0, 'completed' => 0];
                }
                
                $monthlyProgress[$month]['total']++;
                if ($chapitre->isFinished) {
                    $monthlyProgress[$month]['completed']++;
                }
            }
        }

        return collect($monthlyProgress)->map(function ($data) {
            return [
                'completed' => $data['completed'],
                'total' => $data['total'],
                'percentage' => ($data['completed'] / $data['total']) * 100
            ];
        })->toArray();
    }
}