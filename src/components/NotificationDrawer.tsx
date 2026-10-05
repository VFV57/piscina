import React from 'react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: 'calculadora' | 'procedimiento' | 'horario-bomba' | 'seguridad') => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose, onNavigateToTab }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end sm:justify-center items-center p-4 pb-safe animate-fade-in">
      <div 
        className="bg-[#182234] border border-[#223249] rounded-2xl p-5 shadow-2xl flex flex-col gap-4 w-full max-w-md max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#2d3449] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#38bdf8] text-[24px]">notifications_active</span>
            <div>
              <span className="font-headline-sm text-base text-white font-bold block">Avisos de Caseta</span>
              <span className="font-label-sm text-[11px] text-[#bdc8d1]">Piscina Cantillana · 3 recordatorios activos</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#bdc8d1] hover:text-white hover:bg-[#222a3d] active:scale-95 transition-colors"
            type="button"
            aria-label="Cerrar avisos"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        <div className="space-y-3">
          {/* Notice 1 */}
          <div 
            onClick={() => { onNavigateToTab('horario-bomba'); onClose(); }}
            className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 cursor-pointer hover:border-amber-400 transition-colors"
          >
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-amber-400 text-[20px] shrink-0 mt-0.5">warning</span>
              <div className="flex-1">
                <span className="text-xs font-bold text-amber-300 block">Extender Timer a 21:45 h (+45 min)</span>
                <p className="text-[12px] text-amber-100/80 mt-0.5">
                  El ciclo actual apaga a las 21:00 h. Baja 3 pestañas en el reloj mecánico antes de iniciar la dosificación de la tarde.
                </p>
                <span className="text-[11px] text-[#38bdf8] font-bold mt-1.5 inline-flex items-center gap-1">
                  Ver Horario Bomba →
                </span>
              </div>
            </div>
          </div>

          {/* Notice 2 */}
          <div 
            onClick={() => { onNavigateToTab('seguridad'); onClose(); }}
            className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 cursor-pointer hover:border-red-400 transition-colors"
          >
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-rose-400 text-[20px] shrink-0 mt-0.5">block</span>
              <div className="flex-1">
                <span className="text-xs font-bold text-rose-300 block">Regla Inviolable: NUNCA mezclar</span>
                <p className="text-[12px] text-rose-100/80 mt-0.5">
                  El reductor de pH y el cloro liberan gas cloro tóxico al entrar en contacto directo. Mantener baldes separados y esperar 60 min.
                </p>
                <span className="text-[11px] text-[#38bdf8] font-bold mt-1.5 inline-flex items-center gap-1">
                  Ver 4 Reglas de Seguridad →
                </span>
              </div>
            </div>
          </div>

          {/* Notice 3 */}
          <div 
            onClick={() => { onNavigateToTab('procedimiento'); onClose(); }}
            className="p-3 rounded-xl bg-[#131b2e] border border-[#2d3449] cursor-pointer hover:border-[#38bdf8] transition-colors"
          >
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#38bdf8] text-[20px] shrink-0 mt-0.5">routine</span>
              <div className="flex-1">
                <span className="text-xs font-bold text-white block">Rutina Vespertina (20:00 h)</span>
                <p className="text-[12px] text-[#bdc8d1] mt-0.5">
                  Medir pH y cloro con bomba encendida. Dosificar siempre al atardecer sin sol directo para evitar degradación UV del cloro.
                </p>
                <span className="text-[11px] text-[#38bdf8] font-bold mt-1.5 inline-flex items-center gap-1">
                  Ir al Procedimiento Paso a Paso →
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full h-11 bg-[#222a3d] hover:bg-[#2d3449] text-white font-bold rounded-xl font-label-lg text-xs transition-colors"
          type="button"
        >
          Cerrar Avisos
        </button>
      </div>
    </div>
  );
};
