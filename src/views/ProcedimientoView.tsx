import React, { useState, useEffect } from 'react';
import { PoolState } from '../types';

interface ProcedimientoViewProps {
  state: PoolState;
  updateState: (partial: Partial<PoolState>) => void;
  onOpenManual: () => void;
}

export const ProcedimientoView: React.FC<ProcedimientoViewProps> = ({
  state,
  updateState,
  onOpenManual,
}) => {
  const { ph, cl, poolVolume, step3Applied, timerSecondsLeft, timerRunning } = state;

  const [speechActive, setSpeechActive] = useState(false);
  const [currentSpeechStep, setCurrentSpeechStep] = useState<number | null>(null);

  // Live countdown timer effect
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        updateState({ timerSecondsLeft: Math.max(0, timerSecondsLeft - 1) });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timerSecondsLeft, updateState]);

  // Exact dose calculations
  const targetPh = 7.3;
  const phDiff = Math.max(0, ph - targetPh);
  const dosePh = phDiff > 0 ? Math.round(phDiff * 10 * 55.8) : 0; // 279g for 7.8

  const targetCl = 2.5;
  const clDiff = Math.max(0, targetCl - cl);
  const doseCl = clDiff > 0 ? Math.round(clDiff * 49.23) : 0; // 64g for 1.2

  // Format timer
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Toggle timer
  const handleToggleTimer = () => {
    updateState({ timerRunning: !timerRunning });
  };

  const handleFastForwardTimer = () => {
    // Jump forward by 50 minutes for convenient testing in caseta
    const newSeconds = Math.max(10, timerSecondsLeft - 50 * 60);
    updateState({ timerSecondsLeft: newSeconds });
  };

  const handleResetTimer = () => {
    updateState({ timerSecondsLeft: 60 * 60, timerRunning: true });
  };

  // Speech guidance
  const speakStep = (text: string, stepIndex: number) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-CL';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => {
        setCurrentSpeechStep(null);
      };
      setCurrentSpeechStep(stepIndex);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleToggleVoiceAssistant = () => {
    if (speechActive) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setSpeechActive(false);
      setCurrentSpeechStep(null);
    } else {
      setSpeechActive(true);
      const introText = `Iniciando rutina de las 20 horas en Piscina Cantillana. El pH detectado es ${ph}. Se requiere dosificar ${dosePh} gramos de Dideval Baja pH antes de agregar el cloro. Recuerda nunca mezclar los productos.`;
      speakStep(introText, 0);
    }
  };

  // Progress calculation
  let completedSteps = 1; // Step 1 is measured
  if (ph > 7.6) {
    if (step3Applied) completedSteps++;
    if (timerSecondsLeft < 300) completedSteps++;
  } else {
    completedSteps += 2;
  }
  const progressPercent = Math.min(100, Math.round((completedSteps / 4) * 100));

  return (
    <div className="flex flex-col w-full px-4 pb-28 pt-20 gap-4 max-w-lg mx-auto select-none">
      {/* Context & Routine Card */}
      <section className="bg-[#182234] border border-[#223249] p-4 rounded-2xl shadow-lg flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-950/80 border border-sky-400/40 flex items-center justify-center text-[#38bdf8]">
              <span className="material-symbols-outlined text-[20px]">routine</span>
            </div>
            <span className="font-label-md text-xs text-amber-400 uppercase tracking-wider font-semibold font-mono">
              Rutina Vespertina
            </span>
          </div>
          <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 px-2.5 py-0.5 rounded-full font-label-sm text-xs flex items-center gap-1 font-mono">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            <span>En curso</span>
          </div>
        </div>

        <div>
          <h1 className="font-headline-sm text-xl text-white font-bold">Rutina de las 20:00 h</h1>
          <p className="font-body-sm text-xs text-[#bdc8d1] mt-0.5">
            Diagnóstico y dosificación tras ciclo de baño · Volumen: {poolVolume} m³
          </p>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="bg-[#101927] border border-[#222a3d] p-3 rounded-xl flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-white">
            <span className="font-label-sm text-xs text-[#bdc8d1]">Progreso estimado hoy</span>
            <span className="font-label-sm text-xs text-[#38bdf8] font-bold font-mono">
              {completedSteps} de 4 pasos requeridos
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-[#1e293b] overflow-hidden">
            <div
              className="h-full bg-[#38bdf8] rounded-full shadow-[0_0_10px_rgba(56,189,248,0.7)] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-[#bdc8d1] font-label-sm text-[11px] font-mono">
            <span>pH detectado: {ph.toFixed(1)}</span>
            <span>Cloro libre: {cl.toFixed(1)} mg/L</span>
          </div>
        </div>
      </section>

      {/* Stepper de Procedimiento Vertical */}
      <section className="space-y-3 relative">
        {/* PASO 1: COMPLETADO */}
        <div className="bg-[#182234] border border-[#223249] rounded-2xl p-4 shadow-sm relative overflow-hidden transition-all">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.3)] mt-0.5">
              <span className="material-symbols-outlined text-[16px]">done</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="font-label-sm text-xs text-[#bdc8d1] font-mono">Paso 1 · 10 min</span>
                <span className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 px-2 py-0.5 rounded-full font-label-sm text-[10px] flex items-center gap-1 font-mono">
                  <span className="material-symbols-outlined text-[12px]">verified</span> Completado
                </span>
              </div>
              <h2 className="font-headline-sm text-base font-semibold text-white mt-0.5">
                Medir con la bomba andando
              </h2>
              <p className="font-body-sm text-xs text-[#bdc8d1] mt-1 leading-relaxed">
                Muestra a un codo de profundidad (~30 cm), lejos de boquillas y skimmers. Gotas
                aplicadas: 5 DPD (Cloro) y 5 Rojo Fenol (pH).
              </p>
              <div className="mt-2 flex items-center justify-between font-label-sm text-xs text-white bg-[#101927] border border-[#222a3d] px-3 py-1.5 rounded-lg font-mono">
                <span className="text-emerald-400 font-bold">Lectura tomada:</span>
                <span className="text-[#bdc8d1]">
                  pH {ph.toFixed(1)} | Cloro {cl.toFixed(1)} ppm
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PASO 2: DECISIÓN BIFURCACIÓN */}
        <div className="bg-[#182234] border border-[#223249] rounded-2xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#101927] border border-[#223249] text-[#bdc8d1] flex items-center justify-center font-label-md text-xs font-semibold shrink-0 font-mono mt-0.5">
              2
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-xs text-[#bdc8d1] font-mono">
                  Paso 2 · Bifurcación
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full font-label-sm text-[10px] font-mono border ${
                    ph > 7.6
                      ? 'bg-amber-950/70 border-amber-500/40 text-amber-300'
                      : 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                  }`}
                >
                  {ph > 7.6 ? 'Desviación pH' : 'pH Normal'}
                </span>
              </div>
              <h2 className="font-headline-sm text-base font-semibold text-white mt-0.5">
                ¿El pH pasa de 7,6?
              </h2>

              <div
                className={`mt-2 p-2.5 rounded-xl border flex items-center gap-2 ${
                  ph > 7.6
                    ? 'bg-amber-950/30 border-amber-500/30 text-amber-200'
                    : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] shrink-0 ${
                    ph > 7.6 ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  alt_route
                </span>
                <p className="font-body-sm text-xs leading-snug">
                  {ph > 7.6 ? (
                    <>
                      <strong className="font-semibold text-amber-300">
                        Detectado {ph.toFixed(1)} (&gt; 7.6):
                      </strong>{' '}
                      Deriva al <span className="font-semibold underline text-[#38bdf8]">Paso 3</span> de forma prioritaria antes de clorar.
                    </>
                  ) : (
                    <>
                      <strong className="font-semibold text-emerald-300">
                        Detectado {ph.toFixed(1)} (en rango):
                      </strong>{' '}
                      No se requiere reductor de pH. Puedes saltar directo al Paso 5.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PASO 3: ACTIVO Y DESTACADO */}
        <div
          className={`rounded-2xl p-4 shadow-xl space-y-3 relative transition-all border-2 ${
            step3Applied
              ? 'bg-[#182234] border-emerald-500/40'
              : 'bg-[#182234] border-[#38bdf8]/60 shadow-sky-950/40'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full font-bold flex items-center justify-center font-label-md text-xs shrink-0 font-mono shadow-md ${
                  step3Applied
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-[#38bdf8] text-[#00344e] shadow-[0_0_12px_rgba(56,189,248,0.8)]'
                }`}
              >
                {step3Applied ? '✓' : '3'}
              </div>
              <span className="font-label-sm text-xs text-[#38bdf8] font-bold font-mono">
                Paso 3 · 10 min
              </span>
            </div>

            <span
              className={`px-2.5 py-0.5 rounded-full font-label-sm text-[10px] flex items-center gap-1 font-bold font-mono border ${
                step3Applied
                  ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400'
                  : 'bg-sky-950/80 border-sky-400/40 text-[#38bdf8] animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.3)]'
              }`}
            >
              <span className="material-symbols-outlined text-[13px]">
                {step3Applied ? 'verified' : 'bolt'}
              </span>
              <span>{step3Applied ? 'Dosis Aplicada' : 'Acción Requerida'}</span>
            </span>
          </div>

          <div>
            <h2 className="font-headline-sm text-lg font-bold text-white">
              Baja el pH (Dideval)
            </h2>
            <p className="font-body-sm text-xs text-[#bdc8d1] mt-0.5">
              Dosis calculada para reducir de {ph.toFixed(1)} a 7.2 en {poolVolume} m³.
            </p>
          </div>

          {/* Metric Display */}
          <div className="bg-[#101927] border border-[#223249] p-3 rounded-xl flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-[10px] text-[#bdc8d1] uppercase tracking-wider font-mono">
                Dosis Exacta
              </span>
              <span className="font-headline-lg text-3xl text-[#38bdf8] font-bold leading-none font-mono drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]">
                {dosePh}{' '}
                <span className="text-sm font-normal text-[#bdc8d1]">g</span>
              </span>
            </div>
            <div className="text-right">
              <span className="font-label-md text-xs text-white font-semibold block">
                Dideval Baja pH
              </span>
              <span className="font-label-sm text-[11px] text-[#bdc8d1] font-mono">
                Bisulfato sódico seco
              </span>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-1.5 pt-1">
            <span className="font-label-sm text-xs text-amber-300 uppercase tracking-wide flex items-center gap-1 font-semibold font-mono">
              <span className="material-symbols-outlined text-[16px] text-amber-400">security</span>{' '}
              Regla de oro de manipulación
            </span>

            <ol className="space-y-1.5 text-xs font-body-sm text-[#bdc8d1]">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#101927] border border-[#223249] text-[#38bdf8] flex items-center justify-center font-label-sm text-[11px] font-bold shrink-0 font-mono">
                  1
                </span>
                <span className="text-white">Pesar los {dosePh} g con balanza digital de cocina.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#101927] border border-[#223249] text-[#38bdf8] flex items-center justify-center font-label-sm text-[11px] font-bold shrink-0 font-mono">
                  2
                </span>
                <span className="text-white">
                  Llenar balde limpio con agua de piscina primero (nunca ácido en seco).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#101927] border border-[#223249] text-[#38bdf8] flex items-center justify-center font-label-sm text-[11px] font-bold shrink-0 font-mono">
                  3
                </span>
                <span className="text-white">
                  Disolver con vara plástica y verter despacio frente a las boquillas de retorno.
                </span>
              </li>
            </ol>
          </div>

          <button
            onClick={() => updateState({ step3Applied: !step3Applied })}
            className={`w-full h-12 rounded-xl font-label-lg text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md cursor-pointer ${
              step3Applied
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/30'
                : 'bg-[#38bdf8] hover:bg-sky-400 text-[#00344e] shadow-sky-500/25'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">
              {step3Applied ? 'check_circle' : 'done_all'}
            </span>
            <span>{step3Applied ? '✓ Dosis marcada como aplicada' : 'Marcar dosis aplicada'}</span>
          </button>
        </div>

        {/* PASO 4: ESPERA CON CRONÓMETRO */}
        <div className="bg-[#182234] border border-[#223249] rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#101927] border border-[#223249] text-[#bdc8d1] flex items-center justify-center font-label-md text-xs font-semibold shrink-0 font-mono">
                4
              </div>
              <span className="font-label-sm text-xs text-[#bdc8d1] font-mono">Paso 4 · 60 min</span>
            </div>

            <span className="bg-amber-950/70 border border-amber-500/40 text-amber-300 px-2 py-0.5 rounded-full font-label-sm text-[10px] flex items-center gap-1 font-mono">
              <span className="material-symbols-outlined text-[13px]">timelapse</span>
              <span>{timerSecondsLeft === 0 ? 'Completado' : 'En espera'}</span>
            </span>
          </div>

          <h2 className="font-headline-sm text-base font-semibold text-white">
            Espera 1 hora con bomba encendida
          </h2>

          {/* Interactive Countdown */}
          <div className="bg-[#101927] border border-[#223249] p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-sky-950/80 border border-sky-400/40 flex items-center justify-center text-[#38bdf8] shadow-[0_0_10px_rgba(56,189,248,0.25)]">
                <span className="material-symbols-outlined text-[24px]">hourglass_top</span>
              </div>
              <div>
                <span className="font-headline-md text-2xl text-[#38bdf8] tracking-tight font-bold font-mono drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]">
                  {formatTime(timerSecondsLeft)}
                </span>
                <span className="font-label-sm text-[11px] text-[#bdc8d1] block font-mono">
                  Tiempo de recirculación
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleToggleTimer}
                className="px-3 py-1.5 rounded-lg bg-[#182234] border border-[#223249] text-white hover:bg-[#223249] font-label-sm text-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer font-mono"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {timerRunning ? 'pause' : 'play_arrow'}
                </span>
                <span>{timerRunning ? 'Pausar' : 'Reanudar'}</span>
              </button>

              <button
                onClick={handleFastForwardTimer}
                className="px-2 py-1.5 rounded-lg bg-[#182234] border border-[#223249] text-amber-300 hover:bg-[#223249] font-label-sm text-[10px] active:scale-95 transition-all cursor-pointer font-mono"
                title="Simular avance rápido (+50 min)"
                type="button"
              >
                +50m
              </button>
            </div>
          </div>

          <div className="p-2.5 bg-red-950/40 border border-red-500/40 rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-rose-400 text-[18px] shrink-0">
              warning
            </span>
            <p className="font-body-sm text-xs text-rose-200 font-medium leading-tight">
              ¡Precaución! No agregar cloro todavía. Mide el pH tras cumplirse los 60 min.
            </p>
          </div>
        </div>

        {/* PASO 5: BIFURCACIÓN CLORO */}
        <div className="bg-[#182234] border border-[#223249] rounded-2xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#101927] border border-[#223249] text-[#bdc8d1] flex items-center justify-center font-label-md text-xs font-semibold shrink-0 font-mono mt-0.5">
              5
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-xs text-[#bdc8d1] font-mono">Paso 5 · 1 min</span>
                <span className="bg-amber-950/70 border border-amber-500/40 text-amber-300 px-2 py-0.5 rounded-full font-label-sm text-[10px] font-mono">
                  Evaluación
                </span>
              </div>
              <h2 className="font-headline-sm text-base font-semibold text-white mt-0.5">
                ¿Cloro libre bajo 2,0 ppm?
              </h2>
              <div className="mt-2 p-2.5 bg-[#101927] border border-[#223249] rounded-xl flex items-center justify-between font-mono">
                <div>
                  <span className="font-body-sm text-[11px] text-[#bdc8d1] block">
                    Detectado post-sol
                  </span>
                  <span className="font-headline-sm text-base text-amber-400 font-bold">
                    {cl.toFixed(1)} mg/L
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-label-sm text-[11px] text-[#38bdf8] font-semibold block">
                    Acción requerida:
                  </span>
                  <span className="font-body-sm text-xs text-white">Paso 6 activado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PASO 6: SUBIR EL CLORO */}
        <div className="bg-[#182234] border border-[#223249] rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#101927] border border-[#223249] text-[#bdc8d1] flex items-center justify-center font-label-md text-xs font-semibold shrink-0 font-mono">
                6
              </div>
              <span className="font-label-sm text-xs text-[#bdc8d1] font-mono">
                Paso 6 · 10 min
              </span>
            </div>
            <span className="bg-[#101726] text-[#bdc8d1] border border-[#223249] px-2 py-0.5 rounded-full font-label-sm text-[10px] font-mono">
              Pendiente de Paso 4
            </span>
          </div>

          <div>
            <h2 className="font-headline-sm text-base font-semibold text-white">
              Sube el cloro (Dicloro rápido)
            </h2>
            <p className="font-body-sm text-xs text-[#bdc8d1] mt-0.5">
              Dosis para subir de {cl.toFixed(1)} a 3.0 ppm en {poolVolume} m³.
            </p>
          </div>

          <div className="bg-[#101927] border border-[#223249] p-3 rounded-xl flex items-center justify-between">
            <div>
              <span className="font-label-sm text-[10px] text-[#bdc8d1] uppercase font-mono">
                Dosis Recomendada
              </span>
              <span className="font-headline-md text-2xl text-white font-bold block font-mono">
                {doseCl} <span className="text-sm font-normal text-[#bdc8d1]">g</span>
              </span>
            </div>
            <div className="text-right">
              <span className="font-label-md text-xs text-white font-semibold block">
                Dicloro granulado 56%
              </span>
              <span className="font-label-sm text-[11px] text-[#bdc8d1] block font-mono">
                Disolver 100% en balde
              </span>
            </div>
          </div>

          <p className="font-body-sm text-xs text-[#bdc8d1] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#38bdf8] shrink-0">info</span>
            <span>Verter solo el líquido sobrenadante frente a boquillas de retorno.</span>
          </p>
        </div>

        {/* PASO 7: REGISTRO */}
        <div className="bg-[#182234] border border-[#223249] rounded-2xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#101927] border border-[#223249] text-[#bdc8d1] flex items-center justify-center font-label-md text-xs font-semibold shrink-0 font-mono mt-0.5">
              7
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-xs text-[#bdc8d1] font-mono">Paso 7 · 5 min</span>
                <span className="bg-[#101726] text-[#bdc8d1] border border-[#223249] px-2 py-0.5 rounded-full font-label-sm text-[10px] font-mono">
                  Cierre
                </span>
              </div>
              <h2 className="font-headline-sm text-base font-semibold text-white mt-0.5">
                Anotar en el registro de piscina
              </h2>
              <p className="font-body-sm text-xs text-[#bdc8d1] mt-1 leading-relaxed">
                Consigna en el cuaderno oficial los valores iniciales ({ph.toFixed(1)} pH, {cl.toFixed(1)} Cl) y los gramos añadidos ({dosePh}g Dideval, {doseCl}g Dicloro) para el cálculo de consumo mensual.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Voice Assistant & Technical Manual Footer */}
      <section className="space-y-3 pt-1">
        <button
          onClick={handleToggleVoiceAssistant}
          className={`w-full h-12 rounded-xl font-label-lg text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md cursor-pointer ${
            speechActive
              ? 'bg-amber-500 text-slate-950 shadow-amber-900/40'
              : 'bg-[#38bdf8] hover:bg-sky-400 text-[#00344e] shadow-sky-500/20'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">
            {speechActive ? 'volume_up' : 'play_circle'}
          </span>
          <span>
            {speechActive
              ? 'Detener asistente de voz guiado'
              : 'Iniciar rutina guiada por voz/alertas'}
          </span>
        </button>

        {speechActive && (
          <div className="p-2.5 rounded-xl bg-amber-950/50 border border-amber-500/40 text-amber-200 text-xs font-mono text-center flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            Voz activa en español · Narrando pautas técnicas de caseta
          </div>
        )}

        <div className="bg-[#182234] border border-[#223249] rounded-2xl p-4 shadow-sm space-y-2">
          <span className="font-label-sm text-[10px] text-[#bdc8d1] uppercase tracking-wider font-mono">
            Manual de Servicio Piscina Cantillana
          </span>

          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#38bdf8] text-[20px]">
                menu_book
              </span>
              <span className="font-label-md text-sm text-white font-semibold">
                Tablas Técnicas C.1 y C.2
              </span>
            </div>

            <button
              onClick={onOpenManual}
              className="font-label-md text-xs text-[#38bdf8] font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
              type="button"
            >
              <span>Consultar dosificación</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <p className="font-body-sm text-[11px] text-[#bdc8d1] pt-0.5">
            Factores validados para 18 m³ de agua dura en zona central. Revisión 3.0.
          </p>
        </div>
      </section>
    </div>
  );
};
