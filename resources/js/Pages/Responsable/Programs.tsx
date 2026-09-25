import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Chapitre, Programme } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    Activity,
    BadgeCheck,
    BookOpen,
    ChevronDown,
    ChevronRight,
    Download,
    Edit2,
    GraduationCap,
    Plus,
    School,
    Search,
    Trash2,
} from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';

const formatDate = (date: string) => new Date(date).toLocaleDateString('fr-FR');

const ChapterCard = ({ chapter }: { chapter: Chapitre }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const activites = chapter.activites ?? [];

    return (
        <div className="overflow-hidden rounded-lg border dark:border-gray-700">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex w-full items-center justify-between gap-3 bg-gray-50 p-3 text-left dark:bg-gray-900"
            >
                <span className="flex items-center gap-3">
                    {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {chapter.title}
                    </span>
                </span>
                <span className="flex items-center gap-2 text-xs text-gray-500">
                    {activites.length}
                    <Activity className="h-3.5 w-3.5" />
                    <BadgeCheck
                        className={`h-5 w-5 ${chapter.isFinished ? 'text-green-500' : 'text-gray-300'}`}
                        aria-label={chapter.isFinished ? 'Terminé' : 'En cours'}
                    />
                </span>
            </button>

            {isExpanded && (
                <div className="space-y-2 border-t bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
                    {chapter.isFinished && chapter.finished_at && (
                        <p className="text-xs text-green-700 dark:text-green-400">
                            Terminé le {formatDate(chapter.finished_at)}
                        </p>
                    )}
                    {activites.length === 0 && (
                        <p className="text-sm text-gray-500">
                            Aucune activité rapportée.
                        </p>
                    )}
                    {activites.map((activity) => (
                        <div
                            key={activity.id}
                            className="flex items-start gap-2 rounded-md bg-gray-50 p-2 dark:bg-gray-900"
                        >
                            <Activity className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                            <div className="min-w-0 flex-1">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {activity.note}
                                </p>
                                <p className="mt-0.5 text-xs text-gray-400">
                                    {formatDate(activity.date)}
                                    {activity.user &&
                                        ` · ${activity.user.name}`}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

interface ChapterForm {
    id?: number;
    title: string;
    isFinished: boolean;
}

const ProgramEditModal = ({ program }: { program: Programme }) => {
    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [name, setName] = useState(program.name);
    const [chapters, setChapters] = useState<ChapterForm[]>([]);
    const [removedIds, setRemovedIds] = useState<number[]>([]);

    // Reset the form from the latest server data every time the modal opens.
    const onOpenChange = (value: boolean) => {
        if (value) {
            setName(program.name);
            setChapters(
                program.chapitres.map((c) => ({
                    id: c.id,
                    title: c.title,
                    isFinished: c.isFinished,
                })),
            );
            setRemovedIds([]);
            setErrors({});
        }
        setOpen(value);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        router.put(
            route('programmes.update', program.id),
            {
                name,
                chapters: chapters.map((c) => ({ ...c })),
                removed_chapter_ids: removedIds,
            },
            {
                preserveScroll: true,
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
                onSuccess: () => setOpen(false),
                onError: (errs) => setErrors(errs),
            },
        );
    };

    const updateChapter = (index: number, data: Partial<ChapterForm>) => {
        setChapters((prev) =>
            prev.map((c, i) => (i === index ? { ...c, ...data } : c)),
        );
    };

    const removeChapter = (index: number) => {
        const id = chapters[index].id;
        if (id) setRemovedIds((prev) => [...prev, id]);
        setChapters((prev) => prev.filter((_, i) => i !== index));
    };

    const errorList = Object.values(errors);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <button
                    className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label={`Modifier ${program.name}`}
                >
                    <Edit2 className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Modifier le programme</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4 text-sm dark:bg-gray-900">
                        <div>
                            <p className="text-gray-500">Parcours</p>
                            <p className="font-medium">
                                {program.matiere.classe?.parcours?.name}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500">Classe</p>
                            <p className="font-medium">
                                {program.matiere.classe?.name}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500">Matière</p>
                            <p className="font-medium">
                                {program.matiere.name}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`name-${program.id}`}>
                            Nom du programme
                        </Label>
                        <Input
                            id={`name-${program.id}`}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium">
                                Chapitres ({chapters.length})
                            </h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    setChapters((prev) => [
                                        ...prev,
                                        { title: '', isFinished: false },
                                    ])
                                }
                                className="flex items-center gap-1"
                            >
                                <Plus className="h-4 w-4" />
                                Ajouter un chapitre
                            </Button>
                        </div>
                        <div className="max-h-[15rem] space-y-2 overflow-y-auto rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                            {chapters.map((chapter, index) => (
                                <div
                                    key={chapter.id ?? `new-${index}`}
                                    className="flex items-center gap-3 rounded-md bg-white p-3 dark:bg-gray-800"
                                >
                                    <Input
                                        value={chapter.title}
                                        onChange={(e) =>
                                            updateChapter(index, {
                                                title: e.target.value,
                                            })
                                        }
                                        placeholder="Titre du chapitre"
                                        className="flex-1"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateChapter(index, {
                                                isFinished: !chapter.isFinished,
                                            })
                                        }
                                        title={
                                            chapter.isFinished
                                                ? 'Terminé — cliquer pour rouvrir'
                                                : 'En cours — cliquer pour terminer'
                                        }
                                        aria-pressed={chapter.isFinished}
                                        className={`rounded-full p-1 transition-colors ${
                                            chapter.isFinished
                                                ? 'bg-green-100'
                                                : 'bg-gray-100'
                                        }`}
                                    >
                                        <BadgeCheck
                                            className={`h-4 w-4 ${
                                                chapter.isFinished
                                                    ? 'text-green-500'
                                                    : 'text-gray-400'
                                            }`}
                                        />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeChapter(index)}
                                        aria-label="Supprimer le chapitre"
                                        className="rounded-full p-1 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </button>
                                </div>
                            ))}
                            {chapters.length === 0 && (
                                <div className="rounded-md bg-blue-50 p-3 text-center text-sm text-blue-700">
                                    Aucun chapitre. Cliquez sur « Ajouter un
                                    chapitre » pour commencer.
                                </div>
                            )}
                        </div>
                    </div>

                    {errorList.length > 0 && (
                        <ul className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                            {Array.from(new Set(errorList)).map((err) => (
                                <li key={err}>{err}</li>
                            ))}
                        </ul>
                    )}

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Enregistrer
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const ProgramDashboard = ({
    programs,
    title,
}: {
    programs: Programme[];
    title: string;
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedParcours, setSelectedParcours] = useState('');
    const [selectedClasse, setSelectedClasse] = useState('');

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
                        .filter(
                            (p) =>
                                !selectedParcours ||
                                parcoursOf(p) === selectedParcours,
                        )
                        .map(classeOf),
                ),
            ).sort(),
        [programs, selectedParcours],
    );

    const groupedPrograms = useMemo(() => {
        const term = searchTerm.toLowerCase();
        const grouped: Record<string, Record<string, Programme[]>> = {};

        programs
            .filter(
                (p) =>
                    (p.name.toLowerCase().includes(term) ||
                        p.matiere.name.toLowerCase().includes(term)) &&
                    (!selectedParcours || parcoursOf(p) === selectedParcours) &&
                    (!selectedClasse || classeOf(p) === selectedClasse),
            )
            .forEach((program) => {
                const pa = parcoursOf(program);
                const cl = classeOf(program);
                grouped[pa] ??= {};
                grouped[pa][cl] ??= [];
                grouped[pa][cl].push(program);
            });

        return grouped;
    }, [programs, searchTerm, selectedParcours, selectedClasse]);

    const selectClass =
        'rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200';

    return (
        <Authenticated>
            <Head title={title} />
            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100">
                {title}
            </h1>

            <div className="mb-6 flex flex-wrap gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900">
                <div className="relative min-w-[200px] flex-1">
                    <input
                        type="text"
                        placeholder="Rechercher un programme ou une matière..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <select
                    value={selectedParcours}
                    onChange={(e) => {
                        setSelectedParcours(e.target.value);
                        setSelectedClasse('');
                    }}
                    className={selectClass}
                >
                    <option value="">Tous les parcours</option>
                    {parcours.map((p) => (
                        <option key={p} value={p}>
                            {p}
                        </option>
                    ))}
                </select>
                <select
                    value={selectedClasse}
                    onChange={(e) => setSelectedClasse(e.target.value)}
                    className={selectClass}
                >
                    <option value="">Toutes les classes</option>
                    {classes.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
            </div>

            {Object.keys(groupedPrograms).length === 0 && (
                <p className="rounded-lg bg-blue-50 p-4 text-blue-700">
                    {programs.length === 0
                        ? 'Aucun programme pour l’instant. Créez une matière dans « Parcours & classes » : son programme est créé automatiquement.'
                        : 'Aucun programme ne correspond à la recherche.'}
                </p>
            )}

            {Object.entries(groupedPrograms).map(([parcoursName, byClasse]) => (
                <Card key={parcoursName} className="mb-6">
                    <div className="p-6">
                        <div className="mb-6 flex items-center gap-2 text-xl font-semibold">
                            <School className="h-6 w-6 text-blue-600" />
                            {parcoursName}
                        </div>

                        {Object.entries(byClasse).map(([classe, list]) => (
                            <div key={classe} className="mb-6 last:mb-0">
                                <div className="mb-4 flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5 text-gray-600" />
                                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                        {classe}
                                    </h3>
                                </div>

                                <div className="overflow-x-auto pb-2">
                                    <div className="flex gap-4">
                                        {list.map((program) => (
                                            <Card
                                                key={program.id}
                                                className="min-w-[300px] max-w-[300px] flex-shrink-0 transition-shadow hover:shadow-lg"
                                            >
                                                <div className="p-6">
                                                    <div className="mb-4 flex items-start justify-between">
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                                                {program.name}
                                                            </h4>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                {
                                                                    program
                                                                        .matiere
                                                                        .name
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className="flex">
                                                            <a
                                                                href={route(
                                                                    'programmes.export',
                                                                    program.id,
                                                                )}
                                                                className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                aria-label="Exporter le bilan PDF"
                                                                title="Exporter le bilan PDF"
                                                            >
                                                                <Download className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                                                            </a>
                                                            <ProgramEditModal
                                                                program={
                                                                    program
                                                                }
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="mb-6">
                                                        <div className="mb-2 flex items-center justify-between">
                                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                Progression
                                                            </span>
                                                            <span className="text-sm font-semibold text-blue-600">
                                                                {Math.round(
                                                                    program.progression,
                                                                )}
                                                                %
                                                            </span>
                                                        </div>
                                                        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                                            <div
                                                                className="h-2 rounded-full bg-blue-600 transition-all"
                                                                style={{
                                                                    width: `${program.progression}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        {program.chapitres.map(
                                                            (chapter) => (
                                                                <ChapterCard
                                                                    key={
                                                                        chapter.id
                                                                    }
                                                                    chapter={
                                                                        chapter
                                                                    }
                                                                />
                                                            ),
                                                        )}
                                                        {program.chapitres
                                                            .length === 0 && (
                                                            <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
                                                                <BookOpen className="h-4 w-4" />
                                                                Aucun chapitre
                                                                pour l’instant.
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            ))}
        </Authenticated>
    );
};

export default ProgramDashboard;
