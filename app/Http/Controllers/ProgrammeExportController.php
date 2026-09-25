<?php

namespace App\Http\Controllers;

use App\Models\Programme;
use App\Services\ProgressionService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

class ProgrammeExportController extends Controller
{
    public function exportPdf(Programme $programme, ProgressionService $progression): Response
    {
        $programme->load([
            'matiere.classe.parcours',
            'chapitres' => fn ($q) => $q->orderBy('id'),
            'chapitres.activites' => fn ($q) => $q->with('user:id,name')->orderBy('date'),
        ]);

        $pdf = Pdf::loadView('exports.programme-bilan', [
            'programme' => $programme,
            'progression' => $progression->percentage($programme),
            'monthlyData' => $progression->monthly($programme),
            'exportDate' => now()->format('d/m/Y'),
        ]);

        $filename = Str::slug("bilan-{$programme->matiere->name}-{$programme->matiere->classe->name}").'.pdf';

        return $pdf->download($filename);
    }
}
