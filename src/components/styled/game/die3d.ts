import styled from 'styled-components';
import { motion } from 'framer-motion';

export const DieWrapper = styled(motion.div)<{ size?: number }>`
  backface-visibility: hidden;
  width: ${props => props.size || 30}px;
  height: ${props => props.size || 30}px;
  position: relative;
  transform-style: preserve-3d;
  margin: 0 4px;
`;

export const DieFace = styled.div<{ position: number, size: number, isMatching?: boolean  }>`
  backface-visibility: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  background: ${props => props.isMatching ? props.theme.colors.primary : props.theme.colors.secondary};
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.small};
  display: grid;
  grid-template: repeat(3, 1fr) / repeat(3, 1fr);
  gap: 2px;
  padding: 2px;
  transform-style: preserve-3d;
  -webkit-backface-visibility: hidden;
  -webkit-transform-style: preserve-3d;

  ${props => {
    const offset = props.size / 2;
    const epsilon = 0;
    switch (props.position) {
      case 1: return `transform: rotateY(0deg) translateZ(${offset + epsilon}px);`;
      case 2: return `transform: rotateY(90deg) translateZ(${offset + epsilon}px);`;
      case 3: return `transform: rotateX(-90deg) translateZ(${offset + epsilon}px);`;
      case 4: return `transform: rotateX(90deg) translateZ(${offset + epsilon}px);`;
      case 5: return `transform: rotateY(-90deg) translateZ(${offset + epsilon}px);`;
      case 6: return `transform: rotateY(180deg) translateZ(${offset + epsilon}px);`;
      default: return '';
    }
  }}
`;

export const Dot = styled.div<{ isMatching?: boolean }>`
  background: ${props => props.isMatching ? props.theme.colors.secondary : props.theme.colors.primary};
  border-radius: 50%;
  width: 100%;
  height: 100%;
  transform: translateZ(1px);
  -webkit-backface-visibility: hidden;
  -webkit-transform-style: preserve-3d;
`; 