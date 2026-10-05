import React from 'react';
import { TabId } from '../types';

interface HeaderProps {
  activeTab: TabId;
  onOpenNotifications: () => void;
  onOpenPoolInfo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenNotifications,
  onOpenPoolInfo,
}) => {
  const getTabLabel = () => {
    switch (activeTab) {
      case 'calculadora':
        return 'Calculadora';
      case 'procedimiento':
        return 'Procedimiento';
      case 'horario-bomba':
        return 'Horario Bomba';
      case 'seguridad':
        return 'Seguridad';
      default:
        return '';
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[#0b1326]/90 backdrop-blur-xl border-b border-[#222a3d] pt-safe select-none">
      {/* Top Mobile Status Line (09:41, Cellular, WiFi, Battery) */}
      <div className="flex items-center justify-between px-4 h-6 pt-1 text-[#bdc8d1] select-none">
        <span className="font-label-sm text-[11px] tracking-tight text-[#bdc8d1] font-mono">09:41</span>
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[15px]">signal_cellular_alt</span>
          <span className="material-symbols-outlined text-[15px]">wifi</span>
          <span className="material-symbols-outlined text-[16px]">battery_full</span>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="h-16 px-4 flex items-center justify-between gap-2">
        <div 
          onClick={onOpenPoolInfo}
          className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer group"
          title="Ver Ficha Técnica Piscina Cantillana"
        >
          <img
            alt="Piscina Cantillana Icon"
            className="h-8 w-auto object-contain shrink-0 filter drop-shadow-[0_0_8px_rgba(56,189,248,0.4)] transition-transform group-hover:scale-105"
            src="https://lh3.googleusercontent.com/aida/AEtjO1WpkXhSO_N49cPzgmdIkj5G_3TEDyCgEaUFoPm9GasrDq7zQ3JevGIs9b2z6L006N3B--XqyfDlYj1cNXPfRfZbK1QlUHpqIvdEbpC0UqKpOJO1d56NpzIyDvzThg9WtOQzBK-xgQ9kWjAHwTpQO00HHOMKjmCUl40SmmROJP8B8elY784Ik7ac-M41sr8P_kJALVTFe4AuhMWZZwcdhcGs5KzzgZjWzxW7a96mYSI97_uwj6nunbAomj4"
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-baseline gap-1">
              <span className="font-title-md text-[16px] font-bold text-[#dae2fd] truncate group-hover:text-white transition-colors">
                Piscina Cantillana
              </span>
              <span className="text-[#bdc8d1] text-[12px] shrink-0 hidden xs:inline">•</span>
              <span className="font-label-md text-xs text-[#38bdf8] font-semibold truncate hidden xs:inline font-mono">
                {getTabLabel()}
              </span>
            </div>
            <span className="font-label-sm text-[11px] text-[#bdc8d1] truncate font-mono">
              18 m³ · Manual Rev. 3
            </span>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            aria-label="Notificaciones y avisos de caseta"
            onClick={onOpenNotifications}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[#bdc8d1] hover:text-white hover:bg-[#171f33] active:scale-95 transition-all relative"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_6px_#fbbf24]"></span>
          </button>

          <button
            aria-label="Ficha de piscina y caseta"
            onClick={onOpenPoolInfo}
            className="w-8 h-8 rounded-full bg-[#38bdf8] text-[#00344e] flex items-center justify-center font-bold text-xs shadow-[0_0_12px_rgba(56,189,248,0.35)] active:scale-95 transition-all hover:bg-sky-400"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
