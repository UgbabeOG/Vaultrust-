import React, { useState } from 'react';
import {
  Search,
  Lock,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  MapPin,
  Fingerprint,
  FileCheck2,
  AlertCircle,
  Package,
} from 'lucide-react';
import {
  VaultRecord,
  ShipmentRecord,
} from '../data/mockCustodyData';
import { searchVaultOrShipment } from '../services/api';
import { keepFinalDestinationLast } from '../utils/shipmentCheckpoints';
import courierDispatchImage from '../assets/images/biometric_courier_dispatch_1791495350897.jpg';

interface VaultSearchTrackerProps {
  onScheduleDispatch: (vaultId: string, preselectedItems?: string[]) => void;
  onRequestSalonVisit: (vaultId: string) => void;
  externalQuery?: string;
}

export const VaultSearchTracker: React.FC<VaultSearchTrackerProps> = ({
  onScheduleDispatch,
  onRequestSalonVisit,
  externalQuery,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeRecord, setActiveRecord] = useState<{
    type: 'vault' | 'shipment' | 'not_found' | 'idle';
    vault?: VaultRecord;
    shipment?: ShipmentRecord;
  }>({ type: 'idle' });

  // Sync externalQuery if passed from dispatch confirmation or admin update
  React.useEffect(() => {
    if (externalQuery) {
      handleSearchById(externalQuery);
    }
  }, [externalQuery]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await searchVaultOrShipment(searchQuery.trim());
      setActiveRecord({
        type: res.type,
        vault: res.vault,
        shipment: res.shipment,
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchById = async (id: string) => {
    setSearchQuery(id);
    setIsSearching(true);
    try {
      const res = await searchVaultOrShipment(id);
      setActiveRecord({
        type: res.type,
        vault: res.vault,
        shipment: res.shipment,
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section id="tracker" className="py-20 lg:py-28 bg-[#0b0d12] border-t border-b border-[#1f2430]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-[#c5a059] font-medium mb-3">
            <span className="w-5 h-[1px] bg-[#c5a059]" />
            <span>Custodial Verification & Dispatch Portal</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[#f5f5f7] font-normal tracking-tight text-balance">
            Inspect Your Allocated Vault or Track an In-Flight Transit
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#9aa0b0] leading-relaxed">
            Enter your private Vault Allocation Code to review stored inventory, insurance underwriters, and tamper seals — or input an Armored Waybill Tracking Number to monitor your guarded shipment in real time.
          </p>
        </div>

        {/* Search Console Input Bar */}
        <div className="bg-[#12151c] border border-[#2b3140] rounded-sm p-3 sm:p-4 mb-6 shadow-xl">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#c5a059]">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Vault Code (e.g. VSG-VLT-8842) or Shipment ID (e.g. TRK-ARM-7729)..."
                className="w-full pl-11 pr-4 py-3 bg-[#08090b] border border-[#262c3a] focus:border-[#c5a059] focus:outline-none rounded-sm text-sm text-[#f5f5f7] font-mono placeholder:text-[#636a7e] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-3 text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#08090b] bg-gradient-to-r from-[#d8b873] to-[#c5a059] hover:from-[#faebd7] hover:to-[#d8b873] disabled:opacity-75 rounded-sm transition-all duration-200 whitespace-nowrap flex items-center justify-center gap-2"
            >
              {isSearching ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-[#08090b] border-t-transparent rounded-full animate-spin" />
                  <span>Verifying API...</span>
                </>
              ) : (
                <span>Verify & Track</span>
              )}
            </button>
          </form>
        </div>

        {/* Dynamic Result Panels */}
        {activeRecord.type === 'vault' && activeRecord.vault && (
          <div className="bg-[#10131a] border border-[#2b3140] rounded-sm overflow-hidden">
            {/* Top Vault Summary Bar */}
            <div className="p-6 sm:p-8 bg-[#141822] border-b border-[#232733] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#9aa0b0]">
                  <span className="font-mono font-medium text-[#c5a059] text-sm">
                    {activeRecord.vault.id}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeRecord.vault.facility}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#56b6c2]">{activeRecord.vault.tier}</span>
                </div>
                <h3 className="font-display text-2xl font-normal text-[#f5f5f7]">
                  Allocated Vault Compartment: {activeRecord.vault.vaultNumber}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#828899]">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {activeRecord.vault.status}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeRecord.vault.securityRating}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeRecord.vault.environmentCondition}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onScheduleDispatch(activeRecord.vault!.id)}
                  className="px-4 py-2.5 text-xs font-semibold tracking-wider uppercase text-[#08090b] bg-gradient-to-r from-[#d8b873] to-[#c5a059] hover:from-[#faebd7] hover:to-[#d8b873] rounded-sm transition-all whitespace-nowrap flex items-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  <span>Request Armored Dispatch</span>
                </button>
                <button
                  onClick={() => onRequestSalonVisit(activeRecord.vault!.id)}
                  className="px-4 py-2.5 text-xs font-medium tracking-wide text-[#f5f5f7] bg-[#1a1f2c] border border-[#2b3140] hover:border-[#c5a059]/40 rounded-sm transition-colors whitespace-nowrap flex items-center gap-2"
                >
                  <Fingerprint className="w-4 h-4 text-[#c5a059]" />
                  <span>Book Private Salon Inspection</span>
                </button>
              </div>
            </div>

            {/* Middle Telemetry & Verification Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#1f2430] border-b border-[#232733] bg-[#0c0e14] text-xs">
              <div className="p-4 sm:p-5">
                <span className="text-[#727a8d] block mb-1">Total Insured Valuation</span>
                <span className="font-mono text-base font-semibold text-[#f5f5f7] tabular-nums">
                  {activeRecord.vault.totalEstimatedValue}
                </span>
                <span className="text-[#8e95a5] block mt-0.5 text-[11px]">
                  {activeRecord.vault.coverageLimit}
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <span className="text-[#727a8d] block mb-1">Underwriter Policy</span>
                <span className="text-sm font-medium text-[#f5f5f7]">
                  {activeRecord.vault.insuranceUnderwriter}
                </span>
                <span className="text-emerald-400 block mt-0.5 text-[11px]">
                  All-Risk Specie Policy Active
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <span className="text-[#727a8d] block mb-1">Last Physical Audit</span>
                <span className="text-xs font-medium text-[#f5f5f7]">
                  {activeRecord.vault.lastPhysicalAudit}
                </span>
                <span className="text-[#8e95a5] block mt-0.5 text-[11px]">
                  Dual-Custodian Witness Signed
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <span className="text-[#727a8d] block mb-1">Biometric Key Enrollment</span>
                <span className="text-sm font-medium text-[#f5f5f7] flex items-center gap-1.5">
                  <Fingerprint className="w-3.5 h-3.5 text-[#c5a059]" />
                  {activeRecord.vault.biometricKeysRegistered} Authorized Keyholders
                </span>
                <span className="text-[#8e95a5] block mt-0.5 text-[11px]">
                  Zero Single-Party Access
                </span>
              </div>
            </div>

            {/* Allocated Items List */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-display text-lg font-normal text-[#f5f5f7]">
                    Allocated Items in Safe Custody ({activeRecord.vault.items.length})
                  </h4>
                  <p className="text-xs text-[#7e8596]">
                    Physical segregation guaranteed. Serialized bars and GIA stones never commingled.
                  </p>
                </div>
                <div className="text-xs font-mono text-[#c5a059]">
                  Physical Title: 100% Client Sovereign
                </div>
              </div>

              <div className="divide-y divide-[#1f2430] border border-[#232733] rounded-sm bg-[#0a0c10]">
                {activeRecord.vault.items.map((item) => (
                  <div key={item.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#12151c]/60 transition-colors">
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-medium text-[#c5a059]">{item.category}</span>
                        {item.certificationNumber && (
                          <>
                            <span className="text-[#454c5e]" aria-hidden="true">·</span>
                            <span className="font-mono text-[#8f96a8]">{item.certificationNumber}</span>
                          </>
                        )}
                        {item.weightOrCarat && (
                          <>
                            <span className="text-[#454c5e]" aria-hidden="true">·</span>
                            <span className="text-[#b1b7c7]">{item.weightOrCarat}</span>
                          </>
                        )}
                      </div>
                      <h5 className="text-sm font-medium text-[#f5f5f7]">{item.name}</h5>
                      <p className="text-xs text-[#808798] leading-relaxed">{item.description}</p>
                    </div>

                    <div className="md:text-right shrink-0 flex flex-col justify-center">
                      <span className="text-[11px] text-[#6d7588]">Estimated Fair Value</span>
                      <span className="font-mono text-sm font-semibold text-[#f5f5f7] tabular-nums">
                        {item.estimatedValue}
                      </span>
                      <span className="text-[10px] text-[#555d6f] mt-0.5">
                        Deposited {item.depositDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Result Panels: Shipment Tracker */}
        {activeRecord.type === 'shipment' && activeRecord.shipment && (
          <div className="bg-[#10131a] border border-[#2b3140] rounded-sm overflow-hidden">
            {/* Top Shipment Bar */}
            <div className="p-6 sm:p-8 bg-[#141822] border-b border-[#232733] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#9aa0b0]">
                  <span className="font-mono font-medium text-[#7aa2f7] text-sm">
                    {activeRecord.shipment.trackingNumber}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#c5a059] font-medium">{activeRecord.shipment.courierLevel}</span>
                  <span aria-hidden="true">·</span>
                  <span>Linked Vault: {activeRecord.shipment.vaultOriginId}</span>
                </div>
                <h3 className="font-display text-2xl font-normal text-[#f5f5f7]">
                  {activeRecord.shipment.manifestDescription}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#828899]">
                  <span className="flex items-center gap-1.5 text-blue-400 font-medium">
                    <Truck className="w-3.5 h-3.5" />
                    Status: {activeRecord.shipment.transitStatus}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Est. Handover: {activeRecord.shipment.estimatedDelivery}</span>
                </div>
                <div className="flex items-start gap-2 pt-1 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#727a8d] block text-[11px]">Delivery Destination</span>
                    <span className="text-sm font-medium text-[#f5f5f7]">
                      {activeRecord.shipment.destination}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="px-3.5 py-2 rounded-sm bg-[#0a0c10] border border-[#262c3a] text-xs">
                  <span className="text-[#727a8d] block text-[10px]">Escort Callsign</span>
                  <span className="font-mono font-medium text-[#f5f5f7]">
                    {activeRecord.shipment.securityTeamCallsign}
                  </span>
                </div>
                <div className="px-3.5 py-2 rounded-sm bg-[#0a0c10] border border-[#262c3a] text-xs">
                  <span className="text-[#727a8d] block text-[10px]">Lead Custodian</span>
                  <span className="font-medium text-[#f5f5f7]">
                    {activeRecord.shipment.leadCourier}
                  </span>
                </div>
              </div>
            </div>

            {/* Route Summary */}
            <div className="grid grid-cols-1 border-b border-[#232733] bg-[#0c0e14] text-xs">
              <div className="p-4 sm:p-5 flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#727a8d] block text-[11px]">Origin Depository Facility</span>
                  <span className="text-sm font-medium text-[#f5f5f7]">
                    {activeRecord.shipment.originFacility}
                  </span>
                </div>
              </div>
            </div>

            {/* Checkpoint Timeline & Visual Courier Escort Section */}
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Armored Courier Photographic Card */}
                <div className="lg:col-span-5 rounded-sm overflow-hidden border border-[#232733] bg-[#090b0f]">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={courierDispatchImage}
                      alt="Armed courier loading biometric GPS-tracked titanium case into armored vehicle"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center brightness-[0.88] contrast-[1.05]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090b0f] via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-3 left-3 right-3 text-xs">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#7aa2f7] block">
                        Chain of Custody Protocol
                      </span>
                      <span className="font-semibold text-[#f5f5f7] text-xs block">
                        Dual-Biometric Sealed Titanium Case
                      </span>
                    </div>
                  </div>
                  <div className="p-4 space-y-2 text-xs border-t border-[#1a1e28]">
                    <div className="flex justify-between text-[#828899]">
                      <span>Convoy Unit:</span>
                      <span className="font-mono text-[#f5f5f7]">{activeRecord.shipment.securityTeamCallsign}</span>
                    </div>
                    <div className="flex justify-between text-[#828899]">
                      <span>Lead Custodian:</span>
                      <span className="text-[#f5f5f7]">{activeRecord.shipment.leadCourier}</span>
                    </div>
                    <div className="flex justify-between text-[#828899] pt-1 border-t border-[#161a24]">
                      <span>Biometric Seals:</span>
                      <span className="text-emerald-400 font-medium">100% Cryptographic Lock Intact</span>
                    </div>
                  </div>
                </div>

                {/* Right: Checkpoint Timeline */}
                <div className="lg:col-span-7">
                  <h4 className="font-display text-lg font-normal text-[#f5f5f7] mb-6">
                    Chain of Custody & Real-Time Checkpoints
                  </h4>

                  <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-[11px] sm:before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#202533]">
                    {keepFinalDestinationLast(
                      activeRecord.shipment.checkpoints,
                      activeRecord.shipment.destination,
                    ).map((checkpoint, idx) => (
                      <div key={idx} className="relative">
                        {/* Stepper Dot */}
                        <div
                          className={`absolute -left-[23px] sm:-left-[27px] top-1 w-6 h-6 rounded-full flex items-center justify-center ${
                            checkpoint.completed
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                              : checkpoint === activeRecord.shipment!.checkpoints.find((c) => !c.completed)
                              ? 'bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059] animate-pulse'
                              : 'bg-[#151922] text-[#4d5467] border border-[#262c3a]'
                          }`}
                        >
                          {checkpoint.completed ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <Clock className="w-3.5 h-3.5" />
                          )}
                        </div>

                        {/* Step details */}
                        <div className="bg-[#0a0c10] border border-[#232733] p-4 rounded-sm">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                            <span className="font-medium text-sm text-[#f5f5f7]">
                              {checkpoint.status}
                            </span>
                            <span className="font-mono text-xs text-[#828899]">
                              {checkpoint.time}
                            </span>
                          </div>
                          <p className="text-xs text-[#a0a6b7] flex items-center gap-1.5 mb-1">
                            <MapPin className="w-3 h-3 text-[#c5a059]" />
                            <span>{checkpoint.location}</span>
                          </p>
                          {checkpoint.notes && (
                            <p className="text-xs text-[#6e7587] mt-1.5 pt-1.5 border-t border-[#181c26]">
                              {checkpoint.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Idle State: Awaiting Client Query */}
        {activeRecord.type === 'idle' && (
          <div className="bg-[#10131a] border border-[#232733] rounded-sm p-8 sm:p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-[#181d28] border border-[#c5a059]/30 text-[#c5a059] mx-auto mb-4 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-display text-xl sm:text-2xl text-[#f5f5f7] mb-2">
              Awaiting Custodial Identifier
            </h3>
            <p className="text-sm text-[#8f96a8] max-w-lg mx-auto mb-6 leading-relaxed">
              Input your unique Vault Allocation Code or Armored Waybill Tracking Number into the console above to inspect physical assets, tamper seals, and encrypted satellite transit telemetry.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left text-xs">
              <div className="p-4 bg-[#090b0f] border border-[#1e2330] rounded-sm space-y-1">
                <div className="flex items-center gap-2 text-[#c5a059] font-medium">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Vault Allocation Format</span>
                </div>
                <p className="font-mono text-[#d1d5e0]">VSG-VLT-XXXX</p>
                <p className="text-[11px] text-[#6d7588]">
                  Enables real-time review of segregated bullion, certified diamonds, and Lloyd's specie policies.
                </p>
              </div>
              <div className="p-4 bg-[#090b0f] border border-[#1e2330] rounded-sm space-y-1">
                <div className="flex items-center gap-2 text-[#7aa2f7] font-medium">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Transit Waybill Format</span>
                </div>
                <p className="font-mono text-[#d1d5e0]">TRK-ARM-XXXX</p>
                <p className="text-[11px] text-[#6d7588]">
                  Streams live waypoints, escort security callsigns, and safe-hand courier arrival windows.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Not Found state */}
        {activeRecord.type === 'not_found' && (
          <div className="bg-[#12151c] border border-[#2b3140] rounded-sm p-8 text-center">
            <AlertCircle className="w-8 h-8 text-[#c5a059] mx-auto mb-3" />
            <h3 className="font-display text-xl text-[#f5f5f7] mb-2">
              No Depository Record Found
            </h3>
            <p className="text-sm text-[#8f96a8] max-w-md mx-auto mb-4">
              Please verify the Vault Code or Armored Waybill number provided by your Valtrust private banker or custody director.
            </p>
            <p className="text-xs text-[#6e7587]">
              Format: <span className="font-mono text-[#c5a059]">VSG-VLT-XXXX</span> for vaults · <span className="font-mono text-[#7aa2f7]">TRK-ARM-XXXX</span> for transit shipments
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
