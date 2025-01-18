import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Welcome({ auth }: PageProps) {
    return (
        <>
            <Head title="Bienvenue | SuiviApp" />
            <div className="bg-gradient-to-b from-blue-50 via-white to-blue-50 text-gray-800 dark:from-gray-900 dark:via-black dark:to-gray-800 dark:text-gray-200">
                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-blue-600 selection:text-white">
                    <div className="h-screen w-full px-6 py-5 sm:px-12 lg:px-24 xl:max-w-6xl">
                        <motion.header
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center justify-between py-6"
                        >
                            <Link href="/" className="group">
                                <h1 className="text-3xl font-extrabold tracking-tight text-blue-600 transition-colors duration-300 hover:text-blue-700 dark:text-white dark:hover:text-blue-400">
                                    SuiviApp
                                </h1>
                            </Link>
                            <nav className="space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md bg-blue-600 px-4 py-2 text-white shadow-md transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        Aller au Tableau de Bord
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-md bg-white px-4 py-2 text-blue-600 shadow-sm ring-1 ring-blue-600 transition hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            Connexion
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-md bg-blue-600 px-4 py-2 text-white shadow-md transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            Inscription
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </motion.header>

                        <main className="mt-10 flex flex-col items-center justify-center space-y-6 text-center">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6 }}
                            >
                                <h2 className="text-5xl font-extrabold tracking-tight text-gray-800 dark:text-gray-100">
                                    Bienvenue sur <span className="text-blue-600">SuiviApp</span>
                                </h2>
                                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                                    Simplifiez la gestion des cours et suivez les
                                    progrès facilement.
                                </p>
                            </motion.div>

                            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="group rounded-xl bg-white p-8 shadow-lg transition-all hover:shadow-xl dark:bg-gray-800"
                                >
                                    <div className="mb-4 rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                        <svg className="h-6 w-6 text-blue-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                        Gestion des Cours
                                    </h3>
                                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                                        Organisez vos cours et suivez les
                                        progrès de vos étudiants.
                                    </p>
                                </motion.div>

                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className="group rounded-xl bg-white p-8 shadow-lg transition-all hover:shadow-xl dark:bg-gray-800"
                                >
                                    <div className="mb-4 rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                        <svg className="h-6 w-6 text-blue-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                        Suivi des Progrès
                                    </h3>
                                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                                        Visualisez les progrès de vos étudiants
                                        en temps réel.
                                    </p>
                                </motion.div>

                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.6 }}
                                    className="group rounded-xl bg-white p-8 shadow-lg transition-all hover:shadow-xl dark:bg-gray-800"
                                >
                                    <div className="mb-4 rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                        <svg className="h-6 w-6 text-blue-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                        Rapports Détaillés
                                    </h3>
                                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                                        Générer des rapports détaillés pour une
                                        meilleure analyse.
                                    </p>
                                </motion.div>
                            </div>

                            {!auth.user && (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.8 }}
                                    className="mt-12 flex space-x-4"
                                >
                                    <Link
                                        href={route('register')}
                                        className="rounded-md bg-blue-600 px-6 py-3 text-white shadow-md transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        Commencer
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="rounded-md bg-white px-6 py-3 text-blue-600 shadow-sm ring-1 ring-blue-600 transition hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        Connexion
                                    </Link>
                                </motion.div>
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