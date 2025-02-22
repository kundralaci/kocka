import React, { useState } from 'react';
import { Bet, isGreaterBet } from '../models/Bet';
import { Popup } from './Popup';
import {
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

  return (
    <Popup onClose={onClose}>
      <Title style={{marginBottom: '1rem'}}>Make Your Move</Title>
      <Form onSubmit={handleSubmit}
        style={{alignItems: 'center', textAlign: 'center'}}>
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
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
          >
            Cancel
          </Button>
          <Button type="submit" whileHover={{ scale: 1.05 }}>
            Place Bet
          </Button>
        </ButtonGroup>
      </Form>
    </Popup>
  );
}; 