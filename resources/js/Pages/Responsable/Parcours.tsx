import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

const Parcours = ({ title, data }: Props) => {
    const [isParcoursOpen, setIsParcoursOpen] = useState(false);
    const [isClasseOpen, setIsClasseOpen] = useState(false);
    const [editParcours, setEditParcours] = useState<Parcours | null>(null);
    const [editClasse, setEditClasse] = useState(null);

    // Créer un Map pour regrouper les classes par parcours
    const parcoursMap = data.reduce((acc, classe) => {
        const parcours = classe.parcours;
        if (!acc.has(parcours.id)) {
            acc.set(parcours.id, {
                ...parcours,
                classes: [],
            });
        }
        acc.get(parcours.id).classes.push(classe);
        return acc;
    }, new Map());

    const parcoursList = Array.from(parcoursMap.values());

    const handleParcoursSubmit = (e: {
        preventDefault: () => void;
        target: HTMLFormElement | undefined;
    }) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = editParcours ? `/parcours/${editParcours.id}` : '/parcours';

        router.post(
            url,
            {
                _method: editParcours ? 'PUT' : 'POST',
                name: formData.get('name'),
            },
            {
                onSuccess: () => {
                    setIsParcoursOpen(false);
                    setEditParcours(null);
                },
            },
        );
    };

    const handleClasseSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = editClasse ? `/classes/${editClasse.id}` : '/classes';

        router.post(
            url,
            {
                _method: editClasse ? 'PUT' : 'POST',
                name: formData.get('name'),
                parcours_id: formData.get('parcours_id'),
            },
            {
                onSuccess: () => {
                    setIsClasseOpen(false);
                    setEditClasse(null);
                },
            },
        );
    };

    const handleDelete = (type, id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
            router.delete(`/${type}/${id}`);
        }
    };

    return (
        <Authenticated>
            <div className="p-6">
                <Head title={title} />
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold">{title}</h1>
                    <div className="space-x-4">
                        <Button onClick={() => setIsParcoursOpen(true)}>
                            Nouveau Parcours
                        </Button>
                        <Button onClick={() => setIsClasseOpen(true)}>
                            Nouvelle Classe
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6">
                    {parcoursList.map((parcours) => (
                        <Card key={parcours.id}>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>{parcours.name}</CardTitle>
                                <div className="space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setEditParcours(parcours);
                                            setIsParcoursOpen(true);
                                        }}
                                    >
                                        Modifier
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() =>
                                            handleDelete(
                                                'parcours',
                                                parcours.id,
                                            )
                                        }
                                    >
                                        Supprimer
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Classe</TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {parcours.classes.map((classe) => (
                                            <TableRow key={classe.id}>
                                                <TableCell>
                                                    {classe.name}
                                                </TableCell>
                                                <TableCell className="space-x-2 text-right">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            setEditClasse(
                                                                classe,
                                                            );
                                                            setIsClasseOpen(
                                                                true,
                                                            );
                                                        }}
                                                    >
                                                        Modifier
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        onClick={() =>
                                                            handleDelete(
                                                                'classes',
                                                                classe.id,
                                                            )
                                                        }
                                                    >
                                                        Supprimer
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Dialog open={isParcoursOpen} onOpenChange={setIsParcoursOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editParcours
                                    ? 'Modifier le Parcours'
                                    : 'Nouveau Parcours'}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleParcoursSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <Input
                                        name="name"
                                        placeholder="Nom du parcours"
                                        defaultValue={editParcours?.name}
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    {editParcours ? 'Modifier' : 'Créer'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog open={isClasseOpen} onOpenChange={setIsClasseOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editClasse
                                    ? 'Modifier la Classe'
                                    : 'Nouvelle Classe'}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleClasseSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <Input
                                        name="name"
                                        placeholder="Nom de la classe"
                                        defaultValue={editClasse?.name}
                                    />
                                </div>
                                <div>
                                    <Select
                                        name="parcours_id"
                                        defaultValue={editClasse?.parcours_id.toString()}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner un parcours" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {parcoursList.map((parcours) => (
                                                <SelectItem
                                                    key={parcours.id}
                                                    value={parcours.id.toString()}
                                                >
                                                    {parcours.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button type="submit" className="w-full">
                                    {editClasse ? 'Modifier' : 'Créer'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </Authenticated>
    );
};

export default Parcours;
type Classe = {
    id: number;
    name: string;
    parcours_id: number;
    created_at: string;
    updated_at: string;
    parcours: Parcours;
};

type Parcours = {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    classes?: Classe[];
};

type Props = {
    title: string;
    data: Classe[];
};
