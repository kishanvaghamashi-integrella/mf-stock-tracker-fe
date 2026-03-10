import styled from "styled-components";

export const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-default);
  background: var(--bg-subtle);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: var(--bg-surface);
    color: var(--text-default);
    border-color: var(--border-strong);
  }
`;
