import styled from "styled-components";

export const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-default);
  margin-bottom: 1rem;
`;

export const DashboardPanel = styled.div`
  background: var(--bg-surface);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-default);
  padding: 1.5rem;
  margin-top: 1.5rem;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
`;
