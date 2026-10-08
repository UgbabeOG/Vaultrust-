import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DepositoryCarousel } from './components/DepositoryCarousel';
import { VaultSearchTracker } from './components/VaultSearchTracker';
import { ThreePillarsSection } from './components/ThreePillarsSection';
import { ProcurementCatalog } from './components/ProcurementCatalog';
import { VaultTiersSection } from './components/VaultTiersSection';
import { PrivateSalonExperience } from './components/PrivateSalonExperience';
import { Footer } from './components/Footer';
import { ReserveModal, DispatchModal, ProcureModal } from './components/Modals';
import { BULLION_CATALOG } from './data/mockCustodyData';

export default function App() {
  const [isReserveOpen, setIsReserveOpen] = useState(false);
  const [reserveTier, setReserveTier] = useState('Class II Depository Drawer (Zurich Bedrock)');

  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [dispatchVaultId, setDispatchVaultId] = useState('VSG-VLT-8842');

  const [isProcureOpen, setIsProcureOpen] = useState(false);
  const [procureItem, setProcureItem] = useState<(typeof BULLION_CATALOG)[0] | null>(null);
  const [procureAction, setProcureAction] = useState<'vault' | 'ship'>('vault');

  const scrollToTracker = () => {
    const el = document.getElementById('tracker');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToProcurement = () => {
    const el = document.getElementById('procurement');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenReserve = (tier?: string) => {
    if (tier) setReserveTier(tier);
    setIsReserveOpen(true);
  };

  const handleScheduleDispatch = (vaultId: string) => {
    setDispatchVaultId(vaultId);
    setIsDispatchOpen(true);
  };

  const handleRequestSalonVisit = (vaultId: string) => {
    setReserveTier(`Inspection Salon Visit for Vault ${vaultId}`);
    setIsReserveOpen(true);
  };

  const handleAcquireItem = (
    item: (typeof BULLION_CATALOG)[0],
    actionType: 'vault' | 'ship'
  ) => {
    setProcureItem(item);
    setProcureAction(actionType);
    setIsProcureOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#08090b] text-[#e2e4e9] flex flex-col font-sans selection:bg-[#c5a059]/30 selection:text-[#faebd7]">
      {/* Strict Top Bar Contract Header */}
      <Navbar
        onOpenSearch={scrollToTracker}
        onOpenReserve={() => handleOpenReserve()}
      />

      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection
          onOpenReserve={() => handleOpenReserve()}
          onScrollToTracker={scrollToTracker}
        />

        {/* Depository Operations Carousel & Image Showcase */}
        <div id="gallery">
          <DepositoryCarousel
            onReserve={() => handleOpenReserve('Class II Depository Drawer (Zurich Bedrock)')}
            onSalon={() => {
              setReserveTier('Private Salon Booking (Swiss Depository)');
              setIsReserveOpen(true);
            }}
            onDispatch={() => setIsDispatchOpen(true)}
            onProcure={scrollToProcurement}
          />
        </div>

        {/* The Three Pillars: Buy · Store · Ship */}
        <ThreePillarsSection
          onOpenProcurement={scrollToProcurement}
          onOpenReserve={() => handleOpenReserve()}
          onOpenDispatch={() => setIsDispatchOpen(true)}
        />

        {/* Marquee Interactive Feature: Vault Inspection & In-Flight Shipment Tracker */}
        <VaultSearchTracker
          onScheduleDispatch={handleScheduleDispatch}
          onRequestSalonVisit={handleRequestSalonVisit}
        />

        {/* Precious Metals & Rare Diamonds Procurement Desk */}
        <ProcurementCatalog onAcquireItem={handleAcquireItem} />

        {/* Depository Space Tiers & Reservation Configurator */}
        <VaultTiersSection onSelectTier={(tierName) => handleOpenReserve(tierName)} />

        {/* Private Viewing Salons & Faraday Inspection Suites */}
        <PrivateSalonExperience
          onBookSalon={() => {
            setReserveTier('Private Salon Booking (Zurich Depository)');
            setIsReserveOpen(true);
          }}
        />
      </main>

      {/* Sovereign Depository Footer */}
      <Footer
        onOpenSearch={scrollToTracker}
        onOpenReserve={() => handleOpenReserve()}
      />

      {/* Interactive Modals */}
      <ReserveModal
        isOpen={isReserveOpen}
        onClose={() => setIsReserveOpen(false)}
        preselectedTier={reserveTier}
      />

      <DispatchModal
        isOpen={isDispatchOpen}
        onClose={() => setIsDispatchOpen(false)}
        vaultId={dispatchVaultId}
        onDispatchConfirmed={(trackingCode) => {
          scrollToTracker();
        }}
      />

      <ProcureModal
        isOpen={isProcureOpen}
        onClose={() => setIsProcureOpen(false)}
        item={procureItem}
        actionType={procureAction}
      />
    </div>
  );
}
