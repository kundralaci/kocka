import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Bet, isGreaterBet } from '../models/Bet';
import {
  Overlay,
  PopupContent,
  Form,
  InputGroup,
  Label,
  ButtonGroup,
  Button,
  Title
} from './styled/game';
import { NumberEditor } from './NumberEditor';

interface BettingPopupProps {
  currentBet: Bet | null;
  onDecision: (decision: Bet | 'challenge') => void;
  onClose: () => void;
}

export const BettingPopup: React.FC<BettingPopupProps> = ({
  currentBet,
  onDecision,
  onClose
}) => {
  const [quantity, setQuantity] = useState(currentBet ? currentBet.quantity + 1 : 1);
  const [faceValue, setFaceValue] = useState(currentBet ? currentBet.faceValue : 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBet: Bet = { quantity, faceValue };
    
    if (!currentBet || isGreaterBet(newBet, currentBet)) {
      onDecision(newBet);
    }
  };

  const handleCancel = () => {
    onClose();
  };

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
          <Title>Make Your Move</Title>
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label>Quantity</Label>
              <NumberEditor
                min={currentBet ? currentBet.quantity : 1}
                value={quantity}
                onChange={setQuantity}
              />
            </InputGroup>
            <InputGroup>
              <Label>Face Value</Label>
              <NumberEditor
                min={currentBet ? (quantity > currentBet.quantity ? 1 : currentBet.faceValue) : 1}
                max={6}
                value={faceValue}
                onChange={setFaceValue}
              />
            </InputGroup>
            <ButtonGroup>
              <Button
                type="button"
                onClick={handleCancel}
                whileHover={{ scale: 1.05 }}
              >
                Cancel
              </Button>
              <Button type="submit" whileHover={{ scale: 1.05 }}>
                Place Bet
              </Button>
            </ButtonGroup>
          </Form>
        </PopupContent>
      </Overlay>
    </AnimatePresence>
  );
}; 