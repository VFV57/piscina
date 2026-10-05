export type TabId = 'calculadora' | 'procedimiento' | 'horario-bomba' | 'seguridad';

export interface PoolState {
  cl: number;
  ph: number;
  season: 'summer' | 'winter';
  alkalinity: number;
  poolVolume: number;
  pumpRunning: boolean;
  pumpStartTime: string;
  pumpEndTime: string;
  checklist: {
    safetyGear: boolean;
    kidsPetsClear: boolean;
    pumpRecirculating: boolean;
  };
  step3Applied: boolean;
  timerSecondsLeft: number;
  timerRunning: boolean;
  logEntries: LogEntry[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  dateStr: string;
  cl: number;
  ph: number;
  dosePh: number;
  doseCl: number;
  notes?: string;
}
