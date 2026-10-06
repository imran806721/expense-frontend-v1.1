import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CategoryIcon } from './CategoryIcon';
import { formatMoney } from '../lib/format';

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-lg bg-ink px-3 py-2 text-sm shadow-lg">
      <p className="font-medium text-paper">{item.name}</p>
      <p className="tabular text-ink-muted">{formatMoney(item.total)}</p>
    </div>
  );
}

export function CategoryBreakdownChart({ categories }) {
  if (!categories || categories.length === 0) {
    return (
      <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded-2xl bg-paper p-6 text-center text-paper-muted">
        <p className="text-sm">No expenses yet — your breakdown will appear here.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-paper p-6">
      <h3 className="font-display text-base font-semibold text-ink">By category</h3>
      <div className="mt-2 h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={categories} dataKey="total" nameKey="name" innerRadius={50} outerRadius={78} paddingAngle={2}>
              {categories.map((c) => (
                <Cell key={c.categoryId} fill={c.colorHex} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-4 flex flex-col gap-2">
        {categories.map((c) => (
          <li key={c.categoryId} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-ink">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full"
                style={{ backgroundColor: `${c.colorHex}22`, color: c.colorHex }}
              >
                <CategoryIcon iconKey={c.iconKey} className="h-3.5 w-3.5" />
              </span>
              {c.name}
            </span>
            <span className="tabular text-paper-muted">{formatMoney(c.total)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
