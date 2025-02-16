# Liar's Dice Game

A web-based implementation of the classic bluffing dice game, also known as Perudo or Dudo. This project was created as an experimental learning exercise to explore React, Redux, and AI player strategies.

## About the Game

Liar's Dice is a game of deception and probability where players make increasingly higher bids about the dice on the table, while trying to catch others in a lie.

### How to Play

1. Each player starts with a set number of dice (configurable, default is 3)
2. All players roll their dice simultaneously and keep their results hidden from others
3. Players take turns making bids about the total number of dice showing a particular value on the table
   - For example: "four 3's" means you're betting there are at least four dice showing 3
   - 1's are wild and count as any number
4. Each bid must be higher than the previous bid (either in quantity or face value)
5. Instead of making a higher bid, a player can challenge the previous bid
6. When challenged:
   - If the bid was correct (or underestimated), the challenger loses a die
   - If the bid was too high, the bidder loses a die
7. The game continues until only one player has dice remaining

## Features

- Play against 1-4 AI opponents
- Customizable starting conditions
- Multiple theme options
- Visual dice representation
- Bet history tracking
- Responsive design

## Try It Out

You can play the game at: https://kundralaci.github.io/kocka

## Note

This is an experimental project created primarily as a learning exercise. The AI strategies are relatively simple and the game continues to evolve as new features and improvements are added.
