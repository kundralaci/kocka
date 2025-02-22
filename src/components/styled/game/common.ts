import styled from 'styled-components';
import { motion } from 'framer-motion';

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  position: relative;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
    padding: 0.5rem;
  }
`;

export const Title = styled(motion.h1)`
  text-align: center;
  color: ${props => props.theme.colors.primary};
  font-size: 2.5rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.4rem;
    flex: 1;
  }
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
  min-width: 120px;

  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
    min-width: 100px;
  }

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
    transform: translateY(-2px);
  }
`;

export const Tag = styled(motion.div)`
  display: inline-block;
  background: ${props => props.theme.colors.secondary};
  border-width: 0;
  border-radius: ${props => props.theme.borderRadius.small};
  color: ${props => props.theme.colors.text};
  font-size: 0.6em;
  font-weight: normal;
  padding: 0.2em 0.5em;
  margin-bottom: 0.1em;
  transition: all 0.2s ease;
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
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.medium};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.xlarge};
  box-shadow: ${props => props.theme.shadows.main};

  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing.small};
    border-radius: 0;
    min-height: 100vh;
  }
`;

export const ResetButton = styled(motion.button)`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.primary};
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 1rem 0;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;
