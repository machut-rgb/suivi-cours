import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Classe } from '@/types';
import { Head, router } from '@inertiajs/react';

interface Delegue {
    id: number;
    name: string;
    email: string;
    approved_at: string | null;
    created_at: string;
    activites_count: number;
    classe: Classe | null;
}

export default function Delegues({
    title,
    delegues,
}: {
    title: string;
    delegues: Delegue[];
}) {
    const post = (name: string, id: number) =>
        router.post(route(name, id), {}, { preserveScroll: true });

    const reject = (delegue: Delegue) => {
        if (
            confirm(
                `Rejeter l'inscription de ${delegue.name} ? Le compte sera supprimé.`,
            )
        ) {
            router.delete(route('delegues.reject', delegue.id), {
                preserveScroll: true,
            });
        }
    };

    const pendingCount = delegues.filter((d) => !d.approved_at).length;

    return (
        <Authenticated>
            <Head title={title} />
            <Card>
                <CardHeader>
                    <CardTitle>
                        {title}
                        {pendingCount > 0 && (
                            <Badge
                                variant="warning"
                                className="ml-3 align-middle"
                            >
                                {pendingCount} en attente
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Classe</TableHead>
                                <TableHead>Parcours</TableHead>
                                <TableHead className="text-right">
                                    Rapports
                                </TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {delegues.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center text-gray-500"
                                    >
                                        Aucun délégué inscrit.
                                    </TableCell>
                                </TableRow>
                            )}
                            {delegues.map((delegue) => (
                                <TableRow key={delegue.id}>
                                    <TableCell className="font-medium">
                                        {delegue.name}
                                    </TableCell>
                                    <TableCell>{delegue.email}</TableCell>
                                    <TableCell>
                                        {delegue.classe?.name ?? '—'}
                                    </TableCell>
                                    <TableCell>
                                        {delegue.classe?.parcours?.name ?? '—'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {delegue.activites_count}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                delegue.approved_at
                                                    ? 'success'
                                                    : 'warning'
                                            }
                                        >
                                            {delegue.approved_at
                                                ? 'Approuvé'
                                                : 'En attente'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {delegue.approved_at ? (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    post(
                                                        'delegues.revoke',
                                                        delegue.id,
                                                    )
                                                }
                                            >
                                                Suspendre
                                            </Button>
                                        ) : (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700"
                                                    onClick={() =>
                                                        post(
                                                            'delegues.approve',
                                                            delegue.id,
                                                        )
                                                    }
                                                >
                                                    Approuver
                                                </Button>
                                                {delegue.activites_count ===
                                                    0 && (
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() =>
                                                            reject(delegue)
                                                        }
                                                    >
                                                        Rejeter
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </Authenticated>
    );
}
