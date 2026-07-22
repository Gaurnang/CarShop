import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Car, LogOut, User, Settings, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <Car className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg tracking-tight">CarShop</span>
          </Link>
          <div className="hidden md:flex gap-6">
            <Link 
              to="/" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive('/') ? "text-primary" : "text-muted-foreground"
              )}
            >
              Catalog
            </Link>
            {isAuthenticated && (
              <Link 
                to="/dashboard" 
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive('/dashboard') ? "text-primary" : "text-muted-foreground"
                )}
              >
                My Garage
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link to="/admin" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Admin
                </Link>
              )}
              <div className="flex items-center gap-2 border-l border-border pl-4">
                <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
                <button 
                  onClick={handleLogout}
                  className="p-2 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-primary">
                Log in
              </Link>
              <Link to="/register" className="text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
