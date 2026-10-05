import React, { useState } from 'react';
import { PoolState, TabId } from '../types';

interface CalculadoraViewProps {
  state: PoolState;
  updateState: (partial: Partial<PoolState>) => void;
  onNavigateToTab: (tab: TabId) => void;
}

export const CalculadoraView: React.FC<CalculadoraViewProps> = ({
  state,
  updateState,
  onNavigateToTab,
}) => {
  const [copied, setCopied] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { cl, ph, season, poolVolume } = state;

  // Exact calculations for Piscina Cantillana (18 m³)
  // Target pH: 7.3. 150g per 18 m³ drops approx 0.25 pH -> approx 55.8 g per 0.1 pH
  const targetPh = 7.3;
  const phDiff = Math.max(0, ph - targetPh);
  const dosePh = phDiff > 0 ? Math.round(phDiff * 10 * 55.8) : 0; // ~279g for 7.8

  // Target Cl: 2.5 mg/L. Dicloro 56%: approx 49.2g per 1.0 ppm on 18 m³ -> approx 64g for 1.3 ppm delta
  const targetCl = 2.5;
  const clDiff = Math.max(0, targetCl - cl);
  const doseCl = clDiff > 0 ? Math.round(clDiff * 49.23) : 0; // ~64g for 1.2

  const handleClMinus = () => {
    if (cl > 0.2) {
      updateState({ cl: parseFloat((cl - 0.2).toFixed(1)) });
    }
  };

  const handleClPlus = () => {
    if (cl < 6.0) {
      updateState({ cl: parseFloat((cl + 0.2).toFixed(1)) });
    }
  };

  const handlePhMinus = () => {
    if (ph > 6.8) {
      updateState({ ph: parseFloat((ph - 0.1).toFixed(1)) });
    }
  };

  const handlePhPlus = () => {
    if (ph < 8.4) {
      updateState({ ph: parseFloat((ph + 0.1).toFixed(1)) });
    }
  };

  const clPercent = Math.min(100, Math.max(0, (cl / 6.0) * 100));
  const phPercent = Math.min(100, Math.max(0, ((ph - 6.8) / (8.2 - 6.8)) * 100));

  const isPhOptimal = ph >= 7.2 && ph <= 7.6;
  const isClOptimal = cl >= 1.5 && cl <= 3.0;
  const isWaterOptimal = isPhOptimal && isClOptimal;

  const handleCopyLog = () => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('es-CL');
    const textToCopy = `Piscina Cantillana (18 m³) - ${formattedDate} 20:00 h:
· Cloro Libre: ${cl.toFixed(1)} mg/L (Meta 2.5)
· pH Medido: ${ph.toFixed(1)} (Meta 7.3)
· Dosis 1: Dideval Baja pH -> ${dosePh} g (Bisulfato de sodio en balde con agua)
  * Esperar 60 min de bombeo antes de clorar *
· Dosis 2: Dideval Dicloro 56% -> ${doseCl} g (Disolver en agua)
· Régimen: ${season === 'summer' ? 'Temporada Verano (12h filtración)' : 'Invierno (6h filtración)'}`;

    navigator.clipboard.writeText(textToCopy).catch(() => {});
    setCopied(true);

    // Also record in log entries
    const newEntry = {
      id: Date.now().toString(),
      timestamp: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
      dateStr: formattedDate,
      cl,
      ph,
      dosePh,
      doseCl,
    };
    updateState({ logEntries: [newEntry, ...(state.logEntries || []).slice(0, 9)] });

    setTimeout(() => {
      setCopied(false);
    }, 2800);
  };

  return (
    <div className="flex flex-col w-full px-4 pb-28 pt-20 gap-4 max-w-lg mx-auto select-none">
      {/* Water Diagnostics Summary Banner */}
      <section
        className={`w-full rounded-2xl p-4 shadow-sm border transition-all ${
          isWaterOptimal
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
            : 'bg-red-950/40 border-red-500/40 text-red-100'
        }`}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`material-symbols-outlined text-[24px] ${
                isWaterOptimal ? 'text-emerald-400' : 'text-rose-400'
              }`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isWaterOptimal ? 'check_circle' : 'warning'}
            </span>
            <span
              className={`font-title-md text-[17px] font-bold ${
                isWaterOptimal ? 'text-emerald-300' : 'text-rose-300'
              }`}
            >
              {isWaterOptimal ? 'Agua en Equilibrio' : 'Ajuste Requerido'}
            </span>
          </div>

          <span
            className={`px-2.5 py-0.5 rounded-full font-label-sm text-[10px] tracking-wide uppercase font-bold border shadow-xs ${
              isWaterOptimal
                ? 'bg-emerald-900/60 border-emerald-400/40 text-emerald-300'
                : 'bg-red-900/70 border-red-400/40 text-red-200'
            }`}
          >
            {isWaterOptimal ? 'Apta Baño' : 'No Apta Baño'}
          </span>
        </div>

        <p className="font-body-sm text-xs text-[#bdc8d1] mb-3 leading-relaxed">
          {isWaterOptimal
            ? 'El pH y el cloro se encuentran en equilibrio químico adecuado para el confort ocular y desinfección continua.'
            : ph > 7.6
            ? 'El pH actual (alcalino) bloquea el poder desinfectante del cloro. Aplica primero el reductor de pH antes de clorar.'
            : 'Los niveles de desinfección están fuera de la ventana óptima. Aplica la dosificación prescrita al atardecer.'}
        </p>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-2.5 flex items-center justify-between shadow-xs">
            <div className="flex flex-col">
              <span className="font-label-sm text-[11px] text-[#bdc8d1]">Cloro Libre</span>
              <span className="font-headline-sm text-lg text-white font-bold font-mono">
                {cl.toFixed(1)}{' '}
                <span className="font-label-sm text-[10px] font-normal text-[#bdc8d1]">mg/L</span>
              </span>
            </div>
            <span
              className={`material-symbols-outlined text-[20px] ${
                isClOptimal ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              water_drop
            </span>
          </div>

          <div
            className={`bg-[#131b2e] border rounded-xl p-2.5 flex items-center justify-between shadow-xs ${
              isPhOptimal ? 'border-[#222a3d]' : 'border-red-500/40'
            }`}
          >
            <div className="flex flex-col">
              <span className="font-label-sm text-[11px] text-[#bdc8d1]">pH Medido</span>
              <span
                className={`font-headline-sm text-lg font-bold font-mono ${
                  isPhOptimal ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {ph.toFixed(1)}{' '}
                <span className="font-label-sm text-[10px] font-normal">
                  {ph > 7.6 ? 'Alto' : ph < 7.2 ? 'Bajo' : 'Ideal'}
                </span>
              </span>
            </div>
            <span
              className={`material-symbols-outlined text-[20px] ${
                isPhOptimal ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              science
            </span>
          </div>
        </div>
      </section>

      {/* Section: Chemical Readings (Inputs) */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#38bdf8] text-[20px]">biotech</span>
            <h2 className="font-title-md text-[16px] text-white font-bold">
              Lecturas de hoy (20:00 h)
            </h2>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#182234] border border-[#2d3449] font-label-sm text-[11px] text-[#38bdf8] font-mono">
            Vaso 18 m³
          </span>
        </div>

        {/* Free Chlorine Stepper Card */}
        <div className="bg-[#182234] rounded-2xl p-4 border border-[#223249] shadow-sm flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-label-lg text-sm text-white font-bold block">
                Cloro Libre (DPD-1)
              </span>
              <span className="font-body-sm text-xs text-[#bdc8d1]">
                Meta recomendada: 2.0 - 3.0 mg/L
              </span>
            </div>
            <span
              className={`px-2 py-0.5 rounded font-label-sm text-xs font-bold font-mono border ${
                cl < 1.5
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : cl > 3.5
                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              }`}
            >
              {cl < 1.5 ? `Bajo (${cl.toFixed(1)})` : cl > 3.5 ? `Alto (${cl.toFixed(1)})` : `Óptimo (${cl.toFixed(1)})`}
            </span>
          </div>

          {/* Stepper Component */}
          <div className="flex items-center justify-between bg-[#101726] rounded-xl p-1.5 border border-[#222a3d] shadow-inner">
            <button
              aria-label="Disminuir cloro"
              onClick={handleClMinus}
              className="w-12 h-12 rounded-lg bg-[#182234] hover:bg-[#223249] flex items-center justify-center text-white active:scale-95 shadow-sm border border-[#2d3449] transition-transform select-none cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[24px]">remove</span>
            </button>
            <div className="flex items-baseline gap-1">
              <span className="font-metric-display text-3xl text-white font-extrabold tracking-tight font-mono">
                {cl.toFixed(1)}
              </span>
              <span className="font-label-md text-xs text-[#bdc8d1]">mg/L</span>
            </div>
            <button
              aria-label="Aumentar cloro"
              onClick={handleClPlus}
              className="w-12 h-12 rounded-lg bg-[#182234] hover:bg-[#223249] flex items-center justify-center text-white active:scale-95 shadow-sm border border-[#2d3449] transition-transform select-none cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[24px]">add</span>
            </button>
          </div>

          {/* Chlorine Spectrum Track */}
          <div className="pt-2 px-1 flex flex-col gap-1">
            <div className="relative w-full h-2.5 rounded-full flex overflow-hidden shadow-inner bg-[#060e20]">
              <div className="h-full bg-rose-600/80 flex-1" title="Bajo (<1)"></div>
              <div className="h-full bg-amber-500/80 flex-1" title="Marginal (1-2)"></div>
              <div
                className="h-full bg-[#54e788] flex-[1.5] shadow-[0_0_8px_rgba(84,231,136,0.5)]"
                title="Óptimo (2-3)"
              ></div>
              <div className="h-full bg-amber-500/80 flex-1" title="Alto (3-5)"></div>
              <div className="h-full bg-rose-600/80 flex-1" title="Exceso (>5)"></div>
            </div>

            {/* Indicator Needle */}
            <div className="relative w-full h-3">
              <div
                className="absolute -top-1 -ml-1.5 flex flex-col items-center transition-all duration-200"
                style={{ left: `${clPercent}%` }}
              >
                <div className="w-3 h-3 rounded-full bg-[#38bdf8] border-2 border-[#060e20] shadow-[0_0_8px_rgba(56,189,248,0.8)]"></div>
              </div>
            </div>

            <div className="flex justify-between font-label-sm text-[10px] text-[#bdc8d1] px-0.5 font-mono">
              <span>0</span>
              <span>1.0</span>
              <span className="text-[#54e788] font-bold">2.5 Meta</span>
              <span>4.0</span>
              <span>6.0+</span>
            </div>
          </div>
        </div>

        {/* pH Stepper Card */}
        <div className="bg-[#182234] rounded-2xl p-4 border border-[#223249] shadow-sm flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-label-lg text-sm text-white font-bold block">
                pH (Rojo Fenol)
              </span>
              <span className="font-body-sm text-xs text-[#bdc8d1]">
                Rango ideal: 7.2 - 7.6
              </span>
            </div>
            <span
              className={`px-2 py-0.5 rounded font-label-sm text-xs font-bold font-mono border ${
                ph > 7.6
                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                  : ph < 7.2
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              }`}
            >
              {ph > 7.6 ? 'pH Alto' : ph < 7.2 ? 'pH Bajo' : 'pH Ideal (7.3)'}
            </span>
          </div>

          {/* Stepper Component */}
          <div className="flex items-center justify-between bg-[#101726] rounded-xl p-1.5 border border-[#222a3d] shadow-inner">
            <button
              aria-label="Disminuir pH"
              onClick={handlePhMinus}
              className="w-12 h-12 rounded-lg bg-[#182234] hover:bg-[#223249] flex items-center justify-center text-white active:scale-95 shadow-sm border border-[#2d3449] transition-transform select-none cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[24px]">remove</span>
            </button>
            <div className="flex items-baseline gap-1">
              <span className="font-metric-display text-3xl text-white font-extrabold tracking-tight font-mono">
                {ph.toFixed(1)}
              </span>
              <span className="font-label-md text-xs text-[#bdc8d1]">pH</span>
            </div>
            <button
              aria-label="Aumentar pH"
              onClick={handlePhPlus}
              className="w-12 h-12 rounded-lg bg-[#182234] hover:bg-[#223249] flex items-center justify-center text-white active:scale-95 shadow-sm border border-[#2d3449] transition-transform select-none cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[24px]">add</span>
            </button>
          </div>

          {/* pH Spectrum Track */}
          <div className="pt-2 px-1 flex flex-col gap-1">
            <div className="relative w-full h-2.5 rounded-full flex overflow-hidden shadow-inner bg-[#060e20]">
              <div className="h-full bg-amber-500/80 flex-[1.5]" title="Ácido (<7.2)"></div>
              <div
                className="h-full bg-[#54e788] flex-[2] shadow-[0_0_8px_rgba(84,231,136,0.5)]"
                title="Ideal (7.2-7.6)"
              ></div>
              <div className="h-full bg-rose-600/80 flex-[2]" title="Alcalino (>7.6)"></div>
            </div>

            {/* Indicator Needle */}
            <div className="relative w-full h-3">
              <div
                className="absolute -top-1 -ml-1.5 flex flex-col items-center transition-all duration-200"
                style={{ left: `${phPercent}%` }}
              >
                <div
                  className={`w-3 h-3 rounded-full border-2 border-[#060e20] shadow-[0_0_8px_rgba(255,180,171,0.8)] ${
                    isPhOptimal ? 'bg-[#54e788]' : 'bg-rose-400'
                  }`}
                ></div>
              </div>
            </div>

            <div className="flex justify-between font-label-sm text-[10px] text-[#bdc8d1] px-0.5 font-mono">
              <span>6.8</span>
              <span className="text-[#54e788] font-bold">7.2 - 7.6 Ideal</span>
              <span className="text-rose-400 font-bold">8.2</span>
            </div>
          </div>
        </div>

        {/* Season Segmented Button */}
        <div className="flex flex-col gap-1.5">
          <span className="font-label-md text-xs text-[#bdc8d1]">Régimen Estacional</span>
          <div className="grid grid-cols-2 p-1 bg-[#101726] rounded-xl gap-1 border border-[#222a3d]">
            <button
              onClick={() => updateState({ season: 'summer' })}
              className={`h-11 rounded-lg font-label-md text-xs flex flex-col items-center justify-center transition-all cursor-pointer ${
                season === 'summer'
                  ? 'bg-[#38bdf8] text-[#00344e] font-bold shadow-sm border border-sky-400/40'
                  : 'text-[#bdc8d1] hover:text-white'
              }`}
              type="button"
            >
              <span className="font-bold">Temporada (Oct-Abr)</span>
              <span className="font-label-sm text-[10px] opacity-90 font-mono">Diario a las 20:00 h</span>
            </button>
            <button
              onClick={() => updateState({ season: 'winter' })}
              className={`h-11 rounded-lg font-label-md text-xs flex flex-col items-center justify-center transition-all cursor-pointer ${
                season === 'winter'
                  ? 'bg-[#38bdf8] text-[#00344e] font-bold shadow-sm border border-sky-400/40'
                  : 'text-[#bdc8d1] hover:text-white'
              }`}
              type="button"
            >
              <span className="font-medium">Invierno (May-Sep)</span>
              <span className="font-label-sm text-[10px] opacity-70 font-mono">Semanal (Sábados)</span>
            </button>
          </div>
        </div>

        {/* Collapsible Secondary Parameters */}
        <div className="bg-[#182234] rounded-2xl border border-[#223249] shadow-sm overflow-hidden transition-all">
          <button
            onClick={() => setDetailsOpen(!detailsOpen)}
            className="w-full flex items-center justify-between p-4 cursor-pointer text-left select-none"
            type="button"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#38bdf8] text-[20px]">tune</span>
              <span className="font-title-md text-sm text-white font-semibold">
                Parámetros Secundarios
              </span>
            </div>
            <span
              className={`material-symbols-outlined text-[#bdc8d1] transition-transform ${
                detailsOpen ? 'rotate-180' : ''
              }`}
            >
              expand_more
            </span>
          </button>

          {detailsOpen && (
            <div className="px-4 pb-4 flex flex-col gap-2.5 border-t border-[#222a3d] pt-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-[#222a3d]/50">
                <div className="flex flex-col">
                  <span className="font-label-md text-white font-medium">
                    Alcalinidad Total Estimada
                  </span>
                  <span className="font-label-sm text-amber-300 font-semibold text-[10px]">
                    Supuesto estándar · Medir sábados
                  </span>
                </div>
                <span className="font-headline-sm text-sm text-white font-bold font-mono">
                  100 <span className="font-body-sm text-[11px] font-normal text-[#bdc8d1]">mg/L</span>
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#222a3d]/50">
                <div className="flex flex-col">
                  <span className="font-label-md text-white font-medium">Hora de Filtrado</span>
                  <span className="font-label-sm text-[#bdc8d1] text-[10px]">Ciclo automático nocturno</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-body-md text-sm text-[#38bdf8] font-bold font-mono">20:00 h</span>
                  <span className="px-2 py-0.5 rounded bg-[#101726] border border-[#2d3449] text-emerald-400 font-label-sm text-[10px]">
                    En horario
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#222a3d]/50">
                <div className="flex flex-col">
                  <span className="font-label-md text-white font-medium">Concentración Dicloro</span>
                  <span className="font-label-sm text-[#bdc8d1] text-[10px]">Dideval Granulado</span>
                </div>
                <span className="font-label-lg text-xs text-[#38bdf8] font-bold font-mono">56% activo</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="flex flex-col">
                  <span className="font-label-md text-white font-medium">Concentración Bisulfato</span>
                  <span className="font-label-sm text-[#bdc8d1] text-[10px]">Dideval Baja pH en polvo</span>
                </div>
                <span className="font-label-lg text-xs text-[#38bdf8] font-bold font-mono">100% puro</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Prescribed Chemical Action Card */}
      <section className="bg-[#182234] rounded-2xl p-4 border border-[#223249] shadow-md flex flex-col gap-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#38bdf8] shadow-[0_0_10px_rgba(56,189,248,0.7)]"></div>

        <div className="flex items-start justify-between gap-2 pt-1">
          <div>
            <span className="font-label-sm text-[11px] text-[#38bdf8] font-bold tracking-wider uppercase font-mono">
              Prescripción Calculada
            </span>
            <h3 className="font-headline-sm text-lg text-white font-bold">
              Dosis para {poolVolume} m³
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-950/80 border border-sky-400/40 flex items-center justify-center text-[#38bdf8] shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[22px]">medication</span>
          </div>
        </div>

        {/* Step 1: Lower pH (Priority) */}
        <div className="bg-[#101726] rounded-xl p-3.5 flex flex-col gap-1.5 border border-[#222a3d] shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#38bdf8] text-[#00344e] font-label-sm text-xs font-bold flex items-center justify-center font-mono">
                1
              </span>
              <span className="font-title-md text-sm text-white font-bold">Bajar el pH</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full font-label-sm text-[10px] font-bold font-mono border ${
                ph > 7.6
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              }`}
            >
              {ph > 7.6 ? 'Prioritario (pH > 7.6)' : 'pH en Rango'}
            </span>
          </div>

          <div className="my-1 flex items-baseline gap-2">
            <span className="font-headline-lg text-3xl font-extrabold text-white tracking-tight font-mono text-[#38bdf8]">
              {dosePh}
            </span>
            <span className="font-headline-sm text-sm font-bold text-[#bdc8d1]">gramos</span>
          </div>

          <span className="font-label-md text-xs font-bold text-white">
            Dideval Baja pH (Bisulfato de sodio)
          </span>

          <p className="font-body-sm text-[12px] text-[#bdc8d1] bg-[#182234] border border-[#2d3449] p-2.5 rounded-lg flex items-start gap-2 mt-1">
            <span className="material-symbols-outlined text-[18px] text-[#38bdf8] shrink-0 mt-0.5">
              info
            </span>
            <span>
              Disolver en balde plástico con 5L de agua limpia y repartir frente a las boquillas de
              impulsión con la bomba encendida.
            </span>
          </p>
        </div>

        {/* Waiting Lockout Card */}
        <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3 flex items-center gap-2.5 text-amber-300 shadow-xs">
          <span
            className="material-symbols-outlined text-[24px] text-amber-400 shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            timer
          </span>
          <div className="flex flex-col">
            <span className="font-label-md text-xs font-bold text-amber-300">
              Tiempo de recirculación requerido
            </span>
            <span className="font-body-sm text-xs text-[#dae2fd]">
              Esperar <strong>1 hora</strong> con bomba encendida antes de dosificar el cloro.
            </span>
          </div>
        </div>

        {/* Step 2: Elevate Chlorine */}
        <div className="bg-[#101726] rounded-xl p-3.5 flex flex-col gap-1.5 border border-[#222a3d] shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#38bdf8] text-[#00344e] font-label-sm text-xs font-bold flex items-center justify-center font-mono">
                2
              </span>
              <span className="font-title-md text-sm text-white font-bold">Subir el Cloro</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#182234] border border-[#2d3449] text-[#bdc8d1] font-label-sm text-[10px] font-semibold font-mono">
              Paso posterior
            </span>
          </div>

          <div className="my-1 flex items-baseline gap-2">
            <span className="font-headline-lg text-3xl font-extrabold text-white tracking-tight font-mono text-[#38bdf8]">
              {doseCl}
            </span>
            <span className="font-headline-sm text-sm font-bold text-[#bdc8d1]">gramos</span>
          </div>

          <span className="font-label-md text-xs font-bold text-white">
            Dideval Cloro Granulado (Dicloro 56%)
          </span>

          <p className="font-body-sm text-[12px] text-[#bdc8d1] bg-[#182234] border border-[#2d3449] p-2.5 rounded-lg flex items-start gap-2 mt-1">
            <span className="material-symbols-outlined text-[18px] text-amber-400 shrink-0 mt-0.5">
              warning
            </span>
            <span>
              Disolver previamente en agua. Nunca mezclar directamente en el mismo balde con el
              reductor de pH.
            </span>
          </p>
        </div>
      </section>

      {/* Copy Log Action Button */}
      <div className="w-full flex flex-col gap-2 pt-1">
        <button
          onClick={handleCopyLog}
          className={`w-full h-13 rounded-xl font-label-lg text-xs font-bold flex items-center justify-center gap-2 active:scale-98 transition-all border shadow-lg cursor-pointer ${
            copied
              ? 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-900/40'
              : 'bg-[#38bdf8] hover:bg-sky-400 text-[#00344e] border-sky-400/40 shadow-sky-950/40'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">
            {copied ? 'check' : 'content_copy'}
          </span>
          <span>{copied ? '✓ Copiado al portapapeles' : 'Copiar registro para cuaderno'}</span>
        </button>

        <button
          onClick={() => onNavigateToTab('procedimiento')}
          className="w-full h-11 rounded-xl font-label-md text-xs font-semibold text-[#38bdf8] bg-[#182234] hover:bg-[#222a3d] border border-[#2d3449] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          type="button"
        >
          <span>Continuar con Procedimiento Paso a Paso</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
