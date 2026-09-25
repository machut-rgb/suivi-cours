import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Classe, Matiere, Parcours as ParcoursType } from '@/types';
import { Head, router } from '@inertiajs/react';
import { GraduationCap, Pencil, Plus, Trash2, Users } from 'lucide-react';
import { FormEvent, useState } from 'react';

type Target =
    | { kind: 'parcours'; item?: ParcoursType }
    | { kind: 'classe'; item?: Classe; parcoursId: number }
    | { kind: 'matiere'; item?: Matiere; classeId: number };

const labels = {
    parcours: {
        route: 'parcours',
        create: 'Nouveau parcours',
        edit: 'Modifier le parcours',
    },
    classe: {
        route: 'classes',
        create: 'Nouvelle classe',
        edit: 'Modifier la classe',
    },
    matiere: {
        route: 'matieres',
        create: 'Nouvelle matière',
        edit: 'Modifier la matière',
    },
} as const;

const EditDialog = ({
    target,
    parcoursList,
    onClose,
}: {
    target: Target | null;
    parcoursList: ParcoursType[];
    onClose: () => void;
}) => {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    if (!target) return null;

    const { route: base, create, edit } = labels[target.kind];
    const isEdit = !!target.item;

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const payload: Record<string, FormDataEntryValue | number | null> = {
            name: form.get('name'),
        };
        if (target.kind === 'classe') {
            payload.parcours_id = form.get('parcours_id');
        }
        if (target.kind === 'matiere') {
            payload.classe_id = target.classeId;
        }

        const options = {
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
            onSuccess: () => {
                setErrors({});
                onClose();
            },
            onError: (errs: Record<string, string>) => setErrors(errs),
        };

        if (target.item) {
            router.put(
                route(`${base}.update`, target.item.id),
                payload,
                options,
            );
        } else {
            router.post(route(`${base}.store`), payload, options);
        }
    };

    return (
        <Dialog open onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEdit ? edit : create}</DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nom</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={target.item?.name}
                            autoFocus
                            required
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {target.kind === 'classe' && (
                        <div className="space-y-2">
                            <Label htmlFor="parcours_id">Parcours</Label>
                            <select
                                id="parcours_id"
                                name="parcours_id"
                                defaultValue={
                                    target.item?.parcours_id ??
                                    target.parcoursId
                                }
                                className="w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-800"
                            >
                                {parcoursList.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {target.kind === 'matiere' && !isEdit && (
                        <p className="text-sm text-gray-500">
                            Un programme vide est créé automatiquement pour
                            cette matière.
                        </p>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={processing}
                    >
                        {isEdit ? 'Enregistrer' : 'Créer'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const confirmDelete = (
    kind: Target['kind'],
    id: number,
    name: string,
    cascade: string,
) => {
    if (
        confirm(
            `Supprimer « ${name} » ? ${cascade} Cette action est irréversible.`,
        )
    ) {
        router.delete(route(`${labels[kind].route}.destroy`, id), {
            preserveScroll: true,
        });
    }
};

export default function Parcours({
    title,
    parcours,
}: {
    title: string;
    parcours: ParcoursType[];
}) {
    const [target, setTarget] = useState<Target | null>(null);

    return (
        <Authenticated>
            <Head title={title} />
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-3xl font-bold dark:text-gray-100">
                    {title}
                </h1>
                <Button onClick={() => setTarget({ kind: 'parcours' })}>
                    <Plus className="mr-1 h-4 w-4" />
                    Nouveau parcours
                </Button>
            </div>

            {parcours.length === 0 && (
                <p className="rounded-lg bg-blue-50 p-4 text-blue-700">
                    Aucun parcours. Commencez par en créer un.
                </p>
            )}

            <div className="grid gap-6">
                {parcours.map((p) => (
                    <Card key={p.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle>{p.name}</CardTitle>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setTarget({
                                            kind: 'classe',
                                            parcoursId: p.id,
                                        })
                                    }
                                >
                                    <Plus className="mr-1 h-4 w-4" />
                                    Classe
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    aria-label={`Modifier ${p.name}`}
                                    onClick={() =>
                                        setTarget({ kind: 'parcours', item: p })
                                    }
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    aria-label={`Supprimer ${p.name}`}
                                    onClick={() =>
                                        confirmDelete(
                                            'parcours',
                                            p.id,
                                            p.name,
                                            'Toutes ses classes, matières, programmes et rapports seront supprimés.',
                                        )
                                    }
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {(p.classes ?? []).length === 0 && (
                                <p className="text-sm text-gray-500">
                                    Aucune classe dans ce parcours.
                                </p>
                            )}
                            {(p.classes ?? []).map((classe) => (
                                <div
                                    key={classe.id}
                                    className="rounded-lg border p-4 dark:border-gray-700"
                                >
                                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 font-medium">
                                            <GraduationCap className="h-5 w-5 text-gray-500" />
                                            {classe.name}
                                            <span className="flex items-center gap-1 text-xs font-normal text-gray-500">
                                                <Users className="h-3.5 w-3.5" />
                                                {classe.users_count ?? 0}{' '}
                                                délégué(s)
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setTarget({
                                                        kind: 'matiere',
                                                        classeId: classe.id,
                                                    })
                                                }
                                            >
                                                <Plus className="mr-1 h-4 w-4" />
                                                Matière
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                aria-label={`Modifier ${classe.name}`}
                                                onClick={() =>
                                                    setTarget({
                                                        kind: 'classe',
                                                        item: classe,
                                                        parcoursId: p.id,
                                                    })
                                                }
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                aria-label={`Supprimer ${classe.name}`}
                                                onClick={() =>
                                                    confirmDelete(
                                                        'classe',
                                                        classe.id,
                                                        classe.name,
                                                        'Ses matières, programmes et rapports seront supprimés.',
                                                    )
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(classe.matieres ?? []).length ===
                                            0 && (
                                            <span className="text-sm text-gray-500">
                                                Aucune matière.
                                            </span>
                                        )}
                                        {(classe.matieres ?? []).map(
                                            (matiere) => (
                                                <span
                                                    key={matiere.id}
                                                    className="group inline-flex items-center gap-1 rounded-full bg-gray-100 py-1 pl-3 pr-1 text-sm dark:bg-gray-700"
                                                >
                                                    {matiere.name}
                                                    <button
                                                        aria-label={`Modifier ${matiere.name}`}
                                                        onClick={() =>
                                                            setTarget({
                                                                kind: 'matiere',
                                                                item: matiere,
                                                                classeId:
                                                                    classe.id,
                                                            })
                                                        }
                                                        className="rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-600"
                                                    >
                                                        <Pencil className="h-3 w-3" />
                                                    </button>
                                                    <button
                                                        aria-label={`Supprimer ${matiere.name}`}
                                                        onClick={() =>
                                                            confirmDelete(
                                                                'matiere',
                                                                matiere.id,
                                                                matiere.name,
                                                                'Son programme et ses rapports seront supprimés.',
                                                            )
                                                        }
                                                        className="rounded-full p-1 text-red-600 hover:bg-red-100"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </button>
                                                </span>
                                            ),
                                        )}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <EditDialog
                key={
                    target
                        ? `${target.kind}-${target.item?.id ?? 'new'}`
                        : 'none'
                }
                target={target}
                parcoursList={parcours}
                onClose={() => setTarget(null)}
            />
        </Authenticated>
    );
}
