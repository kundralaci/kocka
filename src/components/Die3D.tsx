import React, { useEffect } from 'react';
import { DieWrapper, DieFace, Dot } from './styled/game/die3d';

interface Die3DProps {
  faceValue: number;
  hiddenValue?: string;
  isHidden?: boolean;
  isMatching?: boolean;
  size?: number;
  isRolling?: boolean;
}

interface DotPosition {
  x: number;
  y: number;
}

interface DotPositions {
  [key: number]: DotPosition[];
}

const dotPositions: DotPositions = {
  0: [],
  1: [{ x: 2, y: 2 }],
  2: [{ x: 1, y: 1 }, { x: 3, y: 3 }],
  3: [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }],
  4: [{ x: 1, y: 1 }, { x: 1, y: 3 }, { x: 3, y: 1 }, { x: 3, y: 3 }],
  5: [{ x: 1, y: 1 }, { x: 1, y: 3 }, { x: 2, y: 2 }, { x: 3, y: 1 }, { x: 3, y: 3 }],
  6: [{ x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }, { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }],
};

const getRotationForValue = (value: number) => {
  switch (value) {
    case 1: return [0, 0, 0];
    case 2: return [0, -90, 0];
    case 3: return [90, 0, 0];
    case 4: return [-90, 0, 0];
    case 5: return [0, 90, 0];
    case 6: return [0, 180, 0];
    default: return [0, 0, 0];
  }
};

const generateRandomRotation = () => {
  return [
    Math.floor(Math.random() * 360),
    Math.floor(Math.random() * 360),
    Math.floor(Math.random() * 360),
  ];
};

export const Die3D: React.FC<Die3DProps> = ({
  faceValue,
  isHidden = false,
  isMatching = false,
  size = 30,
  isRolling = false,
}) => {
  const [rotation, setRotation] = React.useState(getRotationForValue(faceValue));

  useEffect(() => {
    if (isRolling) {
      const interval = setInterval(() => {
        setRotation(generateRandomRotation());
      }, 100);

      return () => clearInterval(interval);
    } else {
      setRotation(getRotationForValue(faceValue));
    }
  }, [isRolling, faceValue]);

  const renderFace = (value: number) => (
    <DieFace position={value} isMatching={isMatching} size={size}>
      {dotPositions[value].map(({ x, y }, index) => (
        <div key={index} style={{ gridColumn: x, gridRow: y }}>
          <Dot isMatching={isMatching} />
        </div>
      ))}
    </DieFace>
  );

  return (
    <DieWrapper
      size={size}
      animate={{
        rotateX: rotation[0],
        rotateY: rotation[1],
        rotateZ: rotation[2],
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
    >
      {[0, 1, 2, 3, 4, 5, 6].map(value => renderFace(isHidden ? 0 : value))}
    </DieWrapper>
  );
}; 