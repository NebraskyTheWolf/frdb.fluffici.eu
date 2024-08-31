"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type Card = {
  suit: string;
  value: string;
};

type GameStatus = 'IN-GAME' | 'DEALER_TURN' | 'FINISHED';

// Utility functions
const generateDeck = (): Card[] => {
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  let deck: Card[] = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
  return shuffleDeck(deck);
};

const shuffleDeck = (deck: Card[]): Card[] => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

const calculateScore = (hand: Card[]): number => {
  let score = 0;
  let aceCount = 0;

  hand.forEach((card) => {
    if (card.value === 'J' || card.value === 'Q' || card.value === 'K') {
      score += 10;
    } else if (card.value === 'A') {
      score += 11;
      aceCount += 1;
    } else {
      score += parseInt(card.value);
    }
  });

  while (score > 21 && aceCount > 0) {
    score -= 10;
    aceCount -= 1;
  }

  return score;
};

const BlackjackGame: React.FC = () => {
  const [deck, setDeck] = useState<Card[]>(generateDeck());
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('IN-GAME');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    setPlayerHand([deck.pop()!, deck.pop()!]);
    setDealerHand([deck.pop()!, deck.pop()!]);
  }, [deck]);

  const hit = () => {
    const newDeck = [...deck];
    const newHand = [...playerHand, newDeck.pop()!];
    setPlayerHand(newHand);
    setDeck(newDeck);

    const newScore = calculateScore(newHand);
    if (newScore > 21) {
      setGameStatus('FINISHED');
      setMessage('You Bust! Dealer Wins.');
    }
  };

  const stand = () => {
    setGameStatus('DEALER_TURN');

    let dealerNewHand = [...dealerHand];
    let dealerScore = calculateScore(dealerNewHand);

    while (dealerScore < 17) {
      dealerNewHand.push(deck.pop()!);
      dealerScore = calculateScore(dealerNewHand);
    }

    setDealerHand(dealerNewHand);

    const playerScore = calculateScore(playerHand);
    determineWinner(playerScore, dealerScore);
  };

  const determineWinner = (playerScore: number, dealerScore: number) => {
    if (dealerScore > 21 || playerScore > dealerScore) {
      setMessage('You Win!');
    } else if (playerScore < dealerScore) {
      setMessage('Dealer Wins!');
    } else {
      setMessage('Stand off - remíza!');
    }
    setGameStatus('FINISHED');
  };

  const resetGame = () => {
    setDeck(generateDeck());
    setPlayerHand([]);
    setDealerHand([]);
    setGameStatus('IN-GAME');
    setMessage('');
  };

  const renderCard = (card: Card, index: number) => (
    <motion.div
      key={index}
      className="w-24 h-36 bg-blue-900 border-2 border-red-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold relative"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <span className="absolute top-1 left-1 text-red-500">
        {card.value}
      </span>
      <span className="absolute bottom-1 right-1 text-red-500">
        {card.suit[0].toUpperCase()}
      </span>
    </motion.div>
  );

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center text-white">
      <h1 className="text-3xl font-bold mb-4">BLACKJACK'S RESULT</h1>

      <div className="flex items-center justify-between w-full max-w-4xl">
        <div className="flex-1 bg-blue-600 p-4 rounded-lg text-center relative">
          <h2 className="text-red-500 text-2xl font-bold">VAKEA</h2>
          <p>Skóre: {calculateScore(playerHand)}</p>
          <div className="flex justify-center space-x-2 mt-4">
            {playerHand.map(renderCard)}
          </div>
          {gameStatus === 'FINISHED' && (
            <p className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-yellow-400 text-xl">
              {message}
            </p>
          )}
        </div>

        <div className="text-4xl font-bold mx-8">VS</div>

        <div className="flex-1 bg-red-600 p-4 rounded-lg text-center relative">
          <h2 className="text-red-500 text-2xl font-bold">NEON</h2>
          <p>Skóre: {calculateScore(dealerHand)}</p>
          <div className="flex justify-center space-x-2 mt-4">
            {dealerHand.map(renderCard)}
          </div>
        </div>
      </div>

      {gameStatus === 'IN-GAME' && (
        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={hit}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            HIT
          </button>
          <button
            onClick={stand}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            STAND
          </button>
        </div>
      )}

      {gameStatus === 'FINISHED' && (
        <div className="text-center mt-8">
          <button
            onClick={resetGame}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Play Again
          </button>
        </div>
      )}

      <div className="text-center text-gray-400 mt-8">
        <p>GameID: c1c4c60d-a271-498b-9371-9090b682fc06</p>
      </div>
    </div>
  );
};

export default BlackjackGame;
