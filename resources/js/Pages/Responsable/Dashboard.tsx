import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Download } from 'lucide-react';
import { useState } from 'react';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const getProgressionFromChapters = (chapitres) => {
    if (!chapitres || chapitres.length === 0) return 0;
    const finishedChapters = chapitres.filter((c) => c.isFinished).length;
    return (finishedChapters / chapitres.length) * 100;
};

const getMonthlyProgression = (chapitres) => {
    if (!chapitres || chapitres.length === 0) return {};

    const monthlyProgress = {};
    chapitres.forEach((chapitre) => {
        const activities = chapitre.activites || [];
        activities.forEach((activity) => {
            const date = new Date(activity.created_at);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!monthlyProgress[monthKey]) {
                monthlyProgress[monthKey] = { total: 0, completed: 0 };
            }
            monthlyProgress[monthKey].total++;
            if (chapitre.isFinished) {
                monthlyProgress[monthKey].completed++;
            }
        });
    });

    return Object.entries(monthlyProgress).map(([month, data]) => ({
        month,
        progression: (data.completed / data.total) * 100,
    }));
};

export default function ResponsableDashboard({ title, programs }) {
    const [selectedParcours, setSelectedParcours] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedMatiere, setSelectedMatiere] = useState(null);

    const parcours = Array.from(
        new Set(programs.map((p) => p.matiere.classe.parcours.name)),
    ).sort();
    const classes = selectedParcours
        ? Array.from(
              new Set(
                  programs
                      .filter(
                          (p) =>
                              p.matiere.classe.parcours.name ===
                              selectedParcours,
                      )
                      .map((p) => p.matiere.classe.name),
              ),
          ).sort()
        : [];
    const matieres = selectedClass
        ? Array.from(
              new Set(
                  programs
                      .filter(
                          (p) =>
                              p.matiere.classe.parcours.name ===
                                  selectedParcours &&
                              p.matiere.classe.name === selectedClass,
                      )
                      .map((p) => p.matiere.name),
              ),
          ).sort()
        : [];

    const selectedProgram = programs.find(
        (p) =>
            p.matiere.classe.parcours.name === selectedParcours &&
            p.matiere.classe.name === selectedClass &&
            p.matiere.name === selectedMatiere,
    );

    const monthlyData = selectedProgram
        ? getMonthlyProgression(selectedProgram.chapitres)
        : [];

    const stats = {
        totalPrograms: programs.length,
        avgProgression:
            programs.length > 0
                ? programs.reduce(
                      (acc, curr) =>
                          acc + getProgressionFromChapters(curr.chapitres),
                      0,
                  ) / programs.length
                : 0,
        totalClasses: Array.from(
            new Set(programs.map((p) => p.matiere.classe.name)),
        ).length,
        totalMatieres: new Set(programs.map((p) => p.matiere.name)).size,
    };

    const generatePDF = () => {
        if (!selectedProgram) return;
        const content = {
            programName: selectedProgram.name,
            parcours: selectedParcours,
            class: selectedClass,
            subject: selectedMatiere,
            progression: getProgressionFromChapters(selectedProgram.chapitres),
            chapters: selectedProgram.chapitres.map((chapter) => ({
                title: chapter.title,
                status: chapter.isFinished ? 'Terminé' : 'En cours',
                activities: chapter.activites.length,
            })),
        };
        console.log('Generating PDF with content:', content);
        // alert("La fonctionnalité d'export PDF sera bientôt disponible");
        window.location.href = route('programmes.export', selectedProgram.id);
    };

    return (
        <Authenticated>
        <div className="space-y-6 p-6">
            {/* Header with title and export button - same as before */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold dark:text-gray-200">
                    {title}
                </h1>
                <div className="flex items-center gap-4">
                    {selectedProgram && (
                        <button
                            onClick={generatePDF}
                            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            <Download size={20} />
                            Exporter le Bilan
                        </button>
                    )}
                    <span className="text-sm text-gray-500">
                        Dernière mise à jour : {new Date().toLocaleDateString()}
                    </span>
                </div>
            </div>

            {/* Stats cards - same as before */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {[
                    {
                        label: 'Programmes',
                        value: stats.totalPrograms,
                        color: 'blue',
                    },
                    {
                        label: 'Classes',
                        value: stats.totalClasses,
                        color: 'green',
                    },
                    {
                        label: 'Matières',
                        value: stats.totalMatieres,
                        color: 'purple',
                    },
                    {
                        label: 'Progression moyenne',
                        value: `${stats.avgProgression.toFixed(1)}%`,
                        color: 'orange',
                    },
                ].map((stat, idx) => (
                    <div
                        key={idx}
                        className="rounded-lg bg-white p-4 shadow dark:bg-gray-800"
                    >
                        <div className="flex items-center">
                            <div
                                className={`mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900`}
                            >
                                <span className={`text-${stat.color}-600`}>
                                    {stat.label[0]}
                                </span>
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
                    </div>
                ))}
            </div>

            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                <h2 className="text-lg font-bold dark:text-gray-200">
                    Progression par Parcours, Classe et Matière
                </h2>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Sélectionnez un Parcours
                        </label>
                        <select
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                            value={selectedParcours || ''}
                            onChange={(e) => {
                                setSelectedParcours(e.target.value || null);
                                setSelectedClass(null);
                                setSelectedMatiere(null);
                            }}
                        >
                            <option value="">Choisir un parcours</option>
                            {parcours.map((p) => (
                                <option key={p} value={p}>
                                    {p}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedParcours && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Sélectionnez une Classe
                            </label>
                            <select
                                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                                value={selectedClass || ''}
                                onChange={(e) => {
                                    setSelectedClass(e.target.value || null);
                                    setSelectedMatiere(null);
                                }}
                            >
                                <option value="">Choisir une classe</option>
                                {classes.map((classe) => (
                                    <option key={classe} value={classe}>
                                        {classe}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {selectedClass && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Sélectionnez une Matière
                            </label>
                            <select
                                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                                value={selectedMatiere || ''}
                                onChange={(e) =>
                                    setSelectedMatiere(e.target.value || null)
                                }
                            >
                                <option value="">Choisir une matière</option>
                                {matieres.map((matiere) => (
                                    <option key={matiere} value={matiere}>
                                        {matiere}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {selectedMatiere && monthlyData.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-md mb-4 font-bold dark:text-gray-200">
                            Progression Mensuelle
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="progression"
                                        stroke="#3b82f6"
                                        name="Progression (%)"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {selectedMatiere && selectedProgram && (
                    <div className="mt-6">
                        <h3 className="text-md mb-4 font-bold dark:text-gray-200">
                            Détails des Chapitres
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b dark:border-gray-700">
                                        <th className="pb-2 text-left">
                                            Chapitre
                                        </th>
                                        <th className="pb-2 text-left">
                                            Statut
                                        </th>
                                        <th className="pb-2 text-left">
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
                                                <td className="py-2">
                                                    {chapitre.activites.length}
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </Authenticated>
    );
}
