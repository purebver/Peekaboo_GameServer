import Game from '../classes/models/game.class.js';
import { gameSessions } from './sessions.js';

export const addGameSession = (gameId) => {
  const session = new Game(gameId);
  gameSessions.push(session);
  return session;
};

export const removeGameSession = (gameId) => {
  const index = gameSessions.findIndex((game) => game.id === gameId);
  if (index !== -1) {
    return gameSessions.splice(index, 1)[0];
  }
};

export const getGameSessionById = (id) => {
  return gameSessions.find((game) => game.id === id);
};

export const getGameSessionByInviteCode = (inviteCode) => {
  return gameSessions.find((game) => game.inviteCode === inviteCode);
};
