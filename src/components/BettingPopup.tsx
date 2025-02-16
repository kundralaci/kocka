import styled from 'styled-components';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { isGreaterBet } from '../models/Bet';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const PopupContent = styled(motion.div)`
  background: #16213e;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h2`
  color: #e94560;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #fff;
`;

const Input = styled.input`
  padding: 0.8rem;
  border-radius: 6px;
  border: 2px solid #0f3460;
  background: #1a1a2e;
  color: #fff;
  font-size: 1rem;

  &:focus {
    border-color: #e94560;
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled(motion.button)`
  flex: 1;
  background: #e94560;
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface BettingPopupProps {
  currentBet: { quantity: number; faceValue: number } | null;
  onSubmit: (quantity: number, faceValue: number) => void;
  onClose: () => void;
}

export const BettingPopup: React.FC<BettingPopupProps> = ({
  currentBet,
  onSubmit,
  onClose,
}) => {
  const [quantity, setQuantity] = useState(currentBet ? currentBet.quantity : 1);
  const [faceValue, setFaceValue] = useState(currentBet ? currentBet.faceValue : 1);
  const fallbackBet = {quantity: 1, faceValue: 0};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isGreaterBet({quantity, faceValue}, currentBet ?? fallbackBet)) {
      return;
    }
    onSubmit(quantity, faceValue);
  };

  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <PopupContent
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Title>Place Your Bet</Title>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Quantity:</Label>
            <Input
              type="number"
              min={currentBet ? currentBet.quantity : 1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label>Face Value:</Label>
            <Input
              type="number"
              min={1}
              max={6}
              value={faceValue}
              onChange={(e) => setFaceValue(Number(e.target.value))}
              required
            />
          </InputGroup>
          <ButtonGroup>
            <Button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ background: '#0f3460' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isGreaterBet({quantity, faceValue}, currentBet ?? fallbackBet)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Confirm
            </Button>
          </ButtonGroup>
        </Form>
      </PopupContent>
    </Overlay>
  );
}; 