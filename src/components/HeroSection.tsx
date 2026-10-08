import React from 'react';
import { ShieldCheck, ArrowRight, Search, KeyRound } from 'lucide-react';
import heroVaultImage from '../assets/images/hero_vault_sanctuary_1791484214053.jpg';

interface HeroSectionProps {
  onOpenReserve: () => void;
  onScrollToTracker: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenReserve,
  onScrollToTracker,
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-24 lg:pt-16 lg:pb-32">
      {/* Background visual asset with luxury gradient scrim */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src={heroVaultImage}
          alt="Valtrust Sentinel Global subterranean bedrock bank vault with massive polished steel circular door"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-[0.42] contrast-[1.08] scale-105 transition-transform duration-1000"
        />
        {/* Scrims to ensure strict WCAG AA contrast (4.5:1+) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-[#08090b]/80 to-[#08090b]/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#08090b]/40 to-[#08090b]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Unboxed editorial kicker */}
        <div className="flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-[#c5a059] font-medium mb-6">
          <span className="w-6 h-[1px] bg-[#c5a059]" />
          <span>Sovereign Security · Deep Bedrock Custody · Global Armored Transit</span>
        </div>

        <div className="max-w-3xl">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#f9fafb] leading-[1.12] mb-6 text-balance">
            Sanctuary for the World’s Most Valuable Wares.
          </h1>

          <p className="text-base sm:text-lg text-[#b8bdca] font-normal leading-relaxed mb-8 max-w-2xl">
            Acquire certified investment-grade bullion and rare diamonds. Store them securely inside deep subterranean Class XIII bedrock vaults in Zurich, London, and Singapore. Dispatched securely to your estate or yacht worldwide on your schedule.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12">
            <button
              onClick={onOpenReserve}
              className="group flex items-center justify-center gap-3 px-7 py-3.5 text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#08090b] bg-gradient-to-r from-[#e6ca85] via-[#d4af37] to-[#c5a059] hover:from-[#fff0cd] hover:to-[#dfb95c] rounded-sm transition-all duration-200 shadow-lg shadow-black/40"
            >
              <KeyRound className="w-4 h-4 text-[#08090b]" />
              <span>Reserve Vault Allocation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onScrollToTracker}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 text-xs sm:text-sm font-medium tracking-wide text-[#f0f2f5] bg-[#12151c]/90 hover:bg-[#1c212c] border border-[#2b3140] hover:border-[#c5a059]/50 rounded-sm transition-all duration-200"
            >
              <Search className="w-4 h-4 text-[#c5a059]" />
              <span>Search Vault or Track Shipment</span>
            </button>
          </div>

          {/* Clean unboxed proof and trust indicators (no pill badges) */}
          <div className="pt-8 border-t border-[#232733]/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs text-[#9aa0b0]">
            <div>
              <p className="font-display text-base font-semibold text-[#f5f5f7] tracking-normal mb-1">
                100% Specie
              </p>
              <p className="text-[#848a9b]">Underwritten by Lloyd's of London syndicates</p>
            </div>
            <div>
              <p className="font-display text-base font-semibold text-[#f5f5f7] tracking-normal mb-1">
                Grade XIII
              </p>
              <p className="text-[#848a9b]">EN 1143-1 subterranean bedrock armored protection</p>
            </div>
            <div>
              <p className="font-display text-base font-semibold text-[#f5f5f7] tracking-normal mb-1">
                Non-Fungible
              </p>
              <p className="text-[#848a9b]">Individually allocated, serialized physical title</p>
            </div>
            <div>
              <p className="font-display text-base font-semibold text-[#f5f5f7] tracking-normal mb-1">
                Safe-Hand
              </p>
              <p className="text-[#848a9b]">Armed convoy & guarded air charter transit</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
