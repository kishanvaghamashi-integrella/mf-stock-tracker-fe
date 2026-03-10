import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutWrapper,
  Sidebar,
  SidebarTop,
  CollapseButton,
  NavList,
  NavItem,
  NavLabel,
  SidebarBottom,
  MainContent,
  BottomBar,
  BottomBarItems,
  BottomNavItem,
  DrawerOverlay,
  DrawerPanel,
  DrawerClose,
  DrawerItem,
  DrawerLogoutItem,
} from "./AppLayout.styled";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  ArrowLeftRight,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { useGlobalContext } from "../context/GlobalContext";
import { useTheme } from "../context/ThemeContext";
import { showToast } from "../utils/toast";

const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Portfolio", path: "/portfolio", icon: BriefcaseBusiness },
  { label: "Transactions", path: "/transactions", icon: ArrowLeftRight },
];

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setState } = useGlobalContext();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setState({ user: null });
    showToast.success("Logged out successfully");
    navigate("/login");
  };

  const sidebarWidth = collapsed ? "64px" : "220px";

  return (
    <LayoutWrapper>
      {/* ── Sidebar (desktop) ── */}
      <Sidebar $collapsed={collapsed}>
        <SidebarTop>
          <CollapseButton
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen size={20} />
            ) : (
              <PanelLeftClose size={20} />
            )}
          </CollapseButton>
        </SidebarTop>

        <NavList>
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavItem
              key={path}
              $active={location.pathname === path}
              $collapsed={collapsed}
              onClick={() => navigate(path)}
              title={collapsed ? label : undefined}
            >
              <Icon size={20} />
              <NavLabel $collapsed={collapsed}>{label}</NavLabel>
            </NavItem>
          ))}
        </NavList>

        <SidebarBottom>
          <NavItem
            $active={false}
            $collapsed={collapsed}
            onClick={toggleTheme}
            title={
              collapsed ? (isDark ? "Light mode" : "Dark mode") : undefined
            }
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            <NavLabel $collapsed={collapsed}>
              {isDark ? "Light Mode" : "Dark Mode"}
            </NavLabel>
          </NavItem>

          <NavItem
            $active={false}
            $collapsed={collapsed}
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
            style={{ color: "#ef4444" }}
          >
            <LogOut size={20} />
            <NavLabel $collapsed={collapsed}>Logout</NavLabel>
          </NavItem>
        </SidebarBottom>
      </Sidebar>

      {/* ── Main content ── */}
      <MainContent $sidebarWidth={sidebarWidth}>
        <Outlet />
      </MainContent>

      {/* ── Bottom bar (mobile) ── */}
      <BottomBar>
        <BottomBarItems>
          {navItems.map(({ label, path, icon: Icon }) => (
            <BottomNavItem
              key={path}
              $active={location.pathname === path}
              onClick={() => navigate(path)}
            >
              <Icon size={22} />
              {label}
            </BottomNavItem>
          ))}

          <BottomNavItem $active={false} onClick={() => setDrawerOpen(true)}>
            <Menu size={22} />
            More
          </BottomNavItem>
        </BottomBarItems>
      </BottomBar>

      {/* ── Hamburger drawer (mobile) ── */}
      <DrawerOverlay $open={drawerOpen} onClick={() => setDrawerOpen(false)} />
      <DrawerPanel $open={drawerOpen}>
        <DrawerClose
          onClick={() => setDrawerOpen(false)}
          aria-label="Close menu"
        >
          <X size={20} />
        </DrawerClose>

        <DrawerItem
          onClick={() => {
            toggleTheme();
            setDrawerOpen(false);
          }}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
          {isDark ? "Light Mode" : "Dark Mode"}
        </DrawerItem>

        <DrawerLogoutItem
          onClick={() => {
            handleLogout();
            setDrawerOpen(false);
          }}
        >
          <LogOut size={20} />
          Logout
        </DrawerLogoutItem>
      </DrawerPanel>
    </LayoutWrapper>
  );
};

export default AppLayout;
