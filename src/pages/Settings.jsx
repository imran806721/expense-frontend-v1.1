import { useNavigate } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/signin');
  }

  return (
    <div className="min-h-screen bg-ink">
      <NavBar />
      <main className="mx-auto max-w-lg px-6 py-8">
        <h1 className="mb-6 font-display text-2xl font-semibold text-paper">Settings</h1>
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Your ledger account details</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-paper-muted">Display name</p>
              <p className="mt-1 text-ink">{user?.displayName}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-paper-muted">Email</p>
              <p className="mt-1 text-ink">{user?.email}</p>
            </div>
            <Button variant="destructive" onClick={handleSignOut} className="mt-2 w-fit">
              Sign out
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
