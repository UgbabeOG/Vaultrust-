import React from 'react';
import { ShieldCheck, ArrowRight, Search, KeyRound, Fingerprint, Lock } from 'lucide-react';
import heroVaultBg from '../assets/images/hero_vault_sanctuary_1791484214053.jpg';
import heroPortalImage from '../assets/images/hero_vault_fortress_portal_1791495326601.jpg';

interface HeroSectionProps {
  onOpenReserve: () => void;
  onScrollToTracker: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenReserve,
  onScrollToTracker,
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28">
      {/* Background ambient scrim with luxury texture */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src={heroVaultBg}
          alt="Valtrust Sentinel Global ambient vault background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-[0.25] contrast-[1.1] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-[#08090b]/90 to-[#08090b]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#c5a059]/10 via-transparent to-[#08090b]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Proposition, Copy & Primary CTAs */}
          <div className="lg:col-span-7">
            {/* Unboxed editorial kicker */}
            <div className="flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-[#c5a059] font-medium mb-6">
              <span className="w-6 h-[1px] bg-[#c5a059]" />
              <span>Sovereign Security · Deep Bedrock Custody · Global Armored Transit</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-normal tracking-tight text-[#f9fafb] leading-[1.12] mb-6 text-balance">
              Sanctuary for the World’s Most Valuable Wares.
            </h1>

            <p className="text-base sm:text-lg text-[#b8bdca] font-normal leading-relaxed mb-8 max-w-xl">
              Acquire certified investment-grade bullion and rare diamonds. Store them securely inside deep subterranean Class XIII bedrock vaults in Zurich, London, and Singapore. Dispatched securely to your estate or yacht worldwide on your schedule.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <button
                onClick={onOpenReserve}
                className="group flex items-center justify-center gap-3 px-7 py-3.5 text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#08090b] bg-gradient-to-r from-[#e6ca85] via-[#d4af37] to-[#c5a059] hover:from-[#fff0cd] hover:to-[#dfb95c] rounded-sm transition-all duration-200 shadow-lg shadow-black/40 whitespace-nowrap"
              >
                <KeyRound className="w-4 h-4 text-[#08090b]" />
                <span>Reserve Vault Allocation</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onScrollToTracker}
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 text-xs sm:text-sm font-medium tracking-wide text-[#f0f2f5] bg-[#12151c]/90 hover:bg-[#1c212c] border border-[#2b3140] hover:border-[#c5a059]/50 rounded-sm transition-all duration-200 whitespace-nowrap"
              >
                <Search className="w-4 h-4 text-[#c5a059]" />
                <span>Search Vault or Track Shipment</span>
              </button>
            </div>

            {/* Clean unboxed proof and trust indicators */}
            <div className="pt-6 border-t border-[#232733]/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[#9aa0b0]">
              <div>
                <p className="font-display text-sm sm:text-base font-semibold text-[#f5f5f7] tracking-normal mb-0.5">
                  100% Specie
                </p>
                <p className="text-[#848a9b] text-[11px]">Lloyd's of London syndicates</p>
              </div>
              <div>
                <p className="font-display text-sm sm:text-base font-semibold text-[#f5f5f7] tracking-normal mb-0.5">
                  Grade XIII
                </p>
                <p className="text-[#848a9b] text-[11px]">EN 1143-1 subterranean armor</p>
              </div>
              <div>
                <p className="font-display text-sm sm:text-base font-semibold text-[#f5f5f7] tracking-normal mb-0.5">
                  Non-Fungible
                </p>
                <p className="text-[#848a9b] text-[11px]">Individually allocated title</p>
              </div>
              <div>
                <p className="font-display text-sm sm:text-base font-semibold text-[#f5f5f7] tracking-normal mb-0.5">
                  Safe-Hand
                </p>
                <p className="text-[#848a9b] text-[11px]">Armed convoy & air charter</p>
              </div>
            </div>
          </div>

          {/* Right Column: Prominent Foreground Showcase Image */}
          <div className="lg:col-span-5">
            <div className="relative group rounded-sm overflow-hidden border border-[#c5a059]/40 bg-[#0f121a] shadow-2xl transition-all duration-500 hover:border-[#c5a059]">
              {/* Top ambient bar */}
              <div className="px-4 py-3 bg-[#12151e] border-b border-[#232733] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-[#e2e4e9] text-[11px]">Zurich Bedrock Depository · Portal 01</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#c5a059] font-medium">
                  <Fingerprint className="w-3.5 h-3.5" />
                  <span>Biometric Active</span>
                </div>
              </div>

              {/* Main Foreground Image */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-black">
                <img
                  src={heroPortalImage}
                  alt="Valtrust Sentinel Global sovereign subterranean private vault portal with circular titanium blast door and armed security escort"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center brightness-[0.9] contrast-[1.05] group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090b0f] via-transparent to-transparent opacity-80" />

                {/* Overlaid Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-[#0a0c10]/90 backdrop-blur-md border border-[#2b3140] rounded-sm flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase tracking-wider text-[#c5a059] font-medium block">
                      Depository Architecture
                    </span>
                    <span className="text-xs font-semibold text-[#f5f5f7] block">
                      Subterranean Blast Interlock Chamber
                    </span>
                  </div>
                  <button
                    onClick={onOpenReserve}
                    className="px-3 py-1.5 text-[11px] font-medium text-[#08090b] bg-[#c5a059] hover:bg-[#faebd7] rounded-sm transition-colors whitespace-nowrap"
                  >
                    View Access
                  </button>
                </div>
              </div>

              {/* Bottom Specs Strip */}
              <div className="px-4 py-2.5 bg-[#0d0f15] border-t border-[#1e2330] grid grid-cols-3 gap-2 text-center text-[10px] text-[#8e95a5]">
                <div>
                  <span className="text-[#62697a] block">Armor Rating</span>
                  <span className="font-mono font-medium text-[#f5f5f7]">Grade XIII</span>
                </div>
                <div className="border-x border-[#1e2330]">
                  <span className="text-[#62697a] block">Door Mass</span>
                  <span className="font-mono font-medium text-[#f5f5f7]">22.4 Tonnes</span>
                </div>
                <div>
                  <span className="text-[#62697a] block">Atmosphere</span>
                  <span className="font-mono font-medium text-[#56b6c2]">Inert N₂ Matrix</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
