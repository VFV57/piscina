import React, { useState, useEffect } from 'react';
import { TabId, PoolState } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { CalculadoraView } from './views/CalculadoraView';
import { ProcedimientoView } from './views/ProcedimientoView';
import { HorarioBombaView } from './views/HorarioBombaView';
import { SeguridadView } from './views/SeguridadView';
import { TimerModal } from './components/TimerModal';
import { TechnicalManualModal } from './components/TechnicalManualModal';
import { PoolInfoModal } from './components/PoolInfoModal';
import { NotificationDrawer } from './components/NotificationDrawer';

const STORAGE_KEY = 'cantillana_pool_state_v1';

const defaultState: PoolState = {
  cl: 1.2,
  ph: 7.8,
  season: 'summer',
  alkalinity: 100,
  poolVolume: 18,
  pumpRunning: true,
  pumpStartTime: '09:00',
  pumpEndTime: '21:00',
  checklist: {
    safetyGear: false,
    kidsPetsClear: false,
    pumpRecirculating: false,
  },
  step3Applied: false,
  timerSecondsLeft: 58 * 60 + 34,
  timerRunning: true,
  logEntries: [
    {
      id: '1',
      timestamp: '20:00',
      dateStr: '05/10/2026',
      cl: 1.2,
      ph: 7.8,
      dosePh: 279,
      doseCl: 64,
      notes: 'Rutina nocturna estándar',
    },
  ],
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('calculadora');
  const [timerModalOpen, setTimerModalOpen] = useState(false);
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [poolInfoOpen, setPoolInfoOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [state, setState] = useState<PoolState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultState, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Error loading state from localStorage', e);
    }
    return defaultState;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving state to localStorage', e);
    }
  }, [state]);

  const updateState = (partial: Partial<PoolState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  };

  const handleNavigateToTab = (tab: TabId) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] flex flex-col relative font-body-md">
      {/* Top Mobile App Bar */}
      <Header
        activeTab={activeTab}
        onOpenNotifications={() => setNotificationsOpen(true)}
        onOpenPoolInfo={() => setPoolInfoOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full">
        {activeTab === 'calculadora' && (
          <CalculadoraView
            state={state}
            updateState={updateState}
            onNavigateToTab={handleNavigateToTab}
          />
        )}

        {activeTab === 'procedimiento' && (
          <ProcedimientoView
            state={state}
            updateState={updateState}
            onOpenManual={() => setManualModalOpen(true)}
          />
        )}

        {activeTab === 'horario-bomba' && (
          <HorarioBombaView
            state={state}
            updateState={updateState}
            onOpenTimerModal={() => setTimerModalOpen(true)}
          />
        )}

        {activeTab === 'seguridad' && (
          <SeguridadView
            state={state}
            updateState={updateState}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={handleNavigateToTab}
      />

      {/* Modals & Drawers */}
      <TimerModal
        isOpen={timerModalOpen}
        onClose={() => setTimerModalOpen(false)}
      />

      <TechnicalManualModal
        isOpen={manualModalOpen}
        onClose={() => setManualModalOpen(false)}
      />

      <PoolInfoModal
        isOpen={poolInfoOpen}
        onClose={() => setPoolInfoOpen(false)}
      />

      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onNavigateToTab={handleNavigateToTab}
      />
    </div>
  );
}
