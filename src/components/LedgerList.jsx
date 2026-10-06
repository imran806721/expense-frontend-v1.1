import { Pencil, Trash2 } from 'lucide-react';
import { CategoryIcon } from './CategoryIcon';
import { formatDate, formatMoney } from '../lib/format';

export function LedgerList({ expenses, justAddedId, onEdit, onDelete }) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-2xl bg-paper p-8 text-center text-paper-muted">
        <p className="text-sm">No expenses yet. Add your first entry to start the ledger.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-paper">
      <ul>
        {expenses.map((expense, idx) => (
          <li
            key={expense.id}
            className={`group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-paper-dim/60 ${
              idx !== expenses.length - 1 ? 'border-b border-paper-muted/10' : ''
            } ${expense.id === justAddedId ? 'animate-stamp-in' : ''}`}
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: `${expense.categoryColorHex}22`, color: expense.categoryColorHex }}
            >
              <CategoryIcon iconKey={expense.categoryIconKey} className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-ink">{expense.description || expense.categoryName}</p>
              <p className="text-sm text-paper-muted">
                {expense.categoryName} · {formatDate(expense.expenseDate)}
              </p>
            </div>
            <span className="tabular shrink-0 text-base font-semibold text-ink">{formatMoney(-expense.amount)}</span>
            <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => onEdit(expense)}
                className="rounded-md p-1.5 text-paper-muted hover:bg-paper-dim hover:text-stamp-amber"
                aria-label="Edit expense"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(expense)}
                className="rounded-md p-1.5 text-paper-muted hover:bg-paper-dim hover:text-alert-coral"
                aria-label="Delete expense"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
