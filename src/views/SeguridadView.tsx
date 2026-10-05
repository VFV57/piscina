import React from 'react';
import { PoolState } from '../types';

interface SeguridadViewProps {
  state: PoolState;
  updateState: (partial: Partial<PoolState>) => void;
}

export const SeguridadView: React.FC<SeguridadViewProps> = ({ state, updateState }) => {
  const { checklist, cl, ph } = state;

  const toggleChecklist = (key: keyof typeof checklist) => {
    updateState({
      checklist: {
        ...checklist,
        [key]: !checklist[key],
      },
    });
  };

  const allChecked =
    checklist.safetyGear && checklist.kidsPetsClear && checklist.pumpRecirculating;

  return (
    <div className="flex flex-col w-full px-4 pb-28 pt-20 gap-4 max-w-lg mx-auto select-none">
      {/* Emergency Response Card (Deep Dark Red / Crimson Container) */}
      <section
        aria-label="Emergencias Toxicológicas"
        className="bg-[#3b0d11] border border-red-500/30 rounded-2xl p-4 shadow-lg shadow-red-950/40 relative overflow-hidden flex flex-col gap-3"
      >
        <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-red-600/10 pointer-events-none blur-xl"></div>

        <div className="flex items-start gap-3 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-[#e11d48] text-white flex items-center justify-center shrink-0 shadow-md shadow-red-900/50">
            <span
              className="material-symbols-outlined text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              emergency_home
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-label-sm text-[10px] text-red-300 font-bold uppercase tracking-wider font-mono">
                Protocolo de Incidente
              </span>
              <span className="px-2 py-0.5 rounded-full bg-red-500 text-white font-label-sm text-[10px] font-bold tracking-wide font-mono">
                24 HORAS
              </span>
            </div>
            <h2 className="font-headline-sm text-lg text-white font-bold mt-0.5">
              CITUC Toxicología UC
            </h2>
            <p className="font-body-sm text-xs text-red-200/80 mt-1 leading-snug">
              Centro de Información Toxicológica Pontificia Universidad Católica de Chile.
            </p>
          </div>
        </div>

        {/* First Aid Prompt Box */}
        <div className="bg-[#240a0e]/90 border border-red-500/20 rounded-xl p-3 flex items-start gap-2.5 relative z-10">
          <span className="material-symbols-outlined text-rose-400 shrink-0 text-[22px]">shower</span>
          <p className="font-body-sm text-xs text-red-100 leading-relaxed">
            <strong className="font-semibold text-white">Primeros Auxilios:</strong> Lavar la zona
            afectada con agua corriente continua por al menos{' '}
            <strong className="text-red-300 underline underline-offset-2">15 minutos</strong>. No
            inducir el vómito ni neutralizar con vinagre o leche.
          </p>
        </div>

        {/* Direct Tap-to-Call Action Button */}
        <a
          className="w-full h-12 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white flex items-center justify-center gap-2 font-label-lg text-xs font-bold shadow-md shadow-red-950/60 active:scale-[0.98] transition-all relative z-10 cursor-pointer font-mono"
          href="tel:+56226353800"
        >
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            phone_in_talk
          </span>
          <span>Llamar al 22635 3800</span>
        </a>
      </section>

      {/* Bathing Readiness Live Matrix */}
      <section
        aria-label="Aptitud Sanitaria del Agua"
        className="bg-[#171f33] border border-[#222a3d] rounded-2xl p-4 shadow-sm flex flex-col gap-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-amber-400 text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              waves
            </span>
            <span className="font-label-md text-xs text-[#bdc8d1] uppercase tracking-wider font-semibold font-mono">
              Aptitud de Bañistas
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-label-sm text-[10px] font-bold flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>
            EN ESPERA
          </span>
        </div>

        {/* Status Output Card */}
        <div className="p-3 bg-[#1e293b]/70 border border-amber-500/20 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">hourglass_top</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-headline-sm text-sm font-bold text-white leading-tight">
              Baño en Espera de Recirculación
            </h3>
            <p className="font-body-sm text-xs text-[#bdc8d1] mt-0.5">
              Dosis dosificada hace 25 min. Completar ciclo de bombeo.
            </p>
          </div>
        </div>

        {/* Metrics Checklist Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-[11px] text-[#bdc8d1]">Cloro Libre</span>
              <span className="material-symbols-outlined text-[#54e788] text-[18px]">verified</span>
            </div>
            <div className="mt-1">
              <span className="font-headline-sm text-lg text-white font-mono font-bold">
                {cl.toFixed(1)} mg/L
              </span>
              <span className="block font-label-sm text-[10px] text-[#bdc8d1] font-mono">
                Máx. seg: 5.0 mg/L
              </span>
            </div>
          </div>

          <div className="bg-[#131b2e] border border-[#222a3d] rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-[11px] text-[#bdc8d1]">pH Medido</span>
              <span className="material-symbols-outlined text-amber-400 text-[18px]">sync</span>
            </div>
            <div className="mt-1">
              <span className="font-headline-sm text-lg text-white font-mono font-bold">
                {ph.toFixed(1)} pH
              </span>
              <span className="block font-label-sm text-[10px] text-[#bdc8d1] font-mono">
                Rango: 7.0 - 7.8
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Golden Chemical Safety Rules */}
      <section aria-label="Las 4 Reglas de Oro" className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline-sm text-lg text-white font-bold">4 Reglas Inviolables</h2>
            <p className="font-body-sm text-xs text-[#bdc8d1]">
              Directrices obligatorias de manipulación en caseta técnica.
            </p>
          </div>
          <span className="material-symbols-outlined text-[#38bdf8] text-[28px]">verified_user</span>
        </div>

        {/* Rule 1: No Mixing */}
        <article className="bg-[#182234] border border-[#2d3449] rounded-2xl p-4 shadow-sm space-y-2.5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-500/40 text-rose-400 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(239,68,68,0.25)]">
              <span className="material-symbols-outlined text-[24px]">block</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-[10px] text-rose-400 uppercase tracking-wider font-bold font-mono">
                  Regla 01 · Peligro Letal
                </span>
                <span className="px-2 py-0.5 rounded-full bg-red-900/60 border border-red-500/40 text-red-300 font-label-sm text-[10px] font-bold font-mono">
                  Gas Cloro
                </span>
              </div>
              <h3 className="font-headline-sm text-sm font-bold text-white mt-0.5">
                NUNCA mezclar ácido con cloro
              </h3>
            </div>
          </div>

          <p className="font-body-md text-xs text-[#bdc8d1] leading-relaxed">
            La unión directa de reductor de pH (ácido) con cloro genera una reacción exotérmica violenta liberando gas cloro puro altamente tóxico para las vías respiratorias.
          </p>

          <div className="bg-[#131b2e] border border-[#2d3449] rounded-xl p-2.5 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#bdc8d1] text-[18px]">not_interested</span>
            <span className="font-body-sm text-xs text-[#bdc8d1]">
              Prohibido disolver juntos en el mismo balde o en el cestillo de skimmer.
            </span>
          </div>
        </article>

        {/* Rule 2: Water First */}
        <article className="bg-[#182234] border border-[#2d3449] rounded-2xl p-4 shadow-sm space-y-2.5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-950/80 border border-sky-400/40 text-[#38bdf8] flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(56,189,248,0.3)]">
              <span className="material-symbols-outlined text-[24px]">water_drop</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-[10px] text-[#38bdf8] uppercase tracking-wider font-bold font-mono">
                  Regla 02 · Dilución Segura
                </span>
                <span className="px-2 py-0.5 rounded-full bg-sky-950/80 border border-sky-400/30 text-sky-300 font-label-sm text-[10px] font-bold font-mono">
                  A sobre W
                </span>
              </div>
              <h3 className="font-headline-sm text-sm font-bold text-white mt-0.5">
                Producto sobre agua SIEMPRE
              </h3>
            </div>
          </div>

          <p className="font-body-md text-xs text-[#bdc8d1] leading-relaxed">
            Primero llene el balde plástico con 10 litros de agua de la piscina, y luego vierta los químicos granulados lentamente. Nunca eche agua sobre el producto seco; la ebullición localizada causa proyecciones a los ojos.
          </p>

          <div className="flex items-center justify-around bg-[#131b2e] border border-[#2d3449] rounded-xl p-2.5 text-center font-mono">
            <div className="flex items-center gap-1.5 font-label-md text-xs text-[#54e788] font-bold">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              1° Balde con Agua
            </div>
            <span className="material-symbols-outlined text-[#bdc8d1] text-[16px]">arrow_forward</span>
            <div className="flex items-center gap-1.5 font-label-md text-xs text-[#38bdf8] font-bold">
              <span className="material-symbols-outlined text-[18px]">science</span>
              2° Agregar Químico
            </div>
          </div>
        </article>

        {/* Rule 3: Separation of Time */}
        <article className="bg-[#182234] border border-[#2d3449] rounded-2xl p-4 shadow-sm space-y-2.5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
              <span className="material-symbols-outlined text-[24px]">schedule</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-[10px] text-amber-400 uppercase tracking-wider font-bold font-mono">
                  Regla 03 · Intervalos
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-300 font-label-sm text-[10px] font-bold font-mono">
                  Mín. 1 Hora
                </span>
              </div>
              <h3 className="font-headline-sm text-sm font-bold text-white mt-0.5">
                Un solo producto a la vez
              </h3>
            </div>
          </div>

          <p className="font-body-md text-xs text-[#bdc8d1] leading-relaxed">
            Haga circular el agua con la bomba encendida durante un lapso mínimo de <strong className="text-white">60 minutos</strong> entre la dosificación de pH y la de cloro. El pH siempre debe equilibrarse antes del cloro para maximizar el poder desinfectante.
          </p>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#131b2e] border border-[#2d3449] rounded-xl p-2 text-center font-mono">
              <span className="font-label-sm text-[10px] text-[#bdc8d1] block">Paso 1</span>
              <span className="font-label-md text-xs text-white font-bold">Ajustar pH (7.2-7.6)</span>
            </div>
            <div className="bg-[#131b2e] border border-[#2d3449] rounded-xl p-2 text-center font-mono">
              <span className="font-label-sm text-[10px] text-[#bdc8d1] block">Paso 2 (+60m)</span>
              <span className="font-label-md text-xs text-white font-bold">Dosificar Cloro</span>
            </div>
          </div>
        </article>

        {/* Rule 4: PPE */}
        <article className="bg-[#182234] border border-[#2d3449] rounded-2xl p-4 shadow-sm space-y-2.5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(34,211,238,0.25)]">
              <span className="material-symbols-outlined text-[24px]">front_hand</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-[10px] text-cyan-400 uppercase tracking-wider font-bold font-mono">
                  Regla 04 · EPP Técnico
                </span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/30 text-cyan-300 font-label-sm text-[10px] font-bold font-mono">
                  Obligatorio
                </span>
              </div>
              <h3 className="font-headline-sm text-sm font-bold text-white mt-0.5">
                Equipamiento de Protección
              </h3>
            </div>
          </div>

          <p className="font-body-md text-xs text-[#bdc8d1] leading-relaxed">
            Los componentes activos provocan quemaduras químicas cutáneas y lesiones oculares graves irreversibles.
          </p>

          <div className="grid grid-cols-3 gap-2 pt-1 font-mono">
            <div className="bg-[#131b2e] border border-[#2d3449] rounded-xl p-2.5 flex flex-col items-center text-center gap-1">
              <span className="material-symbols-outlined text-[#38bdf8] text-[22px]">pan_tool</span>
              <span className="font-label-sm text-[10px] text-white font-bold">Guantes Nitrilo</span>
            </div>
            <div className="bg-[#131b2e] border border-[#2d3449] rounded-xl p-2.5 flex flex-col items-center text-center gap-1">
              <span className="material-symbols-outlined text-[#38bdf8] text-[22px]">visibility</span>
              <span className="font-label-sm text-[10px] text-white font-bold">Gafas Selladas</span>
            </div>
            <div className="bg-[#131b2e] border border-[#2d3449] rounded-xl p-2.5 flex flex-col items-center text-center gap-1">
              <span className="material-symbols-outlined text-[#38bdf8] text-[22px]">masks</span>
              <span className="font-label-sm text-[10px] text-white font-bold">Mascarilla P3</span>
            </div>
          </div>
        </article>
      </section>

      {/* Technical Spec Sheets: Piscina Cantillana Stock */}
      <section aria-label="Fichas de Productos" className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline-sm text-lg text-white font-bold">Fichas de Caseta</h2>
            <p className="font-body-sm text-xs text-[#bdc8d1]">
              Productos homologados para la cuba de 18 m³.
            </p>
          </div>
          <span className="material-symbols-outlined text-[#bdc8d1] text-[24px]">inventory_2</span>
        </div>

        {/* Product 1: Dideval Baja pH */}
        <div className="bg-[#182234] border border-[#223249] rounded-2xl p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <span className="px-2 py-0.5 rounded-full bg-[#101726] border border-[#2d3449] text-[#bdc8d1] font-label-sm text-[10px] font-bold uppercase font-mono">
                Ácido Seco
              </span>
              <h3 className="font-headline-sm text-base font-bold text-white mt-1">
                Dideval Baja pH
              </h3>
              <p className="font-body-sm text-xs text-[#bdc8d1]">
                Bisulfato de sodio en microperlas
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#101726] border border-[#2d3449] flex items-center justify-center text-[#38bdf8]">
              <span className="material-symbols-outlined text-[20px]">science</span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 bg-[#101726] border border-[#223249] rounded-xl p-3 font-mono">
            <div>
              <span className="font-label-sm text-[10px] text-[#bdc8d1] block">Dosificación base</span>
              <span className="font-headline-sm text-sm font-bold text-white">150 g / 18 m³</span>
              <span className="font-label-sm text-[10px] text-[#bdc8d1] block">Reduce aprox 0.2 pH</span>
            </div>
            <div>
              <span className="font-label-sm text-[10px] text-[#bdc8d1] block">Punto de aplicación</span>
              <span className="font-headline-sm text-sm font-bold text-white">Boquillas retorno</span>
              <span className="font-label-sm text-[10px] text-[#bdc8d1] block">Disuelto en balde</span>
            </div>
          </div>
        </div>

        {/* Product 2: Dideval Dicloro 56% */}
        <div className="bg-[#182234] border border-[#223249] rounded-2xl p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <span className="px-2 py-0.5 rounded-full bg-sky-950/80 border border-sky-400/30 text-sky-300 font-label-sm text-[10px] font-bold uppercase font-mono">
                Cloro Rápido
              </span>
              <h3 className="font-headline-sm text-base font-bold text-white mt-1">
                Dideval Dicloro 56%
              </h3>
              <p className="font-body-sm text-xs text-[#bdc8d1]">
                Dicloroisocianurato sódico estabilizado
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#101726] border border-[#2d3449] flex items-center justify-center text-[#38bdf8]">
              <span className="material-symbols-outlined text-[20px]">sanitizer</span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 bg-[#101726] border border-[#223249] rounded-xl p-3 font-mono">
            <div>
              <span className="font-label-sm text-[10px] text-[#bdc8d1] block">Dosis de choque</span>
              <span className="font-headline-sm text-sm font-bold text-white">360 g / 18 m³</span>
              <span className="font-label-sm text-[10px] text-[#bdc8d1] block">20 g por m³</span>
            </div>
            <div>
              <span className="font-label-sm text-[10px] text-[#bdc8d1] block">Mantenimiento diario</span>
              <span className="font-headline-sm text-sm font-bold text-white">36 g - 54 g / día</span>
              <span className="font-label-sm text-[10px] text-[#bdc8d1] block">Atardecer preferente</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Safety Confirmation Checklist Widget */}
      <section className="bg-[#182234] border border-[#223249] rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#38bdf8] text-[24px]">task_alt</span>
          <div>
            <h3 className="font-headline-sm text-base font-bold text-white">
              Checklist Pre-Dosificación
            </h3>
            <p className="font-body-sm text-xs text-[#bdc8d1]">
              Confirme antes de manipular bidones.
            </p>
          </div>
        </div>

        <div className="space-y-2 mt-2">
          <label className="flex items-center gap-3 p-3 rounded-xl bg-[#101726] border border-[#223249] hover:border-[#38bdf8]/50 cursor-pointer transition-colors group">
            <input
              type="checkbox"
              checked={checklist.safetyGear}
              onChange={() => toggleChecklist('safetyGear')}
              className="w-5 h-5 rounded border-[#3e484f] bg-[#0b1326] text-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] accent-[#38bdf8] cursor-pointer"
            />
            <span className="font-body-sm text-xs text-white group-hover:text-[#38bdf8] transition-colors">
              Lentes de seguridad y guantes puestos
            </span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-[#101726] border border-[#223249] hover:border-[#38bdf8]/50 cursor-pointer transition-colors group">
            <input
              type="checkbox"
              checked={checklist.kidsPetsClear}
              onChange={() => toggleChecklist('kidsPetsClear')}
              className="w-5 h-5 rounded border-[#3e484f] bg-[#0b1326] text-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] accent-[#38bdf8] cursor-pointer"
            />
            <span className="font-body-sm text-xs text-white group-hover:text-[#38bdf8] transition-colors">
              Niños y mascotas fuera del perímetro de caseta
            </span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-[#101726] border border-[#223249] hover:border-[#38bdf8]/50 cursor-pointer transition-colors group">
            <input
              type="checkbox"
              checked={checklist.pumpRecirculating}
              onChange={() => toggleChecklist('pumpRecirculating')}
              className="w-5 h-5 rounded border-[#3e484f] bg-[#0b1326] text-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] accent-[#38bdf8] cursor-pointer"
            />
            <span className="font-body-sm text-xs text-white group-hover:text-[#38bdf8] transition-colors">
              Bomba de 0.5 HP encendida en modo Recirculación
            </span>
          </label>
        </div>

        {allChecked && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-center font-label-md text-xs text-emerald-300 font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)] animate-fade-in font-mono flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            ✓ Entorno asegurado para manipulación química
          </div>
        )}
      </section>
    </div>
  );
};
