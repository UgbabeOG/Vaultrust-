import React, { useState } from 'react';
import { Shield, Menu, X, Search, Lock, Compass } from 'lucide-react';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenReserve: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, onOpenReserve }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#232733]/80 bg-[#08090b]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-sm border border-[#c5a059]/40 bg-[#12151c] flex items-center justify-center text-[#c5a059] group-hover:border-[#c5a059] transition-colors shadow-sm">
            <Shield className="w-5 h-5 stroke-[1.5]" />
          </div>
          <span className="font-display text-lg tracking-wider font-semibold text-[#f5f5f7] group-hover:text-[#faebd7] transition-colors whitespace-nowrap">
            VALTRUST SENTINEL GLOBAL
          </span>
        </a>

        {/* Zone 2: 4-6 text navigation links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#9ba1b0]">
          <a href="#services" className="hover:text-[#f5f5f7] transition-colors py-1">
            Custody Services
          </a>
          <a href="#tracker" className="hover:text-[#f5f5f7] transition-colors py-1">
            Vault & Transit Tracker
          </a>
          <a href="#procurement" className="hover:text-[#f5f5f7] transition-colors py-1">
            Gold & Diamond Desk
          </a>
          <a href="#vault-spaces" className="hover:text-[#f5f5f7] transition-colors py-1">
            Depository Tiers
          </a>
          <a href="#sanctuary" className="hover:text-[#f5f5f7] transition-colors py-1">
            Private Salons
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium tracking-wide text-[#d4af37] bg-[#141720] border border-[#c5a059]/30 hover:border-[#c5a059] hover:bg-[#1a1f2c] rounded-sm transition-all duration-200 whitespace-nowrap"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Vault / Track</span>
          </button>
          <button
            onClick={onOpenReserve}
            className="px-4 py-2 text-xs font-semibold tracking-wider uppercase text-[#08090b] bg-gradient-to-r from-[#d8b873] to-[#c5a059] hover:from-[#faebd7] hover:to-[#d8b873] rounded-sm shadow-sm transition-all duration-200 whitespace-nowrap"
          >
            Reserve Vault
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onOpenSearch}
            aria-label="Search Vault"
            className="p-2 text-[#d4af37] bg-[#141720] border border-[#c5a059]/30 rounded-sm"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="p-2 text-[#9ba1b0] hover:text-[#f5f5f7]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#232733] bg-[#0c0e13] px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-[#b5bac7]">
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#faebd7]"
            >
              Custody Services
            </a>
            <a
              href="#tracker"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#faebd7]"
            >
              Vault & Transit Tracker
            </a>
            <a
              href="#procurement"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#faebd7]"
            >
              Gold & Diamond Desk
            </a>
            <a
              href="#vault-spaces"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#faebd7]"
            >
              Depository Tiers
            </a>
            <a
              href="#sanctuary"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#faebd7]"
            >
              Private Salons
            </a>
          </nav>
          <div className="pt-4 border-t border-[#1f232e] flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReserve();
              }}
              className="w-full py-2.5 text-xs font-semibold tracking-wider uppercase text-[#08090b] bg-[#c5a059] rounded-sm text-center"
            >
              Reserve Vault Space
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
