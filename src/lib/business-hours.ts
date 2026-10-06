import type { BusinessHours, DaySchedule } from '@/types/content';

/* ============================================================================
   Estado de funcionamento (FR-004).
   Calculado SEMPRE no fuso do estabelecimento, nunca no do aparelho do
   visitante — o horário que importa é o da loja (research.md R-09).
   ============================================================================ */

const BUSINESS_TIME_ZONE = 'America/Sao_Paulo';

export type OpenStatus =
  | { state: 'open'; closesAt: string }
  | { state: 'closed'; nextOpenWeekday: number; nextOpenAt: string }
  /** Primeira renderização: mantém o HTML pré-renderizado idêntico ao cliente. */
  | { state: 'unknown' };

export const WEEKDAY_LABELS = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado',
] as const;

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(':');
  return Number(hours) * 60 + Number(minutes);
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/** Extrai dia da semana, minutos do dia e data ISO no fuso do negócio. */
function resolveBusinessMoment(now: Date): {
  weekday: number;
  minutes: number;
  isoDate: string;
} {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: BUSINESS_TIME_ZONE,
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((part) => part.type === type)?.value ?? '';

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const hour = Number(get('hour')) % 24;

  return {
    weekday: weekdayMap[get('weekday')] ?? 0,
    minutes: hour * 60 + Number(get('minute')),
    isoDate: `${get('year')}-${get('month')}-${get('day')}`,
  };
}

/** Horário efetivo de um dia, considerando exceções (feriados). */
function resolveSchedule(
  hours: BusinessHours,
  weekday: number,
  isoDate: string,
): Pick<DaySchedule, 'closed' | 'intervals'> {
  const exception = hours.exceptions.find((item) => item.date === isoDate);
  if (exception !== undefined) {
    return { closed: exception.closed, intervals: exception.intervals };
  }
  const day = hours.weekly.find((item) => item.weekday === weekday);
  return day ?? { closed: true, intervals: [] };
}

function addDaysIso(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1));
  date.setUTCDate(date.getUTCDate() + days);
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

/**
 * Estado atual do atendimento. Quando fechado, informa o próximo horário de
 * abertura — exigência de FR-004 para não prometer resposta imediata fora do
 * horário comercial.
 */
export function getOpenStatus(now: Date, hours: BusinessHours): OpenStatus {
  const moment = resolveBusinessMoment(now);
  const today = resolveSchedule(hours, moment.weekday, moment.isoDate);

  if (!today.closed) {
    const current = today.intervals.find(
      (interval) =>
        moment.minutes >= toMinutes(interval.opensAt) &&
        moment.minutes < toMinutes(interval.closesAt),
    );
    if (current !== undefined) {
      return { state: 'open', closesAt: current.closesAt };
    }

    const laterToday = today.intervals
      .filter((interval) => toMinutes(interval.opensAt) > moment.minutes)
      .toSorted((a, b) => toMinutes(a.opensAt) - toMinutes(b.opensAt))[0];
    if (laterToday !== undefined) {
      return {
        state: 'closed',
        nextOpenWeekday: moment.weekday,
        nextOpenAt: laterToday.opensAt,
      };
    }
  }

  // Procura a próxima abertura nos 7 dias seguintes.
  for (let offset = 1; offset <= 7; offset += 1) {
    const weekday = (moment.weekday + offset) % 7;
    const isoDate = addDaysIso(moment.isoDate, offset);
    const schedule = resolveSchedule(hours, weekday, isoDate);
    if (schedule.closed) continue;

    const first = schedule.intervals.toSorted(
      (a, b) => toMinutes(a.opensAt) - toMinutes(b.opensAt),
    )[0];
    if (first !== undefined) {
      return { state: 'closed', nextOpenWeekday: weekday, nextOpenAt: first.opensAt };
    }
  }

  return { state: 'unknown' };
}
