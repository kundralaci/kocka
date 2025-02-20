import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Die = styled.span<{ isMatching?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  margin: 0 4px;
  background: ${props => props.isMatching ? props.theme.colors.primary : props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.small};
  font-weight: bold;
  color: ${props => props.theme.colors.text};
`;

export const DiceContainer = styled(motion.div)`
  display: flex;
  gap: 4px;
  margin-top: 8px;
`;
