import { useState, useEffect } from 'react';
import Login from './pages/Login';
import AppShell from './components/AppShell';
import { getLoggedInUser } from './lib/dbService';
import type { Profile } from './lib/dbService';


function App() {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local logged in user
    const currentUser = getLoggedInUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const handleLoginSuccess = (loggedInUser: Profile) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center space-y-4">
          <span className="material-symbols-outlined animate-spin text-[48px] text-primary-container">progress_activity</span>
          <p className="text-body-md text-on-surface-variant font-medium">Đang tải Vĩnh Hưng CRM...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return <AppShell user={user} onLogout={handleLogout} />;
}

export default App;
