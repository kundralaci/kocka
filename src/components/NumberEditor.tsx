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
  onChange: (value: number) => void;
}

export const NumberEditor: React.FC<NumberEditorProps> = ({
  min = 1,
  max = 6,
  value,
  onChange
}) => {
  return (
    <StyledNumberEditor>
        <Button
            type="button"
            onClick={() => onChange(value - 1)}
            disabled={value <= min}
            >
            -
        </Button>
        <Die
            faceValue={value}
        />
        <Button
            type="button"
            onClick={() => onChange(value + 1)}
            disabled={value >= max} // Assuming 10 is the max limit for quantity
            >
            +
        </Button>
    </StyledNumberEditor>
  );
};
