import React from 'react';
import { Die } from './Die';
import {
  NumberEditor as StyledNumberEditor,
  SmallButton
} from './styled/game';
import { RiAddLine, RiSubtractLine } from '@remixicon/react';

interface NumberEditorProps {
  min?: number;
  max?: number;
  value: number;
  is3D?: boolean;
  onChange: (value: number) => void;
}

export const NumberEditor: React.FC<NumberEditorProps> = ({
  min = 1,
  max = 6,
  value,
  is3D = false,
  onChange
}) => {
  return (
    <StyledNumberEditor>
      <SmallButton
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        >
        <RiSubtractLine size={16} />
      </SmallButton>
      <Die is3D={is3D}
          faceValue={value}
      />
      <SmallButton
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max} // Assuming 10 is the max limit for quantity
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        >
        <RiAddLine size={16} />
      </SmallButton>
    </StyledNumberEditor>
  );
};
