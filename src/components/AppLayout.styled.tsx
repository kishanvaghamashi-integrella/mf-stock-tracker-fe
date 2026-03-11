import styled from "styled-components";

export const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: var(--bg-page);
`;

export const Sidebar = styled.aside<{ $collapsed: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${({ $collapsed }) => ($collapsed ? "64px" : "220px")};
  background: var(--bg-surface);
  border-right: 1px solid var(--border-default);
  display: flex;
  flex-direction: column;
  transition: width 0.25s ease;
  z-index: 100;
  overflow: hidden;

  @media (max-width: 767px) {
    display: none;
  }
`;

export const SidebarTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0.75rem;
  border-bottom: 1px solid var(--border-default);
  min-height: 56px;
`;

export const CollapseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;
  flex-shrink: 0;

  &:hover {
    background: var(--bg-subtle);
    color: var(--text-default);
  }
`;

export const NavList = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem 0.5rem;
  overflow-y: auto;
`;

export const NavItem = styled.button<{ $active: boolean; $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.625rem 0.75rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  background: ${({ $active }) =>
    $active ? "var(--accent-primary)" : "transparent"};
  color: ${({ $active }) =>
    $active ? "var(--accent-text)" : "var(--text-default)"};
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: ${({ $active }) =>
      $active ? "var(--accent-hover)" : "var(--bg-subtle)"};
  }

  svg {
    flex-shrink: 0;
  }
`;

export const NavLabel = styled.span<{ $collapsed: boolean }>`
  font-size: 0.9rem;
  font-weight: 500;
  opacity: ${({ $collapsed }) => ($collapsed ? "0" : "1")};
  transition: opacity 0.15s ease;
  pointer-events: none;
`;

export const SidebarBottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem 0.5rem;
  border-top: 1px solid var(--border-default);
`;

export const MainContent = styled.main<{ $sidebarWidth: string }>`
  margin-left: ${({ $sidebarWidth }) => $sidebarWidth};
  flex: 1;
  transition: margin-left 0.25s ease;
  min-width: 0;

  @media (max-width: 767px) {
    margin-left: 0;
    padding-bottom: 64px;
  }
`;

/* ── Bottom Bar (mobile) ── */

export const BottomBar = styled.nav`
  display: none;

  @media (max-width: 767px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 64px;
    background: var(--bg-surface);
    border-top: 1px solid var(--border-default);
    z-index: 100;
  }
`;

export const BottomBarItems = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-around;
`;

export const BottomNavItem = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  flex: 1;
  height: 100%;
  min-width: 44px;
  border: none;
  background: transparent;
  color: ${({ $active }) =>
    $active ? "var(--accent-primary)" : "var(--text-muted)"};
  cursor: pointer;
  transition: color 0.15s ease;

  font-size: 0.65rem;
  font-weight: 500;

  &:hover {
    color: var(--accent-primary);
  }
`;

/* ── Hamburger Drawer (mobile) ── */

export const DrawerOverlay = styled.div<{ $open: boolean }>`
  display: none;

  @media (max-width: 767px) {
    display: ${({ $open }) => ($open ? "block" : "none")};
    position: fixed;
    inset: 0;
    background: var(--overlay-scrim, rgba(0, 0, 0, 0.45));
    z-index: 200;
  }
`;

export const DrawerPanel = styled.div<{ $open: boolean }>`
  display: none;

  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 240px;
    background: var(--bg-surface);
    border-left: 1px solid var(--border-default);
    z-index: 201;
    transform: ${({ $open }) => ($open ? "translateX(0)" : "translateX(100%)")};
    transition: transform 0.25s ease;
    padding: 1.25rem 1rem;
    gap: 0.5rem;
  }
`;

export const DrawerClose = styled.button`
  align-self: flex-end;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  margin-bottom: 0.5rem;

  &:hover {
    background: var(--bg-subtle);
    color: var(--text-default);
  }
`;

export const DrawerItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  color: var(--text-default);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: left;
  transition: background 0.15s ease;

  &:hover {
    background: var(--bg-subtle);
  }
`;

export const DrawerLogoutItem = styled(DrawerItem)`
  color: var(--color-danger);
  margin-top: auto;

  &:hover {
    background: var(--color-danger-bg);
  }
`;
