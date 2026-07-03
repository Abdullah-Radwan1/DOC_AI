import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Crown,
  FileSearch,
  LayoutDashboard,
  LogOut,
  Upload,
  FileText,
  Settings,
  User as UserIcon,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate, Link as RouterLink, useLocation as useRouteLocation } from "@tanstack/react-router";

const navItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/upload", icon: Upload, label: "Upload Document" },
  { path: "/documents", icon: FileText, label: "Documents" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export function AppSidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useRouteLocation();

  const handleSignOut = async () => {
    localStorage.removeItem("docintel-mock-user");
    await signOut();
    navigate({ to: "/login" });
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "compliance_manager":
        return "Compliance Mgr";
      case "auditor":
        return "Auditor";
      default:
        return "Viewer";
    }
  };

  return (
    <Sidebar variant="sidebar">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <RouterLink to="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <FileSearch className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">DocIntel</span>
        </RouterLink>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                      <RouterLink to={item.path}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </RouterLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />
        
        <SidebarGroup>
          <SidebarGroupLabel>Storage Usage</SidebarGroupLabel>
          <SidebarGroupContent className="px-4 py-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Free Plan</span>
              <Badge variant="secondary" className="text-xs">1/3</Badge>
            </div>
            <div className="w-full h-2 bg-sidebar-accent rounded-full overflow-hidden mb-2">
              <div className="h-full bg-primary w-1/3 rounded-full" />
            </div>
            <Button variant="link" size="sm" className="px-0 h-auto text-primary" asChild>
              <RouterLink to="/settings">
                <Crown className="h-3 w-3 mr-1" />
                Upgrade to Pro
              </RouterLink>
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="w-full justify-start">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="" />
                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                      {user?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left flex-1 max-w-full overflow-hidden">
                    <span className="text-sm font-medium truncate w-full">
                      {user?.full_name || "Demo User"}
                    </span>
                    <span className="text-xs text-muted-foreground truncate w-full">
                      {getRoleLabel(user?.role || "viewer")}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user?.email || "demo@docintel.com"}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <RouterLink to="/settings" className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-2" />
                    Profile Settings
                  </RouterLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
