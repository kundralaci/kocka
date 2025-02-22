import React from 'react';
import { Die3D } from './Die3D';
import {
  Die as StyledDie
} from './styled/game';

interface DieProps {
  faceValue: number;
  hiddenValue?: string;
  isHidden?: boolean;
  isMatching?: boolean;
  size?: number;
  isRolling?: boolean;
  is3D?: boolean;
}

export const Die: React.FC<DieProps> = ({
  faceValue,
  isHidden = false,
  isMatching = false,
  hiddenValue = "?",
  size = 30,
  isRolling = false,
  is3D = false,
}) => {
  if (is3D) {
    return (
      <Die3D
        faceValue={isHidden ? 1 : faceValue}
        isHidden={isHidden}
        isMatching={isMatching}
        size={size}
        isRolling={isRolling}
      />
    );
  }

  return (
    <StyledDie
        isMatching={isMatching}
    >
        {isHidden ? hiddenValue : faceValue}
    </StyledDie>
  );
}; 