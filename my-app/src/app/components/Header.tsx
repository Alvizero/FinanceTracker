import React from "react";
import { Wallet, LogOut } from "lucide-react";

interface HeaderProps {
  currentUser: string | null;
  isAdmin: boolean;
  handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, isAdmin, handleLogout }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo e Titolo */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Wallet className="w-6 h-6 text-indigo-600" aria-hidden="true" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Finance Tracker
            </h1>
          </div>

          {/* User Info e Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5  rounded-lg">
              {isAdmin && (
                <span className="px-2 py-0.5 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-full">Admin</span>
              )}
              {!isAdmin && (
                <span className="px-2 py-0.5 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-full">Utente</span>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Esci dall'applicazione"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
