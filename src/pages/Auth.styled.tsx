import styled from "styled-components";

export const AuthContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f1f5f9; /* Tailwind slate-100 */
`;

export const AuthCard = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
  padding: 2.5rem;
  width: 100%;
  max-width: 28rem;
`;

export const AuthTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  color: #0f172a; /* Tailwind slate-900 */
  margin-bottom: 0.5rem;
  text-align: center;
`;

export const AuthSubtitle = styled.p`
  color: #64748b; /* Tailwind slate-500 */
  text-align: center;
  margin-bottom: 2rem;
`;

export const AuthFormGroup = styled.div`
  margin-bottom: 1rem;
`;

export const AuthLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155; /* Tailwind slate-700 */
  margin-bottom: 0.25rem;
`;

export const AuthInput = styled.input`
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #cbd5e1; /* Tailwind slate-300 */
  border-radius: 0.5rem;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #3b82f6; /* Tailwind blue-500 */
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

export const AuthButton = styled.button`
  width: 100%;
  background-color: #2563eb; /* Tailwind blue-600 */
  color: white;
  font-weight: 600;
  padding: 0.625rem 0;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #1d4ed8; /* Tailwind blue-700 */
  }

  &:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
`;
