import styled from 'styled-components';
import { motion } from 'framer-motion';

export const BetHistory = styled(motion.div)`
  margin-top: 1.5rem;
  padding: 1rem;
  background: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.medium};
  max-height: 200px;
  overflow-y: auto;

  h3 {
    color: ${props => props.theme.colors.primary};
    margin-bottom: 0.5rem;
  }

  ul {
    list-style: none;
    padding: 0;
  }
`;

export const BetHistoryItem = styled(motion.li)`
  display: flex;
  align-items: center;
  padding: 0.3rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  
  &:last-child {
    border-bottom: none;
  }
`; 