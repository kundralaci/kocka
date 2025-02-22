import React from 'react';
import { Popup } from './Popup';
import {
  Form,
  Title,
  Button,
} from './styled/game';
import styled from 'styled-components';

const RulesList = styled.ol`
  margin: 0;
  padding-left: 1.5rem;
  
  li {
    margin-bottom: 0.8rem;
  }

  ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }
`;

interface RulesPopupProps {
  onClose: () => void;
}

export const RulesPopup: React.FC<RulesPopupProps> = ({ onClose }) => {
  return (
    <Popup onClose={onClose}>
      <Title style={{ marginBottom: '1rem' }}>How to Play</Title>
      <Form style={{ alignItems: 'flex-start', textAlign: 'left' }}>
        <RulesList>
          <li>Each player starts with a set number of dice (configurable, default is 3)</li>
          <li>All players roll their dice simultaneously and keep their results hidden from others</li>
          <li>Players take turns making bids about the total number of dice showing a particular value on the table
            <ul>
              <li>For example: "four 3's" means you're betting there are at least four dice showing 3</li>
              <li>1's are wild and count as any number</li>
            </ul>
          </li>
          <li>Each bid must be higher than the previous bid (either in quantity or face value)</li>
          <li>Instead of making a higher bid, a player can challenge the previous bid</li>
          <li>When challenged:
            <ul>
              <li>If the bid was correct (or underestimated), the challenger loses a die</li>
              <li>If the bid was too high, the bidder loses a die</li>
            </ul>
          </li>
          <li>The game continues until only one player has dice remaining</li>
        </RulesList>
        <Button
          type="button"
          onClick={onClose}
          whileHover={{ scale: 1.05 }}
          style={{ marginTop: '1rem', alignSelf: 'center' }}
        >
          Close
        </Button>
      </Form>
    </Popup>
  );
}; 