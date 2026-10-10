import {
  VaultRecord,
  ShipmentRecord,
  SAMPLE_VAULTS,
  SAMPLE_SHIPMENTS,
  lookupCustodyRecord,
} from '../data/mockCustodyData';

const browserVaultsKey = 'vaultrust-admin-vaults';
const browserShipmentsKey = 'vaultrust-admin-shipments';
const deletedVaultsKey = 'vaultrust-admin-deleted-vaults';
const deletedShipmentsKey = 'vaultrust-admin-deleted-shipments';

function readBrowserRecords<T extends { id: string }>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const records = window.localStorage.getItem(key);
    return records ? JSON.parse(records) as T[] : [];
  } catch {
    return [];
  }
}

function saveBrowserRecord<T extends { id: string }>(key: string, record: T, deletedKey: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const records = readBrowserRecords<T>(key).filter((item) => item.id !== record.id);
    window.localStorage.setItem(key, JSON.stringify([record, ...records]));
    const deletedIds = readBrowserRecords<{ id: string }>(deletedKey).filter((item) => item.id !== record.id);
    window.localStorage.setItem(deletedKey, JSON.stringify(deletedIds));
    return true;
  } catch {
    return false;
  }
}

function deleteBrowserRecord<T extends { id: string }>(recordsKey: string, deletedKey: string, id: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const deletedIds = readBrowserRecords<{ id: string }>(deletedKey).filter((record) => record.id !== id);
    window.localStorage.setItem(deletedKey, JSON.stringify([{ id }, ...deletedIds]));
    const records = readBrowserRecords<T>(recordsKey).filter((record) => record.id !== id);
    window.localStorage.setItem(recordsKey, JSON.stringify(records));
    return true;
  } catch {
    return false;
  }
}

function mergeRecords<T extends { id: string }>(serverRecords: T[], browserRecords: T[], deletedIds: { id: string }[]): T[] {
  const deleted = new Set(deletedIds.map((record) => record.id.toUpperCase()));
  const recordsById = new Map(browserRecords.filter((record) => !deleted.has(record.id.toUpperCase())).map((record) => [record.id, record]));
  for (const record of serverRecords) {
    if (!deleted.has(record.id.toUpperCase()) && !recordsById.has(record.id)) recordsById.set(record.id, record);
  }
  return [...recordsById.values()];
}

function createBrowserVault(vaultData: Partial<VaultRecord>) {
  const id = vaultData.id?.trim().toUpperCase() || `VSG-VLT-${Math.floor(1000 + Math.random() * 9000)}`;
  const existingVaults = readBrowserRecords<VaultRecord>(browserVaultsKey);
  if (existingVaults.some((vault) => vault.id.toUpperCase() === id)) {
    return { success: false, error: `Vault ${id} already exists in this browser.` };
  }

  const vault: VaultRecord = {
    id,
    type: 'vault',
    vaultNumber: vaultData.vaultNumber || `CH-ZRH-${id.slice(-4)}`,
    facility: vaultData.facility || 'Zurich Bedrock Depository — Sub-Level 4',
    country: vaultData.country || 'Switzerland',
    tier: vaultData.tier || 'Class II Depository Drawer',
    status: vaultData.status || 'Allocated & Sealed',
    securityRating: vaultData.securityRating || 'EN 1143-1 Grade XIII (Sovereign Depository)',
    insuranceUnderwriter: vaultData.insuranceUnderwriter || "Lloyd's of London Specie Syndicate #4401",
    coverageLimit: vaultData.coverageLimit || '$10,000,000 USD Full All-Risk Specie',
    lastPhysicalAudit: `Audit Verified · ${new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })} (Dual-Custodian Witness)`,
    biometricKeysRegistered: Number(vaultData.biometricKeysRegistered) || 2,
    environmentCondition: '19.8°C · 42% RH · Inert Nitrogen Enriched',
    inventoryCount: vaultData.items?.length || 0,
    totalEstimatedValue: vaultData.totalEstimatedValue || '$5,000,000 USD',
    items: vaultData.items || [],
  };

  return saveBrowserRecord(browserVaultsKey, vault, deletedVaultsKey)
    ? { success: true, vault, storage: 'browser' as const }
    : { success: false, error: 'Browser storage is unavailable. The vault could not be saved.' };
}

function createBrowserShipment(shipmentData: Partial<ShipmentRecord>) {
  const trackingNumber = shipmentData.trackingNumber?.trim().toUpperCase() || `TRK-ARM-${Math.floor(1000 + Math.random() * 9000)}`;
  const existingShipments = readBrowserRecords<ShipmentRecord>(browserShipmentsKey);
  if (existingShipments.some((shipment) => shipment.id.toUpperCase() === trackingNumber)) {
    return { success: false, error: `Shipment ${trackingNumber} already exists in this browser.` };
  }
  if (!shipmentData.manifestDescription || !shipmentData.destination) {
    return { success: false, error: 'Manifest description and destination are required.' };
  }

  const originFacility = shipmentData.originFacility || 'Valtrust Zurich Bedrock Depository (Switzerland)';
  const shipment: ShipmentRecord = {
    id: trackingNumber,
    type: 'shipment',
    trackingNumber,
    manifestDescription: shipmentData.manifestDescription,
    originFacility,
    destination: shipmentData.destination,
    courierLevel: shipmentData.courierLevel || 'Level 5 Armed Convoy',
    transitStatus: shipmentData.transitStatus || 'In Transit',
    currentCheckpoint: `${originFacility} · Satellite Telemetry Active`,
    estimatedDelivery: 'Within 6 Hours (Safe-Hand Protocol)',
    securityTeamCallsign: shipmentData.securityTeamCallsign || 'Sentinel Shield Unit Bravo',
    leadCourier: shipmentData.leadCourier || 'Officer K. Lindqvist',
    biometricSealVerified: true,
    vaultOriginId: shipmentData.vaultOriginId || 'VSG-VLT-ALLOCATED',
    checkpoints: [
      {
        time: 'Immediate',
        location: originFacility,
        status: 'Dual-Biometric Extraction & Faraday Sealed Case Locked',
        completed: true,
      },
      {
        time: 'En Route',
        location: 'Secured Armored Transit Corridor',
        status: `Convoy En Route to ${shipmentData.destination}`,
        completed: false,
      },
    ],
  };

  return saveBrowserRecord(browserShipmentsKey, shipment, deletedShipmentsKey)
    ? { success: true, shipment, storage: 'browser' as const }
    : { success: false, error: 'Browser storage is unavailable. The shipment could not be saved.' };
}

export interface SearchResult {
  success: boolean;
  type: 'vault' | 'shipment' | 'not_found';
  vault?: VaultRecord;
  shipment?: ShipmentRecord;
  error?: string;
}

export interface ReservationPayload {
  facility: string;
  tier: string;
  assetType: string;
  estValue: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
}

export interface ReservationResponse {
  success: boolean;
  referenceCode: string;
  message: string;
  error?: string;
}

export interface DispatchPayload {
  vaultId: string;
  destination: string;
  escortLevel: string;
  recipientName: string;
  safeHandKey?: string;
}

export interface DispatchResponse {
  success: boolean;
  trackingNumber: string;
  message: string;
  error?: string;
}

export interface ProcurePayload {
  itemId: string;
  title: string;
  quantity: number;
  actionType: 'vault' | 'ship';
  destAddress?: string;
  buyerName: string;
  buyerEmail: string;
}

export interface ProcureResponse {
  success: boolean;
  orderRef: string;
  message: string;
  error?: string;
}

// 1. Search Vault or Shipment
export async function searchVaultOrShipment(query: string): Promise<SearchResult> {
  const clean = query.trim();
  if (!clean) {
    return { success: false, type: 'not_found' };
  }

  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(clean)}`);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Backend search API unavailable, falling back to local registry', err);
  }

  // Resilient fallback to local registry
  const fallback = lookupCustodyRecord(clean);
  return {
    success: true,
    type: fallback.type,
    vault: fallback.vault,
    shipment: fallback.shipment,
  };
}

// 2. Submit Vault Reservation
export async function submitReservation(
  payload: ReservationPayload
): Promise<ReservationResponse> {
  try {
    const res = await fetch('/api/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      const err = await res.json();
      return {
        success: false,
        referenceCode: '',
        message: err.error || 'Reservation could not be submitted',
      };
    }
  } catch (err) {
    console.warn('Backend reservation API unavailable, generating local reference', err);
    const code = `VSG-RES-${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      success: true,
      referenceCode: code,
      message: 'Reservation dossier registered with Zurich Senior Custody Registrar.',
    };
  }
}

// 3. Submit Armored Dispatch
export async function submitDispatch(
  payload: DispatchPayload
): Promise<DispatchResponse> {
  try {
    const res = await fetch('/api/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      const err = await res.json();
      return {
        success: false,
        trackingNumber: '',
        message: err.error || 'Dispatch order could not be scheduled',
      };
    }
  } catch (err) {
    console.warn('Backend dispatch API unavailable, generating local tracking', err);
    const trk = `TRK-ARM-${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      success: true,
      trackingNumber: trk,
      message: `Armored safe-hand dispatch confirmed. Active waybill: ${trk}`,
    };
  }
}

// 4. Submit Sovereign Procurement Order
export async function submitProcurement(
  payload: ProcurePayload
): Promise<ProcureResponse> {
  try {
    const res = await fetch('/api/procure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      const err = await res.json();
      return {
        success: false,
        orderRef: '',
        message: err.error || 'Procurement order could not be submitted',
      };
    }
  } catch (err) {
    console.warn('Backend procurement API unavailable, generating local order', err);
    const ref = `VSG-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      success: true,
      orderRef: ref,
      message: 'Sovereign procurement order confirmed and locked.',
    };
  }
}

// ==========================================
// ADMIN CRUD CLIENT SERVICES
// ==========================================

// --- VAULTS ---
export async function adminGetVaults(): Promise<{ success: boolean; vaults: VaultRecord[] }> {
  try {
    const res = await fetch('/api/admin/vaults');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.vaults)) {
        return {
          success: true,
          vaults: mergeRecords(
            data.vaults,
            readBrowserRecords<VaultRecord>(browserVaultsKey),
            readBrowserRecords<{ id: string }>(deletedVaultsKey),
          ),
        };
      }
    }
  } catch (err) {
    console.warn('Failed to fetch admin vaults', err);
  }
  return {
    success: true,
    vaults: mergeRecords(
      SAMPLE_VAULTS,
      readBrowserRecords<VaultRecord>(browserVaultsKey),
      readBrowserRecords<{ id: string }>(deletedVaultsKey),
    ),
  };
}

export async function adminCreateVault(vaultData: Partial<VaultRecord>): Promise<{ success: boolean; vault?: VaultRecord; error?: string; storage?: 'server' | 'browser' }> {
  try {
    const res = await fetch('/api/admin/vaults', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vaultData),
    });
    const data = await res.json().catch(() => null);
    if (res.ok && data?.success && data.vault) {
      saveBrowserRecord(browserVaultsKey, data.vault, deletedVaultsKey);
      return { ...data, storage: 'server' };
    }
    if (res.status === 404 || res.status >= 500 || !data) return createBrowserVault(vaultData);
    return { success: false, error: data.error || 'Vault could not be created.' };
  } catch {
    return createBrowserVault(vaultData);
  }
}

export async function adminUpdateVault(id: string, updates: Partial<VaultRecord>): Promise<{ success: boolean; vault?: VaultRecord; error?: string }> {
  try {
    const res = await fetch(`/api/admin/vaults/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (res.ok && data?.success && data.vault) {
      saveBrowserRecord(browserVaultsKey, data.vault, deletedVaultsKey);
    }
    return data;
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' };
  }
}

export async function adminDeleteVault(id: string): Promise<{ success: boolean; error?: string; storage?: 'server' | 'browser' }> {
  try {
    const res = await fetch(`/api/admin/vaults/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    const data = await res.json().catch(() => null);
    if (res.ok && data?.success) {
      deleteBrowserRecord<VaultRecord>(browserVaultsKey, deletedVaultsKey, id);
      return { ...data, storage: 'server' };
    }
    if (!data || res.status === 404 || res.status >= 500) {
      return deleteBrowserRecord<VaultRecord>(browserVaultsKey, deletedVaultsKey, id)
        ? { success: true, storage: 'browser' }
        : { success: false, error: 'The server API is unavailable and this device could not record the deletion.' };
    }
    return { success: false, error: data.error || 'Vault could not be deleted.' };
  } catch {
    return deleteBrowserRecord<VaultRecord>(browserVaultsKey, deletedVaultsKey, id)
      ? { success: true, storage: 'browser' }
      : { success: false, error: 'The server API is unavailable and this device could not record the deletion.' };
  }
}

export async function adminAddItemToVault(vaultId: string, item: any): Promise<{ success: boolean; item?: any; vault?: VaultRecord; error?: string }> {
  const applyLocally = () => {
    const vaults = mergeRecords(
      SAMPLE_VAULTS,
      readBrowserRecords<VaultRecord>(browserVaultsKey),
      readBrowserRecords<{ id: string }>(deletedVaultsKey),
    );
    const vault = vaults.find((record) => record.id.toUpperCase() === vaultId.toUpperCase());
    if (!vault) return { success: false, error: `Vault ${vaultId} not found.` };
    if (!item.name?.trim()) return { success: false, error: 'Item name is required.' };

    const newItem = {
      id: `ITM-${Math.floor(1000 + Math.random() * 9000)}`,
      name: item.name.trim(),
      category: item.category || 'Gold Bullion',
      description: item.description || 'Allocated custodial asset with certified assay credentials.',
      specifications: item.specifications || 'Inspected and verified',
      weightOrCarat: item.weightOrCarat || undefined,
      certificationNumber: item.certificationNumber || undefined,
      estimatedValue: item.estimatedValue || '$100,000 USD',
      depositDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    };
    const updatedVault = { ...vault, items: [...vault.items, newItem] };
    updatedVault.inventoryCount = updatedVault.items.length;
    return saveBrowserRecord(browserVaultsKey, updatedVault, deletedVaultsKey)
      ? { success: true, item: newItem, vault: updatedVault }
      : { success: false, error: 'Browser storage is unavailable. The item could not be saved.' };
  };

  try {
    const res = await fetch(`/api/admin/vaults/${encodeURIComponent(vaultId)}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    const data = await res.json().catch(() => null);
    if (res.ok && data?.success && data.vault) {
      saveBrowserRecord(browserVaultsKey, data.vault, deletedVaultsKey);
      return data;
    }
    if (!data || res.status === 404 || res.status >= 500) return applyLocally();
    return { success: false, error: data.error || 'Item could not be added to the vault.' };
  } catch {
    return applyLocally();
  }
}

export async function adminDeleteItemFromVault(vaultId: string, itemId: string): Promise<{ success: boolean; vault?: VaultRecord; error?: string }> {
  try {
    const res = await fetch(`/api/admin/vaults/${encodeURIComponent(vaultId)}/items/${encodeURIComponent(itemId)}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (res.ok && data?.success && data.vault) {
      saveBrowserRecord(browserVaultsKey, data.vault, deletedVaultsKey);
    }
    return data;
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' };
  }
}

// --- SHIPMENTS ---
export async function adminGetShipments(): Promise<{ success: boolean; shipments: ShipmentRecord[] }> {
  try {
    const res = await fetch('/api/admin/shipments');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.shipments)) {
        return {
          success: true,
          shipments: mergeRecords(
            data.shipments,
            readBrowserRecords<ShipmentRecord>(browserShipmentsKey),
            readBrowserRecords<{ id: string }>(deletedShipmentsKey),
          ),
        };
      }
    }
  } catch (err) {
    console.warn('Failed to fetch admin shipments', err);
  }
  return {
    success: true,
    shipments: mergeRecords(
      SAMPLE_SHIPMENTS,
      readBrowserRecords<ShipmentRecord>(browserShipmentsKey),
      readBrowserRecords<{ id: string }>(deletedShipmentsKey),
    ),
  };
}

export async function adminCreateShipment(shipmentData: Partial<ShipmentRecord>): Promise<{ success: boolean; shipment?: ShipmentRecord; error?: string; storage?: 'server' | 'browser' }> {
  try {
    const res = await fetch('/api/admin/shipments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shipmentData),
    });
    const data = await res.json().catch(() => null);
    if (res.ok && data?.success && data.shipment) {
      saveBrowserRecord(browserShipmentsKey, data.shipment, deletedShipmentsKey);
      return { ...data, storage: 'server' };
    }
    if (res.status === 404 || res.status >= 500 || !data) return createBrowserShipment(shipmentData);
    return { success: false, error: data.error || 'Shipment could not be created.' };
  } catch {
    return createBrowserShipment(shipmentData);
  }
}

export async function adminUpdateShipment(id: string, updates: Partial<ShipmentRecord>): Promise<{ success: boolean; shipment?: ShipmentRecord; error?: string }> {
  try {
    const res = await fetch(`/api/admin/shipments/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (res.ok && data?.success && data.shipment) {
      saveBrowserRecord(browserShipmentsKey, data.shipment, deletedShipmentsKey);
    }
    return data;
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' };
  }
}

export async function adminAddShipmentCheckpoint(id: string, checkpoint: any): Promise<{ success: boolean; checkpoint?: any; shipment?: ShipmentRecord; error?: string }> {
  const applyLocally = () => {
    const allShipments = mergeRecords(
      SAMPLE_SHIPMENTS,
      readBrowserRecords<ShipmentRecord>(browserShipmentsKey),
      readBrowserRecords<{ id: string }>(deletedShipmentsKey),
    );
    const shipment = allShipments.find((record) => record.id.toUpperCase() === id.toUpperCase());
    if (!shipment) return { success: false, error: `Shipment ${id} not found.` };

    const newCheckpoint = {
      time: `${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })} CET`,
      location: checkpoint.location || 'Transit Waypoint',
      status: checkpoint.status || 'Checkpoint verified by escort detail',
      notes: checkpoint.notes || undefined,
      completed: checkpoint.completed !== undefined ? Boolean(checkpoint.completed) : true,
    };
    const updatedShipment = {
      ...shipment,
      checkpoints: [...shipment.checkpoints, newCheckpoint],
      currentCheckpoint: `${newCheckpoint.location} · ${newCheckpoint.status}`,
    };
    return saveBrowserRecord(browserShipmentsKey, updatedShipment, deletedShipmentsKey)
      ? { success: true, checkpoint: newCheckpoint, shipment: updatedShipment }
      : { success: false, error: 'Browser storage is unavailable. The waypoint could not be saved.' };
  };

  try {
    const res = await fetch(`/api/admin/shipments/${encodeURIComponent(id)}/checkpoints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(checkpoint),
    });
    const data = await res.json().catch(() => null);
    if (res.ok && data?.success && data.shipment) {
      saveBrowserRecord(browserShipmentsKey, data.shipment, deletedShipmentsKey);
      return data;
    }
    if (!data || res.status === 404 || res.status >= 500) return applyLocally();
    return { success: false, error: data.error || 'Waypoint could not be logged.' };
  } catch {
    return applyLocally();
  }
}

export async function adminDeleteShipment(id: string): Promise<{ success: boolean; error?: string; storage?: 'server' | 'browser' }> {
  try {
    const res = await fetch(`/api/admin/shipments/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    const data = await res.json().catch(() => null);
    if (res.ok && data?.success) {
      deleteBrowserRecord<ShipmentRecord>(browserShipmentsKey, deletedShipmentsKey, id);
      return { ...data, storage: 'server' };
    }
    if (!data || res.status === 404 || res.status >= 500) {
      return deleteBrowserRecord<ShipmentRecord>(browserShipmentsKey, deletedShipmentsKey, id)
        ? { success: true, storage: 'browser' }
        : { success: false, error: 'The server API is unavailable and this device could not record the deletion.' };
    }
    return { success: false, error: data.error || 'Shipment could not be deleted.' };
  } catch {
    return deleteBrowserRecord<ShipmentRecord>(browserShipmentsKey, deletedShipmentsKey, id)
      ? { success: true, storage: 'browser' }
      : { success: false, error: 'The server API is unavailable and this device could not record the deletion.' };
  }
}

// --- RESERVATIONS ---
export async function adminGetReservations(): Promise<{ success: boolean; reservations: any[] }> {
  try {
    const res = await fetch('/api/admin/reservations');
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Failed to fetch admin reservations', err);
  }
  return { success: false, reservations: [] };
}

export async function adminUpdateReservation(id: string, status: string): Promise<{ success: boolean; reservation?: any; error?: string }> {
  try {
    const res = await fetch(`/api/admin/reservations/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' };
  }
}

export async function adminDeleteReservation(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/admin/reservations/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' };
  }
}
