import React from 'react';
import { PoolState } from '../types';

interface HorarioBombaViewProps {
  state: PoolState;
  updateState: (partial: Partial<PoolState>) => void;
  onOpenTimerModal: () => void;
}

export const HorarioBombaView: React.FC<HorarioBombaViewProps> = ({
  state,
  updateState,
  onOpenTimerModal,
}) => {
  const { season, pumpStartTime, pumpEndTime, pumpRunning } = state;

  const handleTogglePump = () => {
    updateState({ pumpRunning: !pumpRunning });
  };

  const adjustTime = (target: 'start' | 'end', deltaMins: number) => {
    const current = target === 'start' ? pumpStartTime : pumpEndTime;
    const [h, m] = current.split(':').map(Number);
    let total = h * 60 + m + deltaMins;
    if (total < 0) total += 24 * 60;
    total = total % (24 * 60);

    const newH = String(Math.floor(total / 60)).padStart(2, '0');
    const newM = String(total % 60).padStart(2, '0');
    const newTime = `${newH}:${newM}`;

    if (target === 'start') {
      updateState({ pumpStartTime: newTime });
    } else {
      updateState({ pumpEndTime: newTime });
    }
  };

  const handleSelectSeason = (mode: 'summer' | 'winter') => {
    if (mode === 'winter') {
      updateState({
        season: 'winter',
        pumpStartTime: '09:00',
        pumpEndTime: '15:00',
      });
    } else {
      updateState({
        season: 'summer',
        pumpStartTime: '09:00',
        pumpEndTime: '21:00',
      });
    }
  };

  // Calculate filtration hours
  const [sH, sM] = pumpStartTime.split(':').map(Number);
  const [eH, eM] = pumpEndTime.split(':').map(Number);
  let totalRunMins = eH * 60 + eM - (sH * 60 + sM);
  if (totalRunMins <= 0) totalRunMins += 24 * 60;
  const runHours = (totalRunMins / 60).toFixed(0);
  const cycles = (totalRunMins / (4.5 * 60)).toFixed(1);
  const totalVolumePumped = (parseFloat(cycles) * 18).toFixed(0);

  return (
    <div className="flex flex-col w-full px-4 pb-28 pt-20 gap-4 max-w-lg mx-auto select-none">
      {/* Status Card Hero: Live Pump Status & Solar 24h Gauge */}
      <div className="bg-[#182234] border border-[#223249] rounded-2xl p-4 shadow-lg relative overflow-hidden flex flex-col gap-4">
        {/* Ambient cyan glow */}
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-sky-500/10 blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePump}
              className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full font-label-md text-xs font-semibold border transition-all cursor-pointer ${
                pumpRunning
                  ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-800 border-slate-600 text-slate-300'
              }`}
              type="button"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  pumpRunning
                    ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]'
                    : 'bg-slate-500'
                }`}
              ></span>
              <span>{pumpRunning ? 'BOMBA ENCENDIDA' : 'BOMBA EN REPOSO'}</span>
            </button>
            <span className="font-label-sm text-xs text-[#bdc8d1] font-mono">Ciclo 18 m³</span>
          </div>

          <div className="flex items-center gap-1 text-[#bdc8d1] font-mono">
            <span className="material-symbols-outlined text-[18px] text-[#38bdf8]">timer</span>
            <span className="font-label-md text-xs text-white">
              {pumpRunning ? 'Apaga en 01h 15m' : 'Próximo: 09:00'}
            </span>
          </div>
        </div>

        {/* Visual 24h Dial with SVG Indicator */}
        <div className="flex flex-col items-center justify-center py-2 relative z-10">
          <div className="relative w-56 h-56 flex items-center justify-center">
            <svg
              className="w-full h-full transform -rotate-90 drop-shadow-[0_0_12px_rgba(56,189,248,0.25)]"
              viewBox="0 0 200 200"
            >
              {/* Background track 24h ring (00:00 to 24:00) */}
              <circle
                cx="100"
                cy="100"
                fill="none"
                r="78"
                stroke="#1e293b"
                strokeLinecap="round"
                strokeWidth="14"
              ></circle>

              {/* Filtration Active Window (09:00 to 21:00 = 50% = 245 of 490) */}
              <circle
                cx="100"
                cy="100"
                fill="none"
                r="78"
                stroke="#38bdf8"
                strokeDasharray="245 490"
                strokeDashoffset="-183.75"
                strokeLinecap="round"
                strokeWidth="14"
              ></circle>

              {/* Dosage Extension Needed Preview Zone (21:00 to 21:45 = +45 min) */}
              <circle
                cx="100"
                cy="100"
                fill="none"
                r="78"
                stroke="#f59e0b"
                strokeDasharray="15.3 490"
                strokeDashoffset="-428.75"
                strokeLinecap="round"
                strokeWidth="14"
              ></circle>

              {/* Realtime Clock Needle: 19:45 */}
              <line
                stroke="#ffffff"
                strokeLinecap="round"
                strokeWidth="3"
                x1="100"
                x2="162"
                y1="100"
                y2="142"
              ></line>
              <circle cx="100" cy="100" fill="#38bdf8" r="4.5"></circle>
              <circle
                cx="162"
                cy="142"
                fill="#38bdf8"
                r="5"
                stroke="#0b111e"
                strokeWidth="2"
              ></circle>
            </svg>

            {/* Center Dial Telemetry */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
              <span className="font-label-sm text-[10px] text-[#bdc8d1] uppercase tracking-widest font-mono">
                Hora Actual
              </span>
              <span className="font-headline-lg text-3xl font-extrabold text-white tracking-tight font-mono">
                19:45
              </span>
              <span className="font-label-md text-xs text-[#38bdf8] font-semibold font-mono">
                {runHours}h filtración activa
              </span>
            </div>
          </div>

          {/* Segment legend */}
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]"></span>
              <span className="font-label-sm text-xs text-[#bdc8d1] font-mono">
                Filtro ({pumpStartTime} - {pumpEndTime})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]"></span>
              <span className="font-label-sm text-xs text-[#bdc8d1] font-mono">
                Extensión req. (+45m)
              </span>
            </div>
          </div>
        </div>

        {/* Active Filtration Specs Banner */}
        <div className="bg-[#101726] border border-[#223249] rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#38bdf8] text-[20px]">water_drop</span>
            <span className="font-body-sm text-xs text-white font-medium">
              Volumen reciclado hoy:
            </span>
          </div>
          <span className="font-label-md text-xs text-[#38bdf8] font-bold font-mono">
            {totalVolumePumped} m³ ({cycles} ciclos)
          </span>
        </div>
      </div>

      {/* Smart Dosage & Pump Sync Diagnostic Card */}
      <div className="bg-[#182234] border border-[#223249] rounded-2xl p-4 shadow-lg flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <span className="material-symbols-outlined text-[20px]">verified</span>
            </div>
            <div>
              <span className="font-title-md text-[16px] text-white font-bold block leading-tight">
                Ventana Segura Verificada
              </span>
              <span className="font-label-sm text-xs text-[#bdc8d1]">
                Sincronización con rutina de atardecer
              </span>
            </div>
          </div>
          <span className="py-1 px-2.5 rounded-md bg-[#101726] border border-[#223249] font-label-sm text-xs text-[#38bdf8] font-semibold shrink-0 font-mono">
            Hoy 20:00 h
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="bg-[#101726] border border-[#1e293b] rounded-xl p-3 flex flex-col">
            <span className="font-label-sm text-xs text-[#bdc8d1]">Inicio Aplicación</span>
            <span className="font-headline-sm text-lg text-white font-bold font-mono">20:00 h</span>
            <span className="font-body-sm text-[12px] text-[#bdc8d1] mt-0.5">Al atardecer / sin sol</span>
          </div>
          <div className="bg-[#101726] border border-[#1e293b] rounded-xl p-3 flex flex-col">
            <span className="font-label-sm text-xs text-[#bdc8d1]">Duración Estimada</span>
            <span className="font-headline-sm text-lg text-white font-bold font-mono">1h 35m</span>
            <span className="font-body-sm text-[12px] text-[#bdc8d1] mt-0.5">Término: 21:35 h</span>
          </div>
        </div>

        {/* Alert / Adjustment Callout */}
        <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3 mt-1 flex flex-col gap-2 text-amber-300">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-[22px] text-amber-400 shrink-0 mt-0.5">
              warning
            </span>
            <p className="font-body-sm text-xs text-amber-200/90 font-normal leading-snug">
              <strong className="font-label-md text-xs text-amber-300 block mb-0.5 font-bold font-mono">
                Conflicto de Apagado de Bomba
              </strong>
              La bomba se apaga a las <strong className="text-white font-semibold">21:00 h</strong>. Para disolver el reductor de pH, esperar los 60 min y dosificar el Cloro con recirculación activa, extiende el temporizador hasta las{' '}
              <strong className="text-white font-semibold">21:45 h (+45 min)</strong>.
            </p>
          </div>

          <button
            onClick={onOpenTimerModal}
            className="w-full h-11 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg flex items-center justify-center gap-1.5 font-label-lg text-xs active:scale-[0.98] transition-all shadow-md cursor-pointer font-mono"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>Cómo ajustar timer mecánico (+45 min)</span>
          </button>
        </div>
      </div>

      {/* Scheduler / Temporizador Mode & Steppers */}
      <div className="bg-[#182234] border border-[#223249] rounded-2xl p-4 shadow-lg flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-title-md text-[16px] font-bold text-white">
            Programación de Ciclo Diario
          </span>
          <span className="material-symbols-outlined text-[#38bdf8] text-[20px]">
            calendar_month
          </span>
        </div>

        {/* Mode Segmented Control */}
        <div className="grid grid-cols-2 p-1 bg-[#101726] border border-[#1e293b] rounded-xl select-none">
          <button
            onClick={() => handleSelectSeason('summer')}
            className={`h-11 rounded-lg flex items-center justify-center gap-1.5 font-label-md text-xs cursor-pointer transition-all ${
              season === 'summer'
                ? 'bg-[#38bdf8] text-[#00344e] font-bold shadow'
                : 'text-[#bdc8d1] hover:text-white'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">sunny</span>
            <span>Temporada (12h)</span>
          </button>
          <button
            onClick={() => handleSelectSeason('winter')}
            className={`h-11 rounded-lg flex items-center justify-center gap-1.5 font-label-md text-xs cursor-pointer transition-all ${
              season === 'winter'
                ? 'bg-[#38bdf8] text-[#00344e] font-bold shadow'
                : 'text-[#bdc8d1] hover:text-white'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">ac_unit</span>
            <span>Invierno (6h)</span>
          </button>
        </div>

        {/* Stepper 1: Hora Inicio */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <span className="font-label-md text-xs text-white font-semibold">
              Hora de encendido
            </span>
            <span className="font-body-sm text-[12px] text-[#bdc8d1]">
              Inicio filtración diurna
            </span>
          </div>

          <div className="flex items-center bg-[#101726] border border-[#1e293b] rounded-xl p-1 gap-1">
            <button
              onClick={() => adjustTime('start', -30)}
              className="w-11 h-11 rounded-lg bg-[#182234] hover:bg-[#223249] text-white flex items-center justify-center active:scale-95 transition-all text-lg font-bold border border-[#2d3449] cursor-pointer"
              type="button"
              aria-label="Restar 30 min hora encendido"
            >
              −
            </button>
            <span className="min-w-[68px] text-center font-label-lg text-sm text-[#38bdf8] font-bold tabular-nums font-mono">
              {pumpStartTime}
            </span>
            <button
              onClick={() => adjustTime('start', 30)}
              className="w-11 h-11 rounded-lg bg-[#182234] hover:bg-[#223249] text-white flex items-center justify-center active:scale-95 transition-all text-lg font-bold border border-[#2d3449] cursor-pointer"
              type="button"
              aria-label="Sumar 30 min hora encendido"
            >
              +
            </button>
          </div>
        </div>

        {/* Stepper 2: Hora Fin */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-md text-xs text-white font-semibold">
              Hora de apagado
            </span>
            <span className="font-body-sm text-[12px] text-[#bdc8d1]">
              Fin del ciclo ordinario
            </span>
          </div>

          <div className="flex items-center bg-[#101726] border border-[#1e293b] rounded-xl p-1 gap-1">
            <button
              onClick={() => adjustTime('end', -30)}
              className="w-11 h-11 rounded-lg bg-[#182234] hover:bg-[#223249] text-white flex items-center justify-center active:scale-95 transition-all text-lg font-bold border border-[#2d3449] cursor-pointer"
              type="button"
              aria-label="Restar 30 min hora apagado"
            >
              −
            </button>
            <span className="min-w-[68px] text-center font-label-lg text-sm text-[#38bdf8] font-bold tabular-nums font-mono">
              {pumpEndTime}
            </span>
            <button
              onClick={() => adjustTime('end', 30)}
              className="w-11 h-11 rounded-lg bg-[#182234] hover:bg-[#223249] text-white flex items-center justify-center active:scale-95 transition-all text-lg font-bold border border-[#2d3449] cursor-pointer"
              type="button"
              aria-label="Sumar 30 min hora apagado"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Visual Timeline of the Evening Routine */}
      <div className="bg-[#182234] border border-[#223249] rounded-2xl p-4 shadow-lg flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#38bdf8] text-[22px]">route</span>
            <span className="font-title-md text-[16px] font-bold text-white">
              Secuencia de Dosificación & Bomba
            </span>
          </div>
          <span className="font-label-sm text-xs text-[#38bdf8] font-bold font-mono">
            Paso a paso
          </span>
        </div>

        <div className="relative pl-6 space-y-4">
          {/* Continuous vertical guideline */}
          <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-[#223249] -z-0"></div>

          {/* Step 1 */}
          <div className="relative flex items-start gap-3 z-10">
            <div className="w-6 h-6 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center font-label-sm text-xs font-bold -ml-[25px] shadow-[0_0_8px_rgba(56,189,248,0.5)] font-mono">
              1
            </div>
            <div className="flex-1 bg-[#101726] border border-[#1e293b] rounded-xl p-3">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-xs text-white font-bold font-mono">
                  20:00 h · Aplicar pH Minus
                </span>
                <span className="py-0.5 px-2 rounded-full bg-sky-950/80 border border-sky-500/30 text-sky-300 font-label-sm text-[11px] font-semibold font-mono">
                  15 min
                </span>
              </div>
              <p className="font-body-sm text-[12px] text-[#bdc8d1] mt-1 leading-snug">
                Verter disuelto frente a boquillas de retorno. La bomba debe estar operando.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative flex items-start gap-3 z-10">
            <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-label-sm text-xs font-bold -ml-[25px] shadow-[0_0_8px_rgba(245,158,11,0.5)] font-mono">
              2
            </div>
            <div className="flex-1 bg-[#101726] border border-[#1e293b] rounded-xl p-3">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-xs text-white font-bold font-mono">
                  20:15 - 21:15 h · Espera de Homogeneización
                </span>
                <span className="py-0.5 px-2 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-300 font-label-sm text-[11px] font-semibold font-mono">
                  60 min
                </span>
              </div>
              <p className="font-body-sm text-[12px] text-[#bdc8d1] mt-1 leading-snug">
                <strong className="text-amber-300">Bomba obligatoria encendida.</strong> No aplicar cloro antes para evitar inactivación o vapores nocivos.
              </p>
            </div>
          </div>

          {/* Step 3: Critical Timer Extension Point */}
          <div className="relative flex items-start gap-3 z-10">
            <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center font-label-sm text-xs font-bold -ml-[25px] shadow-[0_0_8px_rgba(244,63,94,0.5)] font-mono">
              !
            </div>
            <div className="flex-1 bg-rose-950/40 border border-rose-500/30 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-xs text-rose-300 font-bold font-mono">
                  21:00 h · Extensión de Timer
                </span>
                <span className="py-0.5 px-2 rounded-full bg-rose-500 text-white font-label-sm text-[11px] font-bold font-mono">
                  +45 min
                </span>
              </div>
              <p className="font-body-sm text-[12px] text-rose-200/90 mt-1 leading-snug">
                Si no se bajan los caballetes mecánicos hasta 21:45 h, la bomba se detendrá a mitad del proceso.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative flex items-start gap-3 z-10">
            <div className="w-6 h-6 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center font-label-sm text-xs font-bold -ml-[25px] shadow-[0_0_8px_rgba(52,211,153,0.5)] font-mono">
              3
            </div>
            <div className="flex-1 bg-[#101726] border border-[#1e293b] rounded-xl p-3">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-xs text-white font-bold font-mono">
                  21:15 - 21:35 h · Cloro Rápido
                </span>
                <span className="py-0.5 px-2 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-label-sm text-[11px] font-semibold font-mono">
                  20 min
                </span>
              </div>
              <p className="font-body-sm text-[12px] text-[#bdc8d1] mt-1 leading-snug">
                Dosificar Cloro disuelto. La bomba continuará hasta 21:45 h asegurando dispersión uniforme total.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
