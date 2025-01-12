import React from 'react';

interface MenuItem {
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    link?: string;
}

interface VerticalMenuProps {
    items: MenuItem[];
    activeItem?: string;
    className?: string;
}

const VerticalMenu: React.FC<VerticalMenuProps> = ({
    items,
    activeItem,
    className = '',
}) => {
    return (
        <div
            className={`vertical-menu ${className} h-full w-64 bg-gray-100 p-4`}
        >
            <ul className="space-y-2">
                {items.map((item, index) => (
                    <li
                        key={index}
                        className={`menu-item flex cursor-pointer items-center rounded-lg p-2 ${
                            activeItem === item.label
                                ? 'bg-blue-500 text-white'
                                : 'hover:bg-gray-200'
                        }`}
                        onClick={item.onClick}
                    >
                        {item.icon && (
                            <span className="icon mr-3">{item.icon}</span>
                        )}
                        {item.link ? (
                            <a href={item.link} className="flex-grow">
                                {item.label}
                            </a>
                        ) : (
                            <span className="flex-grow">{item.label}</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VerticalMenu;
