import React from 'react';
import { Shield, Lock, MapPin, Phone, Mail } from 'lucide-react';

interface FooterProps {
  onOpenSearch: () => void;
  onOpenReserve: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSearch, onOpenReserve }) => {
  return (
    <footer className="bg-[#060709] border-t border-[#181b24] text-[#8e95a5] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#181b24]">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm border border-[#c5a059]/40 bg-[#12151c] flex items-center justify-center text-[#c5a059]">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-display text-base font-semibold tracking-wider text-[#f5f5f7]">
                VALTRUST SENTINEL GLOBAL
              </span>
            </div>
            <p className="text-xs text-[#808798] max-w-sm leading-relaxed">
              Private sovereign security, subterranean Class XIII vault depository services, allocated bullion & diamond procurement, and armed safe-hand logistics for ultra-high-net-worth clients worldwide.
            </p>
            <div className="pt-2 text-[11px] text-[#636b7e] space-y-1">
              <div>Depository Operations: Zurich · London · Singapore · Geneva</div>
              <div>Primary Specie Underwriters: Lloyd's of London Syndicates</div>
            </div>
          </div>

          {/* Custodial Links */}
          <div className="space-y-3">
            <h4 className="font-display text-xs tracking-wider uppercase text-[#f5f5f7] font-semibold">
              Custody Vaults
            </h4>
            <ul className="space-y-2 text-[#808798]">
              <li>
                <a href="#vault-spaces" className="hover:text-[#faebd7] transition-colors">
                  Class I Safe Deposit Boxes
                </a>
              </li>
              <li>
                <a href="#vault-spaces" className="hover:text-[#faebd7] transition-colors">
                  Class II Bullion Drawers
                </a>
              </li>
              <li>
                <a href="#vault-spaces" className="hover:text-[#faebd7] transition-colors">
                  Class III Fortress Chambers
                </a>
              </li>
              <li>
                <a href="#sanctuary" className="hover:text-[#faebd7] transition-colors">
                  Private Inspection Salons
                </a>
              </li>
              <li>
                <button onClick={onOpenReserve} className="hover:text-[#c5a059] transition-colors text-left">
                  Reserve Space
                </button>
              </li>
            </ul>
          </div>

          {/* Procurement & Logistics */}
          <div className="space-y-3">
            <h4 className="font-display text-xs tracking-wider uppercase text-[#f5f5f7] font-semibold">
              Wares & Transit
            </h4>
            <ul className="space-y-2 text-[#808798]">
              <li>
                <a href="#procurement" className="hover:text-[#faebd7] transition-colors">
                  1kg Gold Bullion Bars
                </a>
              </li>
              <li>
                <a href="#procurement" className="hover:text-[#faebd7] transition-colors">
                  Investment-Grade Diamonds
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#faebd7] transition-colors">
                  Level 5 Armored Convoys
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#faebd7] transition-colors">
                  Guarded Diplomatic Air Couriers
                </a>
              </li>
              <li>
                <button onClick={onOpenSearch} className="hover:text-[#c5a059] transition-colors text-left">
                  Custody & Shipment Tracker
                </button>
              </li>
            </ul>
          </div>

          {/* Secure Contact */}
          <div className="space-y-3">
            <h4 className="font-display text-xs tracking-wider uppercase text-[#f5f5f7] font-semibold">
              Direct Contact
            </h4>
            <div className="space-y-2 text-[#808798]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                <span>Bahnhofstrasse 45, 8001 Zurich</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                <span>+41 22 819 9000 (24/7 Desk)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                <span>custody@valtrustsentinel.com</span>
              </div>
              <div className="text-[11px] text-[#555d6e] pt-1">
                PGP Fingerprint: 4F92 B710 E83A 9C01
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#5a6274]">
          <div>
            © {new Date().getFullYear()} Valtrust Sentinel Global AG. All rights reserved. Registered private security depository.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#9aa0b0] transition-colors">
              Jurisdictional Secrecy
            </a>
            <a href="#" className="hover:text-[#9aa0b0] transition-colors">
              Lloyd's All-Risk Specie Policy
            </a>
            <a href="#" className="hover:text-[#9aa0b0] transition-colors">
              Chain-of-Custody Protocols
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
