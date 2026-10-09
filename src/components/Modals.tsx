import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, Lock, KeyRound, Sparkles } from 'lucide-react';
import { BULLION_CATALOG } from '../data/mockCustodyData';
import { submitReservation, submitDispatch, submitProcurement } from '../services/api';

interface ReserveModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTier?: string;
}

export const ReserveModal: React.FC<ReserveModalProps> = ({
  isOpen,
  onClose,
  preselectedTier = 'Class II Depository Drawer (Zurich Bedrock)',
}) => {
  const [facility, setFacility] = useState('Zurich Bedrock Depository (Switzerland)');
  const [tier, setTier] = useState(preselectedTier);
  const [assetType, setAssetType] = useState('Gold Bullion & Diamonds');
  const [estValue, setEstValue] = useState('$5,000,000 USD');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [generatedRef, setGeneratedRef] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim()) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await submitReservation({
        facility,
        tier,
        assetType,
        estValue,
        clientName,
        clientEmail,
        clientPhone,
      });

      if (response.success) {
        setGeneratedRef(response.referenceCode);
        setSubmitted(true);
      } else {
        setErrorMessage(response.message || 'Reservation submission failed.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-[#0f121a] border border-[#2b3140] rounded-sm shadow-2xl text-[#f5f5f7] my-auto overflow-hidden">
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 z-20 p-1.5 text-[#737b8d] hover:text-[#f5f5f7] bg-[#141822]/80 hover:bg-[#1a202c] border border-[#262c3a] rounded-sm transition-colors"
          aria-label="Close Modal"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {!submitted ? (
          <div className="flex flex-col h-full min-h-0 overflow-hidden">
            <div className="p-5 sm:p-7 pb-4 border-b border-[#1e2330] pr-12 shrink-0">
              <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#c5a059] font-medium mb-1.5">
                <KeyRound className="w-4 h-4" />
                <span>Private Vault Allocation</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl text-[#f5f5f7]">
                Reserve Depository Space
              </h3>
            </div>

            <div className="p-5 sm:p-7 pt-4 overflow-y-auto flex-1 min-h-0 space-y-4">
              <p className="text-xs text-[#8e95a5] leading-relaxed">
                Initiate a confidential allocation request. A Valtrust Senior Custody Director will coordinate biometric enrollment and safe-hand key delivery.
              </p>

              {errorMessage && (
                <div className="p-3 bg-red-950/40 border border-red-500/50 rounded-sm text-xs text-red-300">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#82899b] mb-1 font-medium">Selected Depository Facility</label>
                  <select
                    value={facility}
                    onChange={(e) => setFacility(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#08090b] border border-[#232733] focus:border-[#c5a059] focus:outline-none rounded-sm text-sm text-[#f5f5f7]"
                  >
                    <option value="Zurich Bedrock Depository (Switzerland)">Zurich Bedrock Depository (Switzerland)</option>
                    <option value="London Mayfair Safe Depository (UK)">London Mayfair Safe Depository (UK)</option>
                    <option value="Singapore Freeport Depository (Singapore)">Singapore Freeport Depository (Singapore)</option>
                    <option value="Geneva SafePort Vault (Switzerland)">Geneva SafePort Vault (Switzerland)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#82899b] mb-1 font-medium">Vault Allocation Tier</label>
                    <select
                      value={tier}
                      onChange={(e) => setTier(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#08090b] border border-[#232733] focus:border-[#c5a059] focus:outline-none rounded-sm text-xs text-[#f5f5f7]"
                    >
                      <option value="Class I Safe Deposit Box">Class I Safe Deposit Box ($3,800/yr)</option>
                      <option value="Class II Depository Drawer">Class II Depository Drawer ($7,900/yr)</option>
                      <option value="Class III Fortress Chamber">Class III Fortress Chamber (Bespoke)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#82899b] mb-1 font-medium">Estimated Insured Specie</label>
                    <select
                      value={estValue}
                      onChange={(e) => setEstValue(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#08090b] border border-[#232733] focus:border-[#c5a059] focus:outline-none rounded-sm text-xs text-[#f5f5f7]"
                    >
                      <option value="$1,000,000 - $3,000,000 USD">$1,000,000 - $3,000,000 USD</option>
                      <option value="$3,000,000 - $10,000,000 USD">$3,000,000 - $10,000,000 USD</option>
                      <option value="$10,000,000 - $50,000,000 USD">$10,000,000 - $50,000,000 USD</option>
                      <option value="$50,000,000+ USD (Sovereign Tier)">$50,000,000+ USD (Sovereign Tier)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#82899b] mb-1 font-medium">Client / Representative Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Lord Alexander Sinclair / Sinclair Family Trust"
                    className="w-full px-3 py-2.5 bg-[#08090b] border border-[#232733] focus:border-[#c5a059] focus:outline-none rounded-sm text-sm text-[#f5f5f7] placeholder:text-[#52596b]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#82899b] mb-1 font-medium">Confidential Email *</label>
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="client@familyoffice.com"
                      className="w-full px-3 py-2.5 bg-[#08090b] border border-[#232733] focus:border-[#c5a059] focus:outline-none rounded-sm text-xs text-[#f5f5f7] placeholder:text-[#52596b]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#82899b] mb-1 font-medium">Encrypted Phone / Signal</label>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+41 22 819 0000"
                      className="w-full px-3 py-2.5 bg-[#08090b] border border-[#232733] focus:border-[#c5a059] focus:outline-none rounded-sm text-xs text-[#f5f5f7] placeholder:text-[#52596b]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1e2330]">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 text-xs font-semibold tracking-wider uppercase text-[#08090b] bg-gradient-to-r from-[#d8b873] to-[#c5a059] hover:from-[#faebd7] hover:to-[#d8b873] disabled:opacity-75 rounded-sm transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-[#08090b] border-t-transparent rounded-full animate-spin" />
                        <span>Transmitting Dossier to Backend API...</span>
                      </>
                    ) : (
                      <span>Submit Confidential Reservation</span>
                    )}
                  </button>
                  <p className="text-[11px] text-[#555d6f] text-center mt-2">
                    Protected by Swiss Bank Secrecy standards and end-to-end zero-knowledge protocols.
                  </p>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 py-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl text-[#f5f5f7]">
              Reservation Dossier Registered
            </h3>
            <p className="text-xs text-[#9aa0b0] max-w-sm mx-auto leading-relaxed">
              Your confidential reservation dossier has been assigned to our Zurich Senior Custody Registrar and logged into the depository backend.
            </p>
            <div className="p-4 bg-[#090b0f] border border-[#232733] rounded-sm max-w-xs mx-auto text-xs space-y-1">
              <span className="text-[#687082] block text-[11px]">Reservation Reference Code:</span>
              <span className="font-mono text-base font-semibold text-[#c5a059] tracking-wider block">
                {generatedRef}
              </span>
              <span className="text-[10px] text-emerald-400 block mt-1">Status: Pending Director Review</span>
            </div>
            <p className="text-[11px] text-[#788194]">
              Custody Director dispatch will confirm to {clientEmail} (contact desk: valtrustsentinelglobal@gmail.com).
            </p>
            <div className="pt-2">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 text-xs font-medium text-[#08090b] bg-[#c5a059] rounded-sm"
              >
                Return to Depository
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface DispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  vaultId?: string;
  onDispatchConfirmed?: (trackingCode: string) => void;
}

export const DispatchModal: React.FC<DispatchModalProps> = ({
  isOpen,
  onClose,
  vaultId = 'VSG-VLT-8842',
  onDispatchConfirmed,
}) => {
  const [destination, setDestination] = useState('');
  const [escortLevel, setEscortLevel] = useState('Level 5 Armed Convoy');
  const [recipientName, setRecipientName] = useState('');
  const [safeHandKey, setSafeHandKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedTracking, setConfirmedTracking] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || !recipientName.trim()) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await submitDispatch({
        vaultId,
        destination,
        escortLevel,
        recipientName,
        safeHandKey,
      });

      if (response.success) {
        setConfirmedTracking(response.trackingNumber);
        if (onDispatchConfirmed) {
          onDispatchConfirmed(response.trackingNumber);
        }
      } else {
        setErrorMessage(response.message || 'Dispatch request failed.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setConfirmedTracking('');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-[#0f121a] border border-[#2b3140] rounded-sm shadow-2xl text-[#f5f5f7] my-auto overflow-hidden">
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 z-20 p-1.5 text-[#737b8d] hover:text-[#f5f5f7] bg-[#141822]/80 hover:bg-[#1a202c] border border-[#262c3a] rounded-sm transition-colors"
          aria-label="Close Modal"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {!confirmedTracking ? (
          <div className="flex flex-col h-full min-h-0 overflow-hidden">
            <div className="p-5 sm:p-7 pb-4 border-b border-[#1e2330] pr-12 shrink-0">
              <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#7aa2f7] font-medium mb-1.5">
                <Truck className="w-4 h-4" />
                <span>Guarded Logistics Protocol</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl text-[#f5f5f7]">
                Schedule Armored Safe-Hand Dispatch
              </h3>
            </div>

            <div className="p-5 sm:p-7 pt-4 overflow-y-auto flex-1 min-h-0 space-y-4">
              <p className="text-xs text-[#8e95a5] leading-relaxed">
                Order physical extraction and guarded transport from vault <span className="font-mono text-[#c5a059]">{vaultId}</span> directly to your designated destination.
              </p>

              {errorMessage && (
                <div className="mb-4 p-3 bg-red-950/40 border border-red-500/50 rounded-sm text-xs text-red-300">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#82899b] mb-1 font-medium">Source Depository Compartment</label>
                  <div className="w-full px-3 py-2 bg-[#08090b] border border-[#232733] rounded-sm font-mono text-sm text-[#c5a059]">
                    {vaultId} (Allocated Segregated Assets)
                  </div>
                </div>

                <div>
                  <label className="block text-[#82899b] mb-1 font-medium">Escort & Carrier Protocol *</label>
                  <select
                    value={escortLevel}
                    onChange={(e) => setEscortLevel(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#08090b] border border-[#232733] focus:border-[#c5a059] focus:outline-none rounded-sm text-xs text-[#f5f5f7]"
                  >
                    <option value="Level 5 Armed Convoy">Level 5 Armed Convoy (B7 Armored Vehicles, Dual Guard Escort)</option>
                    <option value="Guarded Diplomatic Air Courier">Guarded Diplomatic Air Courier (Executive Jet / Airside Tarmac)</option>
                    <option value="Armored Maritime Escort">Armored Maritime Escort (Superyacht Berth / Heli-Handoff)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#82899b] mb-1 font-medium">Delivery Destination Address or Coordinates *</label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Private Residence, Suvretta House, St. Moritz OR Nice Airport FBO"
                    className="w-full px-3 py-2.5 bg-[#08090b] border border-[#232733] focus:border-[#c5a059] focus:outline-none rounded-sm text-sm text-[#f5f5f7] placeholder:text-[#52596b]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#82899b] mb-1 font-medium">Authorized Recipient Name *</label>
                    <input
                      type="text"
                      required
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Full name of signee"
                      className="w-full px-3 py-2.5 bg-[#08090b] border border-[#232733] focus:border-[#c5a059] focus:outline-none rounded-sm text-xs text-[#f5f5f7] placeholder:text-[#52596b]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#82899b] mb-1 font-medium">Safe-Hand Verification Passcode</label>
                    <input
                      type="text"
                      value={safeHandKey}
                      onChange={(e) => setSafeHandKey(e.target.value)}
                      placeholder="e.g. ALPHA-992-SEC"
                      className="w-full px-3 py-2.5 bg-[#08090b] border border-[#232733] focus:border-[#c5a059] focus:outline-none rounded-sm text-xs text-[#f5f5f7] placeholder:text-[#52596b]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1e2330]">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 text-xs font-semibold tracking-wider uppercase text-[#08090b] bg-gradient-to-r from-[#d8b873] to-[#c5a059] hover:from-[#faebd7] hover:to-[#d8b873] disabled:opacity-75 rounded-sm transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-[#08090b] border-t-transparent rounded-full animate-spin" />
                        <span>Scheduling Convoy via API...</span>
                      </>
                    ) : (
                      <span>Confirm & Dispatch Armored Transport</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 py-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/40 text-blue-400 mx-auto flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl text-[#f5f5f7]">
              Armored Transit Dispatched
            </h3>
            <p className="text-xs text-[#9aa0b0] max-w-sm mx-auto leading-relaxed">
              Extraction protocol initiated under dual-biometric signoff. Active tracking waybill registered in backend database.
            </p>
            <div className="p-4 bg-[#090b0f] border border-[#232733] rounded-sm max-w-xs mx-auto text-xs space-y-1">
              <span className="text-[#687082] block text-[11px]">Active Tracking Waybill:</span>
              <span className="font-mono text-base font-semibold text-[#7aa2f7] tracking-wider block">
                {confirmedTracking}
              </span>
              <span className="text-[10px] text-blue-400 block mt-1">Escort Unit Assigned & En Route</span>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 text-xs font-medium text-[#08090b] bg-[#c5a059] rounded-sm"
              >
                Track in Custody Portal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface ProcureModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: (typeof BULLION_CATALOG)[0] | null;
  actionType: 'vault' | 'ship';
}

export const ProcureModal: React.FC<ProcureModalProps> = ({
  isOpen,
  onClose,
  item,
  actionType,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [destAddress, setDestAddress] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim() || !buyerEmail.trim()) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await submitProcurement({
        itemId: item.id,
        title: item.title,
        quantity,
        actionType,
        destAddress,
        buyerName,
        buyerEmail,
      });

      if (response.success) {
        setOrderRef(response.orderRef);
        setCompleted(true);
      } else {
        setErrorMessage(response.message || 'Procurement order failed.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCompleted(false);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-[#0f121a] border border-[#2b3140] rounded-sm shadow-2xl text-[#f5f5f7] my-auto overflow-hidden">
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 z-20 p-1.5 text-[#737b8d] hover:text-[#f5f5f7] bg-[#141822]/80 hover:bg-[#1a202c] border border-[#262c3a] rounded-sm transition-colors"
          aria-label="Close Modal"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {!completed ? (
          <div className="flex flex-col h-full min-h-0 overflow-hidden">
            <div className="p-5 sm:p-7 pb-4 border-b border-[#1e2330] pr-12 shrink-0">
              <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#c5a059] font-medium mb-1.5">
                <Lock className="w-4 h-4" />
                <span>Sovereign Asset Procurement</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl text-[#f5f5f7]">
                Acquisition: {item.title}
              </h3>
            </div>

            <div className="p-5 sm:p-7 pt-4 overflow-y-auto flex-1 min-h-0 space-y-4">
              <p className="text-xs text-[#8e95a5] leading-relaxed">
                {actionType === 'vault'
                  ? 'Item will be directly allocated and stored in your private depository vault.'
                  : 'Item will be dispatched via armored safe-hand courier directly to your address.'}
              </p>

              {errorMessage && (
                <div className="mb-4 p-3 bg-red-950/40 border border-red-500/50 rounded-sm text-xs text-red-300">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="p-3 bg-[#08090b] border border-[#232733] rounded-sm space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#6c7486]">Spot Reference Quotation:</span>
                    <span className="font-mono text-[#f5f5f7] font-semibold">{item.spotReference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6c7486]">Purity & Provenance:</span>
                    <span className="text-[#d1d5e0]">{item.purity} · {item.origin}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#82899b] mb-1 font-medium">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#08090b] border border-[#232733] focus:border-[#c5a059] focus:outline-none rounded-sm text-sm text-[#f5f5f7]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#82899b] mb-1 font-medium">Custodial Mandate</label>
                    <div className="px-3 py-2 bg-[#08090b] border border-[#232733] rounded-sm text-[#c5a059] font-medium">
                      {actionType === 'vault' ? 'Direct Vault Allocation' : 'Armored Doorstep Delivery'}
                    </div>
                  </div>
                </div>

                {actionType === 'ship' && (
                  <div>
                    <label className="block text-[#82899b] mb-1 font-medium">Delivery Destination Address *</label>
                    <input
                      type="text"
                      required
                      value={destAddress}
                      onChange={(e) => setDestAddress(e.target.value)}
                      placeholder="Private Estate, Hotel Villa, or Private Hangar address..."
                      className="w-full px-3 py-2.5 bg-[#08090b] border border-[#232733] focus:border-[#c5a059] focus:outline-none rounded-sm text-sm text-[#f5f5f7]"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#82899b] mb-1 font-medium">Buyer / Entity Name *</label>
                    <input
                      type="text"
                      required
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="Full legal title"
                      className="w-full px-3 py-2.5 bg-[#08090b] border border-[#232733] focus:border-[#c5a059] focus:outline-none rounded-sm text-sm text-[#f5f5f7]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#82899b] mb-1 font-medium">Secure Contact Email *</label>
                    <input
                      type="email"
                      required
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      placeholder="email@domain.com"
                      className="w-full px-3 py-2.5 bg-[#08090b] border border-[#232733] focus:border-[#c5a059] focus:outline-none rounded-sm text-sm text-[#f5f5f7]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1e2330]">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 text-xs font-semibold tracking-wider uppercase text-[#08090b] bg-gradient-to-r from-[#d8b873] to-[#c5a059] hover:from-[#faebd7] hover:to-[#d8b873] disabled:opacity-75 rounded-sm transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-[#08090b] border-t-transparent rounded-full animate-spin" />
                        <span>Locking Order in Depository...</span>
                      </>
                    ) : (
                      <span>Submit Sovereign Procurement Order</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 py-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl text-[#f5f5f7]">
              Procurement Order Received
            </h3>
            <p className="text-xs text-[#9aa0b0] max-w-sm mx-auto leading-relaxed">
              Spot price locked. Your allocated refinery bars/gems will be settled directly with your custody manager.
            </p>
            <div className="p-4 bg-[#090b0f] border border-[#232733] rounded-sm max-w-xs mx-auto text-xs space-y-1">
              <span className="text-[#687082] block text-[11px]">Order Reference:</span>
              <span className="font-mono text-base font-semibold text-[#c5a059] tracking-wider block">
                {orderRef}
              </span>
              <span className="text-[10px] text-emerald-400 block mt-1">Allocation Lock Confirmed</span>
            </div>
            <div className="pt-2">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 text-xs font-medium text-[#08090b] bg-[#c5a059] rounded-sm"
              >
                Close & Return
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
