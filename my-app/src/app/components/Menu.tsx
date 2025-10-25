import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Users, Settings, ChartArea } from "lucide-react";

interface MenuItem {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}

const MENU_ITEMS: MenuItem[] = [
    { href: "/dashboard", label: "Dashboard", icon: ChartArea },
    { href: "/admin/gestioneutenti", label: "Gestione Utenti", icon: Users },
    { href: "/settings", label: "Impostazioni", icon: Settings },
];

const Menu = () => {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40" role="navigation" aria-label="Menu principale admin">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-1 py-3">
                    {MENU_ITEMS.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href;

                        return (
                            <button
                                key={href}
                                onClick={() => router.push(href)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${isActive ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}
                                aria-current={isActive ? "page" : undefined}
                            >
                                <Icon className="w-4 h-4" aria-hidden="true" />
                                <span>{label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default Menu;
