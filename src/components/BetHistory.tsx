import React from 'react';
import { PlayerData } from '../models/Player';
import { Bet } from '../models/Bet';
import {
  BetHistory as StyledBetHistory,
  BetHistoryItem
} from './styled/game';
import { Die } from './Die';

interface BetHistoryProps {
  betHistory: Array<{
    type: 'bet' | 'challenge';
    player: PlayerData;
    bet?: Bet;
  }>;
  lastLoser: number | null;
  players: PlayerData[];
}

export const BetHistory: React.FC<BetHistoryProps> = ({
  betHistory,
  lastLoser,
  players
}) => {
  return (
    <StyledBetHistory
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <h3 style={{ margin: '0 0 10px 0' }}>Bet History</h3>
      <div style={{ flex: 1, overflowY: 'auto', maxHeight: '300px' }}>
        <ul style={{ margin: 0, padding: 0 }}>
          {[...betHistory].reverse().map((entry, index) => (
            <BetHistoryItem
              key={betHistory.length - index - 1}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span style={{ fontWeight: 'bold' }}>{entry.player.name}</span> 
              {entry.type === 'bet' 
                ? (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginLeft: '1ch' }}>bet:</span>
                    <Die faceValue={entry.bet!.quantity}/>
                    <span style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>X</span>
                    <Die is3D={true} faceValue={entry.bet!.faceValue}/>
                  </div>
                ) 
                : (
                  <span style={{ marginLeft: '1ch' }}>challenged</span>
                )
              }
              {lastLoser !== null && index === 0 && (
                <strong>
                  {` - ${players[lastLoser].name} lost a die!`}
                </strong>
              )}
            </BetHistoryItem>
          ))}
        </ul>
      </div>
    </StyledBetHistory>
  );
}; 