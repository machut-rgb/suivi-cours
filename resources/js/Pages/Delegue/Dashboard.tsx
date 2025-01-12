import { Head } from '@inertiajs/react';

export default function DelegueDashboard({
    title,
    tasks,
}: {
    title: string;
    tasks: { id: number; matiere: { name: string }; description: string }[];
}) {
    return (
        <>
            <Head title={title} />
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {title}
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Ajoutez ou consultez vos rapports de cours ici.
                </p>

                <div className="mt-6">
                    <h2 className="text-xl font-semibold">Mes Rapports</h2>
                    <ul className="mt-4 space-y-3">
                        {tasks.map((task) => (
                            <li
                                key={task.id}
                                className="flex items-center justify-between rounded-md bg-gray-100 p-4 dark:bg-gray-700"
                            >
                                <span>
                                    <strong>{task.matiere.name}</strong> -{' '}
                                    {task.description}
                                </span>
                                <button className="rounded-md bg-[#FF2D20] px-4 py-2 text-white hover:bg-[#d1241c]">
                                    Modifier
                                </button>
                            </li>
                        ))}
                    </ul>

                    <button className="mt-4 rounded-md bg-[#FF2D20] px-6 py-3 text-white hover:bg-[#d1241c]">
                        Ajouter un rapport
                    </button>
                </div>
            </div>
        </>
    );
}
