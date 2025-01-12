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
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    Activity,
    BadgeCheck,
    BookOpen,
    ChevronDown,
    ChevronRight,
    Edit2,
    GraduationCap,
    Plus,
    School,
    Search,
    Trash2,
} from 'lucide-react';
import React from 'react';

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
    isFinished: boolean;
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

const ChapterCard = ({ chapter }: { chapter: Chapter }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
        <div className="overflow-hidden rounded-lg border">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex w-full items-center justify-between bg-gray-50 p-3 transition-colors hover:bg-gray-100"
            >
                <div className="flex items-center gap-3">
                    <BookOpen className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-800">
                        {chapter.title}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {chapter.isFinished ? (
                        <BadgeCheck className="h-5 w-5 text-green-500" />
                    ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                    {chapter.activites.length > 0 && (
                        <ChevronDown
                            className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                    )}
                </div>
            </button>

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

const AddProgramModal = ({
    onAdd,
}: {
    onAdd: (data: {
        name: string;
        matiere: { id: number; name: string };
        parcours: {
            id: number;
            name: string;
            classe: { id: number; name: string };
        };
    }) => void;
}) => {
    const [formProgramData, setFormProgramData] = React.useState({
        name: '',
        matiere_id: '',
    });

    const [formChapterData, setFormChapterData] = React.useState([{}]); // title, programme_id

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // setFormProgramData({ name: '', matiere_id: '' });

        console.log(formProgramData);
        console.log(formChapterData);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="mb-4 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un Programme
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ajouter un nouveau programme</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Parcours
                        </label>
                        <select
                            className="w-full rounded-md border border-gray-300 p-2"
                            // value={formData.parcours_id}
                            // onChange={(e) =>
                            //     setFormData((prev) => ({
                            //         ...prev,
                            //         parcours_id: e.target.value,
                            //     }))
                            // }
                            required
                        >
                            <option value="">Sélectionner une classe</option>
                            {[1, 2, 3, 4, 5, 6].map((id) => (
                                <option key={id} value={id}>
                                    {id}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Nom du programme
                        </label>
                        <Input
                            // value={formData.name}
                            // onChange={(e) =>
                            //     setFormData((prev) => ({
                            //         ...prev,
                            //         name: e.target.value,
                            //     }))
                            // }
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Matière
                        </label>
                        <Input
                            // value={formData.matiere}
                            // onChange={(e) =>
                            //     setFormData((prev) => ({
                            //         ...prev,
                            //         matiere: e.target.value,
                            //     }))
                            // }
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Classe
                        </label>
                        <select
                            className="w-full rounded-md border border-gray-300 p-2"
                            // value={formData.classe_id}
                            // onChange={(e) =>
                            //     setFormData((prev) => ({
                            //         ...prev,
                            //         classe_id: e.target.value,
                            //     }))
                            // }
                            required
                        >
                            <option value="">Sélectionner une classe</option>
                            {[1, 2, 3, 4, 5, 6].map((id) => (
                                <option key={id} value={id}>
                                    Classe {id}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Button type="submit" className="w-full">
                        Ajouter
                    </Button>
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
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedParcours, setSelectedParcours] = React.useState('');
    const [selectedClasse, setSelectedClasse] = React.useState('');

    // console.log(programs);
    // console.log(programs[1].matiere.classe[0].parcours);

    // programs.forEach((d) => console.log(d.matiere.classe.parcours));

    // Extract unique parcours and classes
    const parcours = React.useMemo(() => {
        const parcoursSet = new Set<string>();
        programs.forEach((program) => {
            parcoursSet.add(program.matiere.classe.parcours.name);
        });
        return Array.from(parcoursSet);
    }, [programs]);
    // console.log(parcours);

    const classes = React.useMemo(() => {
        const classesSet = new Set<string>();
        programs.forEach((program) => {
            classesSet.add(program.matiere.classe.name);
        });
        return Array.from(classesSet);
    }, [programs]);

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

    const handleAddProgram = (newProgram: unknown) => {
        // Handle program addition logic here
        console.log('New program:', newProgram);
    };
    return (
        <Authenticated>
            <Head title={title} />
            <div className="min-h-screen">
                <header className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">
                            {title}
                        </h1>
                        <p className="text-gray-600">
                            Suivez vos progrès éducatifs à travers tous les
                            parcours
                        </p>
                    </div>
                    <AddProgramModal onAdd={handleAddProgram} />
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
                                                                {/* Programme */}
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
                                                                        <button className="rounded-full p-2 hover:bg-gray-100">
                                                                            <Edit2 className="h-4 w-4 text-gray-600" />
                                                                        </button>
                                                                        <button className="rounded-full p-2 hover:bg-red-50">
                                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                                        </button>
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
