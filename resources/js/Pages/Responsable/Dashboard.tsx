import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Programme } from '@/types';
import { Head } from '@inertiajs/react';
import {
    BookOpen,
    Download,
    GraduationCap,
    Layers,
    TrendingUp,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const formatMonth = (month: string) => {
    const [year, m] = month.split('-').map(Number);
    return new Date(year, m - 1, 1).toLocaleDateString('fr-FR', {
        month: 'short',
        year: '2-digit',
    });
};

const selectClass =
    'mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200';

export default function ResponsableDashboard({
    title,
    programs,
}: {
    title: string;
    programs: Programme[];
}) {
    const [selectedParcours, setSelectedParcours] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedMatiere, setSelectedMatiere] = useState('');

    const parcoursOf = (p: Programme) => p.matiere.classe?.parcours?.name ?? '';
    const classeOf = (p: Programme) => p.matiere.classe?.name ?? '';

    const parcours = useMemo(
        () => Array.from(new Set(programs.map(parcoursOf))).sort(),
        [programs],
    );
    const classes = useMemo(
        () =>
            Array.from(
                new Set(
                    programs
                        .filter((p) => parcoursOf(p) === selectedParcours)
                        .map(classeOf),
                ),
            ).sort(),
        [programs, selectedParcours],
    );
    const matieres = useMemo(
        () =>
            Array.from(
                new Set(
                    programs
                        .filter(
                            (p) =>
                                parcoursOf(p) === selectedParcours &&
                                classeOf(p) === selectedClass,
                        )
                        .map((p) => p.matiere.name),
                ),
            ).sort(),
        [programs, selectedParcours, selectedClass],
    );

    const selectedProgram = programs.find(
        (p) =>
            parcoursOf(p) === selectedParcours &&
            classeOf(p) === selectedClass &&
            p.matiere.name === selectedMatiere,
    );

    const stats = [
        {
            label: 'Programmes',
            value: programs.length,
            icon: BookOpen,
            tone: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
        },
        {
            label: 'Classes',
            value: new Set(programs.map((p) => p.matiere.classe_id)).size,
            icon: GraduationCap,
            tone: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
        },
        {
            label: 'Matières',
            value: new Set(programs.map((p) => p.matiere_id)).size,
            icon: Layers,
            tone: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
        },
        {
            label: 'Progression moyenne',
            value: `${(programs.length
                ? programs.reduce((acc, p) => acc + p.progression, 0) /
                  programs.length
                : 0
            ).toFixed(1)}%`,
            icon: TrendingUp,
            tone: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
        },
    ];

    // Least advanced programmes first: this is what a coordinator needs to act on.
    const lagging = useMemo(
        () =>
            [...programs]
                .sort((a, b) => a.progression - b.progression)
                .slice(0, 5),
        [programs],
    );

    const monthlyData = selectedProgram?.monthly ?? [];

    return (
        <Authenticated>
            <Head title={title} />
            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold dark:text-gray-200">
                        {title}
                    </h1>
                    {selectedProgram && (
                        <a
                            href={route(
                                'programmes.export',
                                selectedProgram.id,
                            )}
                            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            <Download size={20} />
                            Exporter le bilan
                        </a>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="flex items-center rounded-lg bg-white p-4 shadow dark:bg-gray-800"
                        >
                            <div
                                className={`mr-3 flex h-10 w-10 items-center justify-center rounded-full ${stat.tone}`}
                            >
                                <stat.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    {stat.label}
                                </p>
                                <p className="text-2xl font-bold dark:text-gray-200">
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                    <h2 className="mb-4 text-lg font-bold dark:text-gray-200">
                        Programmes les moins avancés
                    </h2>
                    <ul className="space-y-3">
                        {lagging.map((p) => (
                            <li key={p.id}>
                                <div className="mb-1 flex justify-between text-sm">
                                    <span className="dark:text-gray-200">
                                        {p.matiere.name}
                                        <span className="text-gray-500">
                                            {' '}
                                            · {classeOf(p)}
                                        </span>
                                    </span>
                                    <span className="font-semibold tabular-nums dark:text-gray-200">
                                        {Math.round(p.progression)}%
                                    </span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div
                                        className="h-2 rounded-full bg-blue-600"
                                        style={{ width: `${p.progression}%` }}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                    <h2 className="text-lg font-bold dark:text-gray-200">
                        Progression par parcours, classe et matière
                    </h2>

                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Parcours
                            <select
                                className={selectClass}
                                value={selectedParcours}
                                onChange={(e) => {
                                    setSelectedParcours(e.target.value);
                                    setSelectedClass('');
                                    setSelectedMatiere('');
                                }}
                            >
                                <option value="">Choisir un parcours</option>
                                {parcours.map((p) => (
                                    <option key={p} value={p}>
                                        {p}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Classe
                            <select
                                className={selectClass}
                                value={selectedClass}
                                disabled={!selectedParcours}
                                onChange={(e) => {
                                    setSelectedClass(e.target.value);
                                    setSelectedMatiere('');
                                }}
                            >
                                <option value="">Choisir une classe</option>
                                {classes.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Matière
                            <select
                                className={selectClass}
                                value={selectedMatiere}
                                disabled={!selectedClass}
                                onChange={(e) =>
                                    setSelectedMatiere(e.target.value)
                                }
                            >
                                <option value="">Choisir une matière</option>
                                {matieres.map((m) => (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    {selectedProgram && (
                        <>
                            <div className="mt-6">
                                <h3 className="text-md mb-1 font-bold dark:text-gray-200">
                                    Progression cumulée — {selectedProgram.name}
                                </h3>
                                <p className="mb-4 text-sm text-gray-500">
                                    Part des chapitres terminés à la fin de
                                    chaque mois.
                                </p>
                                {monthlyData.length === 0 ? (
                                    <p className="rounded-md bg-blue-50 p-3 text-sm text-blue-700">
                                        Aucune activité ni chapitre terminé pour
                                        l’instant.
                                    </p>
                                ) : (
                                    <div className="h-64">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <LineChart data={monthlyData}>
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    vertical={false}
                                                />
                                                <XAxis
                                                    dataKey="month"
                                                    tickFormatter={formatMonth}
                                                />
                                                <YAxis
                                                    domain={[0, 100]}
                                                    unit="%"
                                                    width={48}
                                                />
                                                <Tooltip
                                                    labelFormatter={(m) =>
                                                        formatMonth(String(m))
                                                    }
                                                    formatter={(v) => [
                                                        `${v}%`,
                                                        'Progression',
                                                    ]}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="progression"
                                                    stroke="#2563eb"
                                                    strokeWidth={2}
                                                    name="Progression"
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 overflow-x-auto">
                                <h3 className="text-md mb-4 font-bold dark:text-gray-200">
                                    Détails des chapitres
                                </h3>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left dark:border-gray-700">
                                            <th className="pb-2">Chapitre</th>
                                            <th className="pb-2">Statut</th>
                                            <th className="pb-2 text-right">
                                                Activités
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedProgram.chapitres.map(
                                            (chapitre) => (
                                                <tr
                                                    key={chapitre.id}
                                                    className="border-b dark:border-gray-700"
                                                >
                                                    <td className="py-2">
                                                        {chapitre.title}
                                                    </td>
                                                    <td className="py-2">
                                                        <span
                                                            className={`inline-block rounded-full px-2 py-1 text-xs ${
                                                                chapitre.isFinished
                                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                            }`}
                                                        >
                                                            {chapitre.isFinished
                                                                ? 'Terminé'
                                                                : 'En cours'}
                                                        </span>
                                                    </td>
                                                    <td className="py-2 text-right tabular-nums">
                                                        {chapitre.activites
                                                            ?.length ?? 0}
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Authenticated>
    );
}
