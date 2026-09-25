import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Activite, Classe, Programme } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { BadgeCheck, Pencil, Plus, Trash2 } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';

const today = () => new Date().toISOString().slice(0, 10);
const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

const fieldClass =
    'mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200';

const ReportDialog = ({
    open,
    onClose,
    programmes,
    activite,
}: {
    open: boolean;
    onClose: () => void;
    programmes: Programme[];
    activite: Activite | null;
}) => {
    const initialProgramme =
        programmes.find((p) =>
            p.chapitres.some((c) => c.id === activite?.chapitre_id),
        )?.id ?? '';

    const [programmeId, setProgrammeId] = useState<number | ''>(
        initialProgramme,
    );
    const { data, setData, post, put, processing, errors, reset } = useForm({
        chapitre_id: activite?.chapitre_id ?? ('' as number | ''),
        note: activite?.note ?? '',
        date: activite?.date?.slice(0, 10) ?? today(),
        mark_finished: false,
    });

    const chapitres =
        programmes.find((p) => p.id === programmeId)?.chapitres ?? [];
    const selectedChapitre = chapitres.find((c) => c.id === data.chapitre_id);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        };
        if (activite) {
            put(route('activites.update', activite.id), options);
        } else {
            post(route('activites.store'), options);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {activite
                            ? 'Modifier le rapport'
                            : 'Nouveau rapport de cours'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="programme">Matière</Label>
                            <select
                                id="programme"
                                className={fieldClass}
                                value={programmeId}
                                onChange={(e) => {
                                    setProgrammeId(
                                        e.target.value
                                            ? Number(e.target.value)
                                            : '',
                                    );
                                    setData('chapitre_id', '');
                                }}
                                required
                            >
                                <option value="">Choisir</option>
                                {programmes.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.matiere.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="date">Date du cours</Label>
                            <input
                                id="date"
                                type="date"
                                className={fieldClass}
                                value={data.date}
                                max={today()}
                                onChange={(e) =>
                                    setData('date', e.target.value)
                                }
                                required
                            />
                            {errors.date && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.date}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="chapitre">Chapitre abordé</Label>
                        <select
                            id="chapitre"
                            className={fieldClass}
                            value={data.chapitre_id}
                            disabled={!programmeId}
                            onChange={(e) =>
                                setData(
                                    'chapitre_id',
                                    e.target.value
                                        ? Number(e.target.value)
                                        : '',
                                )
                            }
                            required
                        >
                            <option value="">Choisir un chapitre</option>
                            {chapitres.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.title}
                                    {c.isFinished ? ' (terminé)' : ''}
                                </option>
                            ))}
                        </select>
                        {errors.chapitre_id && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.chapitre_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="note">Ce qui a été fait</Label>
                        <textarea
                            id="note"
                            rows={4}
                            className={fieldClass}
                            value={data.note}
                            onChange={(e) => setData('note', e.target.value)}
                            placeholder="Ex. : cours sur les suites arithmétiques, exercices 1 à 5 p. 42"
                            maxLength={2000}
                            required
                        />
                        {errors.note && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.note}
                            </p>
                        )}
                    </div>

                    {selectedChapitre && !selectedChapitre.isFinished && (
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300"
                                checked={data.mark_finished}
                                onChange={(e) =>
                                    setData('mark_finished', e.target.checked)
                                }
                            />
                            Ce chapitre est terminé
                        </label>
                    )}

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
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

export default function DelegueDashboard({
    title,
    classe,
    programmes,
    activites,
}: {
    title: string;
    classe: Classe | null;
    programmes: Programme[];
    activites: Activite[];
}) {
    const [dialog, setDialog] = useState<{ activite: Activite | null } | null>(
        null,
    );

    const destroy = (activite: Activite) => {
        if (confirm('Supprimer ce rapport ?')) {
            router.delete(route('activites.destroy', activite.id), {
                preserveScroll: true,
            });
        }
    };

    const overall = useMemo(() => {
        const all = programmes.flatMap((p) => p.chapitres);
        return all.length
            ? Math.round(
                  (all.filter((c) => c.isFinished).length / all.length) * 100,
              )
            : 0;
    }, [programmes]);

    return (
        <Authenticated>
            <Head title={title} />
            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {title}
                        </h1>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">
                            {classe
                                ? `${classe.name} · ${classe.parcours?.name ?? ''} · ${overall}% du programme couvert`
                                : 'Aucune classe associée à votre compte.'}
                        </p>
                    </div>
                    <Button
                        onClick={() => setDialog({ activite: null })}
                        disabled={programmes.length === 0}
                    >
                        <Plus className="mr-1 h-4 w-4" />
                        Ajouter un rapport
                    </Button>
                </div>

                <section>
                    <h2 className="mb-3 text-lg font-semibold dark:text-gray-100">
                        Avancement par matière
                    </h2>
                    {programmes.length === 0 && (
                        <p className="rounded-md bg-blue-50 p-3 text-sm text-blue-700">
                            Aucun programme n’est encore défini pour votre
                            classe.
                        </p>
                    )}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {programmes.map((p) => (
                            <div
                                key={p.id}
                                className="rounded-lg border p-4 dark:border-gray-700"
                            >
                                <div className="mb-2 flex justify-between text-sm">
                                    <span className="font-medium dark:text-gray-100">
                                        {p.matiere.name}
                                    </span>
                                    <span className="tabular-nums text-gray-600 dark:text-gray-300">
                                        {
                                            p.chapitres.filter(
                                                (c) => c.isFinished,
                                            ).length
                                        }
                                        /{p.chapitres.length} chapitres
                                    </span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div
                                        className="h-2 rounded-full bg-blue-600"
                                        style={{ width: `${p.progression}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="mb-3 text-lg font-semibold dark:text-gray-100">
                        Mes rapports ({activites.length})
                    </h2>
                    {activites.length === 0 && (
                        <p className="rounded-md bg-gray-50 p-4 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                            Vous n’avez encore saisi aucun rapport. Cliquez sur
                            « Ajouter un rapport » après chaque cours.
                        </p>
                    )}
                    <ul className="space-y-3">
                        {activites.map((a) => (
                            <li
                                key={a.id}
                                className="flex items-start justify-between gap-4 rounded-md bg-gray-50 p-4 dark:bg-gray-900"
                            >
                                <div className="min-w-0">
                                    <p className="text-sm text-gray-500">
                                        {formatDate(a.date)} ·{' '}
                                        <strong className="text-gray-700 dark:text-gray-200">
                                            {
                                                a.chapitre?.programme?.matiere
                                                    ?.name
                                            }
                                        </strong>{' '}
                                        · {a.chapitre?.title}
                                        {a.chapitre?.isFinished && (
                                            <BadgeCheck className="ml-1 inline h-4 w-4 text-green-500" />
                                        )}
                                    </p>
                                    <p className="mt-1 whitespace-pre-line text-gray-800 dark:text-gray-100">
                                        {a.note}
                                    </p>
                                </div>
                                <div className="flex shrink-0 gap-1">
                                    <button
                                        onClick={() =>
                                            setDialog({ activite: a })
                                        }
                                        aria-label="Modifier le rapport"
                                        className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => destroy(a)}
                                        aria-label="Supprimer le rapport"
                                        className="rounded-full p-2 text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            {dialog && (
                <ReportDialog
                    key={dialog.activite?.id ?? 'new'}
                    open
                    onClose={() => setDialog(null)}
                    programmes={programmes}
                    activite={dialog.activite}
                />
            )}
        </Authenticated>
    );
}
