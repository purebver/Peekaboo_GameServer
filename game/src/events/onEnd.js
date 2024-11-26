import { disconnectedUserRedis } from '../redis/util.redis.js';
import { getGameSessionById } from '../sessions/game.session.js';
import { getUserBySocket, removeUser } from '../sessions/user.sessions.js';

export const onEnd = (socket) => async (data) => {
  const user = getUserBySocket(socket);
  const gameSession = getGameSessionById(user.gameId);
  console.log(`${socket.remoteAddress}:${socket.remotePort} User Disconnected`);

  // gameSession에서 user를 제외시킨다.
  await gameSession.removeUser(user.id);

  // userSession에서 user를 제외시킨다.
  removeUser(socket);

  // 유저 정보 저장
  await disconnectedUserRedis(socket.userId);
};
