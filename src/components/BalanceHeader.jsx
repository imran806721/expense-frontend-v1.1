import { TrendingDown, TrendingUp } from 'lucide-react';
import { formatMoney } from '../lib/format';

export function BalanceHeader({ balance, totalSpent, expenseCount }) {
  const isPositive = balance >= 0;

  return (
    <div className="rounded-2xl bg-ink-raised p-8">
      <p className="text-sm font-medium uppercase tracking-wide text-ink-muted">Running balance</p>
      <div className="mt-2 flex items-center gap-3">
        <span className={`tabular text-5xl font-semibold ${isPositive ? 'text-ledger-green' : 'text-alert-coral'}`}>
          {formatMoney(balance)}
        </span>
        {isPositive ? (
          <TrendingUp className="h-6 w-6 text-ledger-green" />
        ) : (
          <TrendingDown className="h-6 w-6 text-alert-coral" />
        )}
      </div>
      <p className="mt-3 text-sm text-ink-muted">
        <span className="tabular text-paper">{formatMoney(totalSpent)}</span> spent across{' '}
        <span className="tabular text-paper">{expenseCount}</span> {expenseCount === 1 ? 'entry' : 'entries'}
      </p>
    </div>
  );
}
