import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-Memory Database for Depository Operations
interface AllocatedItem {
  id: string;
  name: string;
  category: string;
  description: string;
  specifications: string;
  weightOrCarat?: string;
  certificationNumber?: string;
  estimatedValue: string;
  depositDate: string;
}

interface VaultRecord {
  id: string;
  type: 'vault';
  vaultNumber: string;
  facility: string;
  country: string;
  tier: string;
  status: string;
  securityRating: string;
  insuranceUnderwriter: string;
  coverageLimit: string;
  lastPhysicalAudit: string;
  biometricKeysRegistered: number;
  environmentCondition: string;
  inventoryCount: number;
  totalEstimatedValue: string;
  items: AllocatedItem[];
}

interface ShipmentCheckpoint {
  time: string;
  location: string;
  status: string;
  completed: boolean;
  notes?: string;
}

interface ShipmentRecord {
  id: string;
  type: 'shipment';
  trackingNumber: string;
  manifestDescription: string;
  originFacility: string;
  destination: string;
  courierLevel: string;
  transitStatus: string;
  currentCheckpoint: string;
  estimatedDelivery: string;
  securityTeamCallsign: string;
  leadCourier: string;
  biometricSealVerified: boolean;
  vaultOriginId: string;
  checkpoints: ShipmentCheckpoint[];
}

interface ReservationRecord {
  id: string;
  facility: string;
  tier: string;
  assetType: string;
  estValue: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  status: string;
  createdAt: string;
}

const vaults: VaultRecord[] = [
  {
    id: 'VSG-VLT-8842',
    type: 'vault',
    vaultNumber: 'CH-ZRH-8842',
    facility: 'Zurich Bedrock Depository — Sub-Level 4',
    country: 'Switzerland',
    tier: 'Class II Depository Drawer',
    status: 'Allocated & Sealed',
    securityRating: 'EN 1143-1 Grade XIII (Sovereign Depository)',
    insuranceUnderwriter: "Lloyd's of London Specie Syndicate #4401",
    coverageLimit: '$15,000,000 USD Full All-Risk Specie',
    lastPhysicalAudit: 'Oct 04, 2026 · 14:20 CET (Dual-Custodian Witness)',
    biometricKeysRegistered: 2,
    environmentCondition: '19.8°C · 42% RH · Inert Nitrogen Enriched',
    inventoryCount: 4,
    totalEstimatedValue: '$8,420,000 USD',
    items: [
      {
        id: 'ITM-901',
        name: 'London Good Delivery 1kg Cast Gold Bars (×3)',
        category: 'Gold Bullion',
        description: 'Argor-Heraeus SA fine gold bars, 999.9 purity, individually serialized with assay certificates.',
        specifications: '3 × 1,000.0g · Serial #AH-881920 to #AH-881922',
        weightOrCarat: '3.000 kg (96.45 ozt)',
        certificationNumber: 'LBMA-CH-99410',
        estimatedValue: '$278,400 USD',
        depositDate: 'Jan 14, 2026',
      },
      {
        id: 'ITM-902',
        name: '5.24ct D Flawless Type IIa Emerald-Cut Diamond',
        category: 'Diamonds',
        description: 'GIA certified exceptional chemical purity Type IIa diamond, excellent polish, excellent symmetry, nil fluorescence.',
        specifications: 'Color D · Clarity Flawless · Cut Excellent · 11.84 × 8.72 mm',
        weightOrCarat: '5.24 carats',
        certificationNumber: 'GIA #2238491024',
        estimatedValue: '$1,850,000 USD',
        depositDate: 'Mar 22, 2026',
      },
      {
        id: 'ITM-903',
        name: '4.10ct Fancy Vivid Pink Radiant-Cut Diamond',
        category: 'Diamonds',
        description: 'Argyle origin provenance, certified Fancy Vivid Pink, VS1 clarity, premier collector asset.',
        specifications: 'Color Fancy Vivid Pink · Clarity VS1 · Modified Radiant',
        weightOrCarat: '4.10 carats',
        certificationNumber: 'GIA #5198274112 / Argyle #48201',
        estimatedValue: '$5,400,000 USD',
        depositDate: 'May 09, 2026',
      },
      {
        id: 'ITM-904',
        name: 'Valcambi Suisse 500g Minted Platinum Ingot',
        category: 'Platinum',
        description: '999.5 Fine Platinum bar sealed in tamper-evident security certicard.',
        specifications: '500.0g · Serial #PL-009418',
        weightOrCarat: '500 g (16.075 ozt)',
        certificationNumber: 'LPPM-98214',
        estimatedValue: '$22,600 USD',
        depositDate: 'Jul 18, 2026',
      },
    ],
  },
  {
    id: 'VSG-VLT-9021',
    type: 'vault',
    vaultNumber: 'GB-LON-9021',
    facility: 'London Mayfair Safe Depository — Vault Suite B',
    country: 'United Kingdom',
    tier: 'Class I Lockbox',
    status: 'Allocated & Sealed',
    securityRating: 'UL 608 Class 3 Vault Armor',
    insuranceUnderwriter: "Lloyd's Specie & Fine Art Consortia",
    coverageLimit: '$5,000,000 USD Sovereign Custody',
    lastPhysicalAudit: 'Oct 02, 2026 · 11:15 GMT',
    biometricKeysRegistered: 1,
    environmentCondition: '20.1°C · 45% RH · HEPA Filtered',
    inventoryCount: 2,
    totalEstimatedValue: '$3,180,000 USD',
    items: [
      {
        id: 'ITM-701',
        name: 'Patek Philippe Grandmaster Chime Ref. 6300G',
        category: 'Fine Horology',
        description: 'White gold reversible double-dial wristwatch with original presentation case and archive extracts.',
        specifications: 'Caliber 300 GS AL 36-750 QIS FUS IRM · 20 Complications',
        estimatedValue: '$2,850,000 USD',
        depositDate: 'Feb 10, 2026',
      },
      {
        id: 'ITM-702',
        name: '100 oz Fine Gold 999.9 Johnson Matthey Bullion',
        category: 'Gold Bullion',
        description: 'Vintage serialized cast gold bullion ingot with original refinery hallmarks.',
        specifications: '100.0 oz Troy · Serial #JM-449102',
        weightOrCarat: '3.11 kg',
        certificationNumber: 'JM-LONDON-82',
        estimatedValue: '$330,000 USD',
        depositDate: 'Aug 14, 2026',
      },
    ],
  },
  {
    id: 'VSG-VLT-5104',
    type: 'vault',
    vaultNumber: 'SG-SIN-5104',
    facility: 'Singapore Freeport Depository — Vault Delta',
    country: 'Singapore',
    tier: 'Class III Fortress Chamber',
    status: 'Allocated & Sealed',
    securityRating: 'Monetary Authority Grade & Military Anti-Intrusion',
    insuranceUnderwriter: 'Chubb Global Fine Art & Specie',
    coverageLimit: '$50,000,000 USD Institutional Master Vault',
    lastPhysicalAudit: 'Sep 29, 2026 · 16:45 SGT',
    biometricKeysRegistered: 3,
    environmentCondition: '19.5°C · 40% RH · Climate Matrix Active',
    inventoryCount: 2,
    totalEstimatedValue: '$18,900,000 USD',
    items: [
      {
        id: 'ITM-501',
        name: 'London Good Delivery 400 oz Standard Bullion Bar (×2)',
        category: 'Gold Bullion',
        description: 'Central bank grade 400 troy ounce gold bars, 999.9 fine.',
        specifications: '2 × 12.44 kg · Serial #RC-77104 & #RC-77105',
        weightOrCarat: '24.88 kg (800 ozt)',
        certificationNumber: 'LBMA-SIN-4001',
        estimatedValue: '$2,640,000 USD',
        depositDate: 'Mar 01, 2026',
      },
      {
        id: 'ITM-502',
        name: 'Rare Burma Untreated Pigeon Blood Ruby Suite',
        category: 'Precious Artifacts',
        description: 'Certified no heat Burmese rubies mounted with D Flawless baguette diamonds, SSEF & Gübelin certificates.',
        specifications: 'Total Ruby Weight 28.4 cts · Total Diamond 12.2 cts',
        estimatedValue: '$16,260,000 USD',
        depositDate: 'Apr 11, 2026',
      },
    ],
  },
];

const shipments: ShipmentRecord[] = [
  {
    id: 'TRK-ARM-7729',
    type: 'shipment',
    trackingNumber: 'TRK-ARM-7729',
    manifestDescription: 'Secure Armored Transit: 3 × 1kg Argor-Heraeus Gold Bullion + 1 × 5.24ct Investment Diamond',
    originFacility: 'Valtrust Zurich Bedrock Depository (Switzerland)',
    destination: 'Private Family Residence · St. Moritz, Engadin Valley',
    courierLevel: 'Level 5 Armed Convoy',
    transitStatus: 'In Transit',
    currentCheckpoint: 'Alpine Corridor Checkpoint 04 · Chur Secure Staging Facility',
    estimatedDelivery: 'Today · 16:30 CET',
    securityTeamCallsign: 'Sentinel Shield Unit Echo',
    leadCourier: 'Captain M. von Berg (Biometric Keyholder #09)',
    biometricSealVerified: true,
    vaultOriginId: 'VSG-VLT-8842',
    checkpoints: [
      {
        time: '08:00 CET',
        location: 'Zurich Vault Deep Sub-Level 4',
        status: 'Vault Compartment Unsealed under Dual-Biometric Authentication',
        completed: true,
        notes: 'Independent auditor and Valtrust custody director present. Tamper-evident biometric Faraday case locked.',
      },
      {
        time: '09:45 CET',
        location: 'Zurich Depository Secure Sally Port',
        status: 'Loaded into Level B7 Armored Transport Vehicle',
        completed: true,
        notes: 'Satellite telemetry engaged, non-lethal defensive countermeasure systems online.',
      },
      {
        time: '12:15 CET',
        location: 'Chur Secure Escort Waypoint',
        status: 'Convoy Rotation & Route Cryptographic Re-verification',
        completed: true,
        notes: 'All security seals verified intact; escort team handover verified.',
      },
      {
        time: '14:50 CET (Current)',
        location: 'Engadin Alpine Approach',
        status: 'En Route to Final Safe-Hand Destination',
        completed: false,
        notes: 'Direct communication line open with client security detail.',
      },
      {
        time: '16:30 CET (Est.)',
        location: 'Private Residence Vault, St. Moritz',
        status: 'Safe-Hand Handover & Digital Certificate Exchange',
        completed: false,
      },
    ],
  },
  {
    id: 'TRK-AIR-4105',
    type: 'shipment',
    trackingNumber: 'TRK-AIR-4105',
    manifestDescription: 'Guarded Airside Courier: Patek Philippe Ref. 6300G Fine Horology',
    originFacility: 'Valtrust Mayfair Depository (London, UK)',
    destination: "Private Jet Terminal (FBO) · Nice Côte d'Azur Airport, France",
    courierLevel: 'Guarded Diplomatic Air Courier',
    transitStatus: 'Cleared Customs / Apron Transfer',
    currentCheckpoint: "Nice Côte d'Azur Airport · Signature Flight Support Apron",
    estimatedDelivery: 'Today · 15:45 CEST',
    securityTeamCallsign: 'AeroSentinel Unit 3',
    leadCourier: 'Special Agent D. Vance',
    biometricSealVerified: true,
    vaultOriginId: 'VSG-VLT-9021',
    checkpoints: [
      {
        time: '06:30 GMT',
        location: 'London Mayfair Depository',
        status: 'Custodial Extraction & Pelican Storm Case Titanium Seal Affixed',
        completed: true,
      },
      {
        time: '08:15 GMT',
        location: 'RAF Northolt Private Aviation Apron',
        status: 'Diplomatic Courier Air Clearance Granted',
        completed: true,
      },
      {
        time: '13:20 CEST',
        location: "Nice Côte d'Azur Airport (LFMN)",
        status: 'Charter Touchdown & Sovereign Cargo Clearance',
        completed: true,
      },
      {
        time: '15:45 CEST (Est.)',
        location: 'Nice Executive Tarmac Handover',
        status: 'Safe-Hand Escort to Superyacht Helideck / Client Representative',
        completed: false,
      },
    ],
  },
];

const reservations: ReservationRecord[] = [];
const procurementOrders: any[] = [];

// API ENDPOINTS

// 1. Health check & depository stats
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'operational',
    service: 'Valtrust Sentinel Global Depository API',
    jurisdictions: ['Zurich', 'London', 'Singapore', 'Geneva'],
    timestamp: new Date().toISOString(),
    stats: {
      activeVaultsCount: vaults.length,
      activeShipmentsCount: shipments.length,
      reservationsRegistered: reservations.length,
    },
  });
});

// 2. Search Vault or Track Shipment
app.get('/api/search', (req: Request, res: Response) => {
  const query = String(req.query.q || '').trim().toUpperCase();

  if (!query) {
    return res.status(400).json({
      success: false,
      error: 'Query parameter "q" is required',
    });
  }

  // Check matching vault
  const vaultMatch = vaults.find(
    (v) =>
      v.id.toUpperCase() === query ||
      v.vaultNumber.toUpperCase() === query ||
      query.includes(v.id.slice(-4))
  );

  if (vaultMatch) {
    return res.json({
      success: true,
      type: 'vault',
      vault: vaultMatch,
    });
  }

  // Check matching shipment
  const shipmentMatch = shipments.find(
    (s) =>
      s.id.toUpperCase() === query ||
      s.trackingNumber.toUpperCase() === query ||
      query.includes(s.id.slice(-4))
  );

  if (shipmentMatch) {
    return res.json({
      success: true,
      type: 'shipment',
      shipment: shipmentMatch,
    });
  }

  // Dynamic Vault generation if query formatted like vault code
  if (query.includes('VLT') || query.includes('VAULT') || query.startsWith('VSG-V')) {
    const customVaultId = query.startsWith('VSG-VLT-')
      ? query
      : `VSG-VLT-${query.replace(/[^0-9]/g, '').padEnd(4, '7').slice(0, 4)}`;

    const newVault: VaultRecord = {
      id: customVaultId,
      type: 'vault',
      vaultNumber: `INT-SEC-${query.replace(/[^A-Z0-9]/g, '').slice(0, 6) || '8842'}`,
      facility: 'Valtrust Sovereign Depository — High-Security Sub-Bedrock Suite',
      country: 'Switzerland',
      tier: 'Class II Depository Drawer',
      status: 'Allocated & Sealed',
      securityRating: 'EN 1143-1 Grade XIII (Biometric Interlock)',
      insuranceUnderwriter: "Lloyd's of London Specie Consortia",
      coverageLimit: '$10,000,000 USD Full All-Risk Allocation',
      lastPhysicalAudit: 'Physical Audit Verified (Dual-Key Custodian)',
      biometricKeysRegistered: 2,
      environmentCondition: '19.8°C · 42% RH · Inert Gas Shielding',
      inventoryCount: 2,
      totalEstimatedValue: '$4,750,000 USD',
      items: [
        {
          id: 'ITM-USR-01',
          name: 'Fine Gold Cast Ingot 1kg 999.9 Purity',
          category: 'Gold Bullion',
          description: 'Assayed allocated investment bullion bar with certified serial hallmarks.',
          weightOrCarat: '1.000 kg',
          certificationNumber: 'LBMA-CH-VERIFIED',
          estimatedValue: '$92,800 USD',
          depositDate: 'Verified Custodial Deposit',
          specifications: '1000.0g · 999.9 Fine Gold',
        },
        {
          id: 'ITM-USR-02',
          name: 'Investment Diamond Lot (3.80ct Oval Brilliant Cut)',
          category: 'Diamonds',
          description: 'D Color, VVS1 Clarity, Flawless Luster with GIA Sovereign Micro-Inscription.',
          weightOrCarat: '3.80 carats',
          certificationNumber: 'GIA-CERT-REGISTERED',
          estimatedValue: '$1,450,000 USD',
          depositDate: 'Verified Custodial Deposit',
          specifications: '3.80ct · D/VVS1 · Triple Excellent',
        },
      ],
    };

    vaults.push(newVault);
    return res.json({
      success: true,
      type: 'vault',
      vault: newVault,
      dynamicallyAllocated: true,
    });
  }

  // Dynamic Shipment generation if query formatted like shipment code
  if (
    query.includes('TRK') ||
    query.includes('TRACK') ||
    query.includes('ARM') ||
    query.includes('AIR') ||
    query.length >= 5
  ) {
    const customTracking = query.startsWith('TRK-')
      ? query
      : `TRK-ARM-${query.replace(/[^0-9]/g, '').padEnd(4, '3').slice(0, 4)}`;

    const newShipment: ShipmentRecord = {
      id: customTracking,
      type: 'shipment',
      trackingNumber: customTracking,
      manifestDescription:
        'Secure Armored Escort: High-Value Precious Specie & Allocated Custodial Assets',
      originFacility: 'Valtrust Central Depository Secure Sally Port',
      destination: 'Client Designated Secure Receiving Destination',
      courierLevel: 'Level 5 Armed Convoy',
      transitStatus: 'In Transit',
      currentCheckpoint: 'Regional Armored Corridor · Secure Convoy Waypoint',
      estimatedDelivery: 'Within 4 Hours (Discreet Safe-Hand Protocol)',
      securityTeamCallsign: 'Sentinel Tactical Escort 07',
      leadCourier: 'Officer J. St. Claire (Custody Officer)',
      biometricSealVerified: true,
      vaultOriginId: 'VSG-VLT-ALLOCATED',
      checkpoints: [
        {
          time: 'Extraction Complete',
          location: 'Central Vault Depository Sub-Level',
          status: 'Dual Biometric Unseal & Armor Case Handover',
          completed: true,
          notes: 'Tamper-evident seals inspected and verified.',
        },
        {
          time: 'En Route',
          location: 'Armored Transit Corridor',
          status: 'Convoy Satellite Telemetry & Armed Security Active',
          completed: true,
          notes: 'Continuous encrypted radio telemetry with Valtrust Command Desk.',
        },
        {
          time: 'Pending Safe-Hand',
          location: 'Designated Handover Location',
          status: 'Biometric Handover & Final Custody Release',
          completed: false,
          notes: 'Dual sign-off upon physical inspection.',
        },
      ],
    };

    shipments.push(newShipment);
    return res.json({
      success: true,
      type: 'shipment',
      shipment: newShipment,
      dynamicallyAllocated: true,
    });
  }

  return res.json({
    success: true,
    type: 'not_found',
  });
});

// 3. Reserve Vault Allocation
app.post('/api/reserve', (req: Request, res: Response) => {
  const {
    facility,
    tier,
    assetType,
    estValue,
    clientName,
    clientEmail,
    clientPhone,
  } = req.body;

  if (!clientName || !clientEmail) {
    return res.status(400).json({
      success: false,
      error: 'Client legal name and confidential email are required.',
    });
  }

  const referenceCode = `VSG-RES-${Math.floor(1000 + Math.random() * 9000)}`;

  const reservation: ReservationRecord = {
    id: referenceCode,
    facility: facility || 'Zurich Bedrock Depository (Switzerland)',
    tier: tier || 'Class II Depository Drawer',
    assetType: assetType || 'Gold Bullion & Diamonds',
    estValue: estValue || '$5,000,000 USD',
    clientName: clientName.trim(),
    clientEmail: clientEmail.trim().toLowerCase(),
    clientPhone: clientPhone ? clientPhone.trim() : undefined,
    status: 'Pending Senior Director Review',
    createdAt: new Date().toISOString(),
  };

  reservations.push(reservation);

  res.status(201).json({
    success: true,
    referenceCode,
    reservation,
    message:
      'Confidential reservation dossier registered with Zurich Senior Custody Registrar. Confirmation sent to ' +
      clientEmail,
  });
});

// 4. Get All Reservations (for auditing / admin view)
app.get('/api/reservations', (req: Request, res: Response) => {
  res.json({
    success: true,
    count: reservations.length,
    reservations,
  });
});

// 5. Schedule Armored Dispatch / Ship Items
app.post('/api/dispatch', (req: Request, res: Response) => {
  const {
    vaultId,
    destination,
    escortLevel,
    recipientName,
    safeHandKey,
  } = req.body;

  if (!destination || !recipientName) {
    return res.status(400).json({
      success: false,
      error: 'Destination address and authorized recipient name are required.',
    });
  }

  const trackingNumber = `TRK-ARM-${Math.floor(1000 + Math.random() * 9000)}`;

  const newShipment: ShipmentRecord = {
    id: trackingNumber,
    type: 'shipment',
    trackingNumber,
    manifestDescription: `Dispatched Specie from Vault ${vaultId || 'VSG-VLT-8842'}`,
    originFacility: 'Valtrust Depository Sally Port',
    destination,
    courierLevel: escortLevel || 'Level 5 Armed Convoy',
    transitStatus: 'Dispatched Final Mile',
    currentCheckpoint: 'Secure Depository Sally Port · Convoy En Route',
    estimatedDelivery: 'Within 4 Hours (Discreet Safe-Hand Protocol)',
    securityTeamCallsign: 'Sentinel Shield Unit Echo',
    leadCourier: 'Officer R. Mercer',
    biometricSealVerified: true,
    vaultOriginId: vaultId || 'VSG-VLT-8842',
    checkpoints: [
      {
        time: 'Immediate',
        location: 'Depository Vault Sub-Level',
        status: 'Biometric Unseal & Safe-Hand Case Titanium Closure',
        completed: true,
      },
      {
        time: 'In Progress',
        location: 'Armored Transit Corridor',
        status: `Armed Escort Convoy En Route to ${destination}`,
        completed: false,
        notes: `Safe-Hand Handover assigned to recipient: ${recipientName}`,
      },
    ],
  };

  shipments.unshift(newShipment);

  res.status(201).json({
    success: true,
    trackingNumber,
    shipment: newShipment,
    message: `Armored safe-hand dispatch confirmed. Active waybill: ${trackingNumber}`,
  });
});

// 6. Procurement Order Desk
app.post('/api/procure', (req: Request, res: Response) => {
  const {
    itemId,
    title,
    quantity,
    actionType,
    destAddress,
    buyerName,
    buyerEmail,
  } = req.body;

  if (!buyerName || !buyerEmail) {
    return res.status(400).json({
      success: false,
      error: 'Buyer title and secure contact email are required.',
    });
  }

  const orderRef = `VSG-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  const order = {
    id: orderRef,
    itemId,
    title,
    quantity: quantity || 1,
    actionType: actionType || 'vault',
    destAddress: actionType === 'ship' ? destAddress : 'Direct Vault Allocation',
    buyerName,
    buyerEmail,
    status: 'Allocation Confirmed',
    createdAt: new Date().toISOString(),
  };

  procurementOrders.push(order);

  res.status(201).json({
    success: true,
    orderRef,
    order,
    message: 'Sovereign procurement order confirmed and locked.',
  });
});

// ==========================================
// ADMIN REGISTRAR CRUD OPERATIONS
// ==========================================

// --- VAULTS CRUD ---

// Read all vaults (Admin)
app.get('/api/admin/vaults', (req: Request, res: Response) => {
  res.json({
    success: true,
    count: vaults.length,
    vaults,
  });
});

// Create new vault (Admin)
app.post('/api/admin/vaults', (req: Request, res: Response) => {
  const {
    id,
    vaultNumber,
    facility,
    country,
    tier,
    status,
    securityRating,
    insuranceUnderwriter,
    coverageLimit,
    biometricKeysRegistered,
    totalEstimatedValue,
    items,
  } = req.body;

  const generatedId = id && id.trim() ? id.trim().toUpperCase() : `VSG-VLT-${Math.floor(1000 + Math.random() * 9000)}`;

  // Prevent duplicate ID
  if (vaults.some((v) => v.id.toUpperCase() === generatedId.toUpperCase())) {
    return res.status(409).json({
      success: false,
      error: `Vault with code ${generatedId} already exists in depository database.`,
    });
  }

  const newVault: VaultRecord = {
    id: generatedId,
    type: 'vault',
    vaultNumber: vaultNumber || `CH-ZRH-${generatedId.slice(-4)}`,
    facility: facility || 'Zurich Bedrock Depository — Sub-Level 4',
    country: country || 'Switzerland',
    tier: tier || 'Class II Depository Drawer',
    status: status || 'Allocated & Sealed',
    securityRating: securityRating || 'EN 1143-1 Grade XIII (Sovereign Depository)',
    insuranceUnderwriter: insuranceUnderwriter || "Lloyd's of London Specie Syndicate #4401",
    coverageLimit: coverageLimit || '$10,000,000 USD Full All-Risk Specie',
    lastPhysicalAudit: `Audit Verified · ${new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })} (Dual-Custodian Witness)`,
    biometricKeysRegistered: Number(biometricKeysRegistered) || 2,
    environmentCondition: '19.8°C · 42% RH · Inert Nitrogen Enriched',
    inventoryCount: Array.isArray(items) ? items.length : 0,
    totalEstimatedValue: totalEstimatedValue || '$5,000,000 USD',
    items: Array.isArray(items) ? items : [],
  };

  vaults.unshift(newVault);

  res.status(201).json({
    success: true,
    vault: newVault,
    message: `Vault ${newVault.id} successfully provisioned and allocated.`,
  });
});

// Update vault (Admin)
app.put('/api/admin/vaults/:id', (req: Request, res: Response) => {
  const vaultId = req.params.id.toUpperCase();
  const index = vaults.findIndex((v) => v.id.toUpperCase() === vaultId);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: `Vault ${vaultId} not found.`,
    });
  }

  const current = vaults[index];
  const {
    facility,
    tier,
    status,
    securityRating,
    insuranceUnderwriter,
    coverageLimit,
    biometricKeysRegistered,
    totalEstimatedValue,
    lastPhysicalAudit,
  } = req.body;

  vaults[index] = {
    ...current,
    facility: facility !== undefined ? facility : current.facility,
    tier: tier !== undefined ? tier : current.tier,
    status: status !== undefined ? status : current.status,
    securityRating: securityRating !== undefined ? securityRating : current.securityRating,
    insuranceUnderwriter: insuranceUnderwriter !== undefined ? insuranceUnderwriter : current.insuranceUnderwriter,
    coverageLimit: coverageLimit !== undefined ? coverageLimit : current.coverageLimit,
    biometricKeysRegistered: biometricKeysRegistered !== undefined ? Number(biometricKeysRegistered) : current.biometricKeysRegistered,
    totalEstimatedValue: totalEstimatedValue !== undefined ? totalEstimatedValue : current.totalEstimatedValue,
    lastPhysicalAudit: lastPhysicalAudit !== undefined ? lastPhysicalAudit : current.lastPhysicalAudit,
  };

  res.json({
    success: true,
    vault: vaults[index],
    message: `Vault ${vaultId} updated successfully.`,
  });
});

// Delete / De-allocate vault (Admin)
app.delete('/api/admin/vaults/:id', (req: Request, res: Response) => {
  const vaultId = req.params.id.toUpperCase();
  const index = vaults.findIndex((v) => v.id.toUpperCase() === vaultId);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: `Vault ${vaultId} not found.`,
    });
  }

  const removed = vaults.splice(index, 1)[0];

  res.json({
    success: true,
    deletedId: vaultId,
    message: `Vault ${vaultId} de-allocated and removed from active depository.`,
  });
});

// Add Item to Vault (Admin)
app.post('/api/admin/vaults/:id/items', (req: Request, res: Response) => {
  const vaultId = req.params.id.toUpperCase();
  const vault = vaults.find((v) => v.id.toUpperCase() === vaultId);

  if (!vault) {
    return res.status(404).json({
      success: false,
      error: `Vault ${vaultId} not found.`,
    });
  }

  const {
    name,
    category,
    description,
    specifications,
    weightOrCarat,
    certificationNumber,
    estimatedValue,
  } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      error: 'Item name is required.',
    });
  }

  const newItem: AllocatedItem = {
    id: `ITM-${Math.floor(1000 + Math.random() * 9000)}`,
    name,
    category: category || 'Gold Bullion',
    description: description || 'Allocated custodial asset with certified assay credentials.',
    specifications: specifications || 'Inspected and verified',
    weightOrCarat: weightOrCarat || undefined,
    certificationNumber: certificationNumber || undefined,
    estimatedValue: estimatedValue || '$100,000 USD',
    depositDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
  };

  vault.items.push(newItem);
  vault.inventoryCount = vault.items.length;

  res.status(201).json({
    success: true,
    item: newItem,
    vault,
    message: `Item added to vault ${vaultId}.`,
  });
});

// Remove Item from Vault (Admin)
app.delete('/api/admin/vaults/:id/items/:itemId', (req: Request, res: Response) => {
  const vaultId = req.params.id.toUpperCase();
  const itemId = req.params.itemId;
  const vault = vaults.find((v) => v.id.toUpperCase() === vaultId);

  if (!vault) {
    return res.status(404).json({ success: false, error: `Vault ${vaultId} not found.` });
  }

  const itemIndex = vault.items.findIndex((it) => it.id === itemId);
  if (itemIndex === -1) {
    return res.status(404).json({ success: false, error: `Item ${itemId} not found in vault.` });
  }

  vault.items.splice(itemIndex, 1);
  vault.inventoryCount = vault.items.length;

  res.json({
    success: true,
    message: `Item ${itemId} removed from vault ${vaultId}.`,
    vault,
  });
});

// --- SHIPMENTS CRUD ---

// Read all shipments (Admin)
app.get('/api/admin/shipments', (req: Request, res: Response) => {
  res.json({
    success: true,
    count: shipments.length,
    shipments,
  });
});

// Create new shipment dispatch (Admin)
app.post('/api/admin/shipments', (req: Request, res: Response) => {
  const {
    trackingNumber,
    manifestDescription,
    originFacility,
    destination,
    courierLevel,
    transitStatus,
    securityTeamCallsign,
    leadCourier,
    vaultOriginId,
  } = req.body;

  if (!manifestDescription || !destination) {
    return res.status(400).json({
      success: false,
      error: 'Manifest description and destination are required.',
    });
  }

  const trk = trackingNumber && trackingNumber.trim() ? trackingNumber.trim().toUpperCase() : `TRK-ARM-${Math.floor(1000 + Math.random() * 9000)}`;

  const newShipment: ShipmentRecord = {
    id: trk,
    type: 'shipment',
    trackingNumber: trk,
    manifestDescription,
    originFacility: originFacility || 'Valtrust Zurich Bedrock Depository (Switzerland)',
    destination,
    courierLevel: courierLevel || 'Level 5 Armed Convoy',
    transitStatus: transitStatus || 'In Transit',
    currentCheckpoint: `${originFacility || 'Zurich Sally Port'} · Satellite Telemetry Active`,
    estimatedDelivery: 'Within 6 Hours (Safe-Hand Protocol)',
    securityTeamCallsign: securityTeamCallsign || 'Sentinel Shield Unit Bravo',
    leadCourier: leadCourier || 'Officer K. Lindqvist',
    biometricSealVerified: true,
    vaultOriginId: vaultOriginId || 'VSG-VLT-ALLOCATED',
    checkpoints: [
      {
        time: 'Immediate',
        location: originFacility || 'Depository Sally Port',
        status: 'Dual-Biometric Extraction & Faraday Sealed Case Locked',
        completed: true,
      },
      {
        time: 'En Route',
        location: 'Secured Armored Transit Corridor',
        status: `Convoy En Route to ${destination}`,
        completed: false,
      },
    ],
  };

  shipments.unshift(newShipment);

  res.status(201).json({
    success: true,
    shipment: newShipment,
    message: `Shipment ${trk} dispatched and registered in tracking database.`,
  });
});

// Update shipment (Admin)
app.put('/api/admin/shipments/:id', (req: Request, res: Response) => {
  const trk = req.params.id.toUpperCase();
  const index = shipments.findIndex((s) => s.id.toUpperCase() === trk || s.trackingNumber.toUpperCase() === trk);

  if (index === -1) {
    return res.status(404).json({ success: false, error: `Shipment ${trk} not found.` });
  }

  const current = shipments[index];
  const {
    transitStatus,
    currentCheckpoint,
    estimatedDelivery,
    securityTeamCallsign,
    leadCourier,
  } = req.body;

  shipments[index] = {
    ...current,
    transitStatus: transitStatus !== undefined ? transitStatus : current.transitStatus,
    currentCheckpoint: currentCheckpoint !== undefined ? currentCheckpoint : current.currentCheckpoint,
    estimatedDelivery: estimatedDelivery !== undefined ? estimatedDelivery : current.estimatedDelivery,
    securityTeamCallsign: securityTeamCallsign !== undefined ? securityTeamCallsign : current.securityTeamCallsign,
    leadCourier: leadCourier !== undefined ? leadCourier : current.leadCourier,
  };

  res.json({
    success: true,
    shipment: shipments[index],
    message: `Shipment ${trk} updated successfully.`,
  });
});

// Add waypoint checkpoint to shipment (Admin)
app.post('/api/admin/shipments/:id/checkpoints', (req: Request, res: Response) => {
  const trk = req.params.id.toUpperCase();
  const shipment = shipments.find((s) => s.id.toUpperCase() === trk || s.trackingNumber.toUpperCase() === trk);

  if (!shipment) {
    return res.status(404).json({ success: false, error: `Shipment ${trk} not found.` });
  }

  const { location, status, notes, completed } = req.body;

  const newCheckpoint: ShipmentCheckpoint = {
    time: `${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })} CET`,
    location: location || 'Transit Waypoint',
    status: status || 'Checkpoint verified by escort detail',
    notes: notes || undefined,
    completed: completed !== undefined ? Boolean(completed) : true,
  };

  shipment.checkpoints.push(newCheckpoint);
  shipment.currentCheckpoint = `${location} · ${status}`;

  res.status(201).json({
    success: true,
    checkpoint: newCheckpoint,
    shipment,
    message: `Checkpoint logged for shipment ${trk}.`,
  });
});

// Delete / Archive shipment (Admin)
app.delete('/api/admin/shipments/:id', (req: Request, res: Response) => {
  const trk = req.params.id.toUpperCase();
  const index = shipments.findIndex((s) => s.id.toUpperCase() === trk || s.trackingNumber.toUpperCase() === trk);

  if (index === -1) {
    return res.status(404).json({ success: false, error: `Shipment ${trk} not found.` });
  }

  shipments.splice(index, 1);

  res.json({
    success: true,
    deletedId: trk,
    message: `Shipment ${trk} removed from active transit database.`,
  });
});

// --- RESERVATIONS CRUD ---

// Read all reservations (Admin)
app.get('/api/admin/reservations', (req: Request, res: Response) => {
  res.json({
    success: true,
    count: reservations.length,
    reservations,
  });
});

// Update reservation status (Admin)
app.put('/api/admin/reservations/:id', (req: Request, res: Response) => {
  const ref = req.params.id.toUpperCase();
  const index = reservations.findIndex((r) => r.id.toUpperCase() === ref);

  if (index === -1) {
    return res.status(404).json({ success: false, error: `Reservation ${ref} not found.` });
  }

  const { status } = req.body;
  if (status) {
    reservations[index].status = status;
  }

  res.json({
    success: true,
    reservation: reservations[index],
    message: `Reservation ${ref} updated to: ${status}`,
  });
});

// Delete reservation (Admin)
app.delete('/api/admin/reservations/:id', (req: Request, res: Response) => {
  const ref = req.params.id.toUpperCase();
  const index = reservations.findIndex((r) => r.id.toUpperCase() === ref);

  if (index === -1) {
    return res.status(404).json({ success: false, error: `Reservation ${ref} not found.` });
  }

  reservations.splice(index, 1);

  res.json({
    success: true,
    deletedId: ref,
    message: `Reservation dossier ${ref} archived and removed.`,
  });
});

// Production vs Development Mounting
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Valtrust Sentinel Global server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
