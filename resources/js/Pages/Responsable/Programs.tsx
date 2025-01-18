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
import { Head, router } from '@inertiajs/react';
import {
    Activity,
    BadgeCheck,
    BookOpen,
    ChevronRight,
    Edit2,
    GraduationCap,
    Plus,
    School,
    Search,
    Trash2,
} from 'lucide-react';
import React, { useState } from 'react';

interface Parcours {
    id: number;
    name: string;
}

interface Classe {
    id: number;
    name: string;
    parcours: Parcours;
}

interface Activite {
    id: number;
    note: string;
    chapitre_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
}

interface Chapter {
    id: number;
    title: string;
    isFinished: number;
    programme_id: number;
    activites: Activite[];
}

interface Matiere {
    id: number;
    name: string;
    classe: Classe;
}

interface Program {
    id: number;
    name: string;
    matiere: Matiere;
    chapitres: Chapter[];
}

const ChapterCard = ({
    chapter,
    program,
}: {
    chapter: Chapter;
    program: Program;
}) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
        <div className="overflow-hidden rounded-lg border">
            <div className="flex w-full items-center justify-between bg-gray-50 p-3">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex flex-1 items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <BookOpen className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-800">
                            {chapter.title}
                        </span>
                    </div>
                </button>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="ml-2">
                            {/* <Edit2 className="h-4 w-4 text-gray-600" /> */}
                            {chapter.isFinished ? (
                                <BadgeCheck className="h-5 w-5 text-green-500" />
                            ) : (
                                <BadgeCheck className="h-5 w-5 text-gray-500" />
                            )}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xl">
                        <DialogHeader>
                            <DialogTitle>Détails du chapitre</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <h3 className="font-medium text-gray-700">
                                    Informations générales
                                </h3>
                                <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Parcours
                                        </p>
                                        <p className="font-medium">
                                            {
                                                program.matiere.classe.parcours
                                                    .name
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Classe
                                        </p>
                                        <p className="font-medium">
                                            {program.matiere.classe.name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Matière
                                        </p>
                                        <p className="font-medium">
                                            {program.matiere.name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Programme
                                        </p>
                                        <p className="font-medium">
                                            {program.name}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-medium text-gray-700">
                                    Chapitre
                                </h3>
                                <div className="rounded-lg bg-gray-50 p-4">
                                    <div className="mb-2">
                                        <p className="text-sm text-gray-500">
                                            Titre
                                        </p>
                                        <p className="font-medium">
                                            {chapter.title}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm text-gray-500">
                                            Statut:
                                        </p>
                                        <div className="flex items-center gap-1 text-sm font-medium">
                                            {chapter.isFinished ? (
                                                <>
                                                    <BadgeCheck className="h-4 w-4 text-green-500" />
                                                    <span className="text-green-600">
                                                        Terminé
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronRight className="h-4 w-4 text-gray-400" />
                                                    <span className="text-gray-600">
                                                        En cours
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {chapter.activites.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="font-medium text-gray-700">
                                        Activités
                                    </h3>
                                    <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                                        {chapter.activites.map((activity) => (
                                            <div
                                                key={activity.id}
                                                className="flex items-center gap-2 rounded-md bg-white p-3"
                                            >
                                                <Activity className="h-4 w-4 text-blue-500" />
                                                <span className="text-sm text-gray-700">
                                                    {activity.note}
                                                </span>
                                                <span className="ml-auto text-xs text-gray-400">
                                                    {new Date(
                                                        activity.created_at,
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {isExpanded && chapter.activites.length > 0 && (
                <div className="border-t bg-white p-3">
                    <div className="space-y-2">
                        {chapter.activites.map((activity) => (
                            <div
                                key={activity.id}
                                className="flex items-center gap-2 rounded-md bg-gray-50 p-2"
                            >
                                <Activity className="h-4 w-4 text-blue-500" />
                                <span className="text-sm text-gray-700">
                                    {activity.note}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const SearchFilter = ({
    onSearch,
    onParcoursFilter,
    onClasseFilter,
    parcours,
    classes,
}: {
    onSearch: (value: string) => void;
    onParcoursFilter: (value: string) => void;
    onClasseFilter: (value: string) => void;
    parcours: string[];
    classes: string[];
}) => (
    <div className="mb-6 flex flex-wrap gap-4 rounded-lg bg-white p-4 shadow-sm">
        <div className="min-w-[200px] flex-1">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Rechercher un programme..."
                    onChange={(e) => onSearch(e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
        </div>

        <select
            onChange={(e) => onParcoursFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
            <option value="">Tous les parcours</option>
            {parcours.map((p) => (
                <option key={p} value={p}>
                    {p}
                </option>
            ))}
        </select>

        <select
            onChange={(e) => onClasseFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
            <option value="">Toutes les classes</option>
            {classes.map((c) => (
                <option key={c} value={c}>
                    {c}
                </option>
            ))}
        </select>
    </div>
);

interface ChapterForm {
    // For test only
    id?: number;
    title: string;
    isFinished: number;
}

const ProgramEditModal = ({ program }: { program: Program }) => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = React.useState({
        name: program.name,
        programme_id: program.id,
    });
    const [chapters, setChapters] = React.useState<ChapterForm[]>(
        program.chapitres.map((c) => ({
            id: c.id,
            title: c.title,
            isFinished: c.isFinished,
        })),
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedProgram = {
            ...formData,
            chapters,
        };
        console.log('Updated program:', updatedProgram);

        const formData2Send = new FormData();
        formData2Send.append(
            'programme_id',
            JSON.stringify(formData.programme_id),
        );
        formData2Send.append('name', formData.name);
        formData2Send.append('chap2remove', JSON.stringify(chap2remove));
        formData2Send.append('chapters', JSON.stringify(chapters));

        console.log('To remove : ', chap2remove);
        router.post('/programmes', formData2Send, {
            onSuccess: () => {
                setOpen(false);
                setChap2remove([]);
            },
        });
    };

    const addChapter = () => {
        setChapters([...chapters, { title: '', isFinished: 0 }]);
    };

    const updateChapter = (index: number, data: Partial<ChapterForm>) => {
        const newChapters = [...chapters];
        newChapters[index] = { ...newChapters[index], ...data };
        setChapters(newChapters);
    };

    const [chap2remove, setChap2remove] = React.useState<number[]>([]);
    const removeChapter = (index: number, id: number) => {
        const tempChap2rem = chap2remove.concat(id);
        setChap2remove(tempChap2rem);
        setChapters(chapters.filter((_, i) => i !== index));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="rounded-full p-2 hover:bg-gray-100">
                    <Edit2 className="h-4 w-4 text-gray-600" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Modifier le programme</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Parcours
                                </p>
                                <p className="font-medium">
                                    {program.matiere.classe.parcours.name}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Classe</p>
                                <p className="font-medium">
                                    {program.matiere.classe.name}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Matière</p>
                                <p className="font-medium">
                                    {program.matiere.name}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Nom du programme</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
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
                                    onClick={addChapter}
                                    className="flex items-center gap-1"
                                >
                                    <Plus className="h-4 w-4" />
                                    Ajouter un chapitre
                                </Button>
                            </div>
                            <div className="max-h-[15rem] space-y-2 overflow-y-scroll rounded-lg bg-gray-50 p-4">
                                {chapters.map((chapter, index) => (
                                    <div
                                        key={chapter.id || index}
                                        className="flex items-center gap-3 rounded-md bg-white p-3"
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
                                        />
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateChapter(index, {
                                                        isFinished:
                                                            chapter.isFinished ==
                                                            0
                                                                ? 1
                                                                : 0,
                                                    })
                                                }
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
                                                onClick={() =>
                                                    removeChapter(
                                                        index,
                                                        chapter?.id ?? 0,
                                                    )
                                                }
                                                className="rounded-full p-1 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {chapters.length === 0 && (
                                    <div className="rounded-md bg-blue-50 p-3 text-center text-sm text-blue-700">
                                        Aucun chapitre. Cliquez sur "Ajouter un
                                        chapitre" pour commencer.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <DialogTrigger asChild>
                            <Button type="button" variant="outline">
                                Annuler
                            </Button>
                        </DialogTrigger>
                        <Button type="submit">Enregistrer</Button>
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
    programs: Program[];
    title: string;
}) => {
    console.log(programs);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedParcours, setSelectedParcours] = React.useState('');
    const [selectedClasse, setSelectedClasse] = React.useState('');

    // Extract unique parcours and classes
    const parcours = React.useMemo(() => {
        const parcoursSet = new Set<string>();
        programs.forEach((program) => {
            parcoursSet.add(program.matiere.classe.parcours.name);
        });
        return Array.from(parcoursSet);
    }, [programs]);

    const classes = React.useMemo(() => {
        const classesSet = new Set<string>();
        programs.forEach((program) => {
            classesSet.add(program.matiere.classe.name);
        });
        return Array.from(classesSet);
    }, [programs]);

    // const matieres = React.useMemo(() => {
    //     const matieresSet = new Set<Matiere>();
    //     programs.forEach((program) => {
    //         matieresSet.add(program.matiere);
    //     });
    //     return Array.from(matieresSet);
    // }, [programs]);

    // Filter programs
    const filteredPrograms = React.useMemo(() => {
        return programs.filter((program) => {
            const programParcours = program.matiere.classe.parcours.name;
            const programClasse = program.matiere.classe.name;

            const matchesSearch =
                program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                program.matiere.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
            const matchesParcours =
                !selectedParcours || programParcours === selectedParcours;
            const matchesClasse =
                !selectedClasse || programClasse === selectedClasse;

            return matchesSearch && matchesParcours && matchesClasse;
        });
    }, [programs, searchTerm, selectedParcours, selectedClasse]);

    // Regrouper les programmes par parcours et classes
    const groupedPrograms = React.useMemo(() => {
        const grouped: Record<string, Record<string, Program[]>> = {};
        filteredPrograms.forEach((program) => {
            const programParcours = program.matiere.classe.parcours.name;
            const programClasse = program.matiere.classe.name;

            if (!grouped[programParcours]) {
                grouped[programParcours] = {};
            }
            if (!grouped[programParcours][programClasse]) {
                grouped[programParcours][programClasse] = [];
            }
            grouped[programParcours][programClasse].push(program);
        });
        return grouped;
    }, [filteredPrograms]);
    const calculateProgress = (chapters: Chapter[]) => {
        if (!chapters.length) return 0;
        return Math.round(
            (chapters.filter((c) => c.isFinished).length / chapters.length) *
                100,
        );
    };

    return (
        <Authenticated>
            <Head title={title} />
            <div className="min-h-screen">
                <header className="mb-4 flex items-center justify-between">
                    <div>
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">
                            {title}
                        </h1>
                        {/* <p className="text-gray-600">
                            Suivez vos progrès éducatifs à travers tous les
                            parcours
                        </p> */}
                    </div>
                </header>
                <SearchFilter
                    onSearch={setSearchTerm}
                    onParcoursFilter={setSelectedParcours}
                    onClasseFilter={setSelectedClasse}
                    parcours={parcours}
                    classes={classes}
                />

                {/* Parcours */}
                {Object.entries(groupedPrograms).map(([parcours, classes]) => (
                    <Card key={parcours} className="mb-6">
                        <div className="p-6">
                            {/* Titre du parcours */}
                            <div className="mb-6 flex items-center gap-2 text-xl font-semibold">
                                <School className="h-6 w-6 text-blue-600" />
                                {parcours}
                            </div>

                            {/* Classes du parcours */}
                            {Object.entries(classes).map(
                                ([classe, programs]) => (
                                    <div
                                        key={classe}
                                        className="mb-6 last:mb-0"
                                    >
                                        {/* Titre de la classe */}
                                        <div className="mb-4 flex items-center gap-2">
                                            <GraduationCap className="h-5 w-5 text-gray-600" />
                                            <h3 className="text-lg font-medium text-gray-800">
                                                {classe}
                                            </h3>
                                        </div>

                                        {/* Programmes de la classe */}
                                        <div
                                            className="scrollbar-hide overflow-x-auto" // Masque la barre de défilement dans certains navigateurs
                                        >
                                            <div
                                                className="flex gap-4" // Aligne les éléments horizontalement avec un espacement
                                            >
                                                {programs.map((program) => {
                                                    const progress =
                                                        calculateProgress(
                                                            program.chapitres,
                                                        );
                                                    return (
                                                        <Card
                                                            key={program.id}
                                                            className="min-w-[300px] max-w-[300px] flex-shrink-0 transition-shadow hover:shadow-lg"
                                                        >
                                                            <div className="p-6">
                                                                <div className="mb-4 flex items-start justify-between">
                                                                    <div>
                                                                        <h4 className="font-semibold text-gray-900">
                                                                            {
                                                                                program.name
                                                                            }
                                                                        </h4>
                                                                        <p className="text-sm text-gray-600">
                                                                            {
                                                                                program
                                                                                    .matiere
                                                                                    .name
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex gap-2">
                                                                        <ProgramEditModal
                                                                            program={
                                                                                program
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {/* Progression */}
                                                                <div className="mb-6">
                                                                    <div className="mb-2 flex items-center justify-between">
                                                                        <span className="text-sm font-medium text-gray-700">
                                                                            Progression
                                                                        </span>
                                                                        <span className="text-sm font-semibold text-blue-600">
                                                                            {
                                                                                progress
                                                                            }
                                                                            %
                                                                        </span>
                                                                    </div>
                                                                    <div className="h-2 w-full rounded-full bg-gray-200">
                                                                        <div
                                                                            className="h-2 rounded-full bg-blue-600 transition-all"
                                                                            style={{
                                                                                width: `${progress}%`,
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {/* Chapitres */}
                                                                <div className="space-y-3">
                                                                    {program.chapitres.map(
                                                                        (
                                                                            chapter,
                                                                        ) => (
                                                                            <ChapterCard
                                                                                key={
                                                                                    chapter.id
                                                                                }
                                                                                chapter={
                                                                                    chapter
                                                                                }
                                                                                program={
                                                                                    program
                                                                                }
                                                                            />
                                                                        ),
                                                                    )}
                                                                    {program
                                                                        .chapitres
                                                                        .length ===
                                                                        0 && (
                                                                        <div className="rounded-lg bg-blue-50 p-4 text-blue-700">
                                                                            Aucun
                                                                            chapitre
                                                                            disponible
                                                                            pour
                                                                            l’instant.
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </Authenticated>
    );
};

export default ProgramDashboard;
