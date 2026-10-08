import React, { useState } from 'react';
import { ShieldCheck, Check, KeyRound, Sparkles, Box, Lock, Landmark } from 'lucide-react';

interface VaultTiersSectionProps {
  onSelectTier: (tierName: string) => void;
}

export const VaultTiersSection: React.FC<VaultTiersSectionProps> = ({ onSelectTier }) => {
  const [selectedBilling, setSelectedBilling] = useState<'annual' | 'multi-year'>('annual');
  const [selectedFacility, setSelectedFacility] = useState('Zurich Bedrock');

  const tiers = [
    {
      id: 'tier-1',
      name: 'Class I Safe Deposit Box',
      tagline: 'Ideal for Certified Diamonds, Rare Horology & Precious Heirlooms',
      dimensions: '75mm (H) × 300mm (W) × 450mm (D)',
      volume: '10 Liters Capacity',
      baseFeeAnnual: '$3,800 USD / yr',
      insuranceIncluded: 'Up to $2,500,000 USD Included',
      rating: 'UL Class 3 Depository Standard',
      features: [
        'Biometric fingerprint & private high-security brass dual-key',
        'Inert humidity-stabilized interior lining',
        'Private inspection salon access (4 visits included/year)',
        'Eligible for on-demand armored courier transit',
        'Lloyd’s of London Specie Underwriting',
      ],
      popular: false,
    },
    {
      id: 'tier-2',
      name: 'Class II Depository Drawer',
      tagline: 'Optimized for Allocated Gold Bullion, Platinum Ingots & Large Specie',
      dimensions: '180mm (H) × 300mm (W) × 500mm (D)',
      volume: '27 Liters Capacity (Holds up to 40 × 1kg Gold Bars)',
      baseFeeAnnual: '$7,900 USD / yr',
      insuranceIncluded: 'Up to $15,000,000 USD Included',
      rating: 'EN 1143-1 Grade XIII Subterranean Fortress',
      features: [
        'Multi-factor iris biometric & dual-custodian release protocol',
        'Continuous nitrogen-enriched atmospheric preservation',
        'Unlimited private inspection salon access with assay scales',
        'Priority armored convoy dispatch within 24-hour window',
        'Quarterly physical audit certificates with high-res imaging',
      ],
      popular: true,
    },
    {
      id: 'tier-3',
      name: 'Class III Private Fortress Chamber',
      tagline: 'Dedicated Sovereign Strongroom for Family Offices & Massive Collections',
      dimensions: 'Custom Walk-in Strongroom Vault (from 12m² to 45m²)',
      volume: 'Full Custom Fortress Floorplate',
      baseFeeAnnual: 'Bespoke Retainer (From $32,000 USD / yr)',
      insuranceIncluded: 'Up to $100,000,000+ USD Insured Limit',
      rating: 'Sovereign Central Bank Equivalent',
      features: [
        'Sole client biometric keycode with cryptographic air-gapped terminal',
        'Custom modular safes, velvet display vitrines & safes inside chamber',
        'Dedicated armed executive escort detachment upon request',
        'Direct tarmac transfer and diplomatic safe-hand courier worldwide',
        'Bespoke off-grid audit protocols and legal jurisdiction shielding',
      ],
      popular: false,
    },
  ];

  return (
    <section id="vault-spaces" className="py-24 bg-[#0a0c10] border-t border-[#1c212c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-[#c5a059] font-medium mb-3">
              <span className="w-5 h-[1px] bg-[#c5a059]" />
              <span>Custodial Infrastructure</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-[#f5f5f7] font-normal tracking-tight text-balance">
              Private Vault Space Reservations
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#9ba1b0] leading-relaxed">
              Every compartment is non-fungible, non-commingled, and strictly segregated under physical title belonging directly to you.
            </p>
          </div>

          {/* Facility Selector */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#6d7588] font-medium mr-1">Select Depository:</span>
            {['Zurich Bedrock', 'London Mayfair', 'Singapore Freeport', 'Geneva SafePort'].map((facility) => (
              <button
                key={facility}
                onClick={() => setSelectedFacility(facility)}
                className={`px-3 py-1.5 rounded-sm border transition-colors ${
                  selectedFacility === facility
                    ? 'border-[#c5a059] bg-[#c5a059]/10 text-[#faebd7]'
                    : 'border-[#262c3a] bg-[#12151c] text-[#8e95a5] hover:border-[#384155]'
                }`}
              >
                {facility}
              </button>
            ))}
          </div>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-sm p-8 flex flex-col justify-between transition-all duration-300 ${
                tier.popular
                  ? 'bg-[#121620] border-2 border-[#c5a059] shadow-2xl shadow-black/80'
                  : 'bg-[#0f1117] border border-[#232733] hover:border-[#384155]'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-8 px-3 py-0.5 text-[11px] font-semibold tracking-wider uppercase text-[#08090b] bg-[#c5a059] rounded-sm">
                  Recommended Depository Standard
                </div>
              )}

              <div>
                <div className="text-xs font-mono text-[#c5a059] mb-2">{tier.rating}</div>
                <h3 className="font-display text-2xl text-[#f5f5f7] mb-2">{tier.name}</h3>
                <p className="text-xs text-[#8e95a5] mb-6 leading-relaxed min-h-[36px]">
                  {tier.tagline}
                </p>

                <div className="p-4 bg-[#090b0f] border border-[#1f2431] rounded-sm mb-6 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#6d7588]">Volume Specs:</span>
                    <span className="font-mono text-[#d1d5e0]">{tier.dimensions}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#6d7588]">Capacity:</span>
                    <span className="text-[#d1d5e0]">{tier.volume}</span>
                  </div>
                  <div className="flex justify-between text-xs pt-1 border-t border-[#1a1e28]">
                    <span className="text-[#6d7588]">Coverage:</span>
                    <span className="text-emerald-400 font-medium">{tier.insuranceIncluded}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-xs text-[#6d7588] block">All-Risk Custodial Retainer</span>
                  <div className="font-display text-2xl text-[#f5f5f7] tracking-tight mt-1">
                    {tier.baseFeeAnnual}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-[#1e2330] mb-8 text-xs text-[#9aa0b0]">
                  {tier.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onSelectTier(`${tier.name} (${selectedFacility})`)}
                className={`w-full py-3.5 text-xs font-semibold tracking-wider uppercase rounded-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  tier.popular
                    ? 'text-[#08090b] bg-gradient-to-r from-[#e6ca85] to-[#c5a059] hover:from-[#faebd7] hover:to-[#dfb95c] shadow-lg shadow-black/40'
                    : 'text-[#f5f5f7] bg-[#1a1f2c] border border-[#2c3242] hover:border-[#c5a059] hover:bg-[#202738]'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Reserve in {selectedFacility}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
