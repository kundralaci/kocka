import styled from 'styled-components';
import { motion } from 'framer-motion';

export const PlayersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }
`;

export const PlayerCard = styled(motion.div)<{ isActive: boolean }>`
  background: ${props => props.isActive ? props.theme.colors.secondary : props.theme.colors.secondaryDark};
  padding: ${props => props.theme.spacing.large};
  border-radius: ${props => props.theme.borderRadius.large};
  border: 2px solid ${props => props.isActive ? props.theme.colors.primary : 'transparent'};
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing.medium};
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  h2 {
    color: ${props => props.theme.colors.primary};
    margin-bottom: ${props => props.theme.spacing.medium};
    font-size: 1.2rem;

    @media (max-width: 768px) {
      font-size: 1rem;
      margin-bottom: 0;
      flex-shrink: 0;
    }
  }
`; 