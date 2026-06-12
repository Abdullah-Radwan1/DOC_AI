import { Outlet, Link, useNavigate, useLocation } from '@tanstack/react-router';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  LayoutDashboard,
  Upload,
  FileText,
  Settings,
  ChevronDown,
  Bell,
  LogOut,
  User,
  Check,
  Search,
  Menu,
  Building2,
  Crown,
  FileSearch,
} from 'lucide-react';

const organizations = [
  { id: '1', name: 'Acme Corporation', slug: 'acme-corp' },
  { id: '2', name: 'TechStart Inc.', slug: 'techstart' },
  { id: '3', name: 'Global Enterprises', slug: 'global-ent' },
];

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/upload', icon: Upload, label: 'Upload Document' },
  { path: '/documents', icon: FileText, label: 'Documents' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export function AppLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedOrg, setSelectedOrg] = useState(organizations[0]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications] = useState(3);

  const handleSignOut = async () => {
    localStorage.removeItem('docintel-mock-user');
    await signOut();
    navigate({ to: '/login' });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'compliance_manager':
        return 'secondary';
      case 'auditor':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'compliance_manager':
        return 'Compliance Mgr';
      case 'auditor':
        return 'Auditor';
      default:
        return 'Viewer';
    }
  };

  return (
    <TooltipProvider delayDuration={100}>
      <div className="min-h-screen bg-background flex">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden fixed top-4 left-4 z-50"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Sidebar */}
        <AnimatePresence mode="wait">
          {(sidebarOpen || true) && (
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`
                fixed lg:sticky top-0 left-0 z-40 w-72 h-screen
                bg-card/50 backdrop-blur-xl border-r border-border/50
                flex flex-col
                lg:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              `}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Logo */}
              <div className="h-16 flex items-center gap-3 px-6 border-b border-border/50">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <FileSearch className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight">DocIntel</span>
              </div>

              {/* Organization Switcher */}
              <div className="px-3 py-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between items-center h-11 px-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm truncate max-w-[160px]">
                          {selectedOrg.name}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-[240px] bg-card/95 backdrop-blur-xl border-border/50"
                    sideOffset={4}
                  >
                    <DropdownMenuLabel>Organizations</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {organizations.map((org) => (
                      <DropdownMenuItem
                        key={org.id}
                        onClick={() => setSelectedOrg(org)}
                        className="flex items-center justify-between"
                      >
                        <span>{org.name}</span>
                        {selectedOrg.id === org.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-primary">
                      <Building2 className="h-4 w-4 mr-2" />
                      Add Organization
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-3 py-2">
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Tooltip key={item.path}>
                        <TooltipTrigger asChild>
                          <Link
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`}
                            onClick={() => setSidebarOpen(false)}
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="lg:hidden">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </nav>

              {/* Usage Card */}
              <div className="px-3 pb-4">
                <div className="bg-gradient-to-br from-muted/80 to-muted/50 rounded-xl p-4 border border-border/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Free Plan</span>
                    <Badge variant="secondary" className="text-xs">1/3</Badge>
                  </div>
                  <div className="w-full h-2 bg-background rounded-full overflow-hidden mb-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '33%' }}
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                    />
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    className="w-full justify-start p-0 h-auto text-primary"
                    asChild
                  >
                    <Link to="/settings">
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to Pro
                    </Link>
                  </Button>
                </div>
              </div>

              {/* User Section */}
              <div className="p-4 border-t border-border/50">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between items-center p-2 h-auto rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-sm font-medium">
                            {user?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-medium truncate max-w-[140px]">
                            {user?.full_name || 'Demo User'}
                          </span>
                          <Badge
                            variant={getRoleBadgeVariant(user?.role || 'viewer')}
                            className="text-[10px] px-1.5 py-0 h-4 mt-0.5"
                          >
                            {getRoleLabel(user?.role || 'viewer')}
                          </Badge>
                        </div>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-[220px] bg-card/95 backdrop-blur-xl border-border/50"
                    sideOffset={4}
                  >
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{user?.email || 'demo@docintel.com'}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mobile Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top Bar */}
          <header className="h-16 border-b border-border/50 bg-card/30 backdrop-blur-sm flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
            <div className="flex items-center gap-4 ml-12 lg:ml-0">
              {/* Search */}
              <div className="hidden md:flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    className="w-64 lg:w-80 h-9 pl-9 pr-4 rounded-lg bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notifications > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-card/95 backdrop-blur-xl border-border/50">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-sm font-medium">Analysis Complete</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Contract_Acme_2024.pdf has been analyzed</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-sm font-medium">High Risk Detected</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Review NDA_TechStart document</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-center justify-center text-primary">
                    View all notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-4 lg:p-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
