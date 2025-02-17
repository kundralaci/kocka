import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Bet, isGreaterBet } from '../models/Bet';
import {
  Overlay,
  PopupContent,
  Form,
  InputGroup,
  Label,
  Input,
  ButtonGroup,
  Button,
  Title
} from './styled/game';

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
              <Input
                type="number"
                min={currentBet ? currentBet.quantity : 1}
                value={quantity}
                onChange={e => setQuantity(parseInt(e.target.value))}
              />
            </InputGroup>
            <InputGroup>
              <Label>Face Value</Label>
              <Input
                type="number"
                min={1}
                max={6}
                value={faceValue}
                onChange={e => setFaceValue(parseInt(e.target.value))}
              />
            </InputGroup>
            <ButtonGroup>
              <Button type="submit" whileHover={{ scale: 1.05 }}>
                Place Bet
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                whileHover={{ scale: 1.05 }}
              >
                Cancel
              </Button>
            </ButtonGroup>
          </Form>
        </PopupContent>
      </Overlay>
    </AnimatePresence>
  );
}; 