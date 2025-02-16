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
  background: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.xlarge};
  border-radius: ${props => props.theme.borderRadius.large};
  width: 90%;
  max-width: 400px;
  box-shadow: ${props => props.theme.shadows.main};
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.large};
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.medium};
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.small};
`;

const Label = styled.label`
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  padding: ${props => props.theme.spacing.medium};
  border-radius: ${props => props.theme.borderRadius.small};
  border: 2px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.medium};
  margin-top: ${props => props.theme.spacing.medium};
`;

const Button = styled(motion.button)<{ variant?: 'secondary' }>`
  flex: 1;
  background: ${props => props.variant === 'secondary' ? props.theme.colors.secondary : props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  border: none;
  padding: ${props => props.theme.spacing.medium};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${props => props.variant === 'secondary' 
      ? props.theme.colors.secondaryDark 
      : props.theme.colors.primaryHover};
  }

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
              variant="secondary"
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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