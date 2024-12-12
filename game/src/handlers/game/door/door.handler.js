import redisManager from '../../../classes/managers/redisManager.js';
import CustomError from '../../../Error/custom.error.js';
import { ErrorCodesMaps } from '../../../Error/error.codes.js';
import {
  doorToggleNotification,
  testDoorToggleNotification,
} from '../../../notifications/door/door.notification.js';
import { getGameSessionById } from '../../../sessions/game.session.js';
import { getUserById } from '../../../sessions/user.sessions.js';

export const doorToggleRequestHandler = async ({ socket, payload }) => {
  const { doorId, isDoorToggle } = payload;

  const user = getUserById(socket.userId);
  if (!user) {
    throw new CustomError(ErrorCodesMaps.USER_NOT_FOUND);
  }

  const gameSession = getGameSessionById(user.gameId);
  if (!gameSession) {
    throw new CustomError(ErrorCodesMaps.GAME_NOT_FOUND);
  }

  // 문 상호작용 요청을 DoorQueue에 추가
  // gameSession.doorQueue.queue.add(
  //   { gameSessionId: user.gameId, userId: user.id, doorId, isDoorToggle },
  //   { jobId: `door:${doorId}`, removeOnComplete: true },
  // );

  // Test : 본인 제외 나머지 플레이어에게 doorToggleNotification을 보낸다.
  doorToggleNotification(gameSession, payload);
  // testDoorToggleNotification(gameSession, payload, user.id);
};
