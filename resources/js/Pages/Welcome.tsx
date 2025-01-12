import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Welcome({ auth }: PageProps) {
    return (
        <>
            <Head title="Bienvenue | SuiviApp" />
            <div className="bg-gradient-to-b from-gray-100 via-white to-gray-50 text-gray-800 dark:from-gray-900 dark:via-black dark:to-gray-800 dark:text-gray-200">
                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white">
                    <div className="h-screen w-full px-6 py-5 sm:px-12 lg:px-24 xl:max-w-6xl">
                        <motion.header
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center justify-between py-6"
                        >
                            <Link href="/" className="group">
                                <h1 className="text-3xl font-extrabold tracking-tight text-black transition-colors duration-300 hover:text-[#FF2D20] dark:text-white dark:hover:text-[#FF2D20]">
                                    SuiviApp
                                </h1>
                            </Link>
                            <nav className="space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md bg-[#FF2D20] px-4 py-2 text-white shadow-md transition hover:bg-[#d1241c] focus:outline-none focus:ring-2 focus:ring-[#FF2D20] focus:ring-offset-2"
                                    >
                                        Aller au Tableau de Bord
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-md bg-white px-4 py-2 text-[#FF2D20] shadow-sm ring-1 ring-[#FF2D20] transition hover:bg-[#FF2D20] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#FF2D20] focus:ring-offset-2"
                                        >
                                            Connexion
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-md bg-[#FF2D20] px-4 py-2 text-white shadow-md transition hover:bg-[#d1241c] focus:outline-none focus:ring-2 focus:ring-[#FF2D20] focus:ring-offset-2"
                                        >
                                            Inscription
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </motion.header>

                        <main className="mt-10 flex flex-col items-center justify-center space-y-6 text-center">
                            <h2 className="text-5xl font-extrabold tracking-tight text-gray-800 dark:text-gray-100">
                                Bienvenue sur SuiviApp
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                Simplifiez la gestion des cours et suivez les
                                progrès facilement.
                            </p>
                            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                        Gestion des Cours
                                    </h3>
                                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                                        Organisez vos cours et suivez les
                                        progrès de vos étudiants.
                                    </p>
                                </div>
                                <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                        Suivi des Progrès
                                    </h3>
                                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                                        Visualisez les progrès de vos étudiants
                                        en temps réel.
                                    </p>
                                </div>
                                <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                        Rapports Détaillés
                                    </h3>
                                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                                        Générer des rapports détaillés pour une
                                        meilleure analyse.
                                    </p>
                                </div>
                            </div>
                            {!auth.user && (
                                <div className="mt-8 flex space-x-4">
                                    <Link
                                        href={route('register')}
                                        className="rounded-md bg-[#FF2D20] px-6 py-3 text-white shadow-md transition hover:bg-[#d1241c] focus:outline-none focus:ring-2 focus:ring-[#FF2D20] focus:ring-offset-2"
                                    >
                                        Commencer
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="rounded-md bg-white px-6 py-3 text-[#FF2D20] shadow-sm ring-1 ring-[#FF2D20] transition hover:bg-[#FF2D20] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#FF2D20] focus:ring-offset-2"
                                    >
                                        Connexion
                                    </Link>
                                </div>
                            )}
                        </main>

                        <footer className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
                            © {new Date().getFullYear()} SuiviApp. Tous droits
                            réservés.
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
