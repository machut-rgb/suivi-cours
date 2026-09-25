import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';

export default function PendingApproval() {
    return (
        <GuestLayout>
            <Head title="Compte en attente" />

            <h1 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Compte en attente de validation
            </h1>
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                Votre inscription a bien été enregistrée. Un responsable doit
                valider votre compte de délégué avant que vous puissiez saisir
                des rapports de cours. Réessayez plus tard.
            </p>

            <div className="flex items-center justify-between">
                <Link
                    href={route('approval.pending')}
                    className="text-sm text-blue-600 underline hover:text-blue-800"
                >
                    Vérifier à nouveau
                </Link>
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="text-sm text-gray-600 underline hover:text-gray-900 dark:text-gray-400"
                >
                    Se déconnecter
                </Link>
            </div>
        </GuestLayout>
    );
}
