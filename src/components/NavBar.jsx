import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function NavBar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/signin');
  }

  return (
    <nav className="sticky top-0 z-30 flex items-center justify-between border-b border-paper/5 bg-ink-raised px-6 py-3">
      <Link to="/dashboard" className="flex items-center gap-2 font-display text-lg font-semibold text-paper">
        <BookOpen className="h-5 w-5 text-stamp-amber" />
        Ledger
      </Link>
      <div className="flex items-center gap-1">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-ink hover:text-paper"
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>
        <Link
          to="/settings"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-ink hover:text-paper"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
        <span className="mx-2 h-5 w-px bg-paper/10" />
        <span className="hidden text-sm text-ink-muted sm:inline">{user?.displayName}</span>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-ink hover:text-alert-coral"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </nav>
  );
}
