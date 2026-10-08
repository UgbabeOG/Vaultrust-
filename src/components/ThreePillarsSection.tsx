import React from 'react';
import { ArrowRight, ShoppingBag, ShieldCheck, PlaneTakeoff, Gem, Layers } from 'lucide-react';
import bullionImage from '../assets/images/bullion_diamonds_display_1791484224660.jpg';
import convoyImage from '../assets/images/armored_transit_convoy_1791484234372.jpg';

interface ThreePillarsSectionProps {
  onOpenProcurement: () => void;
  onOpenReserve: () => void;
  onOpenDispatch: () => void;
}

export const ThreePillarsSection: React.FC<ThreePillarsSectionProps> = ({
  onOpenProcurement,
  onOpenReserve,
  onOpenDispatch,
}) => {
  return (
    <section id="services" className="py-24 lg:py-32 bg-[#08090b] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-[#c5a059] font-medium mb-3">
            <span className="w-5 h-[1px] bg-[#c5a059]" />
            <span>The Three Mandates</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl text-[#f5f5f7] font-normal tracking-tight text-balance">
            Acquire, Preserve, and Transport with Absolute Sovereign Discretion
          </h2>
          <p className="mt-4 text-base text-[#9ba1b0] leading-relaxed">
            A cohesive custodial continuum designed exclusively for family offices, private wealth institutions, and high-value collectors worldwide.
          </p>
        </div>

        {/* Feature 1: Acquire & Procure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pb-20 border-b border-[#1c212c]">
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-mono text-[#c5a059] tracking-wider uppercase">
              01. Direct Asset Procurement
            </div>
            <h3 className="font-display text-2xl sm:text-3xl text-[#f5f5f7] font-normal leading-tight">
              Buy Certified Investment Bullion & Rare Natural Diamonds
            </h3>
            <p className="text-sm sm:text-base text-[#9ba1b0] leading-relaxed">
              Eliminate third-party broker friction. Procure LBMA-accredited 999.9 fine gold cast bars, certified platinum ingots, and exceptional GIA Type IIa investment diamonds directly through Valtrust’s sovereign trading desk.
            </p>
            <div className="space-y-3 pt-2 text-xs text-[#8f96a8]">
              <div className="flex items-start gap-2.5">
                <span className="text-[#c5a059] font-mono text-sm">✦</span>
                <span>Direct refinery provenance with individual serial assay certificates</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-[#c5a059] font-mono text-sm">✦</span>
                <span>Conflict-free Kimberley Process certified investment-grade gemstones</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-[#c5a059] font-mono text-sm">✦</span>
                <span>Immediate allocation into your private depository vault upon settlement</span>
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={onOpenProcurement}
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#c5a059] hover:text-[#faebd7] transition-colors group"
              >
                <span>View Current Bullion & Diamond Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative rounded-sm overflow-hidden border border-[#262c3a] group bg-[#0e1117]">
              <img
                src={bullionImage}
                alt="Serialized fine gold bullion bars and flawless investment diamonds in velvet security tray"
                referrerPolicy="no-referrer"
                className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-[0.9]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08090b]/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-[#d1d5e0]">
                <span>Allocated Specie · Zurich Bedrock Reserve</span>
                <span className="font-mono text-[#c5a059]">999.9 Fine Gold · GIA Certified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: Subterranean Vault Custody */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-20 border-b border-[#1c212c]">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-[#0e1117] border border-[#232733] rounded-sm space-y-3">
                <span className="text-xs font-mono text-[#c5a059]">EN 1143-1 Grade XIII</span>
                <h4 className="font-display text-lg text-[#f5f5f7]">Subterranean Bedrock Vaults</h4>
                <p className="text-xs text-[#8f96a8] leading-relaxed">
                  Carved inside ancient granite bedrock in Zurich, London, and Singapore. Blast-proof, EMP-shielded, and guarded around the clock.
                </p>
              </div>

              <div className="p-6 bg-[#0e1117] border border-[#232733] rounded-sm space-y-3">
                <span className="text-xs font-mono text-[#c5a059]">100% Specie Coverage</span>
                <h4 className="font-display text-lg text-[#f5f5f7]">Lloyd's Underwritten Insurance</h4>
                <p className="text-xs text-[#8f96a8] leading-relaxed">
                  Full all-risk policies underwritten by premier London syndicates covering physical loss, transit, and catastrophic risks.
                </p>
              </div>

              <div className="p-6 bg-[#0e1117] border border-[#232733] rounded-sm space-y-3">
                <span className="text-xs font-mono text-[#c5a059]">Biometric Multi-Sig</span>
                <h4 className="font-display text-lg text-[#f5f5f7]">Zero Single-Party Access</h4>
                <p className="text-xs text-[#8f96a8] leading-relaxed">
                  Requires simultaneous biometric verification from the client and the senior custodian officer. No master overrides exist.
                </p>
              </div>

              <div className="p-6 bg-[#0e1117] border border-[#232733] rounded-sm space-y-3">
                <span className="text-xs font-mono text-[#c5a059]">Non-Fungible Title</span>
                <h4 className="font-display text-lg text-[#f5f5f7]">Segregated Allocation</h4>
                <p className="text-xs text-[#8f96a8] leading-relaxed">
                  Your bullion bars and gems remain physically segregated in dedicated compartments. Never pooled, loaned, or encumbered.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
            <div className="text-xs font-mono text-[#c5a059] tracking-wider uppercase">
              02. Deep Subterranean Storage
            </div>
            <h3 className="font-display text-2xl sm:text-3xl text-[#f5f5f7] font-normal leading-tight">
              Store Your Valuables Inside Sovereign-Grade Depository Compartments
            </h3>
            <p className="text-sm sm:text-base text-[#9ba1b0] leading-relaxed">
              Whether you require a personal titanium lockbox for an heirloom watch collection or an entire private fortress chamber for sovereign bullion reserves, Valtrust guarantees absolute institutional privacy outside traditional banking jurisdictions.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenReserve}
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#c5a059] hover:text-[#faebd7] transition-colors group"
              >
                <span>Explore Vault Specifications & Reserve Space</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Feature 3: Armored Secure Logistics & On-Demand Dispatch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-20">
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-mono text-[#c5a059] tracking-wider uppercase">
              03. On-Demand Armored Transit
            </div>
            <h3 className="font-display text-2xl sm:text-3xl text-[#f5f5f7] font-normal leading-tight">
              Dispatched Directly to Your Residence, Yacht, or Family Office
            </h3>
            <p className="text-sm sm:text-base text-[#9ba1b0] leading-relaxed">
              Your assets never remain static when you need them. Trigger safe-hand dispatch via our secure portal. Our armored convoys and guarded air couriers deliver directly to your private estate, private jet apron, or marine berth.
            </p>
            <div className="space-y-3 pt-2 text-xs text-[#8f96a8]">
              <div className="flex items-start gap-2.5">
                <span className="text-[#c5a059] font-mono text-sm">✦</span>
                <span>Level B7 bulletproof armored transport vehicles with satellite encrypted tracking</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-[#c5a059] font-mono text-sm">✦</span>
                <span>Diplomatic safe-hand air couriers with private airside tarmac clearance</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-[#c5a059] font-mono text-sm">✦</span>
                <span>Continuous chain-of-custody biometric logs from vault unseal to physical handover</span>
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={onOpenDispatch}
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#c5a059] hover:text-[#faebd7] transition-colors group"
              >
                <span>Request Armored Dispatch Protocol</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative rounded-sm overflow-hidden border border-[#262c3a] group bg-[#0e1117]">
              <img
                src={convoyImage}
                alt="Luxury armored vehicle convoy with security escorts beside private aircraft on airport tarmac"
                referrerPolicy="no-referrer"
                className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-[0.9]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08090b]/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-[#d1d5e0]">
                <span>Guarded Airside Handoff · International Operations</span>
                <span className="font-mono text-[#7aa2f7]">Level 5 Armed Convoy · Tarmac Clearance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
