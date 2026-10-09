export interface AllocatedItem {
  id: string;
  name: string;
  category: 'Gold Bullion' | 'Diamonds' | 'Platinum' | 'Fine Horology' | 'Precious Artifacts';
  description: string;
  specifications: string;
  weightOrCarat?: string;
  certificationNumber?: string;
  estimatedValue: string;
  depositDate: string;
}

export interface VaultRecord {
  id: string;
  type: 'vault';
  vaultNumber: string;
  facility: string;
  country: string;
  tier: 'Class I Lockbox' | 'Class I Safe Deposit Box' | 'Class II Depository Drawer' | 'Class III Fortress Chamber' | string;
  status: 'Allocated & Sealed' | 'Under Scheduled Audit' | 'Accessible by Custodian' | string;
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

export interface ShipmentCheckpoint {
  time: string;
  location: string;
  status: string;
  completed: boolean;
  notes?: string;
}

export interface ShipmentRecord {
  id: string;
  type: 'shipment';
  trackingNumber: string;
  manifestDescription: string;
  originFacility: string;
  destination: string;
  courierLevel: 'Level 5 Armed Convoy' | 'Guarded Diplomatic Air Courier' | 'Armored Maritime Escort' | string;
  transitStatus: 'In Transit' | 'Cleared Customs / Apron Transfer' | 'Dispatched Final Mile' | 'Delivered & Handed Over' | string;
  currentCheckpoint: string;
  estimatedDelivery: string;
  securityTeamCallsign: string;
  leadCourier: string;
  biometricSealVerified: boolean;
  vaultOriginId: string;
  checkpoints: ShipmentCheckpoint[];
}

export const SAMPLE_VAULTS: VaultRecord[] = [
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
        description: 'White gold reversible double-dial wristwatch with original wooden presentation case and archive extracts.',
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
    inventoryCount: 6,
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

export const SAMPLE_SHIPMENTS: ShipmentRecord[] = [
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
    destination: 'Private Jet Terminal (FBO) · Nice Côte d\'Azur Airport, France',
    courierLevel: 'Guarded Diplomatic Air Courier',
    transitStatus: 'Cleared Customs / Apron Transfer',
    currentCheckpoint: 'Nice Côte d\'Azur Airport · Signature Flight Support Apron',
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
        location: 'Nice Côte d\'Azur Airport (LFMN)',
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
  {
    id: 'TRK-ARM-9914',
    type: 'shipment',
    trackingNumber: 'TRK-ARM-9914',
    manifestDescription: 'High-Value Precious Ingot Dispatch: 2 × 400 oz Standard Bullion Bars',
    originFacility: 'Valtrust Singapore Freeport Depository',
    destination: 'Bank of International Settlements Depository Partner, Geneva',
    courierLevel: 'Level 5 Armed Convoy',
    transitStatus: 'Dispatched Final Mile',
    currentCheckpoint: 'Geneva FreePort Bonded Apron Security Checkpoint',
    estimatedDelivery: 'Tomorrow · 10:00 CET',
    securityTeamCallsign: 'Centurion Global Logistics',
    leadCourier: 'Commander T. Al-Sayed',
    biometricSealVerified: true,
    vaultOriginId: 'VSG-VLT-5104',
    checkpoints: [
      {
        time: '18:00 SGT (Yesterday)',
        location: 'Singapore Freeport Secure Vault',
        status: 'Dual Key Authorization & Bullion Assay Hologram Affixed',
        completed: true,
      },
      {
        time: '04:30 CET (Today)',
        location: 'Geneva Airport Cargo Secure Hangar',
        status: 'Inter-Continental Armored Air Transport Handover',
        completed: true,
      },
      {
        time: '09:00 CET (Current)',
        location: 'Geneva FreePort Bonded Terminal',
        status: 'Armored Vault Arm Transfer in Progress',
        completed: false,
      },
    ],
  },
];

export function lookupCustodyRecord(query: string): {
  type: 'vault' | 'shipment' | 'not_found';
  vault?: VaultRecord;
  shipment?: ShipmentRecord;
} {
  const clean = query.trim().toUpperCase();
  if (!clean) return { type: 'not_found' };

  // Check matching vault
  const vault = SAMPLE_VAULTS.find(
    (v) => v.id.toUpperCase() === clean || v.vaultNumber.toUpperCase() === clean || clean.includes(v.id.slice(-4))
  );
  if (vault) return { type: 'vault', vault };

  // Check matching shipment
  const shipment = SAMPLE_SHIPMENTS.find(
    (s) => s.id.toUpperCase() === clean || s.trackingNumber.toUpperCase() === clean || clean.includes(s.id.slice(-4))
  );
  if (shipment) return { type: 'shipment', shipment };

  // If user typed something looking like a vault ID (e.g. VLT or VAULT or custom digits)
  if (clean.includes('VLT') || clean.includes('VAULT') || clean.startsWith('VSG-V')) {
    return {
      type: 'vault',
      vault: {
        id: clean.startsWith('VSG-VLT-') ? clean : `VSG-VLT-${clean.replace(/[^0-9]/g, '').padEnd(4, '7').slice(0, 4)}`,
        type: 'vault',
        vaultNumber: `INT-SEC-${clean.replace(/[^A-Z0-9]/g, '').slice(0, 6) || '8842'}`,
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
        inventoryCount: 3,
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
      },
    };
  }

  // If user typed something looking like a shipment tracking ID (TRK, ARM, AIR, or number)
  if (clean.includes('TRK') || clean.includes('TRACK') || clean.includes('ARM') || clean.includes('AIR') || clean.length >= 5) {
    return {
      type: 'shipment',
      shipment: {
        id: clean.startsWith('TRK-') ? clean : `TRK-ARM-${clean.replace(/[^0-9]/g, '').padEnd(4, '3').slice(0, 4)}`,
        type: 'shipment',
        trackingNumber: clean.startsWith('TRK-') ? clean : `TRK-ARM-${clean.replace(/[^0-9]/g, '').padEnd(4, '3').slice(0, 4)}`,
        manifestDescription: 'Secure Armored Escort: High-Value Precious Specie & Allocated Custodial Assets',
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
      },
    };
  }

  return { type: 'not_found' };
}

export const BULLION_CATALOG = [
  {
    id: 'GOLD-1KG',
    title: 'London Good Delivery 1kg Cast Gold Bar',
    category: 'Physical Gold Bullion',
    purity: '999.9 Fine Gold (24K)',
    weight: '1,000 grams (32.15 troy oz)',
    origin: 'Argor-Heraeus / Valcambi Suisse',
    spotReference: '$92,840 USD',
    custodyOption: 'Store directly in Zurich, London, or Singapore Vault',
    shippingOption: 'Armored convoy on-demand worldwide',
  },
  {
    id: 'GOLD-100G',
    title: '100g Minted Investment Gold Ingot',
    category: 'Physical Gold Bullion',
    purity: '999.9 Fine Gold',
    weight: '100 grams (3.215 troy oz)',
    origin: 'PAMP Suisse Fortuna Sealed Certicard',
    spotReference: '$9,310 USD',
    custodyOption: 'Class I Safe Deposit Box allocation',
    shippingOption: 'White-glove armed courier delivery',
  },
  {
    id: 'DIA-504',
    title: '5.04ct D Flawless Type IIa Radiant Diamond',
    category: 'Investment-Grade Diamond',
    purity: 'Type IIa Chemical Purity (Zero Nitrogen)',
    weight: '5.04 carats',
    origin: 'GIA Certified, Conflict-Free Verified Provenance',
    spotReference: '$1,850,000 USD',
    custodyOption: 'Private inspection salon access + nitrogen preservation',
    shippingOption: 'Diplomatic flight courier + armed terminal escort',
  },
  {
    id: 'PLAT-1KG',
    title: '1kg Investment Platinum Ingot',
    category: 'Precious Metals',
    purity: '999.5 Fine Platinum',
    weight: '1,000 grams',
    origin: 'Credit Suisse / Valcambi Assayed',
    spotReference: '$34,500 USD',
    custodyOption: '100% Lloyds-syndicate insured physical storage',
    shippingOption: 'Discreet armored transport to private address',
  },
];
