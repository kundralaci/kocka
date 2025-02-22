import React from 'react';
import { Popup } from './Popup';
import {
  Form,
  ButtonGroup,
  Button,
  Title,
} from './styled/game';

interface ConfirmationPopupProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
  title,
  message,
  onConfirm,
  onClose
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Popup onClose={onClose}>
      <Title style={{marginBottom: '1rem'}}>{title}</Title>
      <Form style={{alignItems: 'center', textAlign: 'center'}}>
        <p>{message}</p>
        <ButtonGroup>
          <Button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            whileHover={{ scale: 1.05 }}
          >
            Confirm
          </Button>
        </ButtonGroup>
      </Form>
    </Popup>
  );
}; 