import React from 'react';
import { TabId } from '../types';

interface BottomNavProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs: Array<{ id: TabId; label: string; icon: string }> = [
    { id: 'calculadora', label: 'Calculadora', icon: 'science' },
    { id: 'procedimiento', label: 'Procedimiento', icon: 'checklist' },
    { id: 'horario-bomba', label: 'Horario Bomba', icon: 'schedule' },
    { id: 'seguridad', label: 'Seguridad', icon: 'shield' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-[#060e20]/95 backdrop-blur-xl border-t border-[#171f33] shadow-[0_-4px_24px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-around h-16 px-1 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 min-w-[48px] h-12 flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 cursor-pointer ${
                isActive
                  ? 'text-[#38bdf8] font-label-lg font-bold'
                  : 'text-[#bdc8d1] hover:text-[#dae2fd]'
              }`}
              type="button"
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className={`material-symbols-outlined text-[24px] transition-transform ${
                  isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]' : ''
                }`}
                style={isActive && tab.id === 'seguridad' ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {tab.icon}
              </span>
              <span
                className={`font-label-sm text-[11px] tracking-tight font-mono ${
                  isActive ? 'text-[#38bdf8]' : ''
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
