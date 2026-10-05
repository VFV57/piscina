import React from 'react';

interface PoolInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PoolInfoModal: React.FC<PoolInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end sm:justify-center items-center p-4 pb-safe animate-fade-in">
      <div 
        className="bg-[#182234] border border-[#223249] rounded-2xl p-5 shadow-2xl flex flex-col gap-4 w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#2d3449] pb-3">
          <div className="flex items-center gap-3">
            <img 
              src="https://lh3.googleusercontent.com/aida/AEtjO1WpkXhSO_N49cPzgmdIkj5G_3TEDyCgEaUFoPm9GasrDq7zQ3JevGIs9b2z6L006N3B--XqyfDlYj1cNXPfRfZbK1QlUHpqIvdEbpC0UqKpOJO1d56NpzIyDvzThg9WtOQzBK-xgQ9kWjAHwTpQO00HHOMKjmCUl40SmmROJP8B8elY784Ik7ac-M41sr8P_kJALVTFe4AuhMWZZwcdhcGs5KzzgZjWzxW7a96mYSI97_uwj6nunbAomj4"
              alt="Piscina Cantillana Icon"
              className="h-9 w-auto object-contain shrink-0 drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]"
            />
            <div>
              <span className="font-headline-sm text-base text-white font-bold block">Piscina Cantillana</span>
              <span className="font-label-sm text-[11px] text-[#38bdf8]">Ficha Técnica de Instalación · Rev. 3</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#bdc8d1] hover:text-white hover:bg-[#222a3d] active:scale-95 transition-colors"
            type="button"
            aria-label="Cerrar ficha técnica"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-[#101726] border border-[#2d3449] rounded-xl p-3">
            <span className="font-label-sm text-[10px] text-[#bdc8d1] uppercase tracking-wider block">Volumen de Cuba</span>
            <span className="font-headline-sm text-xl text-white font-bold">18 m³</span>
            <span className="font-label-sm text-[11px] text-[#38bdf8]">18.000 Litros</span>
          </div>
          <div className="bg-[#101726] border border-[#2d3449] rounded-xl p-3">
            <span className="font-label-sm text-[10px] text-[#bdc8d1] uppercase tracking-wider block">Bomba de Caseta</span>
            <span className="font-headline-sm text-xl text-white font-bold">0.5 HP</span>
            <span className="font-label-sm text-[11px] text-emerald-400">Caudal ~4.0 m³/h</span>
          </div>
          <div className="bg-[#101726] border border-[#2d3449] rounded-xl p-3">
            <span className="font-label-sm text-[10px] text-[#bdc8d1] uppercase tracking-wider block">Filtro de Sílice</span>
            <span className="font-headline-sm text-base text-white font-bold">400 mm</span>
            <span className="font-label-sm text-[11px] text-[#bdc8d1]">Carga 45 kg cuarzo</span>
          </div>
          <div className="bg-[#101726] border border-[#2d3449] rounded-xl p-3">
            <span className="font-label-sm text-[10px] text-[#bdc8d1] uppercase tracking-wider block">Ciclo Completo</span>
            <span className="font-headline-sm text-base text-white font-bold">4.5 Horas</span>
            <span className="font-label-sm text-[11px] text-[#bdc8d1]">2 ciclos/día (verano)</span>
          </div>
        </div>

        {/* Hydro Components List */}
        <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-3 space-y-2">
          <span className="font-label-sm text-[11px] text-[#38bdf8] uppercase tracking-wider font-bold block">
            Circuito Hidráulico & Boquillas
          </span>
          <div className="space-y-1.5 text-xs text-[#bdc8d1] font-body-sm">
            <div className="flex items-center justify-between">
              <span>• Impulsión / Retorno:</span>
              <span className="text-white font-semibold">2 boquillas direccionables</span>
            </div>
            <div className="flex items-center justify-between">
              <span>• Aspiración superficial:</span>
              <span className="text-white font-semibold">1 Skimmer con cestillo</span>
            </div>
            <div className="flex items-center justify-between">
              <span>• Aspiración de fondo:</span>
              <span className="text-white font-semibold">1 Toma de fondo / barredora</span>
            </div>
            <div className="flex items-center justify-between">
              <span>• Cuadro Eléctrico:</span>
              <span className="text-white font-semibold">Timer mecánico 24h + Diferencial</span>
            </div>
          </div>
        </div>

        {/* Emergency Contact Reminder */}
        <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-rose-400 text-[22px]">emergency</span>
            <div>
              <span className="text-xs text-rose-200 font-bold block">CITUC Emergencias</span>
              <span className="text-[11px] text-[#bdc8d1]">Atención 24/7 toxicología</span>
            </div>
          </div>
          <a
            href="tel:+56226353800"
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold font-mono"
          >
            22635 3800
          </a>
        </div>

        <button
          onClick={onClose}
          className="w-full h-11 bg-[#222a3d] hover:bg-[#2d3449] text-white font-bold rounded-xl font-label-lg text-xs transition-colors"
          type="button"
        >
          Cerrar Ficha Técnica
        </button>
      </div>
    </div>
  );
};
