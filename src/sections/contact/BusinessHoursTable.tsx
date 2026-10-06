import { WEEKDAY_LABELS } from '@/lib/business-hours';
import { cn } from '@/lib/utils';
import type { BusinessHours } from '@/types/content';

export type BusinessHoursTableProps = {
  hours: BusinessHours;
  className?: string;
};

/**
 * Horário de funcionamento por dia da semana (FR-024).
 *
 * Renderizado como texto selecionável e completo, inclusive sem JavaScript —
 * é o que garante que a informação essencial continue disponível quando o selo
 * "aberto agora" (que depende da hidratação) não aparece (AC-001).
 */
/** Segunda a sábado primeiro, domingo ao final — ordem de leitura natural. */
function readingOrder(weekday: number): number {
  return weekday === 0 ? 7 : weekday;
}

export function BusinessHoursTable({ hours, className }: BusinessHoursTableProps) {
  const ordered = hours.weekly.toSorted(
    (a, b) => readingOrder(a.weekday) - readingOrder(b.weekday),
  );

  return (
    <div className={cn('overflow-hidden rounded-xl border border-border', className)}>
      <table className="w-full border-collapse text-base">
        <caption className="sr-only">Horário de funcionamento por dia da semana</caption>
        <tbody>
          {ordered.map((day) => (
            <tr key={day.weekday} className="border-b border-border last:border-b-0">
              <th
                scope="row"
                className="px-4 py-2.5 text-left font-medium text-foreground capitalize"
              >
                {WEEKDAY_LABELS[day.weekday]}
              </th>
              <td className="px-4 py-2.5 text-right text-foreground-muted">
                {day.closed
                  ? 'Fechado'
                  : day.intervals
                      .map((interval) => `${interval.opensAt} às ${interval.closesAt}`)
                      .join(' · ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
