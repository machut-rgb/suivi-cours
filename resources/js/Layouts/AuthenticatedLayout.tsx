import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Alert } from '@/components/ui/alert';
import { Link, usePage } from '@inertiajs/react';
import { ReactNode, useEffect, useState } from 'react';
import { FaBell, FaMoon, FaSearch, FaSun, FaUserCircle } from 'react-icons/fa';

interface User {
    name: string;
    email: string;
    role: string;
    avatar?: string;
}

interface AuthenticatedProps {
    header?: ReactNode;
    children: ReactNode;
}

// const SearchBar = () => (
//     <div className="relative mx-4 max-w-xl flex-1">
//         <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
//             <FaSearch className="h-5 w-5 text-gray-400" />
//         </div>
//         <input
//             type="search"
//             className="block w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 pl-10 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
//             placeholder="Search..."
//         />
//     </div>
// );

// const NotificationBell = () => {
//     const [showNotification, setShowNotification] = useState(false);

//     return (
//         <div className="relative">
//             <button
//                 onClick={() => setShowNotification(!showNotification)}
//                 className="relative rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
//             >
//                 <FaBell className="h-6 w-6" />
//                 <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
//                     3
//                 </span>
//             </button>
//             {showNotification && (
//                 <div className="absolute right-0 mt-2 w-80 rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
//                     <Alert>
//                         <div className="mb-2 font-semibold">
//                             New Notification
//                         </div>
//                         <div className="text-sm text-gray-500">
//                             You have a new message
//                         </div>
//                     </Alert>
//                 </div>
//             )}
//         </div>
//     );
// };

const UserAvatar = ({ user }: { user: User }) => (
    <div className="flex items-center space-x-4">
        <div className="hidden text-right md:block">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {user.name}
            </div>
            <div className="text-xs text-gray-500">{user.role}</div>
        </div>
        {user.avatar ? (
            <img
                src={user.avatar}
                alt={user.name}
                className="h-10 w-10 rounded-full border-2 border-gray-200 dark:border-gray-700"
            />
        ) : (
            <FaUserCircle className="h-10 w-10 text-gray-400" />
        )}
    </div>
);

const Navigation = ({
    user,
    sidebarOpen,
}: {
    user: User;
    sidebarOpen: boolean;
}) => {
    const navItemClass = `flex items-center rounded-lg px-4 py-3 text-gray-700 transition-all duration-200 
      hover:bg-blue-50 hover:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white
      ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`;

    return (
        <nav className="space-y-1">
            <Link href={route('dashboard')} className={navItemClass}>
                <svg
                    className="mr-3 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                </svg>
                <span
                    className={`transition-all duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
                >
                    Dashboard
                </span>
            </Link>

            <Link
                href={
                    user.role === 'responsable' ? route('programmes.index') : ''
                }
                className={navItemClass}
            >
                <svg
                    className="mr-3 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                </svg>
                <span
                    className={`transition-all duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
                >
                    {user.role === 'responsable' ? 'Programmes' : 'Activités'}
                </span>
            </Link>

            {user.role === 'responsable' && (
                <>
                    <Link
                        href={route('classes.index')}
                        className={navItemClass}
                    >
                        <svg
                            className="mr-3 h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                        </svg>
                        <span
                            className={`transition-all duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
                        >
                            Parcours
                        </span>
                    </Link>

                    <Link href={route('dashboard')} className={navItemClass}>
                        <svg
                            className="mr-3 h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
                        <span
                            className={`transition-all duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
                        >
                            Matières
                        </span>
                    </Link>

                    <Link
                        href={route('delegues.index')}
                        className={navItemClass}
                    >
                        <svg
                            className="mr-3 h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                        <span
                            className={`transition-all duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
                        >
                            Délégués
                        </span>
                    </Link>
                </>
            )}
        </nav>
    );
};

export default function Authenticated({
    header,
    children,
}: AuthenticatedProps) {
    const user = usePage().props.auth.user as User;
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

    return (
        <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-lg dark:border-gray-700 dark:bg-gray-800/80">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
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

                        {/* <SearchBar /> */}

                        <div className="flex items-center space-x-4">
                            {/* <NotificationBell /> */}
                            <button
                                onClick={toggleTheme}
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
                                    <UserAvatar user={user} />
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href="">
                                        Profile
                                    </Dropdown.Link>
                                    <Dropdown.Link href="">
                                        Settings
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                    >
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex">
                <aside
                    className={`fixed inset-y-0 left-0 z-50 mt-16 w-64 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} border-r border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-700 dark:bg-gray-800/80`}
                >
                    <div className="h-full overflow-y-auto px-4 py-6">
                        <Navigation user={user} sidebarOpen={sidebarOpen} />
                    </div>
                </aside>

                <main
                    className={`flex-1 transform transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-0'} `}
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
        </div>
    );
}
