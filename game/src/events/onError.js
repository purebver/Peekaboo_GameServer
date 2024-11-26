import { removeUser, getUserBySocket } from '../sessions/user.sessions.js';
import { getGameSession } from '../sessions/game.session.js';
import { disconnectedUserRedis } from '../redis/util.redis.js';

export const onError = (socket) => async (err) => {
  const user = getUserBySocket(socket);
  const gameSession = getGameSession(user.gameId);
  console.log(`${socket.remoteAddress}:${socket.remotePort} User Disconnected`);
  console.log(`Socket Error:  ${err.message}`);

  // gameSession에서 user를 제외시킨다.
  await gameSession.removeUser(user.id);

  // userSession에서 user를 제외시킨다.
  removeUser(socket);

  // 유저 정보 저장
  await disconnectedUserRedis(socket.userId);
};
