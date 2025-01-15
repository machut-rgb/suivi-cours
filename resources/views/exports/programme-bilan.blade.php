<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
        }

        .header {
            background: #f8fafc;
            padding: 20px;
            margin-bottom: 30px;
            border-bottom: 2px solid #3b82f6;
        }

        .header h1 {
            color: #1e40af;
            margin: 0;
            font-size: 24px;
        }

        .header p {
            color: #64748b;
            margin: 5px 0 0;
        }

        .info-table {
            width: 100%;
            margin-bottom: 20px;
        }
        
        .info-table td {
            padding: 8px;
            vertical-align: middle;
        }
        
        .info-table td:first-child {
            width: 25%;
            font-weight: bold;
            color: #334155;
        }
        
        .info-table tr:nth-child(even) {
            background: #f8fafc;
        }
        
        .progression-cell {
            background: #dbeafe !important;
        }
        
        .progression-value {
            font-size: 20px;
            font-weight: bold;
            color: #1e40af;
        }

        .monthly-table, .chapter-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            background: white;
        }

        .monthly-table th, .chapter-table th {
            background: #f1f5f9;
            color: #334155;
            font-weight: bold;
            text-align: left;
            padding: 12px;
            border: 1px solid #e2e8f0;
        }

        .monthly-table td, .chapter-table td {
            padding: 12px;
            border: 1px solid #e2e8f0;
        }

        .status-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
        }

        .completed {
            background: #dcfce7;
            color: #166534;
        }

        .in-progress {
            background: #fef3c7;
            color: #92400e;
        }

        .activities-list {
            margin: 10px 0 0 20px;
            font-size: 13px;
            color: #475569;
        }

        .activities-list li {
            margin-bottom: 4px;
        }

        .page-break {
            page-break-before: always;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Bilan du Programme</h1>
        <p>Généré le {{ $exportDate }}</p>
    </div>

    <div class="info-block">
        <table class="info-table">
            <tr>
                <td>Parcours</td>
                <td>{{ $programme->matiere->classe->parcours->name }}</td>
            </tr>
            <tr>
                <td>Classe</td>
                <td>{{ $programme->matiere->classe->name }}</td>
            </tr>
            <tr>
                <td>Matière</td>
                <td>{{ $programme->matiere->name }}</td>
            </tr>
            <tr>
                <td class="progression-cell">Progression globale</td>
                <td class="progression-cell">
                    <span class="progression-value">{{ number_format($progression, 1) }}%</span>
                </td>
            </tr>
        </table>
    </div>

    <div class="info-block">
        <h2 class="section-title">Progression Mensuelle</h2>
        <table class="monthly-table">
            <tr>
                <th>Mois</th>
                <th>Progression</th>
                <th>Activités Complétées</th>
                <th>Total Activités</th>
            </tr>
            @foreach($monthlyData as $month => $data)
            <tr>
                <td>{{ \Carbon\Carbon::createFromFormat('Y-m', $month)->format('F Y') }}</td>
                <td>{{ number_format($data['percentage'], 1) }}%</td>
                <td>{{ $data['completed'] }}</td>
                <td>{{ $data['total'] }}</td>
            </tr>
            @endforeach
        </table>
    </div>

    <!-- <div class="page-break"></div> -->

    <div class="info-block">
        <h2 class="section-title">Détails des Chapitres</h2>
        @foreach($programme->chapitres as $chapitre)
            <table class="chapter-table">
                <tr>
                    <th colspan="2">
                        {{ $chapitre->title }}
                        <span class="status-badge {{ $chapitre->isFinished ? 'completed' : 'in-progress' }}">
                            {{ $chapitre->isFinished ? 'Terminé' : 'En cours' }}
                        </span>
                    </th>
                </tr>
                <tr>
                    <td width="30%">
                        <strong>Nombre d'activités:</strong>
                    </td>
                    <td>{{ $chapitre->activites->count() }}</td>
                </tr>
                <tr>
                    <td colspan="2">
                        <strong>Activités:</strong>
                        <ul class="activities-list">
                            @foreach($chapitre->activites as $activite)
                            <li>
                                {{ $activite->note }}
                                <span class="text-sm text-gray-500">
                                    ({{ $activite->created_at->format('d/m/Y') }})
                                </span>
                            </li>
                            @endforeach
                        </ul>
                    </td>
                </tr>
            </table>
            <br>
        @endforeach
    </div>
</body>
</html>