import { useEffect, useState, useCallback } from 'react';
import { PlusCircle } from 'lucide-react';
import { NavBar } from '../components/NavBar';
import { BalanceHeader } from '../components/BalanceHeader';
import { CategoryBreakdownChart } from '../components/CategoryBreakdownChart';
import { LedgerList } from '../components/LedgerList';
import { ExpenseSheet } from '../components/ExpenseSheet';
import { Button } from '../components/ui/button';
import { api } from '../lib/api';
import { formatMoney } from '../lib/format';

function toRow(expense, categories) {
  const category = categories.find((c) => c.id === expense.categoryId);
  return {
    id: expense.id,
    amount: expense.amount,
    description: expense.description,
    expenseDate: expense.expenseDate,
    categoryId: expense.categoryId,
    categoryName: category?.name || 'Other',
    categoryIconKey: category?.iconKey || 'MoreHorizontal',
    categoryColorHex: category?.colorHex || '#8891A8',
  };
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [justAddedId, setJustAddedId] = useState(null);

  const loadAll = useCallback(async () => {
    const [summaryRes, expensesRes, categoriesRes] = await Promise.all([
      api.getSummary(),
      api.getExpenses({ page: 1, pageSize: 20, sort: 'desc' }),
      api.getCategories(),
    ]);
    setSummary(summaryRes);
    setExpenses(expensesRes.items);
    setCategories(categoriesRes);
  }, []);

  useEffect(() => {
    loadAll().finally(() => setLoading(false));
  }, [loadAll]);

  function openAddSheet() {
    setEditingExpense(null);
    setSheetOpen(true);
  }

  function openEditSheet(expense) {
    setEditingExpense(expense);
    setSheetOpen(true);
  }

  function handleCreated(created) {
    setExpenses((prev) => [toRow(created, categories), ...prev]);
    setJustAddedId(created.id);
    api.getSummary().then(setSummary).catch(() => {});
    setTimeout(() => setJustAddedId(null), 900);
  }

  function handleUpdated(updated) {
    setExpenses((prev) => prev.map((e) => (e.id === updated.id ? toRow(updated, categories) : e)));
    api.getSummary().then(setSummary).catch(() => {});
  }

  async function handleDelete(expense) {
    const label = expense.description || expense.categoryName;
    if (!window.confirm(`Delete "${label}" (${formatMoney(expense.amount)})?`)) return;

    await api.deleteExpense(expense.id);
    setExpenses((prev) => prev.filter((e) => e.id !== expense.id));
    api.getSummary().then(setSummary).catch(() => {});
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ink">
        <NavBar />
        <div className="p-6 text-ink-muted">Loading your ledger…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink pb-16">
      <NavBar />
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold text-paper">Dashboard</h1>
          <Button onClick={openAddSheet}>
            <PlusCircle className="h-4 w-4" />
            Add expense
          </Button>
        </div>

        <BalanceHeader
          balance={summary?.balance ?? 0}
          totalSpent={summary?.totalSpent ?? 0}
          expenseCount={summary?.expenseCount ?? 0}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-3 font-display text-lg font-semibold text-paper">Recent activity</h2>
            <LedgerList expenses={expenses} justAddedId={justAddedId} onEdit={openEditSheet} onDelete={handleDelete} />
          </div>
          <div>
            <CategoryBreakdownChart categories={summary?.categoryBreakdown} />
          </div>
        </div>
      </main>

      <ExpenseSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        categories={categories}
        editingExpense={editingExpense}
        onCreated={handleCreated}
        onUpdated={handleUpdated}
      />
    </div>
  );
}
