import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  KeyRound,
  Lock,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Package,
  Layers,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  FileCheck2,
  ArrowRight,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { VaultRecord, ShipmentRecord, AllocatedItem } from '../data/mockCustodyData';
import {
  adminGetVaults,
  adminCreateVault,
  adminUpdateVault,
  adminDeleteVault,
  adminAddItemToVault,
  adminDeleteItemFromVault,
  adminGetShipments,
  adminCreateShipment,
  adminUpdateShipment,
  adminAddShipmentCheckpoint,
  adminDeleteShipment,
  adminGetReservations,
  adminUpdateReservation,
  adminDeleteReservation,
} from '../services/api';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onVaultOrShipmentUpdated?: (id: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  onVaultOrShipmentUpdated,
}) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Active view tab
  const [activeTab, setActiveTab] = useState<'vaults' | 'shipments' | 'reservations'>('vaults');

  // Help & Documentation Modal
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Data states
  const [vaults, setVaults] = useState<VaultRecord[]>([]);
  const [shipments, setShipments] = useState<ShipmentRecord[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // In-app deletion confirmation state (replaces window.confirm which is blocked inside iframes)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: 'vault' | 'shipment' | 'reservation';
    id: string;
    title: string;
    description: string;
    sublabel?: string;
    confirmButtonText: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modals for CRUD operations
  const [isCreateVaultOpen, setIsCreateVaultOpen] = useState(false);
  const [editingVault, setEditingVault] = useState<VaultRecord | null>(null);
  const [managingItemsVault, setManagingItemsVault] = useState<VaultRecord | null>(null);

  const [isCreateShipmentOpen, setIsCreateShipmentOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState<ShipmentRecord | null>(null);
  const [checkpointShipment, setCheckpointShipment] = useState<ShipmentRecord | null>(null);

  // Fetch all administrative datasets
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [vRes, sRes, rRes] = await Promise.all([
        adminGetVaults(),
        adminGetShipments(),
        adminGetReservations(),
      ]);
      if (vRes.success) setVaults(vRes.vaults);
      if (sRes.success) setShipments(sRes.shipments);
      if (rRes.success) setReservations(rRes.reservations);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadData();
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passcode === 'sentinel2026' || passcode === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
      loadData();
    } else {
      setAuthError('Invalid Registrar Master Key. (Default: sentinel2026)');
    }
  };

  // --- VAULT CRUD HANDLERS ---
  const handleDeleteVault = (id: string, sublabel?: string) => {
    const v = vaults.find((vault) => vault.id === id);
    setDeleteConfirmation({
      type: 'vault',
      id,
      title: 'Confirm Depository De-allocation',
      description: `Are you sure you want to de-allocate and unseal vault ${id}? This will remove the compartment and its asset allocation from the active depository registry.`,
      sublabel: sublabel || (v ? `${v.facility} · ${v.tier} · ${v.totalEstimatedValue}` : undefined),
      confirmButtonText: 'De-allocate Vault',
    });
  };

  // --- SHIPMENT CRUD HANDLERS ---
  const handleDeleteShipment = (id: string, sublabel?: string) => {
    const s = shipments.find((ship) => ship.id === id || ship.trackingNumber === id);
    setDeleteConfirmation({
      type: 'shipment',
      id,
      title: 'Confirm Transit Record Deletion',
      description: `Are you sure you want to delete shipment ${id} from transit tracking? Active telemetry and waypoint logs will be permanently removed.`,
      sublabel: sublabel || (s ? `${s.trackingNumber} · ${s.courierLevel} · ${s.destination}` : undefined),
      confirmButtonText: 'Delete Shipment',
    });
  };

  const handleUpdateShipmentStatus = async (id: string, newStatus: string) => {
    const res = await adminUpdateShipment(id, { transitStatus: newStatus });
    if (res.success && res.shipment) {
      setShipments((prev) => prev.map((s) => (s.id === id ? res.shipment! : s)));
      showFeedback(`Shipment ${id} status advanced to: ${newStatus}`);
      if (onVaultOrShipmentUpdated) onVaultOrShipmentUpdated(id);
    }
  };

  // --- RESERVATION CRUD HANDLERS ---
  const handleUpdateReservationStatus = async (id: string, status: string) => {
    const res = await adminUpdateReservation(id, status);
    if (res.success) {
      setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      showFeedback(`Reservation ${id} updated.`);
    }
  };

  const handleDeleteReservation = (id: string, sublabel?: string) => {
    const r = reservations.find((res) => res.id === id);
    setDeleteConfirmation({
      type: 'reservation',
      id,
      title: 'Archive Client Dossier',
      description: `Are you sure you want to archive reservation ${id}?`,
      sublabel: sublabel || (r ? `${r.clientName} · ${r.facility} · ${r.status}` : undefined),
      confirmButtonText: 'Archive Reservation',
    });
  };

  // Execute confirmed deletion via API
  const executeConfirmedDelete = async () => {
    if (!deleteConfirmation) return;
    setIsDeleting(true);
    const { type, id } = deleteConfirmation;

    try {
      if (type === 'vault') {
        const res = await adminDeleteVault(id);
        if (res.success) {
          setVaults((prev) => prev.filter((v) => v.id !== id));
          if (editingVault?.id === id) setEditingVault(null);
          if (managingItemsVault?.id === id) setManagingItemsVault(null);
          showFeedback(`Vault ${id} successfully de-allocated.`);
        } else {
          showFeedback(res.error || 'Failed to delete vault', 'error');
        }
      } else if (type === 'shipment') {
        const res = await adminDeleteShipment(id);
        if (res.success) {
          setShipments((prev) => prev.filter((s) => s.id !== id && s.trackingNumber !== id));
          if (editingShipment?.id === id) setEditingShipment(null);
          if (checkpointShipment?.id === id) setCheckpointShipment(null);
          showFeedback(`Shipment ${id} archived.`);
        } else {
          showFeedback(res.error || 'Failed to delete shipment', 'error');
        }
      } else if (type === 'reservation') {
        const res = await adminDeleteReservation(id);
        if (res.success) {
          setReservations((prev) => prev.filter((r) => r.id !== id));
          showFeedback(`Reservation ${id} removed.`);
        } else {
          showFeedback(res.error || 'Failed to delete reservation', 'error');
        }
      }
    } catch (err: any) {
      showFeedback(err?.message || 'Error executing deletion', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmation(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className={`relative w-full max-w-6xl ${isAuthenticated ? 'h-[90vh]' : 'max-h-[92vh]'} max-h-[92vh] my-auto bg-[#0c0e14] border border-[#2b3140] rounded-sm shadow-2xl flex flex-col text-[#f5f5f7] overflow-hidden`}>
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-4 bg-[#12151e] border-b border-[#232733] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-[#1a1f2c] border border-[#c5a059]/50 flex items-center justify-center text-[#c5a059] shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-display text-xs sm:text-sm tracking-wider uppercase font-semibold text-[#f5f5f7] block">
                Valtrust Sentinel — Registrar Command Portal
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#8e95a5]">
                Depository Management & Sovereign CRUD Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {isAuthenticated && (
              <>
                <button
                  onClick={() => setIsGuideOpen(true)}
                  className="px-2.5 py-1.5 rounded-sm bg-[#1a1f2c] border border-[#2b3140] hover:border-[#c5a059]/40 text-[#c5a059] text-xs flex items-center gap-1.5 transition-colors"
                  title="CRUD Operations Guide"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px] font-medium">CRUD Guide</span>
                </button>
                <button
                  onClick={loadData}
                  disabled={isLoading}
                  className="p-1.5 rounded-sm bg-[#1a1f2c] border border-[#2b3140] hover:border-[#c5a059]/40 text-[#9aa0b0] hover:text-[#f5f5f7] text-xs flex items-center gap-1.5 transition-colors"
                  title="Refresh Depository Data"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#c5a059]' : ''}`} />
                  <span className="hidden sm:inline text-[11px]">Sync</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-[#737b8d] hover:text-[#f5f5f7] transition-colors"
              aria-label="Close Admin Portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Alert Toast */}
        {feedbackMsg && (
          <div
            className={`px-4 sm:px-6 py-2.5 text-xs flex items-center justify-between shrink-0 ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-950/80 border-b border-emerald-500/50 text-emerald-300'
                : 'bg-red-950/80 border-b border-red-500/50 text-red-300'
            }`}
          >
            <span>{feedbackMsg.text}</span>
            <button onClick={() => setFeedbackMsg(null)} className="text-xs hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* AUTHENTICATION GATE */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-14 flex flex-col items-center justify-center text-center max-w-md mx-auto overflow-y-auto my-auto max-h-[calc(92vh-80px)]">
            <div className="w-14 h-14 rounded-full bg-[#161a24] border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] mb-4">
              <KeyRound className="w-7 h-7" />
            </div>
            <h3 className="font-display text-2xl text-[#f5f5f7] mb-2">
              Registrar Authorization Required
            </h3>
            <p className="text-xs text-[#8e95a5] mb-6 leading-relaxed">
              Enter the master custody passkey to execute administrative CRUD operations across the sovereign database.
            </p>

            {authError && (
              <div className="w-full mb-4 p-2.5 bg-red-950/40 border border-red-500/50 rounded-sm text-xs text-red-300">
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="w-full space-y-3">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter Registrar Master Key..."
                className="w-full px-3.5 py-2.5 bg-[#08090b] border border-[#2b3140] focus:border-[#c5a059] focus:outline-none rounded-sm text-sm text-[#f5f5f7] font-mono text-center placeholder:text-[#555d6e]"
              />
              <button
                type="submit"
                className="w-full py-2.5 text-xs font-semibold tracking-wider uppercase text-[#08090b] bg-gradient-to-r from-[#d8b873] to-[#c5a059] hover:from-[#faebd7] hover:to-[#d8b873] rounded-sm transition-all"
              >
                Unlock Command Console
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-[#1e2330] w-full text-center text-[11px] text-[#6d7588]">
              <span>Registrar Passkey required (Default: sentinel2026)</span>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED WORKSPACE */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Tab Navigation */}
            <div className="px-4 sm:px-6 bg-[#0f1118] border-b border-[#232733] flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 overflow-x-auto shrink-0">
              <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('vaults')}
                  className={`px-3 sm:px-4 py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
                    activeTab === 'vaults'
                      ? 'border-[#c5a059] text-[#faebd7] bg-[#161a24]/50'
                      : 'border-transparent text-[#828899] hover:text-[#f5f5f7]'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Vaults ({vaults.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('shipments')}
                  className={`px-4 py-3 text-xs font-medium border-b-2 transition-all flex items-center gap-2 ${
                    activeTab === 'shipments'
                      ? 'border-[#7aa2f7] text-[#faebd7] bg-[#161a24]/50'
                      : 'border-transparent text-[#828899] hover:text-[#f5f5f7]'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5 text-[#7aa2f7]" />
                  <span>Shipments & Transit ({shipments.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('reservations')}
                  className={`px-4 py-3 text-xs font-medium border-b-2 transition-all flex items-center gap-2 ${
                    activeTab === 'reservations'
                      ? 'border-emerald-400 text-[#faebd7] bg-[#161a24]/50'
                      : 'border-transparent text-[#828899] hover:text-[#f5f5f7]'
                  }`}
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Client Reservations ({reservations.length})</span>
                </button>
              </div>

              {/* Action Buttons for current tab */}
              <div className="py-2">
                {activeTab === 'vaults' && (
                  <button
                    onClick={() => setIsCreateVaultOpen(true)}
                    className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#08090b] bg-[#c5a059] hover:bg-[#faebd7] rounded-sm transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Provision Vault</span>
                  </button>
                )}
                {activeTab === 'shipments' && (
                  <button
                    onClick={() => setIsCreateShipmentOpen(true)}
                    className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#08090b] bg-[#7aa2f7] hover:bg-[#a0c0ff] rounded-sm transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Dispatch Shipment</span>
                  </button>
                )}
              </div>
            </div>

            {/* TAB 1: VAULTS CRUD */}
            {activeTab === 'vaults' && (
              <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 pb-12 space-y-4">
                <div className="flex items-center justify-between text-xs text-[#828899] pb-2 border-b border-[#1c202a]">
                  <span>Active Depository Allocations (CREATE, READ, UPDATE, DELETE)</span>
                  <span>Changes immediately reflect in client search console</span>
                </div>

                <div className="divide-y divide-[#1e2330] border border-[#232733] rounded-sm bg-[#080a0f]">
                  {vaults.map((vault) => (
                    <div key={vault.id} className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[#0f121a] transition-colors">
                      <div className="space-y-1.5 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-mono text-sm font-semibold text-[#c5a059]">{vault.id}</span>
                          <span className="text-[#555d6e]">·</span>
                          <span className="text-[#e2e4e9]">{vault.facility}</span>
                          <span className="text-[#555d6e]">·</span>
                          <span className="text-[#7aa2f7]">{vault.tier}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#8a91a3]">
                          <span className="text-emerald-400 font-medium">{vault.status}</span>
                          <span>·</span>
                          <span>{vault.securityRating}</span>
                          <span>·</span>
                          <span>Valuation: <strong className="font-mono text-[#f5f5f7]">{vault.totalEstimatedValue}</strong></span>
                        </div>
                        <div className="text-[11px] text-[#6d7588]">
                          Inventory: {vault.items.length} segregated items · {vault.lastPhysicalAudit}
                        </div>
                      </div>

                      {/* CRUD Actions */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          onClick={() => setManagingItemsVault(vault)}
                          className="px-2.5 py-1.5 text-xs font-medium text-[#c5a059] bg-[#141822] border border-[#2b3140] hover:border-[#c5a059]/50 rounded-sm transition-colors flex items-center gap-1.5"
                        >
                          <Package className="w-3.5 h-3.5" />
                          <span>Items ({vault.items.length})</span>
                        </button>
                        <button
                          onClick={() => setEditingVault(vault)}
                          className="px-2.5 py-1.5 text-xs font-medium text-[#d1d5e0] bg-[#141822] border border-[#2b3140] hover:border-[#c5a059]/50 rounded-sm transition-colors flex items-center gap-1.5"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteVault(vault.id, `${vault.facility} · ${vault.tier}`)}
                          className="px-2.5 py-1.5 text-xs font-medium text-red-400 bg-[#191114] border border-red-900/40 hover:border-red-500 rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                          title="De-allocate vault compartment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>De-allocate</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: SHIPMENTS CRUD */}
            {activeTab === 'shipments' && (
              <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 pb-12 space-y-4">
                <div className="flex items-center justify-between text-xs text-[#828899] pb-2 border-b border-[#1c202a]">
                  <span>Active Armored Transit Database (CREATE, READ, UPDATE, DELETE)</span>
                  <span>Direct satellite tracking telemetry management</span>
                </div>

                <div className="divide-y divide-[#1e2330] border border-[#232733] rounded-sm bg-[#080a0f]">
                  {shipments.map((shipment) => (
                    <div key={shipment.id} className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[#0f121a] transition-colors">
                      <div className="space-y-1.5 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-mono text-sm font-semibold text-[#7aa2f7]">{shipment.trackingNumber}</span>
                          <span className="text-[#555d6e]">·</span>
                          <span className="text-[#c5a059]">{shipment.courierLevel}</span>
                          <span className="text-[#555d6e]">·</span>
                          <span className="text-[#e2e4e9]">Destination: {shipment.destination}</span>
                        </div>
                        <h4 className="text-xs font-medium text-[#f5f5f7]">
                          {shipment.manifestDescription}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#8a91a3]">
                          <span className="text-blue-400 font-medium">Status: {shipment.transitStatus}</span>
                          <span>·</span>
                          <span>Lead Custodian: {shipment.leadCourier}</span>
                          <span>·</span>
                          <span>Callsign: {shipment.securityTeamCallsign}</span>
                        </div>
                        <div className="text-[11px] text-[#6d7588]">
                          Current Checkpoint: {shipment.currentCheckpoint} ({shipment.checkpoints.length} waypoints logged)
                        </div>
                      </div>

                      {/* CRUD Actions */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {/* Status Quick Advance Dropdown */}
                        <select
                          value={shipment.transitStatus}
                          onChange={(e) => handleUpdateShipmentStatus(shipment.id, e.target.value)}
                          className="px-2 py-1.5 bg-[#141822] border border-[#2b3140] text-xs text-[#f5f5f7] rounded-sm focus:outline-none"
                        >
                          <option value="In Transit">In Transit</option>
                          <option value="Cleared Customs / Apron Transfer">Cleared Customs</option>
                          <option value="Dispatched Final Mile">Dispatched Final Mile</option>
                          <option value="Delivered & Handed Over">Delivered & Handed Over</option>
                        </select>

                        <button
                          onClick={() => setCheckpointShipment(shipment)}
                          className="px-2.5 py-1.5 text-xs font-medium text-[#7aa2f7] bg-[#141822] border border-[#2b3140] hover:border-[#7aa2f7]/50 rounded-sm transition-colors flex items-center gap-1.5"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>+ Waypoint</span>
                        </button>

                        <button
                          onClick={() => setEditingShipment(shipment)}
                          className="px-2.5 py-1.5 text-xs font-medium text-[#d1d5e0] bg-[#141822] border border-[#2b3140] hover:border-[#c5a059]/50 rounded-sm transition-colors flex items-center gap-1.5"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteShipment(shipment.id, `${shipment.trackingNumber} · ${shipment.manifestDescription}`)}
                          className="px-2.5 py-1.5 text-xs font-medium text-red-400 bg-[#191114] border border-red-900/40 hover:border-red-500 rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                          title="Delete transit tracking record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: RESERVATIONS CRUD */}
            {activeTab === 'reservations' && (
              <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 pb-12 space-y-4">
                <div className="flex items-center justify-between text-xs text-[#828899] pb-2 border-b border-[#1c202a]">
                  <span>Client Reservation Dossiers Submitted via Portal & API</span>
                  <span>Review, approve, and allocate safe custody compartments</span>
                </div>

                {reservations.length === 0 ? (
                  <div className="p-8 text-center bg-[#080a0f] border border-[#232733] rounded-sm text-xs text-[#727a8d]">
                    No client reservations submitted yet. Test the "Reserve Vault" button to generate a new live dossier!
                  </div>
                ) : (
                  <div className="divide-y divide-[#1e2330] border border-[#232733] rounded-sm bg-[#080a0f]">
                    {reservations.map((res) => (
                      <div key={res.id} className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[#0f121a] transition-colors">
                        <div className="space-y-1.5 max-w-2xl">
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-mono text-sm font-semibold text-[#c5a059]">{res.id}</span>
                            <span className="text-[#555d6e]">·</span>
                            <span className="text-[#f5f5f7] font-medium">{res.clientName}</span>
                            <span className="text-[#555d6e]">·</span>
                            <span className="text-[#8e95a5]">{res.clientEmail}</span>
                            {res.clientPhone && <span className="text-[#6d7588]">({res.clientPhone})</span>}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-[#8a91a3]">
                            <span>Depository: {res.facility}</span>
                            <span>·</span>
                            <span>Tier: {res.tier}</span>
                            <span>·</span>
                            <span>Est. Specie: {res.estValue}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px]">
                            <span className="text-[#6d7588]">Status:</span>
                            <span className={`font-medium ${
                              res.status.includes('Approved')
                                ? 'text-emerald-400'
                                : res.status.includes('Declined')
                                ? 'text-red-400'
                                : 'text-amber-400'
                            }`}>
                              {res.status}
                            </span>
                            <span className="text-[#4b5263]">· Registered: {new Date(res.createdAt).toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Status Update & Delete */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleUpdateReservationStatus(res.id, 'Approved & Compartment Allocated')}
                            className="px-2.5 py-1.5 text-xs font-medium text-emerald-400 bg-[#101b15] border border-emerald-900/40 hover:border-emerald-500 rounded-sm transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateReservationStatus(res.id, 'Contacted by Custody Director')}
                            className="px-2.5 py-1.5 text-xs font-medium text-[#c5a059] bg-[#141822] border border-[#2b3140] hover:border-[#c5a059]/40 rounded-sm transition-colors"
                          >
                            Mark Contacted
                          </button>
                          <button
                            onClick={() => handleDeleteReservation(res.id, `${res.clientName} · ${res.facility}`)}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-sm transition-colors cursor-pointer"
                            title="Archive Dossier"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* MODAL: PROVISION NEW VAULT */}
        {isCreateVaultOpen && (
          <CreateVaultModal
            onClose={() => setIsCreateVaultOpen(false)}
            onCreated={(vault) => {
              setVaults((prev) => [vault, ...prev]);
              setIsCreateVaultOpen(false);
              showFeedback(`Vault ${vault.id} created.`);
              if (onVaultOrShipmentUpdated) onVaultOrShipmentUpdated(vault.id);
            }}
          />
        )}

        {/* MODAL: EDIT VAULT */}
        {editingVault && (
          <EditVaultModal
            vault={editingVault}
            onClose={() => setEditingVault(null)}
            onUpdated={(vault) => {
              setVaults((prev) => prev.map((v) => (v.id === vault.id ? vault : v)));
              setEditingVault(null);
              showFeedback(`Vault ${vault.id} updated.`);
              if (onVaultOrShipmentUpdated) onVaultOrShipmentUpdated(vault.id);
            }}
          />
        )}

        {/* MODAL: MANAGE VAULT ITEMS */}
        {managingItemsVault && (
          <ManageVaultItemsModal
            vault={managingItemsVault}
            onClose={() => setManagingItemsVault(null)}
            onVaultUpdated={(updated) => {
              setVaults((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
              setManagingItemsVault(updated);
              showFeedback(`Inventory updated.`);
              if (onVaultOrShipmentUpdated) onVaultOrShipmentUpdated(updated.id);
            }}
          />
        )}

        {/* MODAL: CREATE SHIPMENT */}
        {isCreateShipmentOpen && (
          <CreateShipmentModal
            onClose={() => setIsCreateShipmentOpen(false)}
            onCreated={(shipment) => {
              setShipments((prev) => [shipment, ...prev]);
              setIsCreateShipmentOpen(false);
              showFeedback(`Shipment ${shipment.id} created.`);
              if (onVaultOrShipmentUpdated) onVaultOrShipmentUpdated(shipment.id);
            }}
          />
        )}

        {/* MODAL: EDIT SHIPMENT */}
        {editingShipment && (
          <EditShipmentModal
            shipment={editingShipment}
            onClose={() => setEditingShipment(null)}
            onUpdated={(updated) => {
              setShipments((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
              setEditingShipment(null);
              showFeedback(`Shipment ${updated.id} updated.`);
              if (onVaultOrShipmentUpdated) onVaultOrShipmentUpdated(updated.id);
            }}
          />
        )}

        {/* MODAL: ADD WAYPOINT CHECKPOINT */}
        {checkpointShipment && (
          <AddWaypointModal
            shipment={checkpointShipment}
            onClose={() => setCheckpointShipment(null)}
            onAdded={(updated) => {
              setShipments((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
              setCheckpointShipment(null);
              showFeedback(`Waypoint logged for ${updated.id}.`);
              if (onVaultOrShipmentUpdated) onVaultOrShipmentUpdated(updated.id);
            }}
          />
        )}

        {/* MODAL: CRUD OPERATIONS STANDARD OPERATING GUIDE */}
        {isGuideOpen && (
          <CrudOperationsGuideModal onClose={() => setIsGuideOpen(false)} />
        )}

        {/* MODAL: IN-APP DELETION CONFIRMATION DIALOG (Reliable in iframes) */}
        {deleteConfirmation && (
          <div
            className="fixed inset-0 z-70 flex justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
            onClick={() => !isDeleting && setDeleteConfirmation(null)}
          >
            <div
              className="w-full max-w-md my-auto bg-[#10131b] border border-red-900/60 rounded-sm shadow-2xl p-5 sm:p-6 space-y-4 text-[#f5f5f7]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-red-950/70 border border-red-800/80 rounded-full text-red-400 shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-[#f5f5f7]">
                    {deleteConfirmation.title}
                  </h3>
                  <div className="inline-block px-2 py-0.5 font-mono text-xs font-semibold bg-[#1a1315] border border-red-900/50 text-red-400 rounded-sm">
                    {deleteConfirmation.id}
                  </div>
                  <p className="text-xs text-[#9aa0b0] leading-relaxed pt-1">
                    {deleteConfirmation.description}
                  </p>
                  {deleteConfirmation.sublabel && (
                    <div className="mt-2 text-[11px] font-mono text-[#8a92a6] bg-[#080a0f] border border-[#1e2330] p-2.5 rounded-sm break-words">
                      {deleteConfirmation.sublabel}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-[#1e2330] flex items-center justify-end gap-2.5 text-xs">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setDeleteConfirmation(null)}
                  className="px-3.5 py-2 bg-[#141822] border border-[#2b3140] hover:bg-[#1b212f] hover:text-[#f5f5f7] text-[#c0c5d2] rounded-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={executeConfirmedDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-medium rounded-sm transition-colors flex items-center gap-1.5 shadow-lg shadow-red-950/40 cursor-pointer"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{deleteConfirmation.confirmButtonText}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- SUB-MODALS FOR SPECIFIC CRUD FORMS ---

function CreateVaultModal({ onClose, onCreated }: { onClose: () => void; onCreated: (vault: VaultRecord) => void }) {
  const [vaultId, setVaultId] = useState(`VSG-VLT-${Math.floor(1000 + Math.random() * 9000)}`);
  const [facility, setFacility] = useState('Zurich Bedrock Depository — Sub-Level 4');
  const [tier, setTier] = useState('Class II Depository Drawer');
  const [status, setStatus] = useState('Allocated & Sealed');
  const [totalVal, setTotalVal] = useState('$5,000,000 USD');
  const [coverageLimit, setCoverageLimit] = useState('$10,000,000 USD Full All-Risk Specie');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await adminCreateVault({
      id: vaultId,
      facility,
      tier,
      status,
      totalEstimatedValue: totalVal,
      coverageLimit,
    });
    setIsSubmitting(false);
    if (res.success && res.vault) {
      onCreated(res.vault);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-md max-h-[92vh] flex flex-col bg-[#10131b] border border-[#2b3140] rounded-sm shadow-2xl my-auto overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#1e2330] flex justify-between items-center shrink-0">
          <h3 className="font-display text-base sm:text-lg text-[#f5f5f7]">Provision New Vault Allocation</h3>
          <button onClick={onClose} className="p-1 text-[#727a8d] hover:text-[#f5f5f7]"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 min-h-0">
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[#828899] mb-1">Vault Code ID</label>
              <input
                type="text"
                value={vaultId}
                onChange={(e) => setVaultId(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 bg-[#080a0f] border border-[#232733] font-mono text-[#c5a059] rounded-sm"
              />
            </div>
            <div>
              <label className="block text-[#828899] mb-1">Depository Facility</label>
              <select
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
                className="w-full px-3 py-2 bg-[#080a0f] border border-[#232733] text-[#f5f5f7] rounded-sm"
              >
                <option value="Zurich Bedrock Depository — Sub-Level 4">Zurich Bedrock Depository — Sub-Level 4</option>
                <option value="London Mayfair Safe Depository — Vault Suite B">London Mayfair Safe Depository — Vault Suite B</option>
                <option value="Singapore Freeport Depository — Vault Delta">Singapore Freeport Depository — Vault Delta</option>
                <option value="Geneva SafePort Depository — Vault Alpha">Geneva SafePort Depository — Vault Alpha</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#828899] mb-1">Tier</label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value)}
                  className="w-full px-3 py-2 bg-[#080a0f] border border-[#232733] text-[#f5f5f7] rounded-sm"
                >
                  <option value="Class I Safe Deposit Box">Class I Safe Deposit Box</option>
                  <option value="Class II Depository Drawer">Class II Depository Drawer</option>
                  <option value="Class III Fortress Chamber">Class III Fortress Chamber</option>
                </select>
              </div>
              <div>
                <label className="block text-[#828899] mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-[#080a0f] border border-[#232733] text-[#f5f5f7] rounded-sm"
                >
                  <option value="Allocated & Sealed">Allocated & Sealed</option>
                  <option value="Under Scheduled Audit">Under Scheduled Audit</option>
                  <option value="Accessible by Custodian">Accessible by Custodian</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[#828899] mb-1">Estimated Specie Valuation</label>
              <input
                type="text"
                value={totalVal}
                onChange={(e) => setTotalVal(e.target.value)}
                className="w-full px-3 py-2 bg-[#080a0f] border border-[#232733] text-[#f5f5f7] rounded-sm"
              />
            </div>
            <div>
              <label className="block text-[#828899] mb-1">Lloyd's Insured Limit</label>
              <input
                type="text"
                value={coverageLimit}
                onChange={(e) => setCoverageLimit(e.target.value)}
                className="w-full px-3 py-2 bg-[#080a0f] border border-[#232733] text-[#f5f5f7] rounded-sm"
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-[#08090b] bg-[#c5a059] hover:bg-[#faebd7] rounded-sm"
              >
                {isSubmitting ? 'Creating...' : 'Provision Vault in Depository'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function EditVaultModal({ vault, onClose, onUpdated }: { vault: VaultRecord; onClose: () => void; onUpdated: (vault: VaultRecord) => void }) {
  const [status, setStatus] = useState(vault.status);
  const [facility, setFacility] = useState(vault.facility);
  const [tier, setTier] = useState(vault.tier);
  const [totalVal, setTotalVal] = useState(vault.totalEstimatedValue);
  const [coverageLimit, setCoverageLimit] = useState(vault.coverageLimit);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await adminUpdateVault(vault.id, {
      status,
      facility,
      tier,
      totalEstimatedValue: totalVal,
      coverageLimit,
    });
    setIsSubmitting(false);
    if (res.success && res.vault) {
      onUpdated(res.vault);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-md max-h-[92vh] flex flex-col bg-[#10131b] border border-[#2b3140] rounded-sm shadow-2xl my-auto overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#1e2330] flex justify-between items-center shrink-0">
          <h3 className="font-display text-base sm:text-lg text-[#f5f5f7]">Edit Vault: {vault.id}</h3>
          <button onClick={onClose} className="p-1 text-[#727a8d] hover:text-[#f5f5f7]"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 min-h-0">
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[#828899] mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-[#080a0f] border border-[#232733] text-[#f5f5f7] rounded-sm"
              >
                <option value="Allocated & Sealed">Allocated & Sealed</option>
                <option value="Under Scheduled Audit">Under Scheduled Audit</option>
                <option value="Accessible by Custodian">Accessible by Custodian</option>
              </select>
            </div>
            <div>
              <label className="block text-[#828899] mb-1">Facility</label>
              <input
                type="text"
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
                className="w-full px-3 py-2 bg-[#080a0f] border border-[#232733] text-[#f5f5f7] rounded-sm"
              />
            </div>
            <div>
              <label className="block text-[#828899] mb-1">Valuation</label>
              <input
                type="text"
                value={totalVal}
                onChange={(e) => setTotalVal(e.target.value)}
                className="w-full px-3 py-2 bg-[#080a0f] border border-[#232733] text-[#f5f5f7] rounded-sm"
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-[#08090b] bg-[#c5a059] hover:bg-[#faebd7] rounded-sm"
              >
                {isSubmitting ? 'Saving...' : 'Update Vault Parameters'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function ManageVaultItemsModal({ vault, onClose, onVaultUpdated }: { vault: VaultRecord; onClose: () => void; onVaultUpdated: (v: VaultRecord) => void }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Gold Bullion');
  const [estimatedValue, setEstimatedValue] = useState('$100,000 USD');
  const [weightOrCarat, setWeightOrCarat] = useState('');
  const [cert, setCert] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    const res = await adminAddItemToVault(vault.id, {
      name,
      category,
      estimatedValue,
      weightOrCarat,
      certificationNumber: cert,
    });
    setIsSubmitting(false);
    if (res.success && res.vault) {
      onVaultUpdated(res.vault);
      setName('');
      setWeightOrCarat('');
      setCert('');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    const res = await adminDeleteItemFromVault(vault.id, itemId);
    if (res.success && res.vault) {
      onVaultUpdated(res.vault);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl max-h-[92vh] flex flex-col bg-[#10131b] border border-[#2b3140] rounded-sm shadow-2xl my-auto overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#1e2330] flex justify-between items-center shrink-0">
          <div>
            <h3 className="font-display text-base sm:text-lg text-[#f5f5f7]">Inventory Assets: {vault.id}</h3>
            <span className="text-xs text-[#828899]">{vault.items.length} items currently allocated</span>
          </div>
          <button onClick={onClose} className="p-1 text-[#727a8d] hover:text-[#f5f5f7]"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-4 sm:p-5 overflow-y-auto flex-1 min-h-0 space-y-4">
          {/* Existing items list */}
          <div>
            <div className="text-xs font-medium text-[#828899] mb-2">Allocated Vault Holdings</div>
            <div className="max-h-56 overflow-y-auto divide-y divide-[#1e2330] border border-[#232733] rounded-sm bg-[#080a0f] p-3 space-y-2">
              {vault.items.length === 0 ? (
                <div className="text-center py-4 text-xs text-[#6e7587]">No allocated items in this compartment.</div>
              ) : (
                vault.items.map((it) => (
                  <div key={it.id} className="pt-2 pb-2 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-medium text-[#f5f5f7]">{it.name}</div>
                      <div className="text-[11px] text-[#7aa2f7]">
                        {it.category} {it.weightOrCarat && `· ${it.weightOrCarat}`} {it.certificationNumber && `· ${it.certificationNumber}`}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[#c5a059]">{it.estimatedValue}</span>
                      <button
                        onClick={() => handleDeleteItem(it.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Add new item form */}
          <form onSubmit={handleAddItem} className="pt-3 border-t border-[#1e2330] space-y-3 text-xs">
            <div className="font-medium text-[#c5a059]">Add Allocated Asset to Vault</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Asset description / item name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-3 py-2 bg-[#080a0f] border border-[#232733] text-[#f5f5f7] rounded-sm"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2 bg-[#080a0f] border border-[#232733] text-[#f5f5f7] rounded-sm"
              >
                <option value="Gold Bullion">Gold Bullion</option>
                <option value="Diamonds">Diamonds</option>
                <option value="Platinum">Platinum</option>
                <option value="Fine Horology">Fine Horology</option>
                <option value="Precious Artifacts">Precious Artifacts</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Valuation (e.g. $250,000 USD)"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(e.target.value)}
                className="px-3 py-2 bg-[#080a0f] border border-[#232733] text-[#f5f5f7] rounded-sm"
              />
              <input
                type="text"
                placeholder="Weight / Carats"
                value={weightOrCarat}
                onChange={(e) => setWeightOrCarat(e.target.value)}
                className="px-3 py-2 bg-[#080a0f] border border-[#232733] text-[#f5f5f7] rounded-sm"
              />
              <input
                type="text"
                placeholder="Assay / GIA Cert #"
                value={cert}
                onChange={(e) => setCert(e.target.value)}
                className="px-3 py-2 bg-[#080a0f] border border-[#232733] text-[#f5f5f7] rounded-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-[#08090b] bg-[#c5a059] hover:bg-[#faebd7] rounded-sm"
            >
              {isSubmitting ? 'Adding...' : 'Allocate Asset to Vault'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function CreateShipmentModal({ onClose, onCreated }: { onClose: () => void; onCreated: (s: ShipmentRecord) => void }) {
  const [trackingNumber, setTrackingNumber] = useState(`TRK-ARM-${Math.floor(1000 + Math.random() * 9000)}`);
  const [manifest, setManifest] = useState('Armored Safe-Hand Escort: Allocated Gold Bars & Gems');
  const [origin, setOrigin] = useState('Valtrust Zurich Bedrock Depository (Switzerland)');
  const [destination, setDestination] = useState('Private Villa · Geneva, Switzerland');
  const [courierLevel, setCourierLevel] = useState('Level 5 Armed Convoy');
  const [leadCourier, setLeadCourier] = useState('Captain M. von Berg');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await adminCreateShipment({
      trackingNumber,
      manifestDescription: manifest,
      originFacility: origin,
      destination,
      courierLevel,
      leadCourier,
    });
    setIsSubmitting(false);
    if (res.success && res.shipment) {
      onCreated(res.shipment);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-md max-h-[92vh] flex flex-col bg-[#10131b] border border-[#2b3140] rounded-sm shadow-2xl my-auto overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#1e2330] flex justify-between items-center shrink-0">
          <h3 className="font-display text-base sm:text-lg text-[#f5f5f7]">Dispatch Armored Shipment</h3>
          <button onClick={onClose} className="p-1 text-[#727a8d] hover:text-[#f5f5f7]"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 min-h-0">
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[#828899] mb-1">Waybill Tracking Number</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 bg-[#080a0f] border border-[#232733] font-mono text-[#7aa2f7] rounded-sm"
              />
            </div>
            <div>
              <label className="block text-[#828899] mb-1">Manifest Description</label>
              <input
                type="text"
                required
                value={manifest}
                onChange={(e) => setManifest(e.target.value)}
                className="w-full px-3 py-2 bg-[#080a0f] border border-[#232733] text-[#f5f5f7] rounded-sm"
              />
            </div>
            <div>
              <label className="block text-[#828899] mb-1">Destination Address / Apron</label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-2 bg-[#080a0f] border border-[#232733] text-[#f5f5f7] rounded-sm"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#828899] mb-1">Escort Protocol</label>
                <select
                  value={courierLevel}
                  onChange={(e) => setCourierLevel(e.target.value)}
                  className="w-full px-3 py-2 bg-[#080a0f] border border-[#232733] text-[#f5f5f7] rounded-sm"
                >
                  <option value="Level 5 Armed Convoy">Level 5 Armed Convoy</option>
                  <option value="Guarded Diplomatic Air Courier">Guarded Air Courier</option>
                  <option value="Armored Maritime Escort">Armored Maritime</option>
                </select>
              </div>
              <div>
                <label className="block text-[#828899] mb-1">Lead Custodian</label>
                <input
                  type="text"
                  value={leadCourier}
                  onChange={(e) => setLeadCourier(e.target.value)}
                  className="w-full px-3 py-2 bg-[#080a0f] border border-[#232733] text-[#f5f5f7] rounded-sm"
                />
              </div>
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-[#08090b] bg-[#7aa2f7] hover:bg-[#a0c0ff] rounded-sm"
              >
                {isSubmitting ? 'Registering...' : 'Dispatch Shipment to Database'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function EditShipmentModal({ shipment, onClose, onUpdated }: { shipment: ShipmentRecord; onClose: () => void; onUpdated: (s: ShipmentRecord) => void }) {
  const [status, setStatus] = useState(shipment.transitStatus);
  const [checkpoint, setCheckpoint] = useState(shipment.currentCheckpoint);
  const [eta, setEta] = useState(shipment.estimatedDelivery);
  const [callsign, setCallsign] = useState(shipment.securityTeamCallsign);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await adminUpdateShipment(shipment.id, {
      transitStatus: status,
      currentCheckpoint: checkpoint,
      estimatedDelivery: eta,
      securityTeamCallsign: callsign,
    });
    setIsSubmitting(false);
    if (res.success && res.shipment) {
      onUpdated(res.shipment);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-md max-h-[92vh] flex flex-col bg-[#10131b] border border-[#2b3140] rounded-sm shadow-2xl my-auto overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#1e2330] flex justify-between items-center shrink-0">
          <h3 className="font-display text-base sm:text-lg text-[#f5f5f7]">Edit Transit: {shipment.trackingNumber}</h3>
          <button onClick={onClose} className="p-1 text-[#727a8d] hover:text-[#f5f5f7]"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 min-h-0">
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[#828899] mb-1">Transit Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-[#080a0f] border border-[#232733] text-[#f5f5f7] rounded-sm"
              >
                <option value="In Transit">In Transit</option>
                <option value="Cleared Customs / Apron Transfer">Cleared Customs / Apron Transfer</option>
                <option value="Dispatched Final Mile">Dispatched Final Mile</option>
                <option value="Delivered & Handed Over">Delivered & Handed Over</option>
              </select>
            </div>
            <div>
              <label className="block text-[#828899] mb-1">Current Waypoint / Status Note</label>
              <input
                type="text"
                value={checkpoint}
                onChange={(e) => setCheckpoint(e.target.value)}
                className="w-full px-3 py-2 bg-[#080a0f] border border-[#232733] text-[#f5f5f7] rounded-sm"
              />
            </div>
            <div>
              <label className="block text-[#828899] mb-1">Estimated Handover Time</label>
              <input
                type="text"
                value={eta}
                onChange={(e) => setEta(e.target.value)}
                className="w-full px-3 py-2 bg-[#080a0f] border border-[#232733] text-[#f5f5f7] rounded-sm"
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-[#08090b] bg-[#7aa2f7] hover:bg-[#a0c0ff] rounded-sm"
              >
                {isSubmitting ? 'Updating...' : 'Save Transit Telemetry'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function AddWaypointModal({ shipment, onClose, onAdded }: { shipment: ShipmentRecord; onClose: () => void; onAdded: (s: ShipmentRecord) => void }) {
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('Convoy checkpoint clearance verified');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;
    setIsSubmitting(true);
    const res = await adminAddShipmentCheckpoint(shipment.id, {
      location,
      status,
      notes,
      completed: true,
    });
    setIsSubmitting(false);
    if (res.success && res.shipment) {
      onAdded(res.shipment);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-md max-h-[92vh] flex flex-col bg-[#10131b] border border-[#2b3140] rounded-sm shadow-2xl my-auto overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#1e2330] flex justify-between items-center shrink-0">
          <h3 className="font-display text-base sm:text-lg text-[#f5f5f7]">Log Waypoint: {shipment.trackingNumber}</h3>
          <button onClick={onClose} className="p-1 text-[#727a8d] hover:text-[#f5f5f7]"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 min-h-0">
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[#828899] mb-1">Waypoint Location *</label>
              <input
                type="text"
                required
                placeholder="e.g. Alpine Pass Checkpoint 05"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-[#080a0f] border border-[#232733] text-[#f5f5f7] rounded-sm"
              />
            </div>
            <div>
              <label className="block text-[#828899] mb-1">Checkpoint Status *</label>
              <input
                type="text"
                required
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-[#080a0f] border border-[#232733] text-[#f5f5f7] rounded-sm"
              />
            </div>
            <div>
              <label className="block text-[#828899] mb-1">Security Notes</label>
              <input
                type="text"
                placeholder="Optional escort notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-[#080a0f] border border-[#232733] text-[#f5f5f7] rounded-sm"
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-[#08090b] bg-[#7aa2f7] hover:bg-[#a0c0ff] rounded-sm"
              >
                {isSubmitting ? 'Logging...' : 'Log Waypoint to Live Tracker'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function CrudOperationsGuideModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-60 flex justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[88vh] my-auto bg-[#0d1017] border border-[#2b3140] rounded-sm shadow-2xl flex flex-col text-[#f5f5f7] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#121622] border-b border-[#232733] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-[#1a1f2c] border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-[#f5f5f7]">
                Registrar Standard Operating Procedure: CRUD Operations Manual
              </h3>
              <p className="text-[11px] text-[#8e95a5]">
                How administrators create, audit, modify, and de-allocate depository records
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#737b8d] hover:text-[#f5f5f7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-6 text-xs leading-relaxed text-[#c1c6d4]">
          {/* Section 1: Overview */}
          <div className="p-4 bg-[#12151f] border border-[#232733] rounded-sm space-y-2">
            <div className="flex items-center gap-2 text-[#c5a059] font-medium text-sm">
              <Shield className="w-4 h-4" />
              <span>Real-Time Backend Synchronization Architecture</span>
            </div>
            <p className="text-[#9aa0b0]">
              Every administrative action in this Registrar Command Console executes directly against the Express backend API (<code className="font-mono text-[#c5a059]">/api/admin/*</code>) and mutates the active depository data store. Any vault provisioned or waypoint logged here immediately becomes searchable and verifiable by customers using the frontend <strong className="text-[#f5f5f7]">"Search Vault / Track"</strong> console.
            </p>
          </div>

          {/* Section 2: Vault Operations */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold text-[#faebd7] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#c5a059]" />
              <span>1. Managing Vaults & Physical Inventory (Vaults Tab)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              <div className="p-3 bg-[#0a0c10] border border-[#1e2330] rounded-sm space-y-1">
                <span className="font-mono text-emerald-400 font-semibold uppercase tracking-wider block">CREATE (Provision)</span>
                <p>
                  Click the <strong className="text-[#c5a059]">+ Provision Vault</strong> button in the top right. Enter a custom Vault Code (e.g. <code className="text-[#c5a059]">VSG-VLT-7711</code>), select the facility (Zurich, London, Singapore, Geneva), tier, insurance limit, and initial specie valuation.
                </p>
              </div>
              <div className="p-3 bg-[#0a0c10] border border-[#1e2330] rounded-sm space-y-1">
                <span className="font-mono text-blue-400 font-semibold uppercase tracking-wider block">READ (Audit)</span>
                <p>
                  The table displays all allocated compartments, security ratings (Grade XIII), insured amounts, and dual-custodian witness timestamps. Click <strong className="text-[#f5f5f7]">Sync</strong> anytime to poll the latest records.
                </p>
              </div>
              <div className="p-3 bg-[#0a0c10] border border-[#1e2330] rounded-sm space-y-1">
                <span className="font-mono text-amber-400 font-semibold uppercase tracking-wider block">UPDATE (Parameters & Wares)</span>
                <p>
                  • Click <strong className="text-[#f5f5f7]">Edit</strong> to adjust status (Allocated & Sealed, Under Audit), facility, or valuation.<br/>
                  • Click <strong className="text-[#c5a059]">Items ({'n'})</strong> to open the Inventory Manager. Here you can add serialized gold bars, diamonds, platinum, or horology with certified GIA/LBMA numbers.
                </p>
              </div>
              <div className="p-3 bg-[#0a0c10] border border-[#1e2330] rounded-sm space-y-1">
                <span className="font-mono text-red-400 font-semibold uppercase tracking-wider block">DELETE (De-allocate)</span>
                <p>
                  • Click <strong className="text-red-400">De-allocate</strong> on any vault row to retire the compartment and purge it from active bailment.<br/>
                  • Inside the <strong className="text-[#c5a059]">Items</strong> modal, click the red trash icon next to individual items to de-allocate single assets.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Shipment Operations */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold text-[#faebd7] flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#7aa2f7]" />
              <span>2. Managing In-Flight Armored Logistics (Shipments Tab)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              <div className="p-3 bg-[#0a0c10] border border-[#1e2330] rounded-sm space-y-1">
                <span className="font-mono text-emerald-400 font-semibold uppercase tracking-wider block">CREATE (Dispatch)</span>
                <p>
                  Click <strong className="text-[#7aa2f7]">+ Dispatch Shipment</strong>. Input a waybill number (<code className="text-[#7aa2f7]">TRK-ARM-XXXX</code>), cargo manifest, destination address, escort callsign, and lead courier officer.
                </p>
              </div>
              <div className="p-3 bg-[#0a0c10] border border-[#1e2330] rounded-sm space-y-1">
                <span className="font-mono text-blue-400 font-semibold uppercase tracking-wider block">READ (Satellite Waypoints)</span>
                <p>
                  Review origin facilities, real-time waypoints, estimated safe-hand handover windows, and escort team callsigns.
                </p>
              </div>
              <div className="p-3 bg-[#0a0c10] border border-[#1e2330] rounded-sm space-y-1">
                <span className="font-mono text-amber-400 font-semibold uppercase tracking-wider block">UPDATE (Advance & Checkpoints)</span>
                <p>
                  • Use the inline dropdown on each row to instantly advance transit status from <em>In Transit</em> to <em>Cleared Customs</em> or <em>Delivered</em>.<br/>
                  • Click <strong className="text-[#7aa2f7]">+ Waypoint</strong> to log live checkpoint coordinates and security clearance notes to the client tracking timeline.
                </p>
              </div>
              <div className="p-3 bg-[#0a0c10] border border-[#1e2330] rounded-sm space-y-1">
                <span className="font-mono text-red-400 font-semibold uppercase tracking-wider block">DELETE (Archive Transit)</span>
                <p>
                  Click <strong className="text-red-400">Delete</strong> on any shipment to conclude and remove completed transit waybills from the active tracking map.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Reservation Operations */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold text-[#faebd7] flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span>3. Processing Client Reservation Dossiers (Reservations Tab)</span>
            </h4>
            <div className="p-4 bg-[#0a0c10] border border-[#1e2330] rounded-sm space-y-2 text-[11px]">
              <p>
                When prospective clients submit a reservation request via the <strong className="text-[#f5f5f7]">"Reserve Vault Space"</strong> modal on the landing page, the dossier is immediately posted to <code className="font-mono text-[#c5a059]">/api/reserve</code> and stored in the database.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                <div className="p-2.5 bg-[#121622] rounded-sm">
                  <strong className="text-emerald-400 block mb-1">Approve Dossier:</strong>
                  <span>Sets status to "Approved & Compartment Allocated" and signals allocation readiness.</span>
                </div>
                <div className="p-2.5 bg-[#121622] rounded-sm">
                  <strong className="text-[#c5a059] block mb-1">Mark Contacted:</strong>
                  <span>Flags that a Senior Custody Director has reached out via encrypted channels.</span>
                </div>
                <div className="p-2.5 bg-[#121622] rounded-sm">
                  <strong className="text-red-400 block mb-1">Archive / Delete:</strong>
                  <span>Removes completed or non-responsive applications from active registrar review.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#121622] border-t border-[#232733] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#08090b] bg-[#c5a059] hover:bg-[#faebd7] rounded-sm transition-colors"
          >
            Understood & Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
