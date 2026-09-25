import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    CheckCircle2,
    LayoutDashboard,
    LucideIcon,
    School,
    Users,
    X,
} from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { FaMoon, FaSun, FaUserCircle } from 'react-icons/fa';

interface NavItem {
    label: string;
    href: string;
    active: boolean;
    icon: LucideIcon;
}

const navItemsFor = (role: string): NavItem[] => {
    if (role === 'responsable') {
        return [
            {
                label: 'Tableau de bord',
                href: route('dashboard.responsable'),
                active: route().current('dashboard.responsable'),
                icon: LayoutDashboard,
            },
            {
                label: 'Programmes',
                href: route('programmes.index'),
                active: route().current('programmes.*'),
                icon: BookOpen,
            },
            {
                label: 'Parcours & classes',
                href: route('parcours.index'),
                active: route().current('parcours.*'),
                icon: School,
            },
            {
                label: 'Délégués',
                href: route('delegues.index'),
                active: route().current('delegues.*'),
                icon: Users,
            },
        ];
    }

    return [
        {
            label: 'Mes rapports',
            href: route('dashboard.delegue'),
            active: route().current('dashboard.delegue'),
            icon: LayoutDashboard,
        },
    ];
};

const FlashMessage = () => {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState<string | null>(null);

    useEffect(() => {
        const message = flash?.success ?? flash?.error ?? null;
        setVisible(message);
        if (!message) return;
        const timer = setTimeout(() => setVisible(null), 4000);
        return () => clearTimeout(timer);
    }, [flash]);

    if (!visible) return null;

    const isError = !flash?.success && !!flash?.error;

    return (
        <div
            role="status"
            className={`fixed bottom-6 right-6 z-[60] flex max-w-sm items-center gap-3 rounded-lg px-4 py-3 text-sm shadow-lg ${
                isError ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
            }`}
        >
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>{visible}</span>
            <button
                onClick={() => setVisible(null)}
                aria-label="Fermer"
                className="ml-2 opacity-80 hover:opacity-100"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
};

export default function Authenticated({
    header,
    children,
}: {
    header?: ReactNode;
    children: ReactNode;
}) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [theme, setTheme] = useState(() => {
        if (typeof window === 'undefined') return 'light';
        return (
            localStorage.getItem('theme') ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light')
        );
    });

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => {
            const newTheme = prev === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            return newTheme;
        });
    };

    const navItems = navItemsFor(user.role);

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-lg dark:border-gray-700 dark:bg-gray-800/80">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                aria-label="Menu"
                                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d={
                                            sidebarOpen
                                                ? 'M6 18L18 6M6 6l12 12'
                                                : 'M4 6h16M4 12h16M4 18h16'
                                        }
                                    />
                                </svg>
                            </button>
                            <Link href="/" className="ml-4">
                                <ApplicationLogo className="h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={toggleTheme}
                                aria-label="Changer de thème"
                                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                            >
                                {theme === 'light' ? (
                                    <FaMoon className="h-6 w-6" />
                                ) : (
                                    <FaSun className="h-6 w-6" />
                                )}
                            </button>
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center space-x-4">
                                        <div className="hidden text-right md:block">
                                            <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                                {user.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {user.role === 'responsable'
                                                    ? 'Responsable'
                                                    : 'Délégué'}
                                            </div>
                                        </div>
                                        <FaUserCircle className="h-10 w-10 text-gray-400" />
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>
                                        Profil
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                    >
                                        Se déconnecter
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex min-h-0 flex-1">
                <aside
                    className={`fixed inset-y-0 left-0 z-50 mt-16 w-64 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} border-r border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-700 dark:bg-gray-800/80`}
                >
                    <nav className="space-y-1 px-4 py-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center rounded-lg px-4 py-3 transition-all duration-200 ${
                                    item.active
                                        ? 'bg-blue-50 font-medium text-blue-700 dark:bg-gray-700 dark:text-white'
                                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                                }`}
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </aside>

                <main
                    className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-0'}`}
                >
                    {header && (
                        <header className="bg-white/80 shadow backdrop-blur-lg dark:bg-gray-800/80">
                            <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}
                    <div className="mx-auto px-4 py-8 sm:px-6 lg:px-8">
                        <div className="rounded-lg bg-white/80 p-6 shadow-lg backdrop-blur-lg dark:bg-gray-800/80">
                            {children}
                        </div>
                    </div>
                </main>
            </div>

            <FlashMessage />
        </div>
    );
}
