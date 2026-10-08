import React from 'react';
import salonImage from '../assets/images/private_viewing_salons_1791484243383.jpg';
import { ShieldCheck, Eye, KeyRound, Sparkles, UserCheck, Calendar } from 'lucide-react';

interface PrivateSalonExperienceProps {
  onBookSalon: () => void;
}

export const PrivateSalonExperience: React.FC<PrivateSalonExperienceProps> = ({ onBookSalon }) => {
  return (
    <section id="sanctuary" className="py-24 bg-[#0a0c10] border-t border-[#1c212c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Image Asset */}
          <div className="lg:col-span-7">
            <div className="relative rounded-sm overflow-hidden border border-[#262c3a] group bg-[#0e1117]">
              <img
                src={salonImage}
                alt="Executive private inspection salon inside Swiss vault depository with fluted walnut paneling and titanium safe lockers"
                referrerPolicy="no-referrer"
                className="w-full h-80 sm:h-[460px] object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-[0.9]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08090b]/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#d1d5e0] gap-2">
                <span>Zurich Bedrock Depository · Private Client Salon IV</span>
                <span className="font-mono text-[#c5a059]">Faraday-Shielded · Sovereign Privacy</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial & Values */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-[#c5a059] font-medium">
              <span className="w-5 h-[1px] bg-[#c5a059]" />
              <span>Inspection Protocol</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl text-[#f5f5f7] font-normal leading-tight text-balance">
              Private Viewing Salons & Sovereign Client Suites
            </h2>

            <p className="text-sm sm:text-base text-[#9ba1b0] leading-relaxed">
              When you wish to physically inspect, appraise, or exhibit your holdings, enter our sound-dampened, Faraday-shielded inspection salons. Safe-hand extraction is performed in your presence under dual-custodian protocols.
            </p>

            <div className="space-y-4 pt-2 text-xs text-[#8f96a8]">
              <div className="flex items-start gap-3">
                <UserCheck className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-[#f5f5f7] block">Unaccompanied Private Access</span>
                  <span>Once the vault seal is broken under your biometric verification, the salon is entirely yours. Zero surveillance cameras inside the private client inspection room.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Eye className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-[#f5f5f7] block">Certified Gemological & Assay Laboratory</span>
                  <span>Access calibrated digital balances, spectrographic gold assayers, and gemological light boxes at your table.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-[#f5f5f7] block">24/7 Access by Appointment</span>
                  <span>Emergency physical access available within two hours notice, day or night, 365 days a year.</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onBookSalon}
                className="px-6 py-3 text-xs font-semibold tracking-wider uppercase text-[#08090b] bg-gradient-to-r from-[#d8b873] to-[#c5a059] hover:from-[#faebd7] hover:to-[#d8b873] rounded-sm transition-all"
              >
                Schedule Private Salon Inspection
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
