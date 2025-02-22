import React from 'react';
import { Die } from './Die';
import {
  NumberEditor as StyledNumberEditor,
  Button
} from './styled/game';

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
      <Button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        >
        -
      </Button>
      <Die is3D={is3D}
          faceValue={value}
      />
      <Button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max} // Assuming 10 is the max limit for quantity
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        >
        +
      </Button>
    </StyledNumberEditor>
  );
};
