import { removeUser, getUserBySocket } from '../sessions/userSessions.js';
import { getGameSession } from '../sessions/game.session.js';

export const onEnd = (socket) => async (data) => {
  const user = getUserBySocket(socket);
  const gameSession = getGameSession(user.gameId);
  console.log(`${socket.remoteAddress}:${socket.remotePort} User Disconnected`);
  gameSession.removeUser(user.id);
  removeUser(socket);
};
