import React, { ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  Overlay,
  PopupContent,
} from './styled/game';

interface PopupProps {
  onClose: () => void;
  children: ReactNode;
}

export const Popup: React.FC<PopupProps> = ({
  onClose,
  children
}) => {
  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <PopupContent
          onClick={e => e.stopPropagation()}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          {children}
        </PopupContent>
      </Overlay>
    </AnimatePresence>
  );
}; 