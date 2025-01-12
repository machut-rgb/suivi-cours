import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

interface Program {
    id: number;
    matiere: { name: string };
    classe: { name: string };
    progression: number;
    lastActivity?: string;
    totalHours: number;
    completedHours: number;
}

export default function ResponsableDashboard({
    title,
    programs,
}: {
    title: string;
    programs: Program[];
}) {
    console.log(programs);
    const stats = {
        totalPrograms: programs.length,
        avgProgression:
            programs.length > 0
                ? programs.reduce(
                      (acc, curr) => acc + (curr.progression || 0),
                      0,
                  ) / programs.length
                : 0,
        totalClasses:
            programs.length > 0
                ? new Set(
                      programs
                          .map((p) => p.classe?.name)
                          .filter((name) => name), // Remove null/undefined
                  ).size
                : 0,
        totalMatieres:
            programs.length > 0
                ? new Set(
                      programs
                          .map((p) => p.matiere?.name)
                          .filter((name) => name), // Remove null/undefined
                  ).size
                : 0,
    };

    console.log(stats);

    return (
        <AuthenticatedLayout>
            <Head title={title} />
            <div className="space-y-6 px-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold dark:text-gray-200">
                        {title}
                    </h1>
                    <span className="text-sm text-gray-500">
                        Dernière mise à jour : {new Date().toLocaleDateString()}
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                                <span className="text-blue-600">P</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    Programmes
                                </p>
                                <p className="text-2xl font-bold dark:text-gray-200">
                                    {stats.totalPrograms}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
                                <span className="text-green-600">C</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Classes</p>
                                <p className="text-2xl font-bold dark:text-gray-200">
                                    {stats.totalClasses}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950">
                                <span className="text-purple-600">M</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    Matières
                                </p>
                                <p className="text-2xl font-bold dark:text-gray-200">
                                    {stats.totalMatieres}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950">
                                <span className="text-orange-600">%</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    Progression moyenne
                                </p>
                                <p className="text-2xl font-bold dark:text-gray-200">
                                    {stats.avgProgression.toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                    <div className="py-8 text-center text-gray-500">
                        Statistiques et graphiques à venir
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
