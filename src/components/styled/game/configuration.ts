import styled from 'styled-components';
import { motion } from 'framer-motion';

export const ConfigurationContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  margin: 2rem 0;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    gap: 1rem;
    margin: 1rem 0;
  }
`;

export const ConfigurationOption = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  width: 100%;

  label {
    font-size: 1.2rem;
    color: ${props => props.theme.colors.primary};

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }

  select, input {
    padding: 0.5rem;
    border-radius: ${props => props.theme.borderRadius.small};
    background: ${props => props.theme.colors.secondary};
    color: ${props => props.theme.colors.text};
    border: 1px solid ${props => props.theme.colors.primary};
    width: 100%;
    max-width: 300px;
    text-align: center;

    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primaryHover};
    }
  }
`;

export const ThemeSelect = styled(motion.select)`
  padding: 0.5rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  background: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.primary};
  width: 200px;
  cursor: pointer;
`; 