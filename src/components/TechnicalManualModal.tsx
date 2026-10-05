import React from 'react';

interface TechnicalManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechnicalManualModal: React.FC<TechnicalManualModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end sm:justify-center items-center p-4 pb-safe animate-fade-in">
      <div 
        className="bg-[#182234] border border-[#223249] rounded-2xl p-5 shadow-2xl flex flex-col gap-4 w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#2d3449] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#38bdf8] text-[24px]">menu_book</span>
            <div>
              <span className="font-headline-sm text-base text-white font-bold block">Tablas Técnicas C.1 y C.2</span>
              <span className="font-label-sm text-[11px] text-[#bdc8d1]">Manual Piscina Cantillana · Cuba 18 m³ · Rev 3.0</span>
            </div>
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

        {/* Tabla C.1: Baja pH */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-title-md text-sm text-[#38bdf8] font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">science</span>
              Tabla C.1 · Reductor de pH (Bisulfato de Sodio)
            </h4>
            <span className="text-[10px] font-mono bg-sky-950/80 border border-sky-400/30 text-sky-300 px-2 py-0.5 rounded">Dideval Polvo</span>
          </div>
          <p className="font-body-sm text-[12px] text-[#bdc8d1]">
            Dosis calculadas para agua de pozo/red de alta dureza (bicarbonatada). Objetivo: pH 7.3.
          </p>

          <div className="overflow-x-auto rounded-xl border border-[#2d3449]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#101726] text-[#bdc8d1] border-b border-[#2d3449]">
                <tr>
                  <th className="p-2.5 font-semibold">pH Medido</th>
                  <th className="p-2.5 font-semibold">Salto ΔpH</th>
                  <th className="p-2.5 font-semibold text-right">Dosis (18 m³)</th>
                  <th className="p-2.5 font-semibold text-right">Pauta Balde</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222a3d] text-white">
                <tr className="hover:bg-[#131b2e]">
                  <td className="p-2.5 font-bold text-amber-300">7.6</td>
                  <td className="p-2.5 text-[#bdc8d1]">-0.3</td>
                  <td className="p-2.5 text-right font-bold text-[#38bdf8]">140 g</td>
                  <td className="p-2.5 text-right text-[#bdc8d1]">5 L agua</td>
                </tr>
                <tr className="hover:bg-[#131b2e] bg-[#101927]">
                  <td className="p-2.5 font-bold text-amber-400">7.8 (Actual)</td>
                  <td className="p-2.5 text-[#bdc8d1]">-0.5</td>
                  <td className="p-2.5 text-right font-bold text-[#38bdf8]">279 g</td>
                  <td className="p-2.5 text-right text-[#bdc8d1]">8 L agua</td>
                </tr>
                <tr className="hover:bg-[#131b2e]">
                  <td className="p-2.5 font-bold text-rose-400">8.0</td>
                  <td className="p-2.5 text-[#bdc8d1]">-0.7</td>
                  <td className="p-2.5 text-right font-bold text-[#38bdf8]">390 g</td>
                  <td className="p-2.5 text-right text-[#bdc8d1]">10 L agua</td>
                </tr>
                <tr className="hover:bg-[#131b2e]">
                  <td className="p-2.5 font-bold text-rose-500">8.2+</td>
                  <td className="p-2.5 text-[#bdc8d1]">-0.9</td>
                  <td className="p-2.5 text-right font-bold text-[#38bdf8]">500 g máx*</td>
                  <td className="p-2.5 text-right text-[#bdc8d1]">Fraccionar en 2</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-[#bdc8d1] italic">
            * Nunca exceder 500 g de una sola vez en 18 m³ para evitar golpe ácido brusco en la bomba.
          </p>
        </div>

        {/* Tabla C.2: Cloro Rápido */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="font-title-md text-sm text-[#38bdf8] font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">sanitizer</span>
              Tabla C.2 · Cloro Rápido (Dicloro Granulado 56%)
            </h4>
            <span className="text-[10px] font-mono bg-sky-950/80 border border-sky-400/30 text-sky-300 px-2 py-0.5 rounded">Dideval 56%</span>
          </div>
          <p className="font-body-sm text-[12px] text-[#bdc8d1]">
            Aplicar siempre tras 60 min de bombeo post-ácido al atardecer sin radiación solar UV directa.
          </p>

          <div className="overflow-x-auto rounded-xl border border-[#2d3449]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#101726] text-[#bdc8d1] border-b border-[#2d3449]">
                <tr>
                  <th className="p-2.5 font-semibold">Cloro Medido</th>
                  <th className="p-2.5 font-semibold">Incremento</th>
                  <th className="p-2.5 font-semibold text-right">Dosis (18 m³)</th>
                  <th className="p-2.5 font-semibold text-right">Modalidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222a3d] text-white">
                <tr className="hover:bg-[#131b2e]">
                  <td className="p-2.5 font-bold text-rose-400">0.5 mg/L</td>
                  <td className="p-2.5 text-[#bdc8d1]">+2.0 ppm</td>
                  <td className="p-2.5 text-right font-bold text-[#38bdf8]">98 g</td>
                  <td className="p-2.5 text-right text-[#bdc8d1]">Refuerzo fuerte</td>
                </tr>
                <tr className="hover:bg-[#131b2e] bg-[#101927]">
                  <td className="p-2.5 font-bold text-amber-300">1.2 - 1.5 mg/L</td>
                  <td className="p-2.5 text-[#bdc8d1]">+1.3 ppm</td>
                  <td className="p-2.5 text-right font-bold text-[#38bdf8]">64 g</td>
                  <td className="p-2.5 text-right text-[#bdc8d1]">Mantenimiento</td>
                </tr>
                <tr className="hover:bg-[#131b2e]">
                  <td className="p-2.5 font-bold text-emerald-400">2.0 - 2.5 mg/L</td>
                  <td className="p-2.5 text-[#bdc8d1]">+0.5 ppm</td>
                  <td className="p-2.5 text-right font-bold text-[#38bdf8]">25 g</td>
                  <td className="p-2.5 text-right text-[#bdc8d1]">Ajuste fino</td>
                </tr>
                <tr className="hover:bg-[#131b2e]">
                  <td className="p-2.5 font-bold text-sky-400">Choque (Lluvia/Algas)</td>
                  <td className="p-2.5 text-[#bdc8d1]">+10.0 ppm</td>
                  <td className="p-2.5 text-right font-bold text-[#38bdf8]">360 g</td>
                  <td className="p-2.5 text-right text-[#bdc8d1]">Tratamiento choque</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full h-11 mt-2 bg-[#222a3d] hover:bg-[#2d3449] text-white font-bold rounded-xl font-label-lg text-xs transition-colors"
          type="button"
        >
          Cerrar Tablas Técnicas
        </button>
      </div>
    </div>
  );
};
