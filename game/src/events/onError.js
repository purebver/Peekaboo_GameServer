import { removeUser, getUserBySocket } from '../sessions/userSessions.js';
import { getGameSession } from '../sessions/game.session.js';

export const onError = (socket) => async (err) => {
  const user = getUserBySocket(socket);
  const gameSession = getGameSession(user.gameId);
  console.log(`${socket.remoteAddress}:${socket.remotePort} User Disconnected`);
  console.log(`Socket Error:  ${err.message}`);

  // gameSession에서 user를 제외시킨다.
  await gameSession.removeUser(user.id);

  // userSession에서 user를 제외시킨다.
  removeUser(socket);
};
