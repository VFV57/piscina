import React, { useState } from 'react';

interface TimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TimerModal: React.FC<TimerModalProps> = ({ isOpen, onClose }) => {
  const [tabsPushed, setTabsPushed] = useState<[boolean, boolean, boolean]>([true, true, true]);

  if (!isOpen) return null;

  const toggleTab = (index: number) => {
    const updated = [...tabsPushed] as [boolean, boolean, boolean];
    updated[index] = !updated[index];
    setTabsPushed(updated);
  };

  const allActive = tabsPushed.every(Boolean);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end sm:justify-center items-center p-4 pb-safe animate-fade-in">
      <div 
        className="bg-[#182234] border border-[#223249] rounded-2xl p-5 shadow-2xl flex flex-col gap-4 w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#38bdf8] text-[26px]">settings_suggest</span>
            <span className="font-headline-sm text-lg text-white font-bold">Timer de Caseta Cantillana</span>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#bdc8d1] hover:text-white hover:bg-[#222a3d] active:scale-95 transition-colors"
            type="button"
            aria-label="Cerrar modal"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Visual diagram of mechanical dial tabs */}
        <div className="bg-[#101726] border border-[#1e293b] rounded-xl p-4 flex flex-col items-center text-center">
          <div className="relative w-44 h-44 rounded-full bg-[#182234] border-2 border-sky-500/30 flex items-center justify-center shadow-inner my-2">
            {/* Center Dial Hub */}
            <div className="w-28 h-28 rounded-full bg-[#101726] border border-[#2d3449] flex flex-col items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[32px] text-[#38bdf8]">rotate_right</span>
              <span className="font-label-sm text-[10px] text-[#bdc8d1] font-bold mt-1 font-mono tracking-wider">RELOJ 24H</span>
              <span className="font-label-sm text-[9px] text-[#38bdf8] font-mono mt-0.5">MODO AUTO</span>
            </div>

            {/* Interactive Pins simulation along edge for 21:00 to 21:45 */}
            <div className="absolute right-2 top-7 flex flex-col gap-1">
              <button 
                onClick={() => toggleTab(0)}
                className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono transition-all shadow-md flex items-center gap-1 ${tabsPushed[0] ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300' : 'bg-slate-700 text-slate-300'}`}
                title="Pestaña 1 (21:00 - 21:15)"
              >
                <span>21:00-21:15</span>
                <span>{tabsPushed[0] ? '✓' : '○'}</span>
              </button>
              <button 
                onClick={() => toggleTab(1)}
                className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono transition-all shadow-md flex items-center gap-1 ${tabsPushed[1] ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300' : 'bg-slate-700 text-slate-300'}`}
                title="Pestaña 2 (21:15 - 21:30)"
              >
                <span>21:15-21:30</span>
                <span>{tabsPushed[1] ? '✓' : '○'}</span>
              </button>
              <button 
                onClick={() => toggleTab(2)}
                className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono transition-all shadow-md flex items-center gap-1 ${tabsPushed[2] ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300' : 'bg-slate-700 text-slate-300'}`}
                title="Pestaña 3 (21:30 - 21:45)"
              >
                <span>21:30-21:45</span>
                <span>{tabsPushed[2] ? '✓' : '○'}</span>
              </button>
            </div>
          </div>

          <span className="font-title-md text-[16px] text-white font-bold mt-2">Ajuste de 3 Pestañas (45 min)</span>
          <span className="font-body-sm text-xs text-[#bdc8d1] mt-1 leading-relaxed">
            Cada pestaña o uña exterior del disco equivale a <strong className="text-[#38bdf8]">15 minutos</strong> de encendido en el timer electro-mecánico de caseta.
          </span>
        </div>

        {/* Step by step checklist */}
        <div className="space-y-2.5 text-[#bdc8d1] font-body-sm text-xs bg-[#131b2e] border border-[#222a3d] rounded-xl p-3">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-[#38bdf8] text-[18px] shrink-0 mt-0.5">check_circle</span>
            <p>1. Localiza el sector marcado <strong className="text-white">21:00</strong> en el aro exterior del programador en el tablero de bombas.</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-[#38bdf8] text-[18px] shrink-0 mt-0.5">check_circle</span>
            <p>2. Presiona hacia afuera (o abajo) las <strong className="text-white">3 pestañas consecutivas</strong> (cubriendo hasta las 21:45 h).</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-[#38bdf8] text-[18px] shrink-0 mt-0.5">check_circle</span>
            <p>3. Verifica que la palanca selectora central permanezca en la posición <strong className="text-white">AUTO (ícono reloj)</strong> y no en Manual I permanente.</p>
          </div>
        </div>

        {allActive && (
          <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-label-sm text-xs font-semibold text-center flex items-center justify-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            3 pestañas verificadas: La bomba operará continua hasta 21:45 h
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full h-12 bg-[#38bdf8] hover:bg-sky-400 text-[#00344e] font-bold rounded-xl font-label-lg text-xs active:scale-[0.98] transition-all shadow-md shadow-sky-500/20"
          type="button"
        >
          Entendido, temporizador verificado
        </button>
      </div>
    </div>
  );
};
