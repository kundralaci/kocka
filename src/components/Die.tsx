import React from 'react';
import {
  Die as StyledDie
} from './styled/game';

interface DieProps {
  faceValue: number;
  hiddenValue?: string;
  isHidden?: boolean;
  isMatching?: boolean;
}

export const Die: React.FC<DieProps> = ({
  faceValue,
  isHidden = false,
  isMatching = false,
  hiddenValue = "?"
}) => {
  return (
    <StyledDie
        isMatching={isMatching}
    >
        {isHidden ? hiddenValue : faceValue}
    </StyledDie>
  );
}; 