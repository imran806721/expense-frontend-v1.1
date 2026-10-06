import { useEffect, useState } from 'react';
import { Sheet, SheetContent } from './ui/sheet';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { CategoryIcon } from './CategoryIcon';
import { api } from '../lib/api';
import { todayISO } from '../lib/format';
import { cn } from '../lib/utils';

const EMPTY_FORM = { amount: '', description: '', expenseDate: todayISO(), categoryId: null };

export function ExpenseSheet({ open, onOpenChange, categories, editingExpense, onCreated, onUpdated }) {
  const isEditing = Boolean(editingExpense);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (editingExpense) {
      setForm({
        amount: String(editingExpense.amount),
        description: editingExpense.description || '',
        expenseDate: editingExpense.expenseDate,
        categoryId: editingExpense.categoryId,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError(null);
  }, [open, editingExpense]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const numericAmount = parseFloat(form.amount);
    if (!form.categoryId) {
      setError('Choose a category');
      return;
    }
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Enter an amount greater than zero');
      return;
    }

    const payload = {
      amount: numericAmount,
      categoryId: form.categoryId,
      description: form.description.trim() || null,
      expenseDate: form.expenseDate,
    };

    setSubmitting(true);
    try {
      if (isEditing) {
        const updated = await api.updateExpense(editingExpense.id, payload);
        onUpdated(updated);
      } else {
        const created = await api.createExpense(payload);
        onCreated(created);
      }
      onOpenChange(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        title={isEditing ? 'Edit expense' : 'Add expense'}
        description={isEditing ? 'Update this ledger entry' : 'Stamp a new entry into your ledger'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label>Category</Label>
            <div className="grid grid-cols-5 gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, categoryId: c.id }))}
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-xl border p-2 text-center transition-colors',
                    form.categoryId === c.id
                      ? 'border-stamp-amber bg-stamp-amber/10'
                      : 'border-paper-muted/20 hover:bg-paper-dim'
                  )}
                  title={c.name}
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${c.colorHex}22`, color: c.colorHex }}
                  >
                    <CategoryIcon iconKey={c.iconKey} className="h-4 w-4" />
                  </span>
                  <span className="w-full truncate text-[11px] text-paper-muted">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              inputMode="decimal"
              className="tabular"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="expenseDate">Date</Label>
            <Input
              id="expenseDate"
              type="date"
              value={form.expenseDate}
              onChange={(e) => setForm((f) => ({ ...f, expenseDate: e.target.value }))}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              maxLength={255}
              placeholder="What was this for?"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>

          {error && <p className="text-sm text-alert-coral">{error}</p>}

          <Button type="submit" variant="success" disabled={submitting} className="mt-2 w-full">
            {submitting ? 'Saving…' : isEditing ? 'Save changes' : 'Add to ledger'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
