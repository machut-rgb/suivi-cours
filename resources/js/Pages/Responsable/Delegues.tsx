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
import { Head, router } from '@inertiajs/react';

const DeleguesList = ({ data }) => {
    const handleApprove = (id) => {
        router.post(
            `/responsable/delegues/${id}/approve`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const handleReject = (id) => {
        router.post(
            `/responsable/delegues/${id}/reject`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const delegues = data.filter((user) => user.role === 'delegue');

    return (
        <Authenticated>
            <div className="py-6">
                <Head title="Gestion des Délégués" />

                <Card>
                    <CardHeader>
                        <CardTitle>Liste des Délégués</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Classe</TableHead>
                                    <TableHead>Parcours</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {delegues.map((delegue) => (
                                    <TableRow key={delegue.id}>
                                        <TableCell>{delegue.name}</TableCell>
                                        <TableCell>{delegue.email}</TableCell>
                                        <TableCell>
                                            {delegue.classe?.name}
                                        </TableCell>
                                        <TableCell>
                                            {delegue.classe?.parcours?.name}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    delegue.email_verified_at
                                                        ? 'success'
                                                        : 'warning'
                                                }
                                            >
                                                {delegue.email_verified_at
                                                    ? 'Approuvé'
                                                    : 'En attente'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {!delegue.email_verified_at && (
                                                <div className="flex space-x-2">
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700"
                                                        onClick={() =>
                                                            handleApprove(
                                                                delegue.id,
                                                            )
                                                        }
                                                    >
                                                        Approuver
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() =>
                                                            handleReject(
                                                                delegue.id,
                                                            )
                                                        }
                                                    >
                                                        Rejeter
                                                    </Button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </Authenticated>
    );
};

export default DeleguesList;
