import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  KeyRound,
  Eye,
  Truck,
  Sparkles,
  Maximize2,
  Lock,
  Pause,
  Play,
} from 'lucide-react';

import heroVault from '../assets/images/hero_vault_sanctuary_1791484214053.jpg';
import biometricsImg from '../assets/images/vault_laser_biometrics_1791493303684.jpg';
import diamondLabImg from '../assets/images/diamond_appraisal_lab_1791493313402.jpg';
import bullionImg from '../assets/images/bullion_diamonds_display_1791484224660.jpg';
import goldStrongroomImg from '../assets/images/gold_ingots_strongroom_1791493334753.jpg';
import armoredFleetImg from '../assets/images/armored_maybach_fleet_1791493325585.jpg';
import airsideImg from '../assets/images/armored_transit_convoy_1791484234372.jpg';
import salonImg from '../assets/images/private_viewing_salons_1791484243383.jpg';

interface DepositorySlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  location: string;
  clearance: string;
  description: string;
  actionLabel: string;
  actionType: 'reserve' | 'salon' | 'dispatch' | 'procure';
}

const SLIDES: DepositorySlide[] = [
  {
    id: 'slide-1',
    image: heroVault,
    title: 'Subterranean Bedrock Vault Core',
    subtitle: 'EN 1143-1 Grade XIII Rotary Steel Fortress',
    location: 'Zurich Bedrock Depository — Sub-Level 4',
    clearance: 'Sovereign Grade · Class XIII Armor',
    description: 'Anchored 40 meters below granite bedrock. Featuring a 22-tonne rotary steel blast door, seismic vibration detectors, and continuous dual-custodian cryptographic locks.',
    actionLabel: 'Reserve Vault Space',
    actionType: 'reserve',
  },
  {
    id: 'slide-2',
    image: biometricsImg,
    title: 'Biometric Retina & Interlock Chambers',
    subtitle: 'Zero Single-Party Override Architecture',
    location: 'Geneva SafePort Interlock Facility',
    clearance: 'Biometric Iris & Multisig Protocol',
    description: 'Entry requires simultaneous biometric iris verification and physical dual-key insertion by the client and the senior custody director. No master override exists.',
    actionLabel: 'Schedule Private Inspection',
    actionType: 'salon',
  },
  {
    id: 'slide-3',
    image: goldStrongroomImg,
    title: 'Sovereign Gold Ingot Strongroom',
    subtitle: 'Central Bank Grade Specie Custody',
    location: 'London Mayfair Depository — Strongroom Suite Alpha',
    clearance: 'LBMA Accredited · 100% Lloyd’s Insured',
    description: 'Individually segregated London Good Delivery 400 oz gold bars and serialized bullion ingots. Zero fractional reserve pooling; pure physical non-fungible bailment.',
    actionLabel: 'Procure Physical Bullion',
    actionType: 'procure',
  },
  {
    id: 'slide-4',
    image: diamondLabImg,
    title: 'Swiss Gemological & Diamond Assay Laboratory',
    subtitle: 'Microscopic & Spectrometric Certification',
    location: 'Zurich Depository Gemological Suite',
    clearance: 'GIA & SSEF Verified Standards',
    description: 'In-house gemological laboratory equipped with Raman spectrometry and calibrated optical balances to verify stone provenance, fluorescence, and Type IIa purity.',
    actionLabel: 'View Investment Diamonds',
    actionType: 'procure',
  },
  {
    id: 'slide-5',
    image: bullionImg,
    title: 'Allocated Specie & Heirloom Deposit Trays',
    subtitle: 'Nitrogen-Enriched Climate Preservation',
    location: 'Singapore Freeport Depository — Vault Delta',
    clearance: 'Monetary Authority Standard',
    description: 'Velvet-lined individual security trays for investment diamonds, fine horology, and precious bullion sealed inside tamper-evident Faraday cases.',
    actionLabel: 'Inspect Allocated Vault',
    actionType: 'reserve',
  },
  {
    id: 'slide-6',
    image: armoredFleetImg,
    title: 'Executive Armored Transport Fleet',
    subtitle: 'Level B7 Ballistic Armored Protection',
    location: 'Zurich Depository Sally Port & Fleet Headquarters',
    clearance: 'Level 5 Armed Convoy Detachment',
    description: 'Discreet ballistic armored SUVs and sedans equipped with encrypted satellite telemetry, run-flat systems, and licensed executive protection officers.',
    actionLabel: 'Request Armored Convoy',
    actionType: 'dispatch',
  },
  {
    id: 'slide-7',
    image: airsideImg,
    title: 'Guarded Diplomatic Airside Transport',
    subtitle: 'Safe-Hand Tarmac Jet Courier Transit',
    location: 'International Executive Aviation Aprons',
    clearance: 'Diplomatic Safe-Hand Protocol',
    description: 'Direct tarmac transfer to private aircraft with armed courier escorts, international customs clearances, and safe-hand delivery to estates or superyachts.',
    actionLabel: 'Schedule Air Courier Dispatch',
    actionType: 'dispatch',
  },
  {
    id: 'slide-8',
    image: salonImg,
    title: 'Faraday-Shielded Private Viewing Salons',
    subtitle: 'Absolute Privacy & Zero Camera Surveillance',
    location: 'Swiss Private Client Depository Salons',
    clearance: 'Unaccompanied Sovereign Privacy',
    description: 'Sound-dampened private suites with fluted walnut paneling and leather seating. Once the custodian unseals the deposit, the room is entirely unmonitored.',
    actionLabel: 'Book Salon Inspection',
    actionType: 'salon',
  },
];

interface DepositoryCarouselProps {
  onReserve: () => void;
  onSalon: () => void;
  onDispatch: () => void;
  onProcure: () => void;
}

export const DepositoryCarousel: React.FC<DepositoryCarouselProps> = ({
  onReserve,
  onSalon,
  onDispatch,
  onProcure,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = SLIDES.length;
  const currentSlide = SLIDES[currentIndex];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    if (isPlaying) {
      timeoutRef.current = setTimeout(() => {
        nextSlide();
      }, 6000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, isPlaying]);

  const handleAction = (type: DepositorySlide['actionType']) => {
    if (type === 'reserve') onReserve();
    else if (type === 'salon') onSalon();
    else if (type === 'dispatch') onDispatch();
    else if (type === 'procure') onProcure();
  };

  return (
    <section className="py-24 bg-[#07080b] border-t border-b border-[#1c212c] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-[#c5a059] font-medium mb-3">
              <span className="w-5 h-[1px] bg-[#c5a059]" />
              <span>Depository & Operations Gallery</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-[#f5f5f7] font-normal tracking-tight text-balance">
              Inside Our Sovereign Depository Facilities
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#9aa0b0] leading-relaxed">
              Explore our subterranean bedrock vaults, biometric interlock chambers, private gemological laboratories, and armored transit detachments across Zurich, London, Singapore, and Geneva.
            </p>
          </div>

          {/* Autoplay toggle & Index Indicator */}
          <div className="flex items-center gap-4 text-xs text-[#8e95a5]">
            <span className="font-mono text-sm font-medium text-[#f5f5f7] tabular-nums">
              0{currentIndex + 1} <span className="text-[#555d6f]">/</span> 0{totalSlides}
            </span>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-sm bg-[#12151c] border border-[#232733] hover:border-[#c5a059]/40 text-[#9aa0b0] hover:text-[#f5f5f7] transition-colors flex items-center gap-1.5"
              aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="text-[11px]">{isPlaying ? 'Auto' : 'Paused'}</span>
            </button>
            <div className="flex items-center gap-1.5">
              <button
                onClick={prevSlide}
                aria-label="Previous facility photo"
                className="p-2.5 rounded-sm bg-[#12151c] border border-[#232733] hover:border-[#c5a059] text-[#f5f5f7] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next facility photo"
                className="p-2.5 rounded-sm bg-[#12151c] border border-[#232733] hover:border-[#c5a059] text-[#f5f5f7] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Marquee Carousel Stage */}
        <div
          className="relative bg-[#0d0f15] border border-[#262c3a] rounded-sm overflow-hidden shadow-2xl"
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
        >
          {/* Main Visual Display */}
          <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden bg-black">
            <img
              key={currentSlide.id}
              src={currentSlide.image}
              alt={currentSlide.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center brightness-[0.72] contrast-[1.05] transition-all duration-700 ease-out animate-fade-in"
            />

            {/* Gradient Scrims */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-[#08090b]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#08090b]/90 via-[#08090b]/40 to-transparent" />

            {/* Content Overlay */}
            <div className="absolute inset-0 p-6 sm:p-10 lg:p-14 flex flex-col justify-end">
              <div className="max-w-2xl space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#b8bdca]">
                  <span className="font-mono text-[#c5a059] font-medium">{currentSlide.location}</span>
                  <span aria-hidden="true" className="text-[#555d6f]">·</span>
                  <span className="text-[#7aa2f7]">{currentSlide.clearance}</span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#f5f5f7] font-normal tracking-tight">
                  {currentSlide.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#ccd1dd] leading-relaxed line-clamp-3 max-w-xl">
                  {currentSlide.description}
                </p>

                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleAction(currentSlide.actionType)}
                    className="px-5 py-2.5 text-xs font-semibold tracking-wider uppercase text-[#08090b] bg-gradient-to-r from-[#d8b873] to-[#c5a059] hover:from-[#faebd7] hover:to-[#d8b873] rounded-sm transition-all whitespace-nowrap shadow-md"
                  >
                    {currentSlide.actionLabel}
                  </button>
                  <a
                    href="mailto:valtrustsentinelglobal@gmail.com"
                    className="px-4 py-2.5 text-xs font-medium text-[#f5f5f7] bg-[#12151c]/80 border border-[#2b3140] hover:border-[#c5a059]/50 rounded-sm transition-colors whitespace-nowrap"
                  >
                    Inquire via Email
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Thumbnail Strip */}
          <div className="p-3 bg-[#0a0c10] border-t border-[#1f2430] grid grid-cols-4 sm:grid-cols-8 gap-2">
            {SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(idx)}
                className={`group relative aspect-[16/10] rounded-sm overflow-hidden border transition-all duration-200 ${
                  currentIndex === idx
                    ? 'border-[#c5a059] ring-1 ring-[#c5a059]/50 opacity-100 scale-100'
                    : 'border-[#202533] opacity-50 hover:opacity-90 scale-95'
                }`}
                aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                <span className="absolute bottom-1 right-1 text-[9px] font-mono text-white bg-black/70 px-1 py-0.2 rounded-xs">
                  0{idx + 1}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Trust Badges Below Carousel */}
        <div className="mt-8 pt-6 border-t border-[#1c212c] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[#828899]">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#c5a059] shrink-0" />
            <span>Zurich & London Underground Depository Access</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#c5a059] shrink-0" />
            <span>Dual-Biometric Sovereign Key Separation</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#c5a059] shrink-0" />
            <span>Level B7 Armored Convoy & Jet Airside Escorts</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#c5a059] shrink-0" />
            <span>Confidential Faraday Appraisal Salons</span>
          </div>
        </div>
      </div>
    </section>
  );
};
