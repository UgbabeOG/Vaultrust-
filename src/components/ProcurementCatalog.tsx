import React from 'react';
import { BULLION_CATALOG } from '../data/mockCustodyData';
import { ShieldCheck, Truck, Lock, ArrowRight, Gem, Scale, Award, Sparkles } from 'lucide-react';
import diamondsCollectionImg from '../assets/images/flawless_diamonds_collection_1791495361301.jpg';

interface ProcurementCatalogProps {
  onAcquireItem: (item: (typeof BULLION_CATALOG)[0], actionType: 'vault' | 'ship') => void;
}

export const ProcurementCatalog: React.FC<ProcurementCatalogProps> = ({ onAcquireItem }) => {
  return (
    <section id="procurement" className="py-24 bg-[#08090b] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-[#c5a059] font-medium mb-3">
              <span className="w-5 h-[1px] bg-[#c5a059]" />
              <span>Direct Sovereign Acquisition</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-[#f5f5f7] font-normal tracking-tight text-balance">
              Physical Bullion & Rare Natural Diamonds
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#9ba1b0] leading-relaxed">
              Purchase physical investment-grade assets through our custodial desk. Elect to immediately allocate them into your private bedrock vault or schedule armed white-glove transit to your door.
            </p>
          </div>

          <div className="text-xs text-[#727a8d] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>LBMA & Rapaport Live Spot Indicative Pricing</span>
          </div>
        </div>

        {/* Spotlight Showcase Banner: Investment Diamonds & Bullion Desk */}
        <div className="mb-12 rounded-sm overflow-hidden border border-[#232733] bg-[#0c0e14] grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5 p-6 sm:p-8 space-y-4 order-2 lg:order-1">
            <div className="flex items-center gap-2 text-xs text-[#c5a059] font-mono uppercase tracking-wider">
              <Gem className="w-3.5 h-3.5" />
              <span>Certified Primary Bourse Allocation</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl text-[#f5f5f7] font-normal leading-snug">
              Type IIa Chemical Purity & Flawless Rough-to-Cut Specie
            </h3>
            <p className="text-xs sm:text-sm text-[#9aa0b0] leading-relaxed">
              All diamonds acquired through Valtrust Sentinel Global are verified under laser Raman spectroscopy with full GIA dossiers and Kimberley Process provenance. Allocate them directly into your insured safe deposit drawer upon trade confirmation.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
              <span className="px-3 py-1 bg-[#141822] border border-[#252b3a] text-[#d1d5e0] rounded-sm">
                0% Vault Transfer Fee
              </span>
              <span className="px-3 py-1 bg-[#141822] border border-[#252b3a] text-[#d1d5e0] rounded-sm">
                Immediate Lloyd's In-Vault Binder
              </span>
            </div>
          </div>
          <div className="lg:col-span-7 h-64 sm:h-80 relative overflow-hidden order-1 lg:order-2">
            <img
              src={diamondsCollectionImg}
              alt="Flawless brilliant, emerald, radiant, and pear cut investment diamonds on dark obsidian stone pedestal"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center brightness-[0.9] contrast-[1.05] hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-transparent via-[#0c0e14]/20 to-[#0c0e14]" />
            <div className="absolute bottom-3 right-3 text-[11px] font-mono text-[#c5a059] bg-black/70 px-2.5 py-1 rounded-sm border border-[#2b3140]">
              GIA Certified · D / Flawless Lot
            </div>
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BULLION_CATALOG.map((item) => (
            <div
              key={item.id}
              className="bg-[#0f1117] border border-[#232733] hover:border-[#c5a059]/60 rounded-sm p-6 flex flex-col justify-between transition-all duration-200 group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#8e95a5] mb-3">
                  <span className="text-[#c5a059] font-medium">{item.category}</span>
                  <span className="font-mono text-[#5f677a]">{item.id}</span>
                </div>

                <h3 className="font-display text-lg text-[#f5f5f7] mb-2 group-hover:text-[#faebd7] transition-colors leading-snug">
                  {item.title}
                </h3>

                <div className="space-y-1.5 text-xs text-[#8990a2] mb-6 pt-2 border-t border-[#1c202a]">
                  <div className="flex justify-between">
                    <span className="text-[#646c7e]">Purity / Grade:</span>
                    <span className="text-[#d1d5e0] font-medium">{item.purity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#646c7e]">Weight / Mass:</span>
                    <span className="font-mono text-[#d1d5e0]">{item.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#646c7e]">Assay Provenance:</span>
                    <span className="text-[#d1d5e0] text-right truncate max-w-[150px]">{item.origin}</span>
                  </div>
                </div>

                <div className="mb-6 bg-[#090b0f] p-3 rounded-sm border border-[#1b1f2b]">
                  <span className="text-[11px] text-[#646c7e] block">Indicative Spot Quotation</span>
                  <span className="font-mono text-xl font-semibold text-[#f5f5f7] tabular-nums mt-0.5 block">
                    {item.spotReference}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2 border-t border-[#1e2330]">
                <button
                  onClick={() => onAcquireItem(item, 'vault')}
                  className="w-full py-2.5 px-3 text-xs font-semibold tracking-wide text-[#08090b] bg-gradient-to-r from-[#d8b873] to-[#c5a059] hover:from-[#faebd7] hover:to-[#d8b873] rounded-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Buy & Direct Vault</span>
                </button>

                <button
                  onClick={() => onAcquireItem(item, 'ship')}
                  className="w-full py-2 px-3 text-xs font-medium text-[#b5bac7] bg-[#141822] border border-[#262c3a] hover:border-[#c5a059]/40 hover:text-[#f5f5f7] rounded-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Buy & Ship to Address</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantee Banner */}
        <div className="mt-12 p-6 bg-[#0e121a] border border-[#232733] rounded-sm grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#8f96a8]">
          <div className="flex items-start gap-3">
            <Scale className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-[#f5f5f7] mb-0.5">Assay Verification Guaranteed</h4>
              <p>Every bar undergoes ultrasonic acoustic testing and optical emission spectroscopy before custody logging.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-[#f5f5f7] mb-0.5">Kimberley Process Compliant</h4>
              <p>Investment diamonds are sourced exclusively through certified primary bourses with verified non-conflict dossiers.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-[#f5f5f7] mb-0.5">Zero Transfer Lag</h4>
              <p>Purchased assets can be held in depository indefinitely or scheduled for immediate armored transit in 1-click.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
