import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Title = styled(motion.h1)`
  text-align: center;
  color: ${props => props.theme.colors.primary};
  font-size: 2.5rem;
  margin-bottom: 2rem;
`;

export const Controls = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

export const Button = styled(motion.button)`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
    transform: translateY(-2px);
  }
`;

export const NumberEditor = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const VersionNumber = styled.div`
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textMuted};
`;

export const GameContainer = styled.div`
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xlarge};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.xlarge};
  box-shadow: ${props => props.theme.shadows.main};
`;

export const ResetButton = styled(motion.button)`
  position: absolute;
  top: ${props => props.theme.spacing.medium};
  right: ${props => props.theme.spacing.medium};
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  border: none;
  padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.medium};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
    transform: translateY(-2px);
  }
`; 

export const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 1rem 0;
`;
